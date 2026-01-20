const express = require("express")

function createFinanceRouter({ pool, authRequired, requireRole, apiError }) {
  const router = express.Router()

  // Get all fees
  router.get("/fees", authRequired, async (req, res) => {
    try {
      const { student_id, status } = req.query

      let query = `select f.*, s.name as student_name, s.student_id
                   from fees f
                   join students s on f.student_id = s.id
                   where 1=1`
      const params = []

      if (student_id) {
        query += ` and f.student_id = $${params.length + 1}`
        params.push(student_id)
      }
      if (status) {
        query += ` and f.status = $${params.length + 1}`
        params.push(status)
      }

      query += " order by f.due_date"
      const result = await pool.query(query, params)
      res.json(result.rows)
    } catch (e) {
      apiError(res, 500, `Failed to fetch fees: ${e.message}`)
    }
  })

  // Get fee summary
  router.get("/fees/summary", authRequired, async (req, res) => {
    try {
      const result = await pool.query(`
        select 
          sum(case when status = 'paid' then amount else 0 end) as total_collected,
          sum(case when status = 'pending' then amount else 0 end) as total_pending,
          sum(case when status = 'overdue' then amount else 0 end) as total_overdue,
          sum(case when status = 'partial' then amount else 0 end) as total_partial,
          count(distinct case when status = 'paid' then student_id end) as students_paid,
          count(distinct case when status = 'pending' then student_id end) as students_pending,
          count(distinct case when status = 'overdue' then student_id end) as students_overdue
        from fees
      `)

      res.json(result.rows[0] || {})
    } catch (e) {
      apiError(res, 500, `Failed to fetch fee summary: ${e.message}`)
    }
  })

  // Add fee
  router.post("/fees", authRequired, requireRole("secretary", "admin"), async (req, res) => {
    try {
      const { student_id, fee_type, amount, due_date } = req.body

      if (!student_id || !fee_type || !amount) {
        apiError(res, 400, "Missing required fields")
        return
      }

      const result = await pool.query(
        `insert into fees (student_id, fee_type, amount, due_date, status)
         values ($1, $2, $3, $4, 'pending')
         returning *`,
        [student_id, fee_type, amount, due_date],
      )

      res.status(201).json(result.rows[0])
    } catch (e) {
      apiError(res, 500, `Failed to add fee: ${e.message}`)
    }
  })

  // Record fee payment
  router.post("/fees/:id/payment", authRequired, requireRole("secretary", "admin"), async (req, res) => {
    try {
      const { id } = req.params
      const { amount, paid_date } = req.body

      if (!amount) {
        apiError(res, 400, "Amount is required")
        return
      }

      const client = await pool.connect()
      try {
        await client.query("begin")

        // Get current fee
        const feeResult = await client.query("select * from fees where id = $1", [id])
        if (!feeResult.rows.length) {
          apiError(res, 404, "Fee not found")
          return
        }

        const fee = feeResult.rows[0]
        const newPaidAmount = (fee.paid_amount || 0) + amount
        let newStatus = "pending"

        if (newPaidAmount >= fee.amount) {
          newStatus = "paid"
        } else if (newPaidAmount > 0) {
          newStatus = "partial"
        }

        // Update fee
        const updatedFee = await client.query(
          `update fees 
           set paid_date = coalesce($2, paid_date),
               status = $3,
               updated_at = now()
           where id = $1
           returning *`,
          [id, paid_date, newStatus],
        )

        // Record transaction
        await client.query(
          `insert into transactions (student_id, amount, transaction_type, description)
           values ($1, $2, 'fee_payment', $3)`,
          [fee.student_id, amount, `Payment for ${fee.fee_type}`],
        )

        await client.query("commit")
        res.json(updatedFee.rows[0])
      } catch (e) {
        await client.query("rollback")
        throw e
      } finally {
        client.release()
      }
    } catch (e) {
      apiError(res, 500, `Failed to record payment: ${e.message}`)
    }
  })

  // Update fee
  router.put("/fees/:id", authRequired, requireRole("secretary", "admin"), async (req, res) => {
    try {
      const { id } = req.params
      const { fee_type, amount, due_date, status } = req.body

      const result = await pool.query(
        `update fees
         set fee_type = coalesce($2, fee_type),
             amount = coalesce($3, amount),
             due_date = coalesce($4, due_date),
             status = coalesce($5, status),
             updated_at = now()
         where id = $1
         returning *`,
        [id, fee_type, amount, due_date, status],
      )

      if (!result.rows.length) {
        apiError(res, 404, "Fee not found")
        return
      }

      res.json(result.rows[0])
    } catch (e) {
      apiError(res, 500, `Failed to update fee: ${e.message}`)
    }
  })

  // Delete fee
  router.delete("/fees/:id", authRequired, requireRole("secretary", "admin"), async (req, res) => {
    try {
      const { id } = req.params
      const result = await pool.query("delete from fees where id = $1 returning *", [id])

      if (!result.rows.length) {
        apiError(res, 404, "Fee not found")
        return
      }

      res.json({ message: "Fee deleted successfully" })
    } catch (e) {
      apiError(res, 500, `Failed to delete fee: ${e.message}`)
    }
  })

  // Get student fee summary
  router.get("/fees/student/:student_id/summary", authRequired, async (req, res) => {
    try {
      const { student_id } = req.params

      const result = await pool.query(
        `select 
           sum(amount) as total_due,
           sum(case when status = 'paid' then amount else 0 end) as total_paid,
           sum(case when status = 'pending' or status = 'overdue' then amount else 0 end) as total_pending,
           count(*) as total_fees
         from fees
         where student_id = $1`,
        [student_id],
      )

      res.json(result.rows[0] || {})
    } catch (e) {
      apiError(res, 500, `Failed to fetch student fee summary: ${e.message}`)
    }
  })

  // Export fees as CSV
  router.get("/fees/export/csv", authRequired, async (req, res) => {
    try {
      const { status } = req.query

      let query = `select f.*, s.name as student_name, s.student_id
                   from fees f
                   join students s on f.student_id = s.id
                   where 1=1`
      const params = []

      if (status) {
        query += ` and f.status = $${params.length + 1}`
        params.push(status)
      }

      const result = await pool.query(query, params)
      const fees = result.rows

      if (!fees.length) {
        res.json({ message: "No fees to export" })
        return
      }

      const headers = [
        "student_id",
        "student_name",
        "fee_type",
        "amount",
        "due_date",
        "paid_date",
        "status",
      ]
      const rows = fees.map((f) =>
        [f.student_id, f.student_name, f.fee_type, f.amount, f.due_date, f.paid_date || "", f.status]
          .map((v) => `"${v}"`)
          .join(","),
      )
      const csv = [headers.join(","), ...rows].join("\n")

      res.setHeader("Content-Type", "text/csv")
      res.setHeader("Content-Disposition", "attachment; filename=fees.csv")
      res.send(csv)
    } catch (e) {
      apiError(res, 500, `Failed to export fees: ${e.message}`)
    }
  })

  return router
}

module.exports = { createFinanceRouter }
