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
        grade text,
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
