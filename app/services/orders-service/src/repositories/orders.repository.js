import pool from '../config/db.js';

const baseSelect = `
  SELECT
    o.id,
    o.uuid,
    o.fecha,
    o.razon_social,
    o.ejecutivo_cuenta_id,
    u.nombre AS ejecutivo_nombre,
    u.apellido AS ejecutivo_apellido,
    u.email AS ejecutivo_email,
    o.plataforma_venta,
    o.numero_remito,
    o.numero_factura,
    o.tipo_envio_retiro,
    o.estado,
    o.metodo_envio_retiro,
    o.nombre_apellido,
    o.dni_cuit_puerta,
    o.observaciones_deposito,
    o.transporte,
    o.destinatario,
    o.dni_cuit_encomienda,
    o.guia_direccion,
    o.valor_declarado,
    o.telefono,
    o.paga_envio,
    o.observaciones_transporte,
    o.bultos,
    o.correo_depo_enviado,
    o.confirmado_por_id,
    o.confirmado_at,
    o.preparado_por_id,
    o.preparado_at,
    o.despachado_por_id,
    o.despachado_at,
    o.pagado_por_id,
    o.pagado_at,
    o.external_id,
    o.created_at,
    o.updated_at
  FROM orders o
  JOIN users u ON u.id = o.ejecutivo_cuenta_id
`;

async function getAll() {
  const query = `
    ${baseSelect}
    ORDER BY o.id DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function getById(id) {
  const query = `
    ${baseSelect}
    WHERE o.id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function create(data) {
  const query = `
    INSERT INTO orders (
      fecha,
      razon_social,
      ejecutivo_cuenta_id,
      plataforma_venta,
      numero_remito,
      numero_factura,
      tipo_envio_retiro,
      estado,
      metodo_envio_retiro,
      nombre_apellido,
      dni_cuit_puerta,
      observaciones_deposito,
      transporte,
      destinatario,
      dni_cuit_encomienda,
      guia_direccion,
      valor_declarado,
      telefono,
      paga_envio,
      observaciones_transporte,
      bultos,
      correo_depo_enviado,
      confirmado_por_id,
      confirmado_at,
      preparado_por_id,
      preparado_at,
      despachado_por_id,
      despachado_at,
      pagado_por_id,
      pagado_at,
      external_id
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9, $10, $11, $12, $13, $14, $15, $16,
      $17, $18, $19, $20, $21, $22, $23, $24,
      $25, $26, $27, $28, $29, $30, $31
    )
    RETURNING id
  `;

  const values = [
    data.fecha,
    data.razon_social,
    data.ejecutivo_cuenta_id,
    data.plataforma_venta,
    data.numero_remito,
    data.numero_factura,
    data.tipo_envio_retiro,
    data.estado ?? 'Precarga',
    data.metodo_envio_retiro ?? null,
    data.nombre_apellido ?? null,
    data.dni_cuit_puerta ?? null,
    data.observaciones_deposito ?? null,
    data.transporte ?? null,
    data.destinatario ?? null,
    data.dni_cuit_encomienda ?? null,
    data.guia_direccion ?? null,
    data.valor_declarado ?? null,
    data.telefono ?? null,
    data.paga_envio ?? false,
    data.observaciones_transporte ?? null,
    data.bultos ?? null,
    data.correo_depo_enviado ?? false,
    data.confirmado_por_id ?? null,
    data.confirmado_at ?? null,
    data.preparado_por_id ?? null,
    data.preparado_at ?? null,
    data.despachado_por_id ?? null,
    data.despachado_at ?? null,
    data.pagado_por_id ?? null,
    data.pagado_at ?? null,
    data.external_id ?? null,
  ];

  const { rows } = await pool.query(query, values);
  return getById(rows[0].id);
}

async function update(id, data) {
  const query = `
    UPDATE orders
    SET
      fecha = $1,
      razon_social = $2,
      ejecutivo_cuenta_id = $3,
      plataforma_venta = $4,
      numero_remito = $5,
      numero_factura = $6,
      tipo_envio_retiro = $7,
      estado = $8,
      metodo_envio_retiro = $9,
      nombre_apellido = $10,
      dni_cuit_puerta = $11,
      observaciones_deposito = $12,
      transporte = $13,
      destinatario = $14,
      dni_cuit_encomienda = $15,
      guia_direccion = $16,
      valor_declarado = $17,
      telefono = $18,
      paga_envio = $19,
      observaciones_transporte = $20,
      bultos = $21,
      correo_depo_enviado = $22,
      confirmado_por_id = $23,
      confirmado_at = $24,
      preparado_por_id = $25,
      preparado_at = $26,
      despachado_por_id = $27,
      despachado_at = $28,
      pagado_por_id = $29,
      pagado_at = $30,
      external_id = $31
    WHERE id = $32
    RETURNING id
  `;

  const values = [
    data.fecha,
    data.razon_social,
    data.ejecutivo_cuenta_id,
    data.plataforma_venta,
    data.numero_remito,
    data.numero_factura,
    data.tipo_envio_retiro,
    data.estado ?? 'Precarga',
    data.metodo_envio_retiro ?? null,
    data.nombre_apellido ?? null,
    data.dni_cuit_puerta ?? null,
    data.observaciones_deposito ?? null,
    data.transporte ?? null,
    data.destinatario ?? null,
    data.dni_cuit_encomienda ?? null,
    data.guia_direccion ?? null,
    data.valor_declarado ?? null,
    data.telefono ?? null,
    data.paga_envio ?? false,
    data.observaciones_transporte ?? null,
    data.bultos ?? null,
    data.correo_depo_enviado ?? false,
    data.confirmado_por_id ?? null,
    data.confirmado_at ?? null,
    data.preparado_por_id ?? null,
    data.preparado_at ?? null,
    data.despachado_por_id ?? null,
    data.despachado_at ?? null,
    data.pagado_por_id ?? null,
    data.pagado_at ?? null,
    data.external_id ?? null,
    id,
  ];

  const { rowCount } = await pool.query(query, values);
  if (!rowCount) return null;

  return getById(id);
}

async function remove(id) {
  const query = `DELETE FROM orders WHERE id = $1 RETURNING id`;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};