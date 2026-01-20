const express = require("express")

function createAttendanceRouter({ pool, authRequired, requireRole, apiError }) {
  const router = express.Router()

  // Get attendance records
  router.get("/attendance", authRequired, async (req, res) => {
    try {
      const { student_id, class_id, date_from, date_to } = req.query

      let query = "select * from attendance where 1=1"
      const params = []

      if (student_id) {
        query += ` and student_id = $${params.length + 1}`
        params.push(student_id)
      }
      if (class_id) {
        query += ` and class_id = $${params.length + 1}`
        params.push(class_id)
      }
      if (date_from) {
        query += ` and attendance_date >= $${params.length + 1}`
        params.push(date_from)
      }
      if (date_to) {
        query += ` and attendance_date <= $${params.length + 1}`
        params.push(date_to)
      }

      query += " order by attendance_date desc"
      const result = await pool.query(query, params)
      res.json(result.rows)
    } catch (e) {
      apiError(res, 500, `Failed to fetch attendance: ${e.message}`)
    }
  })

  // Get attendance stats for a student
  router.get("/attendance/stats/:student_id", authRequired, async (req, res) => {
    try {
      const { student_id } = req.params

      const result = await pool.query(
        `select 
           count(*) as total_days,
           sum(case when status = 'present' then 1 else 0 end) as present_days,
           sum(case when status = 'absent' then 1 else 0 end) as absent_days,
           sum(case when status = 'late' then 1 else 0 end) as late_days,
           sum(case when status = 'excused' then 1 else 0 end) as excused_days,
           round(100.0 * sum(case when status = 'present' then 1 else 0 end) / count(*), 2) as attendance_rate
         from attendance 
         where student_id = $1`,
        [student_id],
      )

      res.json(result.rows[0] || {})
    } catch (e) {
      apiError(res, 500, `Failed to fetch attendance stats: ${e.message}`)
    }
  })

  // Mark attendance for a student
  router.post("/attendance", authRequired, requireRole("teacher"), async (req, res) => {
    try {
      const { student_id, class_id, attendance_date, status, check_in_time, notes } = req.body

      if (!student_id || !attendance_date || !status) {
        apiError(res, 400, "Missing required fields")
        return
      }

      const result = await pool.query(
        `insert into attendance (student_id, class_id, attendance_date, status, check_in_time, notes)
         values ($1, $2, $3, $4, $5, $6)
         returning *`,
        [student_id, class_id, attendance_date, status, check_in_time, notes],
      )

      res.status(201).json(result.rows[0])
    } catch (e) {
      apiError(res, 500, `Failed to mark attendance: ${e.message}`)
    }
  })

  // Bulk mark attendance for a class on a date
  router.post(
    "/attendance/bulk",
    authRequired,
    requireRole("teacher"),
    async (req, res) => {
      try {
        const { class_id, attendance_date, records } = req.body

        if (!class_id || !attendance_date || !Array.isArray(records)) {
          apiError(res, 400, "Missing required fields")
          return
        }

        const client = await pool.connect()
        const created = []

        try {
          await client.query("begin")

          for (const record of records) {
            const result = await client.query(
              `insert into attendance (student_id, class_id, attendance_date, status, check_in_time, notes)
               values ($1, $2, $3, $4, $5, $6)
               on conflict (student_id, attendance_date) 
               do update set status = $4, check_in_time = $5, notes = $6
               returning *`,
              [
                record.student_id,
                class_id,
                attendance_date,
                record.status,
                record.check_in_time || null,
                record.notes || null,
              ],
            )
            created.push(result.rows[0])
          }

          await client.query("commit")
          res.status(201).json({ count: created.length, records: created })
        } catch (e) {
          await client.query("rollback")
          throw e
        } finally {
          client.release()
        }
      } catch (e) {
        apiError(res, 500, `Failed to bulk mark attendance: ${e.message}`)
      }
    },
  )

  // Update attendance record
  router.put("/attendance/:id", authRequired, requireRole("teacher"), async (req, res) => {
    try {
      const { id } = req.params
      const { status, check_in_time, notes } = req.body

      const result = await pool.query(
        `update attendance 
         set status = $2, check_in_time = $3, notes = $4, created_at = now()
         where id = $1
         returning *`,
        [id, status, check_in_time, notes],
      )

      if (!result.rows.length) {
        apiError(res, 404, "Attendance record not found")
        return
      }

      res.json(result.rows[0])
    } catch (e) {
      apiError(res, 500, `Failed to update attendance: ${e.message}`)
    }
  })

  // Delete attendance record
  router.delete("/attendance/:id", authRequired, requireRole("teacher", "secretary"), async (req, res) => {
    try {
      const { id } = req.params
      const result = await pool.query("delete from attendance where id = $1 returning *", [id])

      if (!result.rows.length) {
        apiError(res, 404, "Attendance record not found")
        return
      }

      res.json({ message: "Attendance deleted successfully" })
    } catch (e) {
      apiError(res, 500, `Failed to delete attendance: ${e.message}`)
    }
  })

  // Get class attendance for a specific date
  router.get("/attendance/class/:class_id/date/:date", authRequired, async (req, res) => {
    try {
      const { class_id, date } = req.params

      const result = await pool.query(
        `select a.*, s.name as student_name, s.student_id
         from attendance a
         join students s on a.student_id = s.id
         where a.class_id = $1 and a.attendance_date = $2
         order by s.name`,
        [class_id, date],
      )

      res.json(result.rows)
    } catch (e) {
      apiError(res, 500, `Failed to fetch class attendance: ${e.message}`)
    }
  })

  return router
}

module.exports = { createAttendanceRouter }
