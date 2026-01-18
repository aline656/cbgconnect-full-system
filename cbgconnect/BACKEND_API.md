# Backend API Documentation

This document outlines the required API endpoints for the CBG Connect application to function with real-time data from the database.

## Base URL
```
http://localhost:3001/api
```

## Authentication Endpoints

### POST /auth/login
```json
Request:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "teacher|metron|patron|admin",
    "name": "string",
    "profileImage": "string"
  }
}
```

### POST /auth/register
```json
Request:
{
  "email": "string",
  "password": "string",
  "name": "string",
  "role": "teacher|metron|patron|admin"
}

Response:
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string",
    "name": "string"
  }
}
```

### GET /auth/me
Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "id": "string",
  "email": "string",
  "role": "string",
  "name": "string",
  "profileImage": "string"
}
```

## User Management

### GET /users
Query params: `?role=teacher|metron|patron|admin`

Response:
```json
[
  {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string",
    "profileImage": "string",
    "createdAt": "string",
    "status": "active|inactive"
  }
]
```

### PUT /users/:id
```json
Request:
{
  "name": "string",
  "email": "string",
  "profileImage": "string"
}

Response:
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "profileImage": "string"
}
```

### POST /users/:id/profile-image
Content-Type: `multipart/form-data`

Request: `profileImage: File`

Response:
```json
{
  "profileImage": "string"
}
```

## Dashboard Data

### GET /dashboard/teacher
Response:
```json
{
  "stats": {
    "totalStudents": "number",
    "classesTeaching": "number",
    "assignmentsPending": "number",
    "assignmentsGraded": "number",
    "attendanceRate": "number",
    "averagePerformance": "number"
  },
  "upcomingClasses": [
    {
      "id": "string",
      "subject": "string",
      "className": "string",
      "time": "string",
      "duration": "number"
    }
  ],
  "pendingTasks": [
    {
      "id": "string",
      "type": "assignment|attendance|meeting",
      "title": "string",
      "due": "string",
      "count": "number"
    }
  ],
  "topStudents": [
    {
      "id": "string",
      "name": "string",
      "grade": "string",
      "performance": "number",
      "improvement": "string"
    }
  ]
}
```

### GET /dashboard/metron
Response:
```json
{
  "stats": {
    "totalGirls": "number",
    "dormitoriesManaged": "number",
    "occupancyRate": "number",
    "maintenanceRequests": "number",
    "attendanceRate": "number"
  },
  "recentAssignments": [
    {
      "id": "string",
      "girlName": "string",
      "dormitory": "string",
      "room": "string",
      "assignedAt": "string"
    }
  ],
  "pendingTasks": [
    {
      "id": "string",
      "type": "maintenance|assignment|inspection",
      "title": "string",
      "priority": "high|medium|low"
    }
  ]
}
```

### GET /dashboard/patron
Response:
```json
{
  "stats": {
    "totalBoys": "number",
    "dormitoriesManaged": "number",
    "occupancyRate": "number",
    "disciplinaryCases": "number",
    "reportsSubmitted": "number"
  },
  "recentAssignments": [
    {
      "id": "string",
      "boyName": "string",
      "dormitory": "string",
      "room": "string",
      "assignedAt": "string"
    }
  ],
  "pendingReports": [
    {
      "id": "string",
      "type": "disciplinary|attendance|performance",
      "title": "string",
      "dueDate": "string"
    }
  ]
}
```

## Teacher Specific Endpoints

### GET /teacher/classes
Response:
```json
[
  {
    "id": "string",
    "name": "string",
    "grade": "string",
    "subject": "string",
    "schedule": "string",
    "students": ["string"]
  }
]
```

### GET /teacher/assignments
Response:
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "classId": "string",
    "dueDate": "string",
    "status": "pending|graded|draft",
    "submissions": "number"
  }
]
```

### POST /teacher/assignments
```json
Request:
{
  "title": "string",
  "description": "string",
  "classId": "string",
  "dueDate": "string"
}

Response:
{
  "id": "string",
  "title": "string",
  "description": "string",
  "classId": "string",
  "dueDate": "string",
  "status": "pending"
}
```

### GET /teacher/attendance
Response:
```json
[
  {
    "id": "string",
    "classId": "string",
    "date": "string",
    "present": "number",
    "absent": "number",
    "students": [
      {
        "studentId": "string",
        "name": "string",
        "status": "present|absent|late"
      }
    ]
  }
]
```

### POST /teacher/attendance
```json
Request:
{
  "classId": "string",
  "date": "string",
  "attendance": [
    {
      "studentId": "string",
      "status": "present|absent|late"
    }
  ]
}

Response:
{
  "id": "string",
  "classId": "string",
  "date": "string",
  "present": "number",
  "absent": "number"
}
```

## Metron Specific Endpoints

### GET /metron/dormitories
Response:
```json
[
  {
    "id": "string",
    "name": "string",
    "capacity": "number",
    "occupied": "number",
    "status": "active|maintenance",
    "rooms": [
      {
        "id": "string",
        "number": "string",
        "capacity": "number",
        "occupied": "number",
        "assignedGirl": "string"
      }
    ]
  }
]
```

### GET /metron/girls
Response:
```json
[
  {
    "id": "string",
    "name": "string",
    "grade": "string",
    "assignedDormitory": "string",
    "assignedRoom": "string",
    "status": "active|inactive"
  }
]
```

### POST /metron/dormitory-assignments
```json
Request:
{
  "girlId": "string",
  "dormitoryId": "string",
  "roomId": "string"
}

Response:
{
  "id": "string",
  "girlId": "string",
  "dormitoryId": "string",
  "roomId": "string",
  "assignedAt": "string"
}
```

## Patron Specific Endpoints

### GET /patron/dormitories
Response:
```json
[
  {
    "id": "string",
    "name": "string",
    "capacity": "number",
    "occupied": "number",
    "status": "active|maintenance",
    "rooms": [
      {
        "id": "string",
        "number": "string",
        "capacity": "number",
        "occupied": "number",
        "assignedBoy": "string"
      }
    ]
  }
]
```

### GET /patron/boys
Response:
```json
[
  {
    "id": "string",
    "name": "string",
    "grade": "string",
    "assignedDormitory": "string",
    "assignedRoom": "string",
    "status": "active|inactive"
  }
]
```

### POST /patron/dormitory-assignments
```json
Request:
{
  "boyId": "string",
  "dormitoryId": "string",
  "roomId": "string"
}

Response:
{
  "id": "string",
  "boyId": "string",
  "dormitoryId": "string",
  "roomId": "string",
  "assignedAt": "string"
}
```

### GET /patron/reports
Response:
```json
[
  {
    "id": "string",
    "title": "string",
    "type": "disciplinary|attendance|performance",
    "description": "string",
    "studentId": "string",
    "createdAt": "string",
    "status": "draft|submitted"
  }
]
```

### POST /patron/reports
```json
Request:
{
  "title": "string",
  "type": "disciplinary|attendance|performance",
  "description": "string",
  "studentId": "string"
}

Response:
{
  "id": "string",
  "title": "string",
  "type": "string",
  "description": "string",
  "studentId": "string",
  "createdAt": "string",
  "status": "draft"
}
```

## Notifications

### GET /notifications
Query params: `?role=teacher|metron|patron|admin|all`

Response:
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "type": "info|warning|success|error|reminder",
    "role": "teacher|metron|patron|all",
    "priority": "low|medium|high",
    "read": "boolean",
    "timestamp": "string",
    "category": "attendance|assignment|grade|dormitory|discipline|system|meeting|other",
    "sender": "string",
    "action": {
      "label": "string",
      "path": "string"
    }
  }
]
```

### PUT /notifications/:id/read
Response:
```json
{
  "id": "string",
  "read": true
}
```

### PUT /notifications/read-all
Response:
```json
{
  "message": "All notifications marked as read"
}
```

### DELETE /notifications/:id
Response:
```json
{
  "message": "Notification deleted successfully"
}
```

## Real-time WebSocket Connection

### Connection URL
```
ws://localhost:3001?userId=<userId>&role=<userRole>
```

### Message Format
```json
{
  "type": "new_notification|notification_read|notification_deleted|dashboard_update",
  "data": {
    "notification": "object",
    "notificationId": "string",
    "endpoint": "string",
    "data": "object"
  }
}
```

## Error Handling

All endpoints should return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "string",
  "message": "string",
  "details": "object"
}
```

## File Upload

Profile images should be uploaded to a secure storage location and return a URL. Supported formats: JPEG, PNG, GIF, WebP. Maximum file size: 5MB.

## Database Schema Requirements

The backend should implement the following main collections/tables:

1. **Users** - id, email, password, name, role, profileImage, createdAt, status
2. **Classes** - id, name, grade, subject, teacherId, schedule
3. **Students** - id, name, grade, classId, status
4. **Assignments** - id, title, description, classId, teacherId, dueDate, status
5. **Attendance** - id, classId, date, studentId, status
6. **Dormitories** - id, name, capacity, type (boys/girls), status
7. **Rooms** - id, dormitoryId, number, capacity, assignedStudentId
8. **Reports** - id, title, type, description, studentId, patronId, status
9. **Notifications** - id, title, description, type, role, priority, read, timestamp, category, sender

## Security Requirements

- JWT authentication for all protected routes
- Password hashing with bcrypt
- Rate limiting on authentication endpoints
- CORS configuration for frontend domain
- Input validation and sanitization
- File upload security (type checking, size limits)
