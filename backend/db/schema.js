const { pool } = require("./pool")

async function ensureSchema() {
  const client = await pool.connect()
  try {
    await client.query("begin")

    await client.query(`
      create table if not exists users (
        id bigserial primary key,
        name text not null,
        email text not null unique,
        password_hash text not null,
        role text not null default 'parent',
        created_at timestamptz not null default now()
      )
    `)

    await client.query(
      `alter table users drop constraint if exists users_role_check`,
    )
    await client.query(
      `alter table users add constraint users_role_check check (role in ('parent','teacher','secretary','metron','patron','admin'))`,
    )

    await client.query(`
      create table if not exists parents (
        id bigserial primary key,
        user_id bigint not null unique references users(id) on delete cascade,
        phone text,
        address text,
        birthday text,
        occupation text,
        bio text,
        created_at timestamptz not null default now()
      )
    `)

    await client.query(`
      create table if not exists secretaries (
        id bigserial primary key,
        user_id bigint not null unique references users(id) on delete cascade,
        department text,
        phone text,
        bio text,
        national_id text,
        created_at timestamptz not null default now()
      )
    `)

    await client.query(`
      create table if not exists metrons (
        id bigserial primary key,
        user_id bigint not null unique references users(id) on delete cascade,
        department text,
        phone text,
        bio text,
        national_id text,
        created_at timestamptz not null default now()
      )
    `)

    await client.query(`
      create table if not exists patrons (
        id bigserial primary key,
        user_id bigint not null unique references users(id) on delete cascade,
        department text,
        phone text,
        bio text,
        national_id text,
        created_at timestamptz not null default now()
      )
    `)

    await client.query(`
      create table if not exists secretary_tasks (
        id bigserial primary key,
        secretary_id bigint not null references secretaries(id) on delete cascade,
        title text not null,
        priority text not null default 'medium',
        due text,
        category text,
        status text not null default 'pending',
        created_at timestamptz not null default now()
      )
    `)

    await client.query(`
      create table if not exists secretary_activities (
        id bigserial primary key,
        secretary_id bigint not null references secretaries(id) on delete cascade,
        action text not null,
        meta jsonb not null default '{}'::jsonb,
        status text not null default 'completed',
        created_at timestamptz not null default now()
      )
    `)

    await client.query(`
      create table if not exists secretary_events (
        id bigserial primary key,
        secretary_id bigint not null references secretaries(id) on delete cascade,
        title text not null,
        event_date date,
        event_time text,
        location text,
        type text,
        created_at timestamptz not null default now()
      )
    `)

    await client.query(`
      create table if not exists parent_settings (
        parent_id bigint primary key references parents(id) on delete cascade,
        settings jsonb not null default '{}'::jsonb,
        updated_at timestamptz not null default now()
      )
    `)

    await client.query(`
      create table if not exists children (
        id bigserial primary key,
        parent_id bigint not null references parents(id) on delete cascade,
        name text not null,
        gender text check (gender in ('male', 'female')),
        grade text,
        class_name text,
        teacher_name text,
        attendance_rate numeric,
        overall_grade text,
        created_at timestamptz not null default now()
      )
    `)

    await client.query(`
      create table if not exists grades (
        id bigserial primary key,
        child_id bigint not null references children(id) on delete cascade,
        subject text not null,
        grade text not null,
        teacher text,
        graded_at timestamptz not null default now()
      )
    `)

    await client.query(`
      create table if not exists notifications (
        id bigserial primary key,
        parent_id bigint not null references parents(id) on delete cascade,
        type text not null,
        title text not null,
        content text not null,
        read boolean not null default false,
        created_at timestamptz not null default now()
      )
    `)

    await client.query(`
      create table if not exists events (
        id bigserial primary key,
        parent_id bigint not null references parents(id) on delete cascade,
        title text not null,
        event_date date,
        event_time text,
        location text,
        created_at timestamptz not null default now()
      )
    `)

    // Students table
    await client.query(`
      create table if not exists students (
        id bigserial primary key,
        student_id text not null unique,
        name text not null,
        gender text not null check (gender in ('male', 'female')),
        date_of_birth date,
        grade text,
        class_name text,
        status text not null default 'active' check (status in ('active', 'inactive', 'graduated', 'transferred')),
        admission_date date,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `)

    // Teachers table
    await client.query(`
      create table if not exists teachers (
        id bigserial primary key,
        user_id bigint not null unique references users(id) on delete cascade,
        subject text,
        class_name text,
        phone text,
        bio text,
        national_id text,
        created_at timestamptz not null default now()
      )
    `)

    // Classes table
    await client.query(`
      create table if not exists classes (
        id bigserial primary key,
        name text not null unique,
        grade text not null,
        teacher_id bigint references teachers(id) on delete set null,
        class_size int,
        created_at timestamptz not null default now()
      )
    `)

    // Subjects table
    await client.query(`
      create table if not exists subjects (
        id bigserial primary key,
        name text not null unique,
        code text not null unique,
        description text,
        created_at timestamptz not null default now()
      )
    `)

    // Attendance table
    await client.query(`
      create table if not exists attendance (
        id bigserial primary key,
        student_id bigint not null references students(id) on delete cascade,
        class_id bigint references classes(id) on delete set null,
        attendance_date date not null,
        status text not null check (status in ('present', 'absent', 'late', 'excused')),
        check_in_time time,
        notes text,
        created_at timestamptz not null default now()
      )
    `)

    // Grades table - for student grades on assignments/exams
    await client.query(`
      create table if not exists student_grades (
        id bigserial primary key,
        student_id bigint not null references students(id) on delete cascade,
        subject_id bigint not null references subjects(id) on delete cascade,
        assignment_name text,
        marks_obtained numeric(10, 2),
        total_marks numeric(10, 2),
        percentage numeric(5, 2),
        grade text,
        graded_by bigint references teachers(id) on delete set null,
        graded_date date,
        created_at timestamptz not null default now()
      )
    `)

    // Assignments table
    await client.query(`
      create table if not exists assignments (
        id bigserial primary key,
        class_id bigint not null references classes(id) on delete cascade,
        subject_id bigint not null references subjects(id) on delete cascade,
        teacher_id bigint not null references teachers(id) on delete cascade,
        title text not null,
        description text,
        due_date date,
        due_time time,
        file_path text,
        total_marks numeric(10, 2) default 100,
        created_at timestamptz not null default now()
      )
    `)

    // Finance/Fees table
    await client.query(`
      create table if not exists fees (
        id bigserial primary key,
        student_id bigint not null references students(id) on delete cascade,
        fee_type text not null,
        amount numeric(10, 2) not null,
        due_date date,
        paid_date date,
        status text not null default 'pending' check (status in ('pending', 'paid', 'overdue', 'partial')),
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `)

    // Transactions table
    await client.query(`
      create table if not exists transactions (
        id bigserial primary key,
        student_id bigint not null references students(id) on delete cascade,
        amount numeric(10, 2) not null,
        transaction_type text not null,
        description text,
        recorded_by bigint references users(id) on delete set null,
        created_at timestamptz not null default now()
      )
    `)

    // Documents table
    await client.query(`
      create table if not exists documents (
        id bigserial primary key,
        student_id bigint not null references students(id) on delete cascade,
        document_type text not null,
        file_path text not null,
        status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `)

    // Student-Parent relationship
    await client.query(`
      create table if not exists student_parents (
        student_id bigint not null references students(id) on delete cascade,
        parent_id bigint not null references parents(id) on delete cascade,
        relationship text,
        primary key (student_id, parent_id)
      )
    `)

    // Student contact info
    await client.query(`
      create table if not exists student_contact (
        student_id bigint primary key references students(id) on delete cascade,
        parent_name text,
        parent_phone text,
        parent_email text,
        emergency_contact text,
        emergency_phone text,
        address text,
        created_at timestamptz not null default now()
      )
    `)

    // Dormitory table (for patron/metron)
    await client.query(`
      create table if not exists dormitories (
        id bigserial primary key,
        name text not null unique,
        capacity int,
        gender text check (gender in ('male', 'female')),
        warden_id bigint references users(id) on delete set null,
        created_at timestamptz not null default now()
      )
    `)

    // Room assignments
    await client.query(`
      create table if not exists room_assignments (
        id bigserial primary key,
        student_id bigint not null references students(id) on delete cascade,
        dormitory_id bigint not null references dormitories(id) on delete cascade,
        room_number text,
        bed_number int,
        check_in_date date,
        check_out_date date,
        status text not null default 'active' check (status in ('active', 'inactive')),
        created_at timestamptz not null default now()
      )
    `)

    // Activities table (for patron/metron activities)
    await client.query(`
      create table if not exists activities (
        id bigserial primary key,
        title text not null,
        description text,
        activity_date date,
        activity_time time,
        location text,
        organized_by bigint references users(id) on delete set null,
        created_at timestamptz not null default now()
      )
    `)

    // Activity attendance
    await client.query(`
      create table if not exists activity_attendance (
        id bigserial primary key,
        activity_id bigint not null references activities(id) on delete cascade,
        student_id bigint not null references students(id) on delete cascade,
        attended boolean default false,
        created_at timestamptz not null default now()
      )
    `)

    // Academic years and archived students
    await client.query(`
      create table if not exists academic_years (
        id bigserial primary key,
        year text not null unique,
        start_date date,
        end_date date,
        archived boolean not null default false,
        archived_at timestamptz,
        total_students int default 0,
        average_gpa numeric(5,2) default 0,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `)

    await client.query(`
      create table if not exists archived_students (
        id bigserial primary key,
        academic_year_id bigint not null references academic_years(id) on delete cascade,
        student_id bigint references students(id) on delete set null,
        name text not null,
        email text,
        phone text,
        class_name text,
        final_gpa numeric(4,2),
        status text not null default 'promoted' check (status in ('promoted','repeat','transferred')),
        snapshot jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now()
      )
    `)

    // Terms table
    await client.query(`
      create table if not exists terms (
        id bigserial primary key,
        name text not null,
        start_date date,
        end_date date,
        status text not null default 'inactive' check (status in ('active','inactive','completed')),
        academic_year_id bigint,
        created_at timestamptz not null default now()
      )
    `)

    await client.query("commit")
  } catch (e) {
    try {
      await client.query("rollback")
    } catch (_e) {}
    throw e
  } finally {
    client.release()
  }
}

module.exports = { ensureSchema }
