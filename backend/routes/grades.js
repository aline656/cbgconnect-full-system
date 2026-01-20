const express = require("express")
const { parse } = require("csv-parse/sync")

function createGradesRouter({ pool, authRequired, requireRole, apiError }) {
  const router = express.Router()

  // Get all grades with filters
  router.get("/grades", authRequired, async (req, res) => {
    try {
      const { student_id, subject_id, class_id } = req.query

      let query = `select sg.*, s.name as subject_name, st.name as student_name, st.student_id
                   from student_grades sg
                   join subjects s on sg.subject_id = s.id
                   join students st on sg.student_id = st.id
                   where 1=1`
      const params = []

      if (student_id) {
        query += ` and sg.student_id = $${params.length + 1}`
        params.push(student_id)
      }
      if (subject_id) {
        query += ` and sg.subject_id = $${params.length + 1}`
        params.push(subject_id)
      }

      query += " order by sg.created_at desc"
      const result = await pool.query(query, params)
      res.json(result.rows)
    } catch (e) {
      apiError(res, 500, `Failed to fetch grades: ${e.message}`)
    }
  })

  // Get grade distribution for a class/subject
  router.get("/grades/distribution/:subject_id", authRequired, async (req, res) => {
    try {
      const { subject_id } = req.params

      const result = await pool.query(
        `select 
           case 
             when percentage >= 90 then 'A (90-100)'
             when percentage >= 80 then 'B (80-89)'
             when percentage >= 70 then 'C (70-79)'
             when percentage >= 60 then 'D (60-69)'
             else 'F (Below 60)'
           end as grade_range,
           count(*) as count,
           round(100.0 * count(*) / (select count(*) from student_grades where subject_id = $1), 2) as percentage
         from student_grades
         where subject_id = $1
         group by grade_range
         order by grade_range`,
        [subject_id],
      )

      res.json(result.rows)
    } catch (e) {
      apiError(res, 500, `Failed to fetch grade distribution: ${e.message}`)
    }
  })

  // Add new grade
  router.post("/grades", authRequired, requireRole("teacher"), async (req, res) => {
    try {
      const {
        student_id,
        subject_id,
        assignment_name,
        marks_obtained,
        total_marks,
        graded_date,
      } = req.body

      if (!student_id || !subject_id || marks_obtained === undefined || !total_marks) {
        apiError(res, 400, "Missing required fields")
        return
      }

      const percentage = (marks_obtained / total_marks) * 100
      const grade = percentage >= 90 ? "A" : percentage >= 80 ? "B" : percentage >= 70 ? "C" : percentage >= 60 ? "D" : "F"

      const result = await pool.query(
        `insert into student_grades (student_id, subject_id, assignment_name, marks_obtained, total_marks, percentage, grade, graded_date)
         values ($1, $2, $3, $4, $5, $6, $7, $8)
         returning *`,
        [student_id, subject_id, assignment_name, marks_obtained, total_marks, percentage, grade, graded_date],
      )

      res.status(201).json(result.rows[0])
    } catch (e) {
      apiError(res, 500, `Failed to add grade: ${e.message}`)
    }
  })

  // Update grade
  router.put("/grades/:id", authRequired, requireRole("teacher"), async (req, res) => {
    try {
      const { id } = req.params
      const { marks_obtained, total_marks, graded_date } = req.body

      const percentage = marks_obtained && total_marks ? (marks_obtained / total_marks) * 100 : null
      const grade = percentage >= 90 ? "A" : percentage >= 80 ? "B" : percentage >= 70 ? "C" : percentage >= 60 ? "D" : percentage ? "F" : null

      const result = await pool.query(
        `update student_grades
         set marks_obtained = coalesce($2, marks_obtained),
             total_marks = coalesce($3, total_marks),
             percentage = coalesce($4, percentage),
             grade = coalesce($5, grade),
             graded_date = coalesce($6, graded_date)
         where id = $1
         returning *`,
        [id, marks_obtained, total_marks, percentage, grade, graded_date],
      )

      if (!result.rows.length) {
        apiError(res, 404, "Grade not found")
        return
      }

      res.json(result.rows[0])
    } catch (e) {
      apiError(res, 500, `Failed to update grade: ${e.message}`)
    }
  })

  // Delete grade
  router.delete("/grades/:id", authRequired, requireRole("teacher"), async (req, res) => {
    try {
      const { id } = req.params
      const result = await pool.query("delete from student_grades where id = $1 returning *", [id])

      if (!result.rows.length) {
        apiError(res, 404, "Grade not found")
        return
      }

      res.json({ message: "Grade deleted successfully" })
    } catch (e) {
      apiError(res, 500, `Failed to delete grade: ${e.message}`)
    }
  })

  // Bulk import grades (CSV)
  router.post("/grades/import/csv", authRequired, requireRole("teacher"), async (req, res) => {
    try {
      const { csv_data } = req.body

      if (!csv_data) {
        apiError(res, 400, "CSV data is required")
        return
      }

      const records = parse(csv_data, {
        columns: true,
        skip_empty_lines: true,
      })

      const client = await pool.connect()
      const created = []
      const errors = []

      try {
        await client.query("begin")

        for (let i = 0; i < records.length; i++) {
          const record = records[i]
          try {
            if (!record.student_id || !record.subject_id || record.marks_obtained === undefined) {
              errors.push(`Row ${i + 2}: Missing required fields`)
              continue
            }

            const percentage = (record.marks_obtained / record.total_marks) * 100
            const grade = percentage >= 90 ? "A" : percentage >= 80 ? "B" : percentage >= 70 ? "C" : percentage >= 60 ? "D" : "F"

            const result = await client.query(
              `insert into student_grades (student_id, subject_id, assignment_name, marks_obtained, total_marks, percentage, grade, graded_date)
               values ($1, $2, $3, $4, $5, $6, $7, $8)
               returning *`,
              [
                record.student_id,
                record.subject_id,
                record.assignment_name || null,
                parseFloat(record.marks_obtained),
                parseFloat(record.total_marks),
                percentage,
                grade,
                record.graded_date || null,
              ],
            )
            created.push(result.rows[0])
          } catch (e) {
            errors.push(`Row ${i + 2}: ${e.message}`)
          }
        }

        await client.query("commit")
        res.json({
          created: created.length,
          failed: errors.length,
          errors,
          grades: created,
        })
      } catch (e) {
        await client.query("rollback")
        throw e
      } finally {
        client.release()
      }
    } catch (e) {
      apiError(res, 500, `Failed to import grades: ${e.message}`)
    }
  })

  // Export grades as CSV
  router.get("/grades/export/csv", authRequired, async (req, res) => {
    try {
      const { subject_id, student_id } = req.query

      let query = `select sg.*, s.name as subject_name, st.name as student_name
                   from student_grades sg
                   join subjects s on sg.subject_id = s.id
                   join students st on sg.student_id = st.id
                   where 1=1`
      const params = []

      if (subject_id) {
        query += ` and sg.subject_id = $${params.length + 1}`
        params.push(subject_id)
      }
      if (student_id) {
        query += ` and sg.student_id = $${params.length + 1}`
        params.push(student_id)
      }

      const result = await pool.query(query, params)
      const grades = result.rows

      if (!grades.length) {
        res.json({ message: "No grades to export" })
        return
      }

      const headers = [
        "student_id",
        "student_name",
        "subject_name",
        "assignment_name",
        "marks_obtained",
        "total_marks",
        "percentage",
        "grade",
        "graded_date",
      ]
      const rows = grades.map((g) =>
        [
          g.student_id,
          g.student_name,
          g.subject_name,
          g.assignment_name || "",
          g.marks_obtained,
          g.total_marks,
          g.percentage,
          g.grade,
          g.graded_date || "",
        ]
          .map((v) => `"${v}"`)
          .join(","),
      )
      const csv = [headers.join(","), ...rows].join("\n")

      res.setHeader("Content-Type", "text/csv")
      res.setHeader("Content-Disposition", "attachment; filename=grades.csv")
      res.send(csv)
    } catch (e) {
      apiError(res, 500, `Failed to export grades: ${e.message}`)
    }
  })

  return router
}

module.exports = { createGradesRouter }
