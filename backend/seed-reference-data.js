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
    // Seed subjects
    const subjects = [
      'Mathematics', 'English', 'Science', 'History', 'Geography', 'French'
    ];
    for (const name of subjects) {
      const code = name.substring(0, 3).toUpperCase();
      const existing = await pool.query('SELECT id FROM subjects WHERE name = $1', [name]);
      if (existing.rows.length === 0) {
        await pool.query('INSERT INTO subjects (name, code) VALUES ($1, $2)', [name, code]);
        console.log('Created subject:', name);
      }
    }
    
    // Skip teachers seeding - requires valid user IDs
    // For now, classes will have teacher_id = NULL
    
    // Seed classes
    const classes = [
      { name: 'Class A', grade: '1' },
      { name: 'Class B', grade: '2' },
      { name: 'Class C', grade: '3' }
    ];
    for (const c of classes) {
      const existing = await pool.query('SELECT id FROM classes WHERE name = $1', [c.name]);
      if (existing.rows.length === 0) {
        await pool.query('INSERT INTO classes (name, grade, teacher_id) VALUES ($1, $2, NULL)', [c.name, c.grade]);
        console.log('Created class:', c.name);
      }
    }
    
    console.log('Seeding complete!');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
