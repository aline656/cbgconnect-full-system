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
