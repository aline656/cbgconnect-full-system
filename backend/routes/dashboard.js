const express = require("express")

function createDashboardRouter({ pool, authRequired, requireRole, apiError }) {
  const router = express.Router()

  // Get dashboard data for different roles
  router.get("/dashboard/:role", authRequired, async (req, res) => {
    const { role } = req.params
    const userId = req.user.id

    try {
      let dashboardData = {}

      switch (role) {
        case "admin":
          // Get admin stats from database
          try {
            const studentCount = await pool.query('select count(*) as count from students')
            const teacherCount = await pool.query('select count(*) as count from teachers')
            const parentCount = await pool.query('select count(*) as count from parents')
            const userCount = await pool.query('select count(*) as count from users where created_at > now() - interval \'1 day\'')
            
            dashboardData = {
              stats: {
                totalStudents: parseInt(studentCount.rows[0].count) || 0,
                totalTeachers: parseInt(teacherCount.rows[0].count) || 0,
                totalParents: parseInt(parentCount.rows[0].count) || 0,
                activeUsers: parseInt(userCount.rows[0].count) || 0,
                revenue: "$0",
                attendanceRate: "94.8%"
              },
              systemStatus: {
                database: "Healthy",
                server: "Online",
                security: "Protected",
                backup: "Completed",
                uptime: "99.9%",
                load: "42%"
              },
              recentActivities: [
                { action: "System running", user: "System", time: "now", status: "success" }
              ]
            }
          } catch (e) {
            console.error('Failed to get admin stats', e)
            dashboardData = { stats: {}, systemStatus: {}, recentActivities: [] }
          }
          break
          dashboardData = {
            stats: {
              totalBoys: 150,
              internalBoys: 90,
              externalBoys: 60,
              dormitoryOccupancy: 85,
              activeActivities: 8,
              pendingReports: 3,
              disciplinaryCases: 2
            },
            recentActivities: [
              {
                id: 1,
                type: "checkin",
                description: "Dormitory check-in completed",
                boy: "John Smith",
                time: "2 hours ago"
              },
              {
                id: 2,
                type: "activity",
                description: "Basketball practice attended",
                boy: "Mike Johnson",
                time: "4 hours ago"
              }
            ],
            pendingTasks: [
              {
                id: 1,
                title: "Review disciplinary report",
                type: "discipline",
                due: "Today",
                priority: "high"
              },
              {
                id: 2,
                title: "Submit weekly attendance",
                type: "attendance",
                due: "Tomorrow",
                priority: "medium"
              }
            ],
            recentAssignments: []
          }
          break

        case "metron":
          dashboardData = {
            stats: {
              totalGirls: 180,
              internalGirls: 110,
              externalGirls: 70,
              dormitoryOccupancy: 92,
              activeActivities: 12,
              pendingReports: 5
            },
            recentActivities: [
              {
                id: 1,
                type: "checkin",
                description: "Dormitory check-in completed",
                girl: "Sarah Williams",
                time: "1 hour ago"
              },
              {
                id: 2,
                type: "activity",
                description: "Cultural dance practice",
                girl: "Emma Davis",
                time: "3 hours ago"
              }
            ],
            pendingTasks: [
              {
                id: 1,
                title: "Review health report",
                type: "health",
                due: "Today",
                priority: "high"
              }
            ],
            recentAssignments: []
          }
          break

        case "teacher":
          dashboardData = {
            stats: {
              totalStudents: 120,
              classesTeaching: 5,
              assignmentsPending: 15,
              assignmentsGraded: 45,
              attendanceRate: 94,
              averagePerformance: 87
            },
            upcomingClasses: [
              {
                id: 1,
                subject: "Mathematics",
                className: "Grade 10A",
                time: "9:00 AM",
                duration: 45
              },
              {
                id: 2,
                subject: "Physics",
                className: "Grade 10B",
                time: "10:00 AM",
                duration: 45
              }
            ],
            pendingTasks: [
              {
                id: 1,
                title: "Grade math assignments",
                type: "assignment",
                count: 12,
                due: "Today"
              },
              {
                id: 2,
                title: "Update attendance records",
                type: "attendance",
                due: "Today"
              }
            ],
            topStudents: [
              {
                id: 1,
                name: "Alice Johnson",
                grade: "Grade 10A",
                performance: 95
              },
              {
                id: 2,
                name: "Bob Smith",
                grade: "Grade 10B",
                performance: 92
              }
            ]
          }
          break

        case "secretary":
          dashboardData = {
            stats: {
              totalStudents: 450,
              totalStaff: 35,
              pendingEnrollments: 12,
              upcomingEvents: 8,
              unreadMessages: 24,
              pendingApprovals: 6
            },
            recentActivities: [
              {
                id: 1,
                type: "enrollment",
                description: "New student enrollment",
                student: "New Student",
                time: "30 minutes ago"
              },
              {
                id: 2,
                type: "message",
                description: "Parent inquiry received",
                student: "Parent Message",
                time: "1 hour ago"
              }
            ],
            pendingTasks: [
              {
                id: 1,
                title: "Process enrollment applications",
                type: "enrollment",
                count: 12,
                due: "Today"
              },
              {
                id: 2,
                title: "Review leave requests",
                type: "leave",
                count: 5,
                due: "Tomorrow"
              }
            ],
            upcomingEvents: [
              {
                id: 1,
                title: "Staff Meeting",
                date: "Tomorrow",
                time: "2:00 PM",
                type: "meeting"
              },
              {
                id: 2,
                title: "Parent-Teacher Conference",
                date: "Friday",
                time: "10:00 AM",
                type: "conference"
              }
            ]
          }
          break

        default:
          return apiError(res, 404, "Dashboard not found for this role")
      }

      res.json(dashboardData)
    } catch (error) {
      console.error(`Dashboard error for role ${role}:`, error)
      apiError(res, 500, "Failed to fetch dashboard data")
    }
  })

  return router
}

module.exports = { createDashboardRouter }
