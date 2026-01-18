const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://cbgconnect_user:y5UKUAz9gnSC3KR2rYMjrS7PyLzly070@dpg-d5malq3e5dus73ec515g-a.virginia-postgres.render.com/cbgconnect",
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = { pool };
