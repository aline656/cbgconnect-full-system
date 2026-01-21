const express = require('express')

function createTermsRouter({ pool, authRequired, requireRole, apiError }) {
  const router = express.Router()

  // Get all terms (optionally filtered by academic year)
  router.get('/admin/terms', authRequired, async (req, res) => {
    const { academicYearId } = req.query
    try {
      let query = 'select id, name, start_date, end_date, status, academic_year_id from terms'
      const params = []
      
      if (academicYearId) {
        query += ' where academic_year_id = $1'
        params.push(academicYearId)
      } else {
        // If no academic year specified, get terms from the active academic year
        query += ' where academic_year_id = (select id from academic_years where archived = false order by start_date desc limit 1)'
      }
      
      query += ' order by start_date'
      const { rows } = await pool.query(query, params)
      const normalized = rows.map(r => ({
        id: String(r.id),
        name: r.name,
        startDate: r.start_date,
        endDate: r.end_date,
        status: r.status,
        academicYearId: r.academic_year_id
      }))
      res.json(normalized)
    } catch (e) {
      console.error('Failed to fetch terms', e)
      apiError(res, 500, 'Failed to fetch terms')
    }
  })

  // Create term
  router.post('/admin/terms', authRequired, requireRole('secretary', 'admin'), async (req, res) => {
    const { name, startDate, endDate, academicYearId } = req.body
    const client = await pool.connect()
    try {
      await client.query('begin')
      
      let yearId = academicYearId
      if (!yearId) {
        // Get active academic year
        const { rows: activeYears } = await client.query(
          `select id from academic_years where archived = false order by start_date desc limit 1`
        )
        if (activeYears[0]) {
          yearId = activeYears[0].id
        }
      }
      
      const { rows } = await client.query(
        `insert into terms (name, start_date, end_date, status, academic_year_id)
         values ($1, $2, $3, 'inactive', $4) returning id, name, start_date, end_date, status`,
        [name, startDate, endDate, yearId || null]
      )
      
      await client.query('commit')
      const term = rows[0]
      res.status(201).json({
        id: String(term.id),
        name: term.name,
        startDate: term.start_date,
        endDate: term.end_date,
        status: term.status
      })
    } catch (e) {
      try { await client.query('rollback') } catch (_) {}
      console.error('Failed to create term', e)
      apiError(res, 500, 'Failed to create term')
    } finally {
      client.release()
    }
  })

  // Update term
  router.put('/admin/terms/:id', authRequired, requireRole('secretary', 'admin'), async (req, res) => {
    const { id } = req.params
    const { name, startDate, endDate, status } = req.body
    try {
      const { rows } = await pool.query(
        `update terms set name = $1, start_date = $2, end_date = $3, status = coalesce($4, status)
         where id = $5 returning id, name, start_date, end_date, status`,
        [name, startDate, endDate, status || null, id]
      )
      if (!rows[0]) return apiError(res, 404, 'Term not found')
      const term = rows[0]
      res.json({
        id: String(term.id),
        name: term.name,
        startDate: term.start_date,
        endDate: term.end_date,
        status: term.status
      })
    } catch (e) {
      console.error('Failed to update term', e)
      apiError(res, 500, 'Failed to update term')
    }
  })

  // Delete term
  router.delete('/admin/terms/:id', authRequired, requireRole('secretary', 'admin'), async (req, res) => {
    const { id } = req.params
    try {
      const { rowCount } = await pool.query('delete from terms where id = $1', [id])
      if (!rowCount) return apiError(res, 404, 'Term not found')
      res.json({ success: true })
    } catch (e) {
      console.error('Failed to delete term', e)
      apiError(res, 500, 'Failed to delete term')
    }
  })

  return router
}

module.exports = { createTermsRouter }
