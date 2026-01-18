async function loadParentContext(client, userId) {
  const p = await client.query(
    `select p.id as parent_id, u.id as user_id, u.name, u.email, u.role,
            p.phone, p.address, p.birthday, p.occupation, p.bio
     from parents p
     join users u on u.id = p.user_id
     where p.user_id = $1
     limit 1`,
    [userId],
  )
  if (!p.rowCount) return null
  return p.rows[0]
}

async function loadSecretaryContext(client, userId) {
  const s = await client.query(
    `select s.id as secretary_id, u.id as user_id, u.name, u.email, u.role, s.department
     from secretaries s
     join users u on u.id = s.user_id
     where s.user_id = $1
     limit 1`,
    [userId],
  )
  if (!s.rowCount) return null
  return s.rows[0]
}

module.exports = { loadParentContext, loadSecretaryContext }
