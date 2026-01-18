const jwt = require("jsonwebtoken")

const { apiError } = require("../utils/apiError")

function getBearerToken(req) {
  const header = req.headers.authorization
  if (!header || typeof header !== "string") return null
  const [scheme, token] = header.split(" ")
  if (scheme !== "Bearer" || !token) return null
  return token
}

function authRequired(jwtSecret) {
  return (req, res, next) => {
    const token = getBearerToken(req)
    if (!token) {
      apiError(res, 401, "Missing authentication token")
      return
    }

    try {
      const payload = jwt.verify(token, jwtSecret)
      req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      }
      next()
    } catch (_e) {
      apiError(res, 401, "Invalid or expired token")
    }
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      apiError(res, 403, "Forbidden")
      return
    }
    next()
  }
}

module.exports = { authRequired, requireRole, getBearerToken }
