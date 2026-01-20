const { pool } = require('./db/pool');

const checkTable = async () => {
  const client = await pool.connect();
  
  try {
    // Check if students table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'students'
    `);
    
    console.log('Students table exists:', tableCheck.rowCount > 0);
    
    if (tableCheck.rowCount > 0) {
      // Get table structure
      const structure = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'students' 
        ORDER BY ordinal_position
      `);
      
      console.log('Table structure:');
      structure.rows.forEach(row => {
        console.log(`  ${row.column_name}: ${row.data_type} (${row.is_nullable})`);
      });
      
      // Get current data
      const data = await client.query('SELECT COUNT(*) as count FROM students WHERE gender = \'female\'');
      console.log('Female students count:', data.rows[0].count);
    }
  } catch (error) {
    console.error('Error checking table:', error);
  } finally {
    client.release();
  }
};

checkTable().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Check failed:', error);
  process.exit(1);
});
