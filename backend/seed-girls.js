const { pool } = require('./db/pool');

const seedGirls = async () => {
  const client = await pool.connect();
  
  try {
    const girlsData = [
      {
        name: 'Sarah Johnson',
        student_id: 'GS2023001',
        gender: 'female',
        is_resident: true,
        grade: '12',
        class_name: 'Science A',
        date_of_birth: '2006-09-15',
        guardian_name: 'John Johnson',
        guardian_contact: '+1234567890',
        email: 'sarah.j@school.edu',
        status: 'active',
        admission_date: '2023-09-01',
        activities: ['Volleyball', 'Music Club', 'Debate'],
        dormitory: 'Rose Hall',
        bed: 'B-204-A'
      },
      {
        name: 'Emma Wilson',
        student_id: 'GS2023002',
        gender: 'female',
        is_resident: true,
        grade: '11',
        class_name: 'Arts B',
        date_of_birth: '2007-03-22',
        guardian_name: 'Mary Wilson',
        guardian_contact: '+1234567891',
        email: 'emma.w@school.edu',
        status: 'active',
        admission_date: '2023-09-01',
        activities: ['Art Club', 'Drama'],
        dormitory: 'Rose Hall',
        bed: 'B-205-A'
      },
      {
        name: 'Olivia Brown',
        student_id: 'GS2023003',
        gender: 'female',
        is_resident: true,
        grade: '10',
        class_name: 'Mathematics A',
        date_of_birth: '2008-01-10',
        guardian_name: 'Robert Brown',
        guardian_contact: '+1234567892',
        email: 'olivia.b@school.edu',
        status: 'active',
        admission_date: '2023-09-01',
        activities: ['Basketball', 'Science Club'],
        dormitory: 'Lily Wing',
        bed: 'A-101-B'
      },
      {
        name: 'Sophia Davis',
        student_id: 'GS2023004',
        gender: 'female',
        is_resident: false,
        grade: '12',
        class_name: 'Literature A',
        date_of_birth: '2006-11-28',
        guardian_name: 'Jennifer Davis',
        guardian_contact: '+1234567893',
        email: 'sophia.d@school.edu',
        status: 'active',
        admission_date: '2023-09-01',
        activities: ['Music', 'Dance'],
        dormitory: null,
        bed: null
      },
      {
        name: 'Isabella Martinez',
        student_id: 'GS2023005',
        gender: 'female',
        is_resident: false,
        grade: '11',
        class_name: 'History B',
        date_of_birth: '2007-05-18',
        guardian_name: 'Carlos Martinez',
        guardian_contact: '+1234567894',
        email: 'isabella.m@school.edu',
        status: 'active',
        admission_date: '2023-09-01',
        activities: ['Art', 'Photography'],
        dormitory: null,
        bed: null
      },
      {
        name: 'Mia Garcia',
        student_id: 'GS2023006',
        gender: 'female',
        is_resident: false,
        grade: '10',
        class_name: 'Geography A',
        date_of_birth: '2008-07-25',
        guardian_name: 'David Garcia',
        guardian_contact: '+1234567895',
        email: 'mia.g@school.edu',
        status: 'active',
        admission_date: '2023-09-01',
        activities: ['Swimming', 'Tennis'],
        dormitory: null,
        bed: null
      }
    ];

    for (const girl of girlsData) {
      await client.query(`
        INSERT INTO students (
          name, student_id, gender, is_resident, grade, class_name, 
          date_of_birth, guardian_name, guardian_contact, email, status, 
          admission_date, activities, dormitory, bed
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        girl.name,
        girl.student_id,
        girl.gender,
        girl.is_resident,
        girl.grade,
        girl.class_name,
        girl.date_of_birth,
        girl.guardian_name,
        girl.guardian_contact,
        girl.email,
        girl.status,
        girl.admission_date,
        girl.activities,
        girl.dormitory,
        girl.bed
      ]);
    }

    console.log('Sample girls data seeded successfully');
  } catch (error) {
    console.error('Error seeding girls data:', error);
  } finally {
    client.release();
  }
};

seedGirls().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
