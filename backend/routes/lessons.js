const express = require('express')

function createLessonsRouter({ pool, authRequired, requireRole, apiError }) {
  const router = express.Router()

  // Get lessons (by teacher, class, or all for admin)
  router.get('/admin/lessons', authRequired, async (req, res) => {
    const { academicYearId, teacherId, classId } = req.query
    try {
      let query = `
        select l.id, l.teacher_id, l.subject_id, l.class_id, l.title, l.description, l.due_date, l.created_at,
               t.name as teacher_name, s.name as subject_name, c.name as class_name, c.grade
        from assignments l
        join teachers t on l.teacher_id = t.id
        join subjects s on l.subject_id = s.id
        join classes c on l.class_id = c.id
        where 1=1
      `
      const params = []
      if (academicYearId) {
        query += ' and l.created_at::text like $' + (params.length + 1)
        params.push(academicYearId + '%')
      }
      if (teacherId) {
        query += ' and l.teacher_id = $' + (params.length + 1)
        params.push(teacherId)
      }
      if (classId) {
        query += ' and l.class_id = $' + (params.length + 1)
        params.push(classId)
      }
      query += ' order by l.created_at desc'

      const { rows } = await pool.query(query, params)
      const normalized = rows.map(r => ({
        id: String(r.id),
        teacherId: String(r.teacher_id),
        teacherName: r.teacher_name,
        subjectName: r.subject_name,
        grade: r.grade,
        className: r.class_name,
        classId: String(r.class_id),
        title: r.title,
        description: r.description,
        dueDate: r.due_date,
        createdAt: r.created_at
      }))
      res.json(normalized)
    } catch (e) {
      console.error('Failed to fetch lessons', e)
      apiError(res, 500, 'Failed to fetch lessons')
    }
  })

  // Create lesson
  router.post('/admin/lessons', authRequired, requireRole('admin', 'secretary'), async (req, res) => {
    const { teacherId, subjectId, classId, title, description, dueDate } = req.body
    try {
      const { rows } = await pool.query(
        `insert into assignments (teacher_id, subject_id, class_id, title, description, due_date, created_at)
         values ($1, $2, $3, $4, $5, $6, now()) returning id`,
        [teacherId, subjectId, classId, title || '', description || '', dueDate || null]
      )
      res.status(201).json({ id: String(rows[0].id) })
    } catch (e) {
      console.error('Failed to create lesson', e)
      apiError(res, 500, 'Failed to create lesson')
    }
  })

  // Update lesson
  router.put('/admin/lessons/:id', authRequired, requireRole('admin', 'secretary'), async (req, res) => {
    const { id } = req.params
    const { title, description, dueDate } = req.body
    try {
      const { rows } = await pool.query(
        `update assignments set title = coalesce($1, title), description = coalesce($2, description), due_date = coalesce($3, due_date) where id = $4 returning id`,
        [title || null, description || null, dueDate || null, id]
      )
      if (!rows[0]) return apiError(res, 404, 'Lesson not found')
      res.json({ success: true })
    } catch (e) {
      console.error('Failed to update lesson', e)
      apiError(res, 500, 'Failed to update lesson')
    }
  })

  // Delete lesson
  router.delete('/admin/lessons/:id', authRequired, requireRole('admin', 'secretary'), async (req, res) => {
    const { id } = req.params
    try {
      const { rowCount } = await pool.query('delete from assignments where id = $1', [id])
      if (!rowCount) return apiError(res, 404, 'Lesson not found')
      res.json({ success: true })
    } catch (e) {
      console.error('Failed to delete lesson', e)
      apiError(res, 500, 'Failed to delete lesson')
    }
  })

  return router
}

module.exports = { createLessonsRouter }
