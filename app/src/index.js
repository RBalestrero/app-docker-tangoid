const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS fecha');
    res.json({
      mensaje: 'App funcionando en Docker',
      servidor: 'Express',
      base_de_datos: 'PostgreSQL',
      hora_db: result.rows[0].fecha
    });
  } catch (error) {
    res.status(500).json({
      error: 'No se pudo conectar a la base de datos',
      detalle: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});