import {
  formatBoolean,
  formatCurrency,
  formatDateTime,
} from '../utils/pedidos.formatters.jsx';

export const PEDIDO_DETAIL_FIELDS = [
  {
    key: 'metodo_envio_retiro',
    label: 'Método de envío/retiro',
  },
  {
    key: 'nombre_apellido',
    label: 'Nombre y apellido',
  },
  {
    key: 'destinatario',
    label: 'Destinatario',
  },
  {
    key: 'telefono',
    label: 'Teléfono',
  },
  {
    key: 'dni_cuit',
    label: 'DNI/CUIT',
    getValue: (row) => row.dni_cuit_encomienda || row.dni_cuit_puerta,
  },
  {
    key: 'guia_direccion',
    label: 'Guía / Dirección',
    wide: true,
  },
  {
    key: 'transporte',
    label: 'Transporte',
  },
  {
    key: 'valor_declarado',
    label: 'Valor declarado',
    format: formatCurrency,
  },
  {
    key: 'bultos',
    label: 'Bultos',
  },
  {
    key: 'paga_envio',
    label: 'Paga envío',
    format: formatBoolean,
  },
  {
    key: 'observaciones_deposito',
    label: 'Observaciones depósito',
    wide: true,
  },
  {
    key: 'observaciones_transporte',
    label: 'Observaciones transporte',
    wide: true,
  },
  {
    key: 'confirmado_at',
    label: 'Confirmado el',
    format: formatDateTime,
  },
  {
    key: 'preparado_at',
    label: 'Preparado el',
    format: formatDateTime,
  },
  {
    key: 'despachado_at',
    label: 'Despachado el',
    format: formatDateTime,
  },
  {
    key: 'pagado_at',
    label: 'Pagado el',
    format: formatDateTime,
  },
];