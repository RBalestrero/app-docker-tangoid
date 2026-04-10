export const TABS = [
  { id: 'pendientes', label: 'Pedidos' },
  { id: 'devoluciones', label: 'Devoluciones' },
  { id: 'reservas', label: 'Reservas' },
];

export const INITIAL_FILTERS = {
  page: 1,
  limit: 10,
  quick_search: '',
  estado: '',
  tipo_envio_retiro: '',
  ejecutivo: '',
};

export const INITIAL_DRAFT_FILTERS = {
  quick_search: '',
  estado: '',
  tipo_envio_retiro: '',
  ejecutivo: '',
};

export const INITIAL_ORDER_FORM = {
  fecha: '',
  razon_social: '',
  ejecutivo_cuenta_id: '',
  plataforma_venta: '',
  numero_remito: '',
  numero_factura: '',
  tipo_envio_retiro: '',
  estado: 'Precarga',
  metodo_envio_retiro: '',
  nombre_apellido: '',
  dni_cuit_puerta: '',
  observaciones_deposito: '',
  transporte: '',
  destinatario: '',
  dni_cuit_encomienda: '',
  guia_direccion: '',
  valor_declarado: '',
  telefono: '',
  paga_envio: false,
  observaciones_transporte: '',
  bultos: '',
  external_id: '',
};

export const DEFAULT_PAGINATION = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export const PEDIDO_ESTADOS = [
  'Precarga',
  'Confirmado',
  'Facturar',
  'Facturado',
  'Pagado',
  'Preparado',
  'Despachado',
];

export const PEDIDO_TIPOS_ENVIO = ['PUERTA', 'ENCOMIENDA', 'RETIRO'];