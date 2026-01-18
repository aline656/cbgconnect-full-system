const express = require("express")

function createParentsPublicRouter({ pool }) {
  const router = express.Router()

  router.get("/parents/dashboard", async (req, res) => {
    const parentId = req.query.parentId

    let client
    try {
      client = await pool.connect()
      let parentName = "Sarah Johnson"

      if (parentId) {
        try {
          const r = await client.query(
            `select u.name
             from parents p
             join users u on u.id = p.user_id
             where p.id = $1
             limit 1`,
            [parentId],
          )
          if (r.rowCount && r.rows[0]?.name) parentName = r.rows[0].name
        } catch (_e) {}
      }

      const data = {
        name: parentName,
        children: [
          {
            id: 1,
            name: "Emily Johnson",
            grade: "Grade 5",
            avatar: "EJ",
            teacher: "Mr. Wilson",
            attendance: 95,
            overallGrade: "A-",
          },
          {
            id: 2,
            name: "Michael Johnson",
            grade: "Grade 7",
            avatar: "MJ",
            teacher: "Ms. Rodriguez",
            attendance: 98,
            overallGrade: "B+",
          },
        ],
        recentGrades: [
          { subject: "Mathematics", grade: "A", date: "Today", teacher: "Mr. Wilson" },
          { subject: "Science", grade: "B+", date: "Yesterday", teacher: "Ms. Carter" },
          { subject: "English", grade: "A-", date: "3 days ago", teacher: "Mr. Smith" },
        ],
        notifications: [
          { id: 1, type: "grade", title: "New Grade Posted", content: "Emily scored A in Mathematics", read: false },
          { id: 2, type: "attendance", title: "Attendance Update", content: "Michael has perfect attendance this week", read: false },
          { id: 3, type: "message", title: "Teacher Message", content: "Parent-teacher meeting scheduled for next Friday", read: true },
        ],
        upcomingEvents: [
          { title: "Science Fair", date: "Mar 15", time: "10:00 AM", location: "School Hall" },
          { title: "Parent-Teacher Meeting", date: "Mar 20", time: "2:00 PM", location: "Room 204" },
        ],
        stats: {
          totalAssignments: 24,
          completedAssignments: 20,
          attendanceRate: 96,
          teacherMessages: 3,
        },
      }

      res.json(data)
    } catch (_error) {
      res.status(500).json({ message: "Failed to load dashboard" })
    } finally {
      if (client) client.release()
    }
  })

  return router
}

module.exports = { createParentsPublicRouter }
