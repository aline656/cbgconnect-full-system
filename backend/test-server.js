const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("ws")

const app = express()
const server = http.createServer(app)
const wss = new Server({ server })

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const userId = url.searchParams.get('userId')
  const role = url.searchParams.get('role')
  
  console.log(`WebSocket connected: userId=${userId}, role=${role}`)
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to real-time updates',
    userId,
    role
  }))
  
  // Handle incoming messages
  ws.on('message', (message) => {
    console.log('Received:', message.toString())
  })
  
  // Handle disconnection
  ws.on('close', () => {
    console.log(`WebSocket disconnected: userId=${userId}, role=${role}`)
  })
})

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

app.use(express.json())

// Simple health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Simple auth test endpoint
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body
  
  // Mock user for testing
  if (email === "test@example.com" && password === "password123") {
    res.json({
      token: "mock-jwt-token",
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "patron"
      }
    })
  } else {
    res.status(401).json({ message: "Invalid credentials" })
  }
})

// Mock dashboard endpoint
app.get("/api/dashboard/patron", (req, res) => {
  res.json({
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
      }
    ],
    pendingTasks: [
      {
        id: 1,
        title: "Review disciplinary report",
        type: "discipline",
        due: "Today",
        priority: "high"
      }
    ]
  })
})

// Mock auth/me endpoint
app.get("/api/auth/me", (req, res) => {
  res.json({
    user: {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      role: "patron"
    }
  })
})

// Profile endpoints for different roles
app.get("/api/profile/metron", (req, res) => {
  res.json({
    id: 1,
    name: "Mrs. Sarah Johnson",
    email: "metron@cbgconnect.edu",
    role: "metron",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Metron",
    department: "Girls' Dormitory",
    phone: "+1-555-0101",
    joinDate: "2022-08-15",
    statistics: {
      totalGirlsManaged: 180,
      currentDormitoryOccupancy: 92,
      activitiesOrganized: 45,
      reportsCompleted: 128
    },
    recentActivities: [
      {
        id: 1,
        type: "checkin",
        description: "Completed dormitory inspection",
        timestamp: "2024-01-18T10:30:00Z"
      },
      {
        id: 2,
        type: "activity",
        description: "Organized cultural dance practice",
        timestamp: "2024-01-18T14:15:00Z"
      }
    ]
  })
})

app.get("/api/profile/patron", (req, res) => {
  res.json({
    id: 2,
    name: "Mr. Michael Davis",
    email: "patron@cbgconnect.edu",
    role: "patron",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Patron",
    department: "Boys' Dormitory",
    phone: "+1-555-0102",
    joinDate: "2022-06-20",
    statistics: {
      totalBoysManaged: 150,
      currentDormitoryOccupancy: 85,
      activitiesOrganized: 38,
      disciplinaryCasesHandled: 24
    },
    recentActivities: [
      {
        id: 1,
        type: "checkin",
        description: "Completed evening dormitory check",
        timestamp: "2024-01-18T21:00:00Z"
      },
      {
        id: 2,
        type: "discipline",
        description: "Resolved student conflict",
        timestamp: "2024-01-18T16:45:00Z"
      }
    ]
  })
})

app.get("/api/profile/teacher", (req, res) => {
  res.json({
    id: 3,
    name: "Ms. Emily Chen",
    email: "teacher@cbgconnect.edu",
    role: "teacher",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher",
    department: "Academics",
    phone: "+1-555-0103",
    joinDate: "2021-09-10",
    subjects: ["Mathematics", "Physics"],
    statistics: {
      totalStudentsTaught: 120,
      averageGrade: 87,
      classesConducted: 245,
      assignmentsGraded: 489
    },
    recentActivities: [
      {
        id: 1,
        type: "class",
        description: "Conducted Grade 10 Mathematics class",
        timestamp: "2024-01-18T09:00:00Z"
      },
      {
        id: 2,
        type: "grading",
        description: "Graded physics assignments",
        timestamp: "2024-01-18T15:30:00Z"
      }
    ]
  })
})

app.get("/api/profile/secretary", (req, res) => {
  res.json({
    id: 4,
    name: "Mrs. Linda Wilson",
    email: "secretary@cbgconnect.edu",
    role: "secretary",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Secretary",
    department: "Administration",
    phone: "+1-555-0104",
    joinDate: "2020-03-15",
    statistics: {
      totalEnrollmentsProcessed: 450,
      pendingApplications: 12,
      appointmentsScheduled: 28,
      documentsProcessed: 1250
    },
    recentActivities: [
      {
        id: 1,
        type: "enrollment",
        description: "Processed new student application",
        timestamp: "2024-01-18T11:30:00Z"
      },
      {
        id: 2,
        type: "communication",
        description: "Responded to parent inquiry",
        timestamp: "2024-01-18T13:45:00Z"
      }
    ]
  })
})

const PORT = 4000

server.listen(PORT, () => {
  console.log(`Test backend listening on http://localhost:${PORT}`)
  console.log("WebSocket server running on ws://localhost:4000")
  console.log("Available endpoints:")
  console.log("- POST /api/auth/login")
  console.log("- GET /api/auth/me") 
  console.log("- GET /api/profile/metron")
  console.log("- GET /api/profile/patron")
  console.log("- GET /api/profile/teacher")
  console.log("- GET /api/profile/secretary")
  console.log("- GET /api/dashboard/patron")
  console.log("- GET /api/health")
})
