import pool from "../config/db.js";

async function getAll() {
  const query = `
    SELECT
      id,
      uuid,
      nombre,
      apellido,
      email,
      rol,
      activo,
      password,
      salt,
      created_at,
      updated_at
    FROM users
    WHERE activo = true
    ORDER BY nombre, apellido
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function getById(id) {
  const query = `
    SELECT
      id,
      uuid,
      nombre,
      apellido,
      email,
      rol,
      activo,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function create(user) {
  const query = `
    INSERT INTO users (nombre, apellido, email, rol, password, salt)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, uuid, nombre, apellido, email, rol, created_at, updated_at
  `;
  const values = [
    user.nombre,
    user.apellido,
    user.email,
    user.rol,
    user.password,
    user.salt,
    // user.activo, // No se inserta el campo activo, se asume true por defecto
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function update(id, user) {
  const query = `
    UPDATE users
    SET nombre = $1, apellido = $2, email = $3, rol = $4, activo = $5
    WHERE id = $6
    RETURNING id, uuid, nombre, apellido, email, rol, activo, created_at, updated_at
  `;
  const values = [
    user.nombre,
    user.apellido,
    user.email,
    user.rol,
    user.activo,
    id,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function remove(id) {
  const query = `
    UPDATE users
    SET activo = false
    WHERE id = $1
  `;
  const { rowCount } = await pool.query(query, [id]);
  return rowCount > 0;
}

async function findByEmail(email) {
  const query = `
    SELECT
      id,
      uuid,
      nombre,
      apellido,
      email,
      rol,
      activo,
      created_at,
      updated_at
    FROM users
    WHERE email = $1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  findByEmail,
};