const express = require('express')

function createAcademicYearsRouter({ pool, authRequired, requireRole, apiError }) {
  const router = express.Router()

  // List all academic years (active and archived)
  router.get('/admin/academic-years', authRequired, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `select id, year, start_date, end_date, total_students, average_gpa, archived_at, archived
         from academic_years order by start_date desc`
      )
      res.json(rows)
    } catch (e) {
      console.error('Failed to fetch academic years', e)
      apiError(res, 500, 'Failed to fetch academic years')
    }
  })

  // Get the active academic year (not archived)
  router.get('/admin/academic-years/active/current', authRequired, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `select id, year, start_date, end_date, total_students, average_gpa, archived_at, archived
         from academic_years where archived = false order by start_date desc limit 1`
      )
      if (!rows[0]) return apiError(res, 404, 'No active academic year found')
      res.json(rows[0])
    } catch (e) {
      console.error('Failed to fetch active academic year', e)
      apiError(res, 500, 'Failed to fetch active academic year')
    }
  })

  // Get details for an archived year including archived students
  router.get('/admin/academic-years/:id', authRequired, async (req, res) => {
    const { id } = req.params
    try {
      const { rows: years } = await pool.query(
        `select id, year, start_date, end_date, total_students, average_gpa, archived_at
         from academic_years where id = $1`,
        [id]
      )
      if (!years[0]) return apiError(res, 404, 'Academic year not found')

      const { rows: students } = await pool.query(
        `select id, student_id, name, email, phone, class_name as class, final_gpa, status, created_at
         from archived_students where academic_year_id = $1 order by name`,
        [id]
      )

      res.json({ ...years[0], students })
    } catch (e) {
      console.error('Failed to fetch academic year details', e)
      apiError(res, 500, 'Failed to fetch academic year details')
    }
  })

  // Create (or archive) an academic year with snapshot students
  router.post('/admin/academic-years', authRequired, requireRole('secretary', 'admin'), async (req, res) => {
    const { year, name, startDate, start_date, endDate, end_date, students = [] } = req.body
    const client = await pool.connect()
    try {
      await client.query('begin')
      const yearName = year || name || ''
      const startDateVal = startDate || start_date || new Date().toISOString().split('T')[0]
      const endDateVal = endDate || end_date || new Date().toISOString().split('T')[0]
      
      const insertYear = await client.query(
        `insert into academic_years (year, start_date, end_date, archived, archived_at, total_students, average_gpa)
         values ($1, $2, $3, false, null, $4, $5) returning id`,
        [yearName, startDateVal, endDateVal, students.length, 0]
      )
      const academicYearId = insertYear.rows[0].id

      for (const s of students) {
        await client.query(
          `insert into archived_students (academic_year_id, student_id, name, email, phone, class_name, final_gpa, status, snapshot)
           values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [academicYearId, s.studentId || null, s.name, s.email || null, s.phone || null, s.class || null, s.finalGPA || null, s.status || 'promoted', JSON.stringify(s)]
        )
      }

      await client.query('commit')
      res.status(201).json({ id: academicYearId })
    } catch (e) {
      try { await client.query('rollback') } catch (_) {}
      console.error('Failed to create academic year', e)
      apiError(res, 500, 'Failed to create academic year')
    } finally {
      client.release()
    }
  })

  // Update academic year
  router.put('/admin/academic-years/:id', authRequired, requireRole('admin', 'secretary'), async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    try {
      if (status === 'archived') {
        await pool.query(
          `update academic_years set archived = true, archived_at = now() where id = $1`,
          [id]
        )
      }
      res.json({ success: true })
    } catch (e) {
      console.error('Failed to update academic year', e)
      apiError(res, 500, 'Failed to update academic year')
    }
  })

  // Delete academic year
  router.delete('/admin/academic-years/:id', authRequired, requireRole('admin'), async (req, res) => {
    const { id } = req.params
    try {
      await pool.query(`delete from academic_years where id = $1`, [id])
      res.json({ success: true })
    } catch (e) {
      console.error('Failed to delete academic year', e)
      apiError(res, 500, 'Failed to delete academic year')
    }
  })

  return router
}

module.exports = { createAcademicYearsRouter }
