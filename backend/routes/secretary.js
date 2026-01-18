const express = require("express")

function createSecretaryRouter({
  pool,
  authRequired,
  requireRole,
  apiError,
  loadSecretaryContext,
  ensureSecretarySeedData,
  initials,
}) {
  const router = express.Router()

  router.get(
    "/secretary/me/dashboard",
    authRequired,
    requireRole("secretary"),
    async (req, res) => {
      let client
      try {
        client = await pool.connect()
        const ctx = await loadSecretaryContext(client, req.user.id)
        if (!ctx) {
          apiError(res, 404, "Secretary profile not found")
          return
        }

        await ensureSecretarySeedData(client, ctx.secretary_id)

        const totalsR = await client.query(
          `select
             (select count(*)::int from children) as total_students,
             (select count(*)::int from parents) as total_parents`,
        )
        const totalStudents = totalsR.rows[0]?.total_students ?? 0

        const pendingFormsR = await client.query(
          `select count(*)::int as pending
           from secretary_tasks
           where secretary_id = $1 and status = 'pending'`,
          [ctx.secretary_id],
        )
        const pendingForms = pendingFormsR.rows[0]?.pending ?? 0

        const tasksR = await client.query(
          `select id, title, priority, due, category
           from secretary_tasks
           where secretary_id = $1 and status = 'pending'
           order by created_at desc
           limit 8`,
          [ctx.secretary_id],
        )

        const activitiesR = await client.query(
          `select action, meta, status, created_at
           from secretary_activities
           where secretary_id = $1
           order by created_at desc
           limit 8`,
          [ctx.secretary_id],
        )

        const eventsR = await client.query(
          `select title, event_date, event_time, location, type
           from secretary_events
           where secretary_id = $1
           order by event_date asc nulls last, created_at asc
           limit 6`,
          [ctx.secretary_id],
        )

        res.json({
          user: {
            name: ctx.name,
            role: "School Secretary",
            department: ctx.department || "Administration",
            avatar: initials(ctx.name),
          },
          todayStats: {
            totalStudents,
            presentToday: totalStudents,
            absentToday: 0,
            feePayments: 0,
            pendingForms,
            newAdmissions: 0,
          },
          pendingTasks: tasksR.rows.map((t) => ({
            id: t.id,
            title: t.title,
            priority: t.priority,
            due: t.due,
            category: t.category,
          })),
          recentActivities: activitiesR.rows.map((a) => ({
            action: a.action,
            student: a.meta?.student,
            teacher: a.meta?.teacher,
            count: a.meta?.count,
            amount: a.meta?.amount,
            time: new Date(a.created_at).toLocaleString("en-US"),
            status: a.status,
          })),
          upcomingEvents: eventsR.rows.map((e) => ({
            title: e.title,
            date: e.event_date
              ? new Date(e.event_date).toLocaleDateString("en-US")
              : null,
            time: e.event_time,
            location: e.location,
            type: e.type,
          })),
        })
      } catch (_e) {
        apiError(res, 500, "Failed to load dashboard")
      } finally {
        if (client) client.release()
      }
    },
  )

  return router
}

module.exports = { createSecretaryRouter }
