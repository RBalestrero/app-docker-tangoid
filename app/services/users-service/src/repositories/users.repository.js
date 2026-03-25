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

export default {
  getAll,
  getById,
};