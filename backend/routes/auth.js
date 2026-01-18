const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

function validateRegisterBody(body) {
  const errors = []

  if (!body || typeof body !== "object") {
    errors.push({ path: "body", message: "Invalid payload" })
    return { ok: false, errors }
  }

  const { name, email, password, role } = body

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push({ path: "name", message: "Name must be at least 2 characters" })
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    errors.push({ path: "email", message: "Enter a valid email" })
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    errors.push({
      path: "password",
      message: "Password must be at least 8 characters",
    })
  }

  if (role !== undefined) {
    const allowed = ["parent", "teacher", "secretary", "metron", "patron", "admin"]
    if (typeof role !== "string" || !allowed.includes(role)) {
      errors.push({ path: "role", message: "Invalid role" })
    }
  }

  return { ok: errors.length === 0, errors }
}

function validateLoginBody(body) {
  const errors = []

  if (!body || typeof body !== "object") {
    errors.push({ path: "body", message: "Invalid payload" })
    return { ok: false, errors }
  }

  const { email, password } = body

  if (!email || typeof email !== "string" || !email.includes("@")) {
    errors.push({ path: "email", message: "Enter a valid email" })
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    errors.push({
      path: "password",
      message: "Password must be at least 8 characters",
    })
  }

  return { ok: errors.length === 0, errors }
}

function createAuthRouter({
  pool,
  authRequired,
  apiError,
  JWT_SECRET,
  ensureParentSeedData,
  ensureSecretarySeedData,
}) {
  const router = express.Router()

  router.get("/me", authRequired, async (req, res) => {
    let client
    try {
      client = await pool.connect()
      const r = await client.query(
        "select id, name, email, role, created_at from users where id = $1 limit 1",
        [req.user.id],
      )
      if (!r.rowCount) {
        apiError(res, 404, "User not found")
        return
      }
      const user = r.rows[0]
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
        },
      })
    } catch (_e) {
      apiError(res, 500, "Failed to load user")
    } finally {
      if (client) client.release()
    }
  })

  router.post("/register", async (req, res) => {
    const { ok, errors } = validateRegisterBody(req.body)

    if (!ok) {
      res.status(400).json({ message: "Invalid data", errors })
      return
    }

    const { name, email, password } = req.body
    const role = typeof req.body?.role === "string" ? req.body.role : "parent"

    let client

    try {
      client = await pool.connect()

      await client.query("begin")

      const existing = await client.query(
        "select id from users where email = $1 limit 1",
        [email.toLowerCase()],
      )

      if (existing.rowCount && existing.rowCount > 0) {
        await client.query("rollback")
        res.status(409).json({ message: "Email already registered" })
        return
      }

      const passwordHash = await bcrypt.hash(password, 12)

      const inserted = await client.query(
        `insert into users (name, email, password_hash, role)
         values ($1, $2, $3, $4)
         returning id, name, email, role, created_at`,
        [name.trim(), email.toLowerCase(), passwordHash, role],
      )

      const user = inserted.rows[0]

      if (user.role === "parent") {
        const parentRow = await client.query(
          `insert into parents (user_id)
           values ($1)
           on conflict (user_id) do update set user_id = excluded.user_id
           returning id`,
          [user.id],
        )

        await ensureParentSeedData(client, parentRow.rows[0].id, user.name)
      }

      if (user.role === "secretary") {
        const secretaryRow = await client.query(
          `insert into secretaries (user_id, department)
           values ($1, $2)
           on conflict (user_id) do update set department = excluded.department
           returning id`,
          [user.id, "Administration"],
        )

        await ensureSecretarySeedData(client, secretaryRow.rows[0].id)
      }

      await client.query("commit")

      res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
        },
      })
    } catch (_error) {
      if (client) {
        try {
          await client.query("rollback")
        } catch (_e) {}
      }
      res.status(500).json({ message: "Failed to create account" })
    } finally {
      if (client) {
        client.release()
      }
    }
  })

  router.post("/login", async (req, res) => {
    const { ok, errors } = validateLoginBody(req.body)

    if (!ok) {
      res.status(400).json({ message: "Invalid credentials", errors })
      return
    }

    const { email, password } = req.body

    let client

    try {
      client = await pool.connect()

      const result = await client.query(
        "select id, name, email, role, password_hash from users where email = $1 limit 1",
        [email.toLowerCase()],
      )

      if (!result.rowCount || result.rows.length === 0) {
        res.status(401).json({ message: "Invalid email or password" })
        return
      }

      const user = result.rows[0]

      const passwordMatches = await bcrypt.compare(password, user.password_hash)

      if (!passwordMatches) {
        res.status(401).json({ message: "Invalid email or password" })
        return
      }

      const token = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        {
          expiresIn: "12h",
        },
      )

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (_error) {
      res.status(500).json({ message: "Failed to sign in" })
    } finally {
      if (client) {
        client.release()
      }
    }
  })

  return router
}

module.exports = { createAuthRouter }
