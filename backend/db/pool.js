const { Pool } = require("pg")

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:jules098765@localhost:5432/cbgconnect",
})

module.exports = { pool }
