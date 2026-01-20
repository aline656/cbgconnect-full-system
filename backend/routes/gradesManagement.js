const express = require('express')

function createGradesManagementRouter({ pool, authRequired, requireRole, apiError }) {
  const router = express.Router()

  // Get grades (for admin/secretary, optionally filtered)
  router.get('/admin/grades-register', authRequired, async (req, res) => {
    const { academicYearId, termId, subjectId } = req.query
    try {
      let query = `
        select g.id, g.student_id, g.marks_obtained, g.total_marks, g.percentage, g.grade,
               g.graded_date, g.created_at, g.assignment_name,
               st.name as student_name, sub.name as subject_name, t.name as term_name
        from student_grades g
        join students st on g.student_id = st.id
        join subjects sub on g.subject_id = sub.id
        left join terms t on t.id = $1
        where 1=1
      `
      const params = [termId || null]
      let paramCount = 1
      
      if (subjectId) {
        paramCount++
        query += ' and g.subject_id = $' + paramCount
        params.push(subjectId)
      }
      query += ' order by g.created_at desc'

      const { rows } = await pool.query(query, params)
      const normalized = rows.map(r => ({
        id: String(r.id),
        studentId: String(r.student_id),
        studentName: r.student_name,
        subjectName: r.subject_name,
        termId: termId || null,
        termName: r.term_name || 'Term',
        score: Number(r.marks_obtained) || 0,
        letterGrade: r.grade || 'F',
        remarks: r.assignment_name || '',
        createdBy: 'admin',
        createdAt: r.created_at
      }))
      res.json(normalized)
    } catch (e) {
      console.error('Failed to fetch grades', e)
      apiError(res, 500, 'Failed to fetch grades')
    }
  })

  // Create grade
  router.post('/admin/grades-register', authRequired, requireRole('admin', 'secretary', 'teacher'), async (req, res) => {
    const { studentId, subjectId, marksObtained, totalMarks, grade, gradedDate } = req.body
    const userId = req.user.id
    try {
      const percentage = totalMarks ? (marksObtained / totalMarks * 100).toFixed(2) : 0
      const { rows } = await pool.query(
        `insert into student_grades (student_id, subject_id, marks_obtained, total_marks, percentage, grade, graded_date, graded_by)
         values ($1, $2, $3, $4, $5, $6, $7, $8) returning id`,
        [studentId, subjectId, marksObtained, totalMarks, percentage, grade, gradedDate, userId]
      )
      res.status(201).json({ id: String(rows[0].id) })
    } catch (e) {
      console.error('Failed to create grade', e)
      apiError(res, 500, 'Failed to create grade')
    }
  })

  // Update grade
  router.put('/admin/grades-register/:id', authRequired, requireRole('admin', 'secretary', 'teacher'), async (req, res) => {
    const { id } = req.params
    const { marksObtained, totalMarks, grade } = req.body
    try {
      const percentage = totalMarks ? (marksObtained / totalMarks * 100).toFixed(2) : 0
      const { rows } = await pool.query(
        `update student_grades 
         set marks_obtained = coalesce($1, marks_obtained), 
             total_marks = coalesce($2, total_marks),
             percentage = $3,
             grade = coalesce($4, grade)
         where id = $5 returning id`,
        [marksObtained || null, totalMarks || null, percentage, grade || null, id]
      )
      if (!rows[0]) return apiError(res, 404, 'Grade not found')
      res.json({ success: true })
    } catch (e) {
      console.error('Failed to update grade', e)
      apiError(res, 500, 'Failed to update grade')
    }
  })

  // Delete grade
  router.delete('/admin/grades-register/:id', authRequired, requireRole('admin', 'secretary'), async (req, res) => {
    const { id } = req.params
    try {
      const { rowCount } = await pool.query('delete from student_grades where id = $1', [id])
      if (!rowCount) return apiError(res, 404, 'Grade not found')
      res.json({ success: true })
    } catch (e) {
      console.error('Failed to delete grade', e)
      apiError(res, 500, 'Failed to delete grade')
    }
  })

  return router
}

module.exports = { createGradesManagementRouter }
