const express = require("express")
const multer = require("multer")
const path = require("path")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false)
    }
    cb(null, true)
  }
})

function createProfileRouter({ pool, authRequired, apiError }) {
  const router = express.Router()

  // Get profile data for different roles
  router.get("/profile/:role", authRequired, async (req, res) => {
    const { role } = req.params
    const userId = req.user.id

    try {
      let profileData = {}
      let client

      try {
        client = await pool.connect()

        // Get user basic information from database
        const userResult = await client.query(
          "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
          [userId]
        )

        if (!userResult.rowCount) {
          return apiError(res, 404, "User not found")
        }

        const user = userResult.rows[0]

        // Build profile data based on role
        switch (role) {
          case "metron":
            // Get metron-specific data
            const metronResult = await client.query(
              "SELECT department, phone, bio, national_id FROM metrons WHERE user_id = $1",
              [userId]
            )
            
            const metronData = metronResult.rows[0] || {}
            
            profileData = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
              department: metronData.department || "Girls' Dormitory",
              phone: metronData.phone || "+1-555-0101",
              bio: metronData.bio || "",
              nationalId: metronData.national_id || "",
              joinDate: user.created_at,
              statistics: {
                totalGirlsManaged: 180,
                currentDormitoryOccupancy: 92,
                activitiesOrganized: 45,
                reportsCompleted: 128
              }
            }
            break

          case "patron":
            // Get patron-specific data
            const patronResult = await client.query(
              "SELECT department, phone, bio, national_id FROM patrons WHERE user_id = $1",
              [userId]
            )
            
            const patronData = patronResult.rows[0] || {}
            
            profileData = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
              department: patronData.department || "Boys' Dormitory",
              phone: patronData.phone || "+1-555-0102",
              bio: patronData.bio || "",
              nationalId: patronData.national_id || "",
              joinDate: user.created_at,
              statistics: {
                totalBoysManaged: 150,
                currentDormitoryOccupancy: 85,
                activitiesOrganized: 38,
                disciplinaryCasesHandled: 24
              }
            }
            break

          case "teacher":
            profileData = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
              department: "Academics",
              phone: "+1-555-0103",
              joinDate: user.created_at,
              subjects: ["Mathematics", "Physics"],
              statistics: {
                totalStudentsTaught: 120,
                averageGrade: 87,
                classesConducted: 245,
                assignmentsGraded: 489
              }
            }
            break

          case "secretary":
            profileData = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
              department: "Administration",
              phone: "+1-555-0104",
              joinDate: user.created_at,
              statistics: {
                totalEnrollmentsProcessed: 450,
                pendingApplications: 12,
                appointmentsScheduled: 28,
                documentsProcessed: 1250
              }
            }
            break

          default:
            return apiError(res, 404, "Profile not found for this role")
        }

        res.json(profileData)
      } finally {
        if (client) client.release()
      }
    } catch (error) {
      console.error(`Profile error for role ${role}:`, error)
      apiError(res, 500, "Failed to fetch profile data")
    }
  })

  // Update profile data
  router.put("/profile/:role", authRequired, async (req, res) => {
    const { role } = req.params
    const userId = req.user.id
    const { firstName, lastName, email, phone, department, bio, nationalId } = req.body

    try {
      let client

      try {
        client = await pool.connect()

        // Combine first and last name
        const fullName = `${firstName} ${lastName}`.trim()

        // Update user information in database
        const updateResult = await client.query(
          "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role, created_at",
          [fullName, email, userId]
        )

        if (!updateResult.rowCount) {
          return apiError(res, 404, "User not found")
        }

        const updatedUser = updateResult.rows[0]

        // Update role-specific data
        switch (role) {
          case "metron":
            await client.query(
              `INSERT INTO metrons (user_id, department, phone, bio, national_id) 
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (user_id) 
               DO UPDATE SET 
                 department = EXCLUDED.department,
                 phone = EXCLUDED.phone,
                 bio = EXCLUDED.bio,
                 national_id = EXCLUDED.national_id`,
              [userId, department || "Girls' Dormitory", phone, bio, nationalId]
            )
            break

          case "patron":
            await client.query(
              `INSERT INTO patrons (user_id, department, phone, bio, national_id) 
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (user_id) 
               DO UPDATE SET 
                 department = EXCLUDED.department,
                 phone = EXCLUDED.phone,
                 bio = EXCLUDED.bio,
                 national_id = EXCLUDED.national_id`,
              [userId, department || "Boys' Dormitory", phone, bio, nationalId]
            )
            break

          default:
            return apiError(res, 404, "Profile not found for this role")
        }

        // Return updated profile data
        let profileData = {}

        switch (role) {
          case "metron":
            profileData = {
              id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
              role: updatedUser.role,
              profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(updatedUser.name)}`,
              department: department || "Girls' Dormitory",
              phone: phone || "+1-555-0101",
              bio: bio || "",
              nationalId: nationalId || "",
              joinDate: updatedUser.created_at,
              statistics: {
                totalGirlsManaged: 180,
                currentDormitoryOccupancy: 92,
                activitiesOrganized: 45,
                reportsCompleted: 128
              }
            }
            break

          case "patron":
            profileData = {
              id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
              role: updatedUser.role,
              profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(updatedUser.name)}`,
              department: department || "Boys' Dormitory",
              phone: phone || "+1-555-0102",
              bio: bio || "",
              nationalId: nationalId || "",
              joinDate: updatedUser.created_at,
              statistics: {
                totalBoysManaged: 150,
                currentDormitoryOccupancy: 85,
                activitiesOrganized: 38,
                disciplinaryCasesHandled: 24
              }
            }
            break

          default:
            return apiError(res, 404, "Profile not found for this role")
        }

        res.json({
          message: "Profile updated successfully",
          profile: profileData
        })
      } finally {
        if (client) client.release()
      }
    } catch (error) {
      console.error(`Profile update error for role ${role}:`, error)
      apiError(res, 500, "Failed to update profile data")
    }
  })

  // Upload profile image
  router.post("/profile/:role/upload", authRequired, upload.single('profileImage'), async (req, res) => {
    const { role } = req.params
    const userId = req.user.id

    try {
      console.log('Upload request received:', { role, userId, file: req.file?.filename })

      if (!req.file) {
        return apiError(res, 400, "No file uploaded")
      }

      // Create uploads directory if it doesn't exist
      const fs = require('fs')
      const uploadsDir = path.join(__dirname, '../uploads')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      // Generate file URL
      const fileUrl = `/uploads/${req.file.filename}`

      // Update user's profile image in database (you might want to add a profile_image column to users table)
      let client
      try {
        client = await pool.connect()
        
        // For now, we'll return the file URL. In a real implementation, 
        // you'd want to store this in the database
        const userResult = await client.query(
          "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
          [userId]
        )

        if (!userResult.rowCount) {
          return apiError(res, 404, "User not found")
        }

        const user = userResult.rows[0]

        // Return updated profile data with new image
        let profileData = {}

        switch (role) {
          case "metron":
            profileData = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              profileImage: `http://localhost:4000/uploads/${req.file.filename}`,
              department: "Girls' Dormitory",
              phone: "+1-555-0101",
              joinDate: user.created_at,
              statistics: {
                totalGirlsManaged: 180,
                currentDormitoryOccupancy: 92,
                activitiesOrganized: 45,
                reportsCompleted: 128
              }
            }
            break

          default:
            return apiError(res, 404, "Profile not found for this role")
        }

        console.log('Upload successful:', profileData.profileImage)
        res.json({
          message: "Profile image uploaded successfully",
          profile: profileData,
          imageUrl: fileUrl
        })
      } finally {
        if (client) client.release()
      }
    } catch (error) {
      console.error('Upload error details:', error)
      apiError(res, 500, "Failed to upload profile image")
    }
  })

  // Get girls data for metron
  router.get("/girls", authRequired, async (req, res) => {
    const userId = req.user.id

    try {
      let client
      try {
        client = await pool.connect()

        // Get all girls from children table (filtering by gender)
        const girlsResult = await client.query(
          `SELECT 
            c.id, 
            c.name, 
            'GS' || LPAD(c.id::text, 6, '0') as "studentId", 
            CASE 
              WHEN c.grade IN ('9', '10', '11', '12') THEN 'internal'
              ELSE 'external'
            END as "type",
            c.grade, 
            c.grade as "className",
            COALESCE(EXTRACT(YEAR FROM AGE(CURRENT_DATE, c.created_at)), 16) as "age",
            p.name as "guardianName", 
            u.phone as "guardianContact", 
            u.email, 
            'active' as "status",
            TO_CHAR(c.created_at, 'YYYY-MM-DD') as "admissionDate",
            ARRAY[]::TEXT as "activities",
            CASE 
              WHEN c.grade IN ('9', '10', '11', '12') THEN 'Rose Hall'
              ELSE NULL
            END as "dormitory",
            CASE 
              WHEN c.grade IN ('9', '10', '11', '12') THEN 'A-' || LPAD((c.id % 100)::text, 3, '0')
              ELSE NULL
            END as "bed"
          FROM children c
          LEFT JOIN parents p ON c.parent_id = p.id
          LEFT JOIN users u ON p.user_id = u.id
          WHERE c.gender = 'female' OR c.gender IS NULL
          ORDER BY c.created_at DESC`
        )

        res.json({
          girls: girlsResult.rows,
          total: girlsResult.rowCount
        })
      } finally {
        if (client) client.release()
      }
    } catch (error) {
      console.error('Failed to fetch girls:', error)
      apiError(res, 500, "Failed to fetch girls data")
    }
  })

  // Get boys data for patron
  router.get("/boys", authRequired, async (req, res) => {
    const userId = req.user.id

    try {
      let client
      try {
        client = await pool.connect()

        // Get all boys from children table (filtering by gender)
        const boysResult = await client.query(
          `SELECT 
            c.id, 
            c.name, 
            'BS' || LPAD(c.id::text, 6, '0') as "studentId", 
            CASE 
              WHEN c.grade IN ('9', '10', '11', '12') THEN 'internal'
              ELSE 'external'
            END as "type",
            c.grade, 
            c.grade as "className",
            COALESCE(EXTRACT(YEAR FROM AGE(CURRENT_DATE, c.created_at)), 16) as "age",
            p.name as "guardianName", 
            u.phone as "guardianContact", 
            u.email, 
            'active' as "status",
            TO_CHAR(c.created_at, 'YYYY-MM-DD') as "admissionDate",
            ARRAY[]::TEXT as "activities",
            CASE 
              WHEN c.grade IN ('9', '10', '11', '12') THEN 'Boys Hall'
              ELSE NULL
            END as "dormitory",
            CASE 
              WHEN c.grade IN ('9', '10', '11', '12') THEN 'B-' || LPAD((c.id % 100)::text, 3, '0')
              ELSE NULL
            END as "bed"
          FROM children c
          LEFT JOIN parents p ON c.parent_id = p.id
          LEFT JOIN users u ON p.user_id = u.id
          WHERE c.gender = 'male' OR c.gender IS NULL
          ORDER BY c.created_at DESC`
        )

        res.json({
          boys: boysResult.rows,
          total: boysResult.rowCount
        })
      } finally {
        if (client) client.release()
      }
    } catch (error) {
      console.error('Failed to fetch boys:', error)
      apiError(res, 500, "Failed to fetch boys data")
    }
  })

  return router
}

module.exports = { createProfileRouter }
