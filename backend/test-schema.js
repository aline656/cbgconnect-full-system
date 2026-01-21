const { pool } = require('./db/pool');
(async () => {
  try {
    const result = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'academic_years' ORDER BY ordinal_position`
    );
    console.log('academic_years table columns:');
    result.rows.forEach(r => console.log('  ' + r.column_name + ': ' + r.data_type));
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
