export const PEDIDO_PIPELINE_SECTIONS = [
  {
    id: 'comercial',
    title: 'Comercial',
    states: ['Precarga', 'Confirmado'],
  },
  {
    id: 'facturacion',
    title: 'Facturación',
    states: ['Facturar', 'Facturado', 'Pagado'],
  },
  {
    id: 'logistica',
    title: 'Depósito y Logística',
    states: ['Preparado', 'Despachado'],
  },
];

export function groupOrdersByPipeline(orders = []) {
  return PEDIDO_PIPELINE_SECTIONS.map((section) => ({
    ...section,
    rows: orders.filter((order) => section.states.includes(order.estado)),
  }));
}