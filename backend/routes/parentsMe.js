const express = require("express")

function createParentsMeRouter({
  pool,
  authRequired,
  requireRole,
  apiError,
  loadParentContext,
  ensureParentSeedData,
  initials,
  mapLetterGradeToProgress,
}) {
  const router = express.Router()

  router.get(
    "/parents/me/dashboard",
    authRequired,
    requireRole("parent"),
    async (req, res) => {
      let client
      try {
        client = await pool.connect()
        const ctx = await loadParentContext(client, req.user.id)
        if (!ctx) {
          apiError(res, 404, "Parent profile not found")
          return
        }

        await ensureParentSeedData(client, ctx.parent_id, ctx.name)

        const childrenR = await client.query(
          `select id, name, grade, teacher_name, attendance_rate, overall_grade
           from children where parent_id = $1 order by id asc`,
          [ctx.parent_id],
        )

        const childIds = childrenR.rows.map((c) => c.id)
        const gradesR = childIds.length
          ? await client.query(
              `select subject, grade, teacher, graded_at
               from grades
               where child_id = any($1::bigint[])
               order by graded_at desc
               limit 6`,
              [childIds],
            )
          : { rows: [] }

        const notificationsR = await client.query(
          `select id, type, title, content, read
           from notifications
           where parent_id = $1
           order by created_at desc
           limit 6`,
          [ctx.parent_id],
        )

        const eventsR = await client.query(
          `select title, event_date, event_time, location
           from events
           where parent_id = $1
           order by event_date asc nulls last, created_at asc
           limit 6`,
          [ctx.parent_id],
        )

        const stats = {
          totalAssignments: 0,
          completedAssignments: 0,
          attendanceRate:
            childrenR.rows.length > 0
              ? Math.round(
                  (childrenR.rows.reduce(
                    (sum, c) => sum + Number(c.attendance_rate || 0),
                    0,
                  ) /
                    childrenR.rows.length) * 10,
                ) / 10
              : 0,
          teacherMessages: notificationsR.rows.filter(
            (n) => n.type === "message" && !n.read,
          ).length,
        }

        res.json({
          name: ctx.name,
          children: childrenR.rows.map((c) => ({
            id: c.id,
            name: c.name,
            grade: c.grade,
            avatar: initials(c.name),
            teacher: c.teacher_name,
            attendance: c.attendance_rate !== null ? Number(c.attendance_rate) : null,
            overallGrade: c.overall_grade,
          })),
          recentGrades: gradesR.rows.map((g) => ({
            subject: g.subject,
            grade: g.grade,
            date: new Date(g.graded_at).toLocaleDateString("en-US"),
            teacher: g.teacher,
          })),
          notifications: notificationsR.rows.map((n) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            content: n.content,
            read: n.read,
          })),
          upcomingEvents: eventsR.rows.map((e) => ({
            title: e.title,
            date: e.event_date
              ? new Date(e.event_date).toLocaleDateString("en-US")
              : null,
            time: e.event_time,
            location: e.location,
          })),
          stats,
        })
      } catch (_e) {
        apiError(res, 500, "Failed to load dashboard")
      } finally {
        if (client) client.release()
      }
    },
  )

  router.get(
    "/parents/me/profile",
    authRequired,
    requireRole("parent"),
    async (req, res) => {
      let client
      try {
        client = await pool.connect()
        const ctx = await loadParentContext(client, req.user.id)
        if (!ctx) {
          apiError(res, 404, "Parent profile not found")
          return
        }

        await ensureParentSeedData(client, ctx.parent_id, ctx.name)

        const childrenR = await client.query(
          `select id, name, grade
           from children
           where parent_id = $1
           order by id asc`,
          [ctx.parent_id],
        )

        const settingsR = await client.query(
          `select settings from parent_settings where parent_id = $1 limit 1`,
          [ctx.parent_id],
        )
        const settings = settingsR.rowCount ? settingsR.rows[0].settings : {}

        res.json({
          personal: {
            name: ctx.name,
            email: ctx.email,
            phone: ctx.phone,
            address: ctx.address,
            birthday: ctx.birthday,
            occupation: ctx.occupation,
            bio: ctx.bio,
            avatar: initials(ctx.name),
          },
          children: childrenR.rows.map((c) => ({
            id: c.id,
            name: c.name,
            grade: c.grade,
            relationship: "Child",
          })),
          preferences: {
            notifications: settings.notifications || {},
            language: settings.account?.language || "english",
            timezone: settings.account?.timezone || "UTC",
            theme: settings.account?.theme || "light",
          },
          activity: [],
        })
      } catch (_e) {
        apiError(res, 500, "Failed to load profile")
      } finally {
        if (client) client.release()
      }
    },
  )

  router.put(
    "/parents/me/profile",
    authRequired,
    requireRole("parent"),
    async (req, res) => {
      let client
      try {
        const payload = req.body
        if (!payload || typeof payload !== "object") {
          apiError(res, 400, "Invalid payload")
          return
        }

        client = await pool.connect()
        const ctx = await loadParentContext(client, req.user.id)
        if (!ctx) {
          apiError(res, 404, "Parent profile not found")
          return
        }

        await client.query(`update users set name = $1 where id = $2`, [
          String(payload.personal?.name || ctx.name).trim(),
          req.user.id,
        ])

        await client.query(
          `update parents
           set phone = $1, address = $2, birthday = $3, occupation = $4, bio = $5
           where id = $6`,
          [
            payload.personal?.phone ?? ctx.phone,
            payload.personal?.address ?? ctx.address,
            payload.personal?.birthday ?? ctx.birthday,
            payload.personal?.occupation ?? ctx.occupation,
            payload.personal?.bio ?? ctx.bio,
            ctx.parent_id,
          ],
        )

        if (payload.preferences && typeof payload.preferences === "object") {
          const existingSettingsR = await client.query(
            `select settings from parent_settings where parent_id = $1 limit 1`,
            [ctx.parent_id],
          )
          const existing = existingSettingsR.rowCount
            ? existingSettingsR.rows[0].settings
            : {}

          const merged = {
            ...existing,
            notifications:
              payload.preferences.notifications ?? existing.notifications,
            account: {
              ...(existing.account || {}),
              language: payload.preferences.language ?? existing.account?.language,
              timezone: payload.preferences.timezone ?? existing.account?.timezone,
              theme: payload.preferences.theme ?? existing.account?.theme,
            },
          }

          await client.query(
            `insert into parent_settings (parent_id, settings)
             values ($1, $2)
             on conflict (parent_id) do update set settings = excluded.settings, updated_at = now()`,
            [ctx.parent_id, merged],
          )
        }

        res.json({ ok: true })
      } catch (_e) {
        apiError(res, 500, "Failed to update profile")
      } finally {
        if (client) client.release()
      }
    },
  )

  router.get(
    "/parents/me/settings",
    authRequired,
    requireRole("parent"),
    async (req, res) => {
      let client
      try {
        client = await pool.connect()
        const ctx = await loadParentContext(client, req.user.id)
        if (!ctx) {
          apiError(res, 404, "Parent profile not found")
          return
        }
        const settingsR = await client.query(
          `select settings from parent_settings where parent_id = $1 limit 1`,
          [ctx.parent_id],
        )
        const settings = settingsR.rowCount ? settingsR.rows[0].settings : {}
        res.json({ settings })
      } catch (_e) {
        apiError(res, 500, "Failed to load settings")
      } finally {
        if (client) client.release()
      }
    },
  )

  router.put(
    "/parents/me/settings",
    authRequired,
    requireRole("parent"),
    async (req, res) => {
      let client
      try {
        const { settings } = req.body || {}
        if (!settings || typeof settings !== "object") {
          apiError(res, 400, "Invalid settings")
          return
        }
        client = await pool.connect()
        const ctx = await loadParentContext(client, req.user.id)
        if (!ctx) {
          apiError(res, 404, "Parent profile not found")
          return
        }
        await client.query(
          `insert into parent_settings (parent_id, settings)
           values ($1, $2)
           on conflict (parent_id) do update set settings = excluded.settings, updated_at = now()`,
          [ctx.parent_id, settings],
        )
        res.json({ ok: true })
      } catch (_e) {
        apiError(res, 500, "Failed to update settings")
      } finally {
        if (client) client.release()
      }
    },
  )

  router.get(
    "/parents/me/report",
    authRequired,
    requireRole("parent"),
    async (req, res) => {
      let client
      try {
        const childId = req.query.child ? Number(req.query.child) : null
        const period =
          typeof req.query.period === "string" ? req.query.period : "fall-2024"

        client = await pool.connect()
        const ctx = await loadParentContext(client, req.user.id)
        if (!ctx) {
          apiError(res, 404, "Parent profile not found")
          return
        }

        await ensureParentSeedData(client, ctx.parent_id, ctx.name)

        const childR = childId
          ? await client.query(
              `select id, name, grade, teacher_name, attendance_rate, overall_grade
               from children
               where id = $1 and parent_id = $2
               limit 1`,
              [childId, ctx.parent_id],
            )
          : await client.query(
              `select id, name, grade, teacher_name, attendance_rate, overall_grade
               from children
               where parent_id = $1
               order by id asc
               limit 1`,
              [ctx.parent_id],
            )

        if (!childR.rowCount) {
          apiError(res, 404, "Child not found")
          return
        }

        const child = childR.rows[0]
        const gradesR = await client.query(
          `select subject, grade, teacher, graded_at
           from grades
           where child_id = $1
           order by graded_at desc`,
          [child.id],
        )

        const subjects = gradesR.rows.slice(0, 12).map((g) => ({
          name: g.subject,
          grade: g.grade,
          progress: mapLetterGradeToProgress(g.grade),
          teacher: g.teacher,
        }))

        res.json({
          childId: child.id,
          name: child.name,
          grade: child.grade,
          teacher: child.teacher_name,
          period,
          attendance: {
            total: 45,
            present: 43,
            absent: 2,
            percentage:
              child.attendance_rate !== null ? Number(child.attendance_rate) : 0,
          },
          grades: {
            overall: child.overall_grade,
            subjects,
          },
          assignments: {
            total: 24,
            completed: 20,
            pending: 4,
            late: 0,
          },
          behavior: [],
          teacherComments: [],
        })
      } catch (_e) {
        apiError(res, 500, "Failed to load report")
      } finally {
        if (client) client.release()
      }
    },
  )

  return router
}

module.exports = { createParentsMeRouter }
