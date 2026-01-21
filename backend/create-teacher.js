const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  password: 'jules098765',
  host: 'localhost',
  port: 5432,
  database: 'cbgconnect'
});

(async () => {
  try {
    // Create a teacher record for user 3 (secretary)
    const existing = await pool.query('SELECT id FROM teachers WHERE user_id = $1', [3]);
    if (existing.rows.length === 0) {
      await pool.query('INSERT INTO teachers (user_id, subject) VALUES ($1, $2)', [3, 'Mathematics']);
      console.log('Created teacher for user 3');
    } else {
      console.log('Teacher already exists for user 3');
    }
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
