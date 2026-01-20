const express = require("express")
const { parse } = require("csv-parse/sync")

function createStudentsRouter({ pool, authRequired, requireRole, apiError }) {
  const router = express.Router()

  // Get all students with filters
  router.get("/students", authRequired, async (req, res) => {
    try {
      const { grade, status, search, class_name } = req.query
      let query = "select * from students where 1=1"
      const params = []

      if (grade) {
        query += ` and grade = $${params.length + 1}`
        params.push(grade)
      }
      if (status) {
        query += ` and status = $${params.length + 1}`
        params.push(status)
      }
      if (class_name) {
        query += ` and class_name = $${params.length + 1}`
        params.push(class_name)
      }
      if (search) {
        query += ` and (name ilike $${params.length + 1} or student_id ilike $${params.length + 1})`
        params.push(`%${search}%`)
        params.push(`%${search}%`)
      }

      query += " order by created_at desc"
      const result = await pool.query(query, params)
      res.json(result.rows)
    } catch (e) {
      apiError(res, 500, `Failed to fetch students: ${e.message}`)
    }
  })

  // Get single student with details
  router.get("/students/:id", authRequired, async (req, res) => {
    try {
      const { id } = req.params
      const studentResult = await pool.query("select * from students where id = $1", [id])
      if (!studentResult.rows.length) {
        apiError(res, 404, "Student not found")
        return
      }

      const student = studentResult.rows[0]

      // Get contact info
      const contactResult = await pool.query(
        "select * from student_contact where student_id = $1",
        [id],
      )
      const contact = contactResult.rows[0] || {}

      // Get fees
      const feesResult = await pool.query(
        "select * from fees where student_id = $1 order by created_at desc",
        [id],
      )

      // Get attendance stats
      const attendanceResult = await pool.query(
        `select 
           count(*) as total_days,
           sum(case when status = 'present' then 1 else 0 end) as present_days,
           sum(case when status = 'absent' then 1 else 0 end) as absent_days,
           round(100.0 * sum(case when status = 'present' then 1 else 0 end) / count(*), 2) as attendance_rate
         from attendance where student_id = $1`,
        [id],
      )

      // Get grades
      const gradesResult = await pool.query(
        `select sg.*, s.name as subject_name 
         from student_grades sg
         left join subjects s on sg.subject_id = s.id
         where sg.student_id = $1
         order by sg.created_at desc`,
        [id],
      )

      res.json({
        ...student,
        contact,
        fees: feesResult.rows,
        attendance: attendanceResult.rows[0] || {},
        grades: gradesResult.rows,
      })
    } catch (e) {
      apiError(res, 500, `Failed to fetch student: ${e.message}`)
    }
  })

  // Add new student
  router.post("/students", authRequired, requireRole("secretary", "admin"), async (req, res) => {
    try {
      const {
        student_id,
        name,
        gender,
        date_of_birth,
        grade,
        class_name,
        admission_date,
        parent_name,
        parent_phone,
        parent_email,
        emergency_contact,
        emergency_phone,
        address,
      } = req.body

      if (!student_id || !name || !gender) {
        apiError(res, 400, "Missing required fields")
        return
      }

      const client = await pool.connect()
      try {
        await client.query("begin")

        // Create student
        const studentResult = await client.query(
          `insert into students (student_id, name, gender, date_of_birth, grade, class_name, admission_date)
           values ($1, $2, $3, $4, $5, $6, $7)
           returning *`,
          [student_id, name, gender, date_of_birth, grade, class_name, admission_date],
        )

        const student = studentResult.rows[0]

        // Create contact info if provided
        if (parent_name || parent_phone || parent_email) {
          await client.query(
            `insert into student_contact (student_id, parent_name, parent_phone, parent_email, emergency_contact, emergency_phone, address)
             values ($1, $2, $3, $4, $5, $6, $7)`,
            [student.id, parent_name, parent_phone, parent_email, emergency_contact, emergency_phone, address],
          )
        }

        await client.query("commit")
        res.status(201).json(student)
      } catch (e) {
        await client.query("rollback")
        throw e
      } finally {
        client.release()
      }
    } catch (e) {
      apiError(res, 500, `Failed to create student: ${e.message}`)
    }
  })

  // Update student
  router.put("/students/:id", authRequired, requireRole("secretary", "admin"), async (req, res) => {
    try {
      const { id } = req.params
      const updates = req.body

      const fields = []
      const values = []
      let paramCount = 1

      const allowedFields = [
        "name",
        "gender",
        "date_of_birth",
        "grade",
        "class_name",
        "status",
        "admission_date",
      ]
      for (const field of allowedFields) {
        if (field in updates) {
          fields.push(`${field} = $${paramCount}`)
          values.push(updates[field])
          paramCount++
        }
      }

      if (!fields.length) {
        apiError(res, 400, "No fields to update")
        return
      }

      values.push(id)
      const query = `update students set ${fields.join(", ")}, updated_at = now() where id = $${paramCount} returning *`
      const result = await pool.query(query, values)

      if (!result.rows.length) {
        apiError(res, 404, "Student not found")
        return
      }

      res.json(result.rows[0])
    } catch (e) {
      apiError(res, 500, `Failed to update student: ${e.message}`)
    }
  })

  // Delete student
  router.delete("/students/:id", authRequired, requireRole("secretary", "admin"), async (req, res) => {
    try {
      const { id } = req.params
      const result = await pool.query("delete from students where id = $1 returning *", [id])

      if (!result.rows.length) {
        apiError(res, 404, "Student not found")
        return
      }

      res.json({ message: "Student deleted successfully" })
    } catch (e) {
      apiError(res, 500, `Failed to delete student: ${e.message}`)
    }
  })

  // Bulk import students (CSV)
  router.post("/students/import/csv", authRequired, requireRole("secretary", "admin"), async (req, res) => {
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
            if (!record.student_id || !record.name || !record.gender) {
              errors.push(`Row ${i + 2}: Missing required fields`)
              continue
            }

            const result = await client.query(
              `insert into students (student_id, name, gender, date_of_birth, grade, class_name, admission_date)
               values ($1, $2, $3, $4, $5, $6, $7)
               returning *`,
              [
                record.student_id,
                record.name,
                record.gender,
                record.date_of_birth || null,
                record.grade || null,
                record.class_name || null,
                record.admission_date || null,
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
          students: created,
        })
      } catch (e) {
        await client.query("rollback")
        throw e
      } finally {
        client.release()
      }
    } catch (e) {
      apiError(res, 500, `Failed to import students: ${e.message}`)
    }
  })

  // Export students as CSV
  router.get("/students/export/csv", authRequired, async (req, res) => {
    try {
      const { grade, status } = req.query

      let query = "select * from students where 1=1"
      const params = []

      if (grade) {
        query += ` and grade = $${params.length + 1}`
        params.push(grade)
      }
      if (status) {
        query += ` and status = $${params.length + 1}`
        params.push(status)
      }

      const result = await pool.query(query, params)
      const students = result.rows

      if (!students.length) {
        res.json({ message: "No students to export" })
        return
      }

      // Build CSV
      const headers = Object.keys(students[0]).join(",")
      const rows = students.map((s) => Object.values(s).map((v) => `"${v}"`).join(","))
      const csv = [headers, ...rows].join("\n")

      res.setHeader("Content-Type", "text/csv")
      res.setHeader("Content-Disposition", "attachment; filename=students.csv")
      res.send(csv)
    } catch (e) {
      apiError(res, 500, `Failed to export students: ${e.message}`)
    }
  })

  return router
}

module.exports = { createStudentsRouter }
