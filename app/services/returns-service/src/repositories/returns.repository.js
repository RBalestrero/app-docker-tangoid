import pool from '../config/db.js';

const BASE_SELECT = `
  SELECT
    r.id,
    r.uuid,
    r.order_id,
    r.cliente,
    r.numero_operacion,
    r.razon,
    r.remito,
    r.condicion,
    r.vuelva_a_la_venta,
    r.observaciones,
    r.ubicacion,
    r.testeado,
    r.notas_tecnico,
    r.ejecutivo_id,
    r.tecnico_id,
    r.created_at,
    r.updated_at,

    o.numero_factura,
    o.estado AS estado_pedido,

    ue.nombre AS ejecutivo_nombre,
    ue.apellido AS ejecutivo_apellido,
    ue.email AS ejecutivo_email,

    ut.nombre AS tecnico_nombre,
    ut.apellido AS tecnico_apellido,
    ut.email AS tecnico_email
  FROM returns r
  INNER JOIN orders o ON o.id = r.order_id
  INNER JOIN users ue ON ue.id = r.ejecutivo_id
  LEFT JOIN users ut ON ut.id = r.tecnico_id
`;

function buildWhereClause(filters = {}) {
  const conditions = [];
  const values = [];
  let index = 1;

  if (filters.id) {
    conditions.push(`r.id = $${index++}`);
    values.push(filters.id);
  }

  if (filters.uuid) {
    conditions.push(`r.uuid = $${index++}`);
    values.push(filters.uuid);
  }

  if (filters.order_id) {
    conditions.push(`r.order_id = $${index++}`);
    values.push(filters.order_id);
  }

  if (filters.ejecutivo_id) {
    conditions.push(`r.ejecutivo_id = $${index++}`);
    values.push(filters.ejecutivo_id);
  }

  if (filters.tecnico_id) {
    conditions.push(`r.tecnico_id = $${index++}`);
    values.push(filters.tecnico_id);
  }

  if (filters.condicion) {
    conditions.push(`r.condicion = $${index++}`);
    values.push(filters.condicion);
  }

  if (filters.ubicacion) {
    conditions.push(`r.ubicacion = $${index++}`);
    values.push(filters.ubicacion);
  }

  if (typeof filters.testeado === 'boolean') {
    conditions.push(`r.testeado = $${index++}`);
    values.push(filters.testeado);
  }

  if (typeof filters.vuelva_a_la_venta === 'boolean') {
    conditions.push(`r.vuelva_a_la_venta = $${index++}`);
    values.push(filters.vuelva_a_la_venta);
  }

  if (filters.remito) {
    conditions.push(`r.remito ILIKE $${index++}`);
    values.push(`%${filters.remito}%`);
  }

  if (filters.cliente) {
    conditions.push(`r.cliente ILIKE $${index++}`);
    values.push(`%${filters.cliente}%`);
  }

  if (filters.numero_operacion) {
    conditions.push(`r.numero_operacion ILIKE $${index++}`);
    values.push(`%${filters.numero_operacion}%`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  return { whereClause, values, nextIndex: index };
}

function buildUpdateQuery(id, data) {
  const allowedFields = [
    'order_id',
    'cliente',
    'numero_operacion',
    'razon',
    'remito',
    'condicion',
    'vuelva_a_la_venta',
    'observaciones',
    'ubicacion',
    'testeado',
    'notas_tecnico',
    'ejecutivo_id',
    'tecnico_id'
  ];

  const setClauses = [];
  const values = [];
  let index = 1;

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      setClauses.push(`${field} = $${index++}`);
      values.push(data[field]);
    }
  }

  if (setClauses.length === 0) {
    return null;
  }

  values.push(id);

  return {
    query: `
      UPDATE returns
      SET ${setClauses.join(', ')}
      WHERE id = $${index}
      RETURNING *
    `,
    values
  };
}

const returnsRepository = {
  async create(data) {
    const query = `
      INSERT INTO returns (
        order_id,
        cliente,
        numero_operacion,
        razon,
        remito,
        condicion,
        vuelva_a_la_venta,
        observaciones,
        ubicacion,
        testeado,
        notas_tecnico,
        ejecutivo_id,
        tecnico_id
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
      RETURNING *
    `;

    const values = [
      data.order_id,
      data.cliente,
      data.numero_operacion ?? null,
      data.razon ?? null,
      data.remito ?? null,
      data.condicion,
      data.vuelva_a_la_venta ?? false,
      data.observaciones ?? null,
      data.ubicacion ?? 'deposito',
      data.testeado ?? false,
      data.notas_tecnico ?? null,
      data.ejecutivo_id,
      data.tecnico_id ?? null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findAll(filters = {}, options = {}) {
    const { whereClause, values, nextIndex } = buildWhereClause(filters);

    const limit = Number.isInteger(options.limit) ? options.limit : 50;
    const offset = Number.isInteger(options.offset) ? options.offset : 0;
    const orderBy = options.orderBy ?? 'r.created_at';
    const orderDir = options.orderDir === 'ASC' ? 'ASC' : 'DESC';

    const allowedOrderFields = new Set([
      'r.id',
      'r.created_at',
      'r.updated_at',
      'r.cliente',
      'r.remito',
      'r.condicion',
      'r.ubicacion',
      'r.testeado'
    ]);

    const safeOrderBy = allowedOrderFields.has(orderBy) ? orderBy : 'r.created_at';

    const query = `
      ${BASE_SELECT}
      ${whereClause}
      ORDER BY ${safeOrderBy} ${orderDir}
      LIMIT $${nextIndex} OFFSET $${nextIndex + 1}
    `;

    const result = await pool.query(query, [...values, limit, offset]);
    return result.rows;
  },

  async count(filters = {}) {
    const { whereClause, values } = buildWhereClause(filters);

    const query = `
      SELECT COUNT(*)::INT AS total
      FROM returns r
      ${whereClause}
    `;

    const result = await pool.query(query, values);
    return result.rows[0].total;
  },

  async findById(id) {
    const query = `
      ${BASE_SELECT}
      WHERE r.id = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  async findByUuid(uuid) {
    const query = `
      ${BASE_SELECT}
      WHERE r.uuid = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [uuid]);
    return result.rows[0] || null;
  },

  async update(id, data) {
    const built = buildUpdateQuery(id, data);

    if (!built) {
      throw new Error('No hay campos válidos para actualizar');
    }

    const result = await pool.query(built.query, built.values);
    return result.rows[0] || null;
  },

  async assignTechnician(id, tecnico_id) {
    const query = `
      UPDATE returns
      SET tecnico_id = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [tecnico_id, id]);
    return result.rows[0] || null;
  },

  async saveTechnicalReview(id, { testeado, notas_tecnico, condicion, vuelva_a_la_venta, ubicacion }) {
    const fields = [];
    const values = [];
    let index = 1;

    if (typeof testeado === 'boolean') {
      fields.push(`testeado = $${index++}`);
      values.push(testeado);
    }

    if (Object.prototype.hasOwnProperty.call(arguments[1], 'notas_tecnico')) {
      fields.push(`notas_tecnico = $${index++}`);
      values.push(notas_tecnico ?? null);
    }

    if (condicion) {
      fields.push(`condicion = $${index++}`);
      values.push(condicion);
    }

    if (typeof vuelva_a_la_venta === 'boolean') {
      fields.push(`vuelva_a_la_venta = $${index++}`);
      values.push(vuelva_a_la_venta);
    }

    if (ubicacion) {
      fields.push(`ubicacion = $${index++}`);
      values.push(ubicacion);
    }

    if (fields.length === 0) {
      throw new Error('No hay datos para guardar en la revisión técnica');
    }

    values.push(id);

    const query = `
      UPDATE returns
      SET ${fields.join(', ')}
      WHERE id = $${index}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  async remove(id) {
    const query = `
      DELETE FROM returns
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
};

export default returnsRepository;