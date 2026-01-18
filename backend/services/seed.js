async function ensureParentSeedData(client, parentId, parentName) {
  const existingChildren = await client.query(
    "select id from children where parent_id = $1 limit 1",
    [parentId],
  )
  if (existingChildren.rowCount && existingChildren.rowCount > 0) return

  const child1 = await client.query(
    `insert into children (parent_id, name, grade, teacher_name, attendance_rate, overall_grade)
     values ($1, $2, $3, $4, $5, $6)
     returning id`,
    [parentId, `${parentName.split(" ")[0] || "Student"} A`, "Grade 5", "Mr. Wilson", 95, "A-"],
  )
  const child2 = await client.query(
    `insert into children (parent_id, name, grade, teacher_name, attendance_rate, overall_grade)
     values ($1, $2, $3, $4, $5, $6)
     returning id`,
    [parentId, `${parentName.split(" ")[0] || "Student"} B`, "Grade 7", "Ms. Rodriguez", 98, "B+"],
  )

  const child1Id = child1.rows[0].id
  const child2Id = child2.rows[0].id

  await client.query(
    `insert into grades (child_id, subject, grade, teacher)
     values
       ($1, 'Mathematics', 'A', 'Mr. Wilson'),
       ($1, 'Science', 'B+', 'Ms. Chen'),
       ($1, 'English', 'A-', 'Mr. Davis'),
       ($2, 'Mathematics', 'B+', 'Ms. Rodriguez'),
       ($2, 'Science', 'A-', 'Dr. Miller'),
       ($2, 'English', 'B', 'Mrs. Anderson')`,
    [child1Id, child2Id],
  )

  await client.query(
    `insert into notifications (parent_id, type, title, content, read)
     values
       ($1, 'grade', 'New Grade Posted', 'A new grade has been posted in Mathematics', false),
       ($1, 'attendance', 'Attendance Update', 'Attendance record updated for this week', false),
       ($1, 'message', 'Teacher Message', 'A teacher sent you a new message', true)`,
    [parentId],
  )

  await client.query(
    `insert into events (parent_id, title, event_date, event_time, location)
     values
       ($1, 'Science Fair', current_date + interval '20 days', '10:00 AM', 'School Hall'),
       ($1, 'Parent-Teacher Meeting', current_date + interval '25 days', '2:00 PM', 'Room 204')`,
    [parentId],
  )

  await client.query(
    `insert into parent_settings (parent_id, settings)
     values ($1, $2)
     on conflict (parent_id) do nothing`,
    [
      parentId,
      {
        notifications: {
          email: true,
          sms: true,
          push: false,
          grades: true,
          attendance: true,
          events: true,
          announcements: true,
          messages: true,
        },
        privacy: {
          profileVisibility: "teachers-only",
          dataSharing: false,
          activityStatus: true,
          contactVisibility: false,
        },
        account: {
          language: "english",
          timezone: "America/Los_Angeles",
          dateFormat: "MM/DD/YYYY",
          theme: "light",
        },
        billing: {
          plan: "premium",
          status: "active",
          nextBilling: "2024-11-15",
          autoRenew: true,
        },
      },
    ],
  )
}

async function ensureSecretarySeedData(client, secretaryId) {
  const existingTasks = await client.query(
    "select id from secretary_tasks where secretary_id = $1 limit 1",
    [secretaryId],
  )
  if (existingTasks.rowCount && existingTasks.rowCount > 0) return

  await client.query(
    `insert into secretary_tasks (secretary_id, title, priority, due, category, status)
     values
       ($1, 'Process Enrollment Forms', 'high', 'Today', 'Admissions', 'pending'),
       ($1, 'Verify Fee Payments', 'medium', 'Today', 'Finance', 'pending'),
       ($1, 'Update Student Records', 'medium', 'Tomorrow', 'Records', 'pending'),
       ($1, 'Schedule Parent Meetings', 'low', 'This Week', 'Scheduling', 'pending'),
       ($1, 'Prepare Monthly Report', 'high', 'Friday', 'Reporting', 'pending')`,
    [secretaryId],
  )

  await client.query(
    `insert into secretary_activities (secretary_id, action, meta, status)
     values
       ($1, 'Processed enrollment form', '{"student":"Alex Chen"}', 'completed'),
       ($1, 'Updated attendance', '{"count":"15 students"}', 'completed'),
       ($1, 'Received fee payment', '{"amount":"$1,250"}', 'completed'),
       ($1, 'Sent reminder emails', '{"count":"45 parents"}', 'in-progress'),
       ($1, 'Approved leave request', '{"teacher":"Mr. Wilson"}', 'completed')`,
    [secretaryId],
  )

  await client.query(
    `insert into secretary_events (secretary_id, title, event_date, event_time, location, type)
     values
       ($1, 'Staff Meeting', current_date + interval '1 day', '10:00 AM', 'Conference Room', 'meeting'),
       ($1, 'Fee Due Date', current_date + interval '5 days', 'All day', '-', 'deadline'),
       ($1, 'Parent-Teacher Conferences', current_date + interval '8 days', '9:00 AM - 4:00 PM', 'School Hall', 'event'),
       ($1, 'Report Card Distribution', current_date + interval '16 days', 'All day', 'Online', 'deadline')`,
    [secretaryId],
  )
}

module.exports = { ensureParentSeedData, ensureSecretarySeedData }
