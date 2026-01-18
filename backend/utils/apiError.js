function apiError(res, status, message, extra) {
  res.status(status).json({ message, ...(extra ? extra : {}) })
}

module.exports = { apiError }
