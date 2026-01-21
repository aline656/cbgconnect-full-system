const express = require('express')

function createUsersRouter({ pool, authRequired, requireRole, apiError }) {
  const router = express.Router()

  // Get all users
  router.get('/admin/users', authRequired, requireRole('admin'), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `select id, name, email, role, created_at from users order by created_at desc`
      )
      const normalized = rows.map(r => ({
        id: String(r.id),
        name: r.name,
        email: r.email,
        role: r.role,
        createdAt: r.created_at
      }))
      res.json(normalized)
    } catch (e) {
      console.error('Failed to fetch users', e)
      apiError(res, 500, 'Failed to fetch users')
    }
  })

  // Create user
  router.post('/admin/users', authRequired, requireRole('admin'), async (req, res) => {
    const { name, email, password, role } = req.body
    if (!name || !email || !password || !role) {
      return apiError(res, 400, 'Missing required fields')
    }

    try {
      const bcrypt = require('bcryptjs')
      const passwordHash = await bcrypt.hash(password, 10)
      
      const { rows } = await pool.query(
        `insert into users (name, email, password_hash, role, created_at) 
         values ($1, $2, $3, $4, now()) returning id, name, email, role`,
        [name, email, passwordHash, role]
      )
      
      res.status(201).json({
        id: String(rows[0].id),
        name: rows[0].name,
        email: rows[0].email,
        role: rows[0].role
      })
    } catch (e) {
      console.error('Failed to create user', e)
      if (e.code === '23505') { // unique violation
        return apiError(res, 409, 'Email already exists')
      }
      apiError(res, 500, 'Failed to create user')
    }
  })

  // Update user
  router.put('/admin/users/:id', authRequired, requireRole('admin'), async (req, res) => {
    const { id } = req.params
    const { name, email, role } = req.body

    try {
      const { rows } = await pool.query(
        `update users set name = coalesce($1, name), email = coalesce($2, email), role = coalesce($3, role) 
         where id = $4 returning id, name, email, role`,
        [name || null, email || null, role || null, id]
      )
      
      if (!rows[0]) return apiError(res, 404, 'User not found')
      
      res.json({
        id: String(rows[0].id),
        name: rows[0].name,
        email: rows[0].email,
        role: rows[0].role
      })
    } catch (e) {
      console.error('Failed to update user', e)
      apiError(res, 500, 'Failed to update user')
    }
  })

  // Delete user
  router.delete('/admin/users/:id', authRequired, requireRole('admin'), async (req, res) => {
    const { id } = req.params

    try {
      await pool.query(`delete from users where id = $1`, [id])
      res.json({ success: true })
    } catch (e) {
      console.error('Failed to delete user', e)
      apiError(res, 500, 'Failed to delete user')
    }
  })

  return router
}

module.exports = { createUsersRouter }
