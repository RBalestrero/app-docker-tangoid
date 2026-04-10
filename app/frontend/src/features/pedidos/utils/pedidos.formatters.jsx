export function isVisibleValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
}

export function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('es-AR');
}

export function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('es-AR');
}

export function formatBoolean(value) {
  if (value === true) return 'Sí';
  if (value === false) return 'No';
  return '';
}

export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '';
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return value;

  return numberValue.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  });
}

export function normalizeOrders(rawOrders = [], page = 1) {
  return rawOrders.map((order, index) => ({
    ...order,
    _rowId:
      order.id ??
      order._id ??
      order.uuid ??
      order.numero_remito ??
      order.numero_factura ??
      `pedido-${page}-${index}`,
    ejecutivo_cuenta:
      `${order.ejecutivo_nombre || ''} ${order.ejecutivo_apellido || ''}`.trim(),
  }));
}

export function buildCreateOrderPayload(orderForm) {
  return {
    ...orderForm,
    ejecutivo_cuenta_id: Number(orderForm.ejecutivo_cuenta_id),
    valor_declarado:
      orderForm.valor_declarado === '' ? null : Number(orderForm.valor_declarado),
    bultos: orderForm.bultos === '' ? null : Number(orderForm.bultos),
  };
}

export function validateCreateOrderForm(orderForm) {
  if (!orderForm.fecha) return 'La fecha es obligatoria.';
  if (!orderForm.razon_social.trim()) return 'La razón social es obligatoria.';
  if (!orderForm.ejecutivo_cuenta_id) {
    return 'El ejecutivo de cuenta es obligatorio.';
  }
  if (!orderForm.plataforma_venta.trim()) {
    return 'La plataforma de venta es obligatoria.';
  }
  if (!orderForm.tipo_envio_retiro) {
    return 'El tipo de envío/retiro es obligatorio.';
  }

  return '';
}