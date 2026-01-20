const express = require("express")
const cors = require("cors")
const { pool } = require("./db/pool")
const { ensureSchema } = require("./db/schema")
const { apiError } = require("./utils/apiError")
const { authRequired: makeAuthRequired, requireRole } = require("./middleware/auth")
const { loadParentContext, loadSecretaryContext } = require("./services/context")
const { ensureParentSeedData, ensureSecretarySeedData } = require("./services/seed")
const { initials, mapLetterGradeToProgress } = require("./utils/format")
const { createAuthRouter } = require("./routes/auth")
const { createHealthRouter } = require("./routes/health")
const { createSecretaryRouter } = require("./routes/secretary")
const { createParentsMeRouter } = require("./routes/parentsMe")
const { createParentsPublicRouter } = require("./routes/parentsPublic")
const { createDashboardRouter } = require("./routes/dashboard")
const { createProfileRouter } = require("./routes/profile")
const { createStudentsRouter } = require("./routes/students")
const { createAttendanceRouter } = require("./routes/attendance")
const { createGradesRouter } = require("./routes/grades")
const { createFinanceRouter } = require("./routes/finance")
const { createAcademicYearsRouter } = require("./routes/academicYears")
const { createTermsRouter } = require("./routes/terms")
const { createLessonsRouter } = require("./routes/lessons")
const { createGradesManagementRouter } = require("./routes/gradesManagement")

const app = express()

const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret"

const authRequired = makeAuthRequired(JWT_SECRET)

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
)

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use(
  "/api/auth",
  createAuthRouter({
    pool,
    authRequired,
    apiError,
    JWT_SECRET,
    ensureParentSeedData,
    ensureSecretarySeedData,
  }),
)

app.use("/api", createHealthRouter())

app.use(
  "/api",
  createSecretaryRouter({
    pool,
    authRequired,
    requireRole,
    apiError,
    loadSecretaryContext,
    ensureSecretarySeedData,
    initials,
  }),
)

app.use(
  "/api",
  createParentsMeRouter({
    pool,
    authRequired,
    requireRole,
    apiError,
    loadParentContext,
    ensureParentSeedData,
    initials,
    mapLetterGradeToProgress,
  }),
)

app.use(
  "/api",
  createParentsPublicRouter({
    pool,
  }),
)

app.use(
  "/api",
  createDashboardRouter({
    pool,
    authRequired,
    requireRole,
    apiError,
  }),
)

app.use(
  "/api",
  createProfileRouter({
    pool,
    authRequired,
    apiError,
  }),
)

app.use(
  "/api",
  createStudentsRouter({
    pool,
    authRequired,
    requireRole,
    apiError,
  }),
)

app.use(
  "/api",
  createAttendanceRouter({
    pool,
    authRequired,
    requireRole,
    apiError,
  }),
)

app.use(
  "/api",
  createGradesRouter({
    pool,
    authRequired,
    requireRole,
    apiError,
  }),
)

app.use(
  "/api",
  createFinanceRouter({
    pool,
    authRequired,
    requireRole,
    apiError,
  }),
)

app.use(
  "/api",
  createAcademicYearsRouter({
    pool,
    authRequired,
    requireRole,
    apiError,
  }),
)

app.use(
  "/api",
  createTermsRouter({
    pool,
    authRequired,
    requireRole,
    apiError,
  }),
)

app.use(
  "/api",
  createLessonsRouter({
    pool,
    authRequired,
    requireRole,
    apiError,
  }),
)

app.use(
  "/api",
  createGradesManagementRouter({
    pool,
    authRequired,
    requireRole,
    apiError,
  }),
)


;(async () => {
  try {
    await ensureSchema()
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`)
    })
  } catch (e) {
    console.error("Failed to start backend", e)
    process.exit(1)
  }
})()
