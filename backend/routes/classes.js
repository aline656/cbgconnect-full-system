const express = require('express')

function createClassesRouter({ pool, authRequired, requireRole, apiError }) {
  const router = express.Router()

  // Get all classes
  router.get('/admin/classes', authRequired, async (req, res) => {
    try {
      const { rows } = await pool.query(
        'select id, name, grade, teacher_id, created_at from classes order by name'
      )
      const normalized = rows.map(r => ({
        id: String(r.id),
        name: r.name,
        grade: r.grade,
        teacherId: r.teacher_id ? String(r.teacher_id) : null,
        createdAt: r.created_at
      }))
      res.json(normalized)
    } catch (e) {
      console.error('Failed to fetch classes', e)
      apiError(res, 500, 'Failed to fetch classes')
    }
  })

  // Create class
  router.post('/admin/classes', authRequired, requireRole('admin', 'secretary'), async (req, res) => {
    const { name, grade, teacherId } = req.body
    
    if (!name || !grade) {
      return apiError(res, 400, 'Name and grade are required')
    }

    try {
      const { rows } = await pool.query(
        `insert into classes (name, grade, teacher_id, created_at)
         values ($1, $2, $3, now()) returning id`,
        [name, grade, teacherId || null]
      )
      res.status(201).json({ id: String(rows[0].id), name, grade, teacherId: teacherId || null })
    } catch (e) {
      console.error('Failed to create class', e)
      apiError(res, 500, 'Failed to create class')
    }
  })

  // Update class
  router.put('/admin/classes/:id', authRequired, requireRole('admin', 'secretary'), async (req, res) => {
    const { id } = req.params
    const { name, grade, teacherId } = req.body

    try {
      const { rows } = await pool.query(
        `update classes 
         set name = coalesce($1, name), 
             grade = coalesce($2, grade),
             teacher_id = coalesce($3::bigint, teacher_id)
         where id = $4 returning id, name, grade, teacher_id`,
        [name || null, grade || null, teacherId || null, id]
      )
      if (!rows[0]) return apiError(res, 404, 'Class not found')
      
      const r = rows[0]
      res.json({
        id: String(r.id),
        name: r.name,
        grade: r.grade,
        teacherId: r.teacher_id ? String(r.teacher_id) : null
      })
    } catch (e) {
      console.error('Failed to update class', e)
      apiError(res, 500, 'Failed to update class')
    }
  })

  // Delete class
  router.delete('/admin/classes/:id', authRequired, requireRole('admin', 'secretary'), async (req, res) => {
    const { id } = req.params
    try {
      const { rowCount } = await pool.query('delete from classes where id = $1', [id])
      if (!rowCount) return apiError(res, 404, 'Class not found')
      res.json({ success: true })
    } catch (e) {
      console.error('Failed to delete class', e)
      apiError(res, 500, 'Failed to delete class')
    }
  })

  return router
}

module.exports = { createClassesRouter }
