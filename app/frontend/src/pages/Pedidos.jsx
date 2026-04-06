import { useEffect, useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import { getOrders } from '../api/ordersService';
import '../styles/Pedidos.css';

const tabs = [
  { id: 'pendientes', label: 'Pedidos' },
  { id: 'devoluciones', label: 'Devoluciones' },
  { id: 'reservas', label: 'Reservas' },
];

function StatusBadge({ children }) {
  return <span className="pedidos-badge pedidos-badge-status">{children}</span>;
}

function TableCard({ title, children }) {
  return (
    <div className="pedidos-card">
      <div className="pedidos-card-header">
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function DetailItem({ label, value, wide = false }) {
  return (
    <div className={`pedidos-detail-item ${wide ? 'pedidos-detail-item-wide' : ''}`}>
      <div className="pedidos-detail-label">{label}</div>
      <div className="pedidos-detail-value">{value}</div>
    </div>
  );
}

function isVisibleValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('es-AR');
}

function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('es-AR');
}

function formatBoolean(value) {
  if (value === true) return 'Sí';
  if (value === false) return 'No';
  return '';
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '';
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return value;

  return numberValue.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  });
}

function Pedidos() {
  const [activeTab, setActiveTab] = useState('pendientes');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const loadOrders = async () => {
      if (activeTab !== 'pendientes') return;

      try {
        setLoadingOrders(true);
        setOrdersError('');

        const response = await getOrders({
          page: pagination.page,
          limit: pagination.limit,
        });

        const rawOrders = Array.isArray(response?.data) ? response.data : [];

        const normalizedOrders = rawOrders.map((order, index) => ({
          ...order,
          _rowId:
            order.id ??
            order._id ??
            order.uuid ??
            order.numero_remito ??
            order.numero_factura ??
            `pedido-${pagination.page}-${index}`,
          ejecutivo_cuenta: `${order.ejecutivo_nombre || ''} ${order.ejecutivo_apellido || ''}`.trim(),
        }));

        setOrders(normalizedOrders);

        setPagination((prev) => ({
          ...prev,
          total: response?.meta?.total ?? 0,
          page: response?.meta?.page ?? prev.page,
          limit: response?.meta?.limit ?? prev.limit,
          totalPages: response?.meta?.totalPages ?? 1,
          hasNextPage: response?.meta?.hasNextPage ?? false,
          hasPrevPage: response?.meta?.hasPrevPage ?? false,
        }));
      } catch (error) {
        console.error('Error cargando pedidos:', error);
        setOrdersError('No se pudieron cargar los pedidos.');
        setOrders([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }));
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [activeTab, pagination.page, pagination.limit]);

  const handleVer = (row) => {
    console.log('Ver registro:', row);
  };

  const handleEditar = (row) => {
    console.log('Editar registro:', row);
  };

  const handleEliminar = (row) => {
    console.log('Eliminar registro:', row);
  };

  const handlePrevPage = () => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  };

  const handleNextPage = () => {
    setPagination((prev) => ({
      ...prev,
      page: prev.hasNextPage ? prev.page + 1 : prev.page,
    }));
  };

  const handleLimitChange = (event) => {
    const newLimit = Number(event.target.value) || 10;

    setPagination((prev) => ({
      ...prev,
      page: 1,
      limit: newLimit,
    }));
  };

  const pedidosColumns = useMemo(
    () => [
      {
        key: 'fecha',
        label: 'Fecha',
        render: (value) => formatDate(value),
      },
      {
        key: 'razon_social',
        label: 'Razón social',
      },
      {
        key: 'ejecutivo_cuenta',
        label: 'Ejecutivo de cuenta',
      },
      {
        key: 'plataforma_venta',
        label: 'Plataforma de venta',
      },
      {
        key: 'numero_remito',
        label: 'N° de remito',
      },
      {
        key: 'numero_factura',
        label: 'N° de factura',
      },
      {
        key: 'tipo_envio_retiro',
        label: 'Tipo de envío/retiro',
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => <StatusBadge>{value}</StatusBadge>,
      },
      {
        key: 'acciones',
        label: 'Acciones',
        headerClassName: 'text-center',
        cellClassName: 'text-center',
        stopRowClick: true,
        render: (_, row) => (
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleVer(row)}
            >
              Ver
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleEditar(row)}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleEliminar(row)}
            >
              Eliminar
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const devolucionesColumns = useMemo(
    () => [{ key: 'placeholder', label: 'Sin datos por el momento' }],
    []
  );

  const reservasColumns = useMemo(
    () => [{ key: 'placeholder', label: 'Sin datos por el momento' }],
    []
  );

  const renderPedidoDetails = (row) => (
    <div className="pedidos-detail-grid">
      {isVisibleValue(row.metodo_envio_retiro) && (
        <DetailItem label="Método de envío/retiro" value={row.metodo_envio_retiro} />
      )}

      {isVisibleValue(row.nombre_apellido) && (
        <DetailItem label="Nombre y apellido" value={row.nombre_apellido} />
      )}

      {isVisibleValue(row.destinatario) && (
        <DetailItem label="Destinatario" value={row.destinatario} />
      )}

      {isVisibleValue(row.telefono) && (
        <DetailItem label="Teléfono" value={row.telefono} />
      )}

      {isVisibleValue(row.dni_cuit_encomienda || row.dni_cuit_puerta) && (
        <DetailItem
          label="DNI/CUIT"
          value={row.dni_cuit_encomienda || row.dni_cuit_puerta}
        />
      )}

      {isVisibleValue(row.guia_direccion) && (
        <DetailItem
          label="Guía / Dirección"
          value={row.guia_direccion}
          wide
        />
      )}

      {isVisibleValue(row.transporte) && (
        <DetailItem label="Transporte" value={row.transporte} />
      )}

      {isVisibleValue(formatCurrency(row.valor_declarado)) && (
        <DetailItem
          label="Valor declarado"
          value={formatCurrency(row.valor_declarado)}
        />
      )}

      {isVisibleValue(row.bultos) && (
        <DetailItem label="Bultos" value={row.bultos} />
      )}

      {isVisibleValue(formatBoolean(row.paga_envio)) && (
        <DetailItem label="Paga envío" value={formatBoolean(row.paga_envio)} />
      )}

      {isVisibleValue(row.observaciones_deposito) && (
        <DetailItem
          label="Observaciones depósito"
          value={row.observaciones_deposito}
          wide
        />
      )}

      {isVisibleValue(row.observaciones_transporte) && (
        <DetailItem
          label="Observaciones transporte"
          value={row.observaciones_transporte}
          wide
        />
      )}

      {isVisibleValue(formatDateTime(row.confirmado_at)) && (
        <DetailItem
          label="Confirmado el"
          value={formatDateTime(row.confirmado_at)}
        />
      )}

      {isVisibleValue(formatDateTime(row.preparado_at)) && (
        <DetailItem
          label="Preparado el"
          value={formatDateTime(row.preparado_at)}
        />
      )}

      {isVisibleValue(formatDateTime(row.despachado_at)) && (
        <DetailItem
          label="Despachado el"
          value={formatDateTime(row.despachado_at)}
        />
      )}

      {isVisibleValue(formatDateTime(row.pagado_at)) && (
        <DetailItem
          label="Pagado el"
          value={formatDateTime(row.pagado_at)}
        />
      )}

      {!isVisibleValue(row.metodo_envio_retiro) &&
        !isVisibleValue(row.nombre_apellido) &&
        !isVisibleValue(row.destinatario) &&
        !isVisibleValue(row.telefono) &&
        !isVisibleValue(row.dni_cuit_encomienda || row.dni_cuit_puerta) &&
        !isVisibleValue(row.guia_direccion) &&
        !isVisibleValue(row.transporte) &&
        !isVisibleValue(formatCurrency(row.valor_declarado)) &&
        !isVisibleValue(row.bultos) &&
        !isVisibleValue(formatBoolean(row.paga_envio)) &&
        !isVisibleValue(row.observaciones_deposito) &&
        !isVisibleValue(row.observaciones_transporte) &&
        !isVisibleValue(formatDateTime(row.confirmado_at)) &&
        !isVisibleValue(formatDateTime(row.preparado_at)) &&
        !isVisibleValue(formatDateTime(row.despachado_at)) &&
        !isVisibleValue(formatDateTime(row.pagado_at)) && (
          <DetailItem label="Detalle" value="Sin información adicional" wide />
        )}
    </div>
  );

  const renderEmptySectionDetails = () => (
    <div className="pedidos-detail-grid">
      <DetailItem
        label="Estado"
        value="Todavía no hay registros disponibles en esta sección."
        wide
      />
    </div>
  );

  const currentConfig = useMemo(() => {
    switch (activeTab) {
      case 'devoluciones':
        return {
          title: 'Devoluciones',
          columns: devolucionesColumns,
          rows: [],
          renderExpandedRow: renderEmptySectionDetails,
        };

      case 'reservas':
        return {
          title: 'Reservas',
          columns: reservasColumns,
          rows: [],
          renderExpandedRow: renderEmptySectionDetails,
        };

      case 'pendientes':
      default:
        return {
          title: 'Pedidos',
          columns: pedidosColumns,
          rows: orders,
          renderExpandedRow: renderPedidoDetails,
        };
    }
  }, [activeTab, pedidosColumns, devolucionesColumns, reservasColumns, orders]);

  const tabsWithCounts = useMemo(
    () =>
      tabs.map((tab) => ({
        ...tab,
        count: tab.id === 'pendientes' ? pagination.total : 0,
      })),
    [pagination.total]
  );

  return (
    <div className="pedidos-page">
      <div className="container-fluid px-4">
        <header className="pedidos-header">
          <div>
            <span className="pedidos-kicker">Gestión operativa</span>
            <h1 className="pedidos-title">Pedidos</h1>
            <p className="pedidos-subtitle">
              Visualización centralizada de pedidos obtenidos desde el backend.
            </p>
          </div>
        </header>

        <section className="pedidos-panel">
          <div className="pedidos-tabs">
            {tabsWithCounts.map((tab) => (
              <button
                key={tab.id}
                className={`pedidos-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <span>{tab.label}</span>
                <span className="pedidos-tab-count">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="pedidos-table-wrapper">
            <TableCard title={currentConfig.title}>
              {activeTab === 'pendientes' && (
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 px-3 pt-3">
                  <div className="text-muted small">
                    {pagination.total > 0 ? (
                      <>
                        Mostrando página <strong>{pagination.page}</strong> de{' '}
                        <strong>{pagination.totalPages}</strong> — Total de registros:{' '}
                        <strong>{pagination.total}</strong>
                      </>
                    ) : (
                      'Sin registros'
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <label htmlFor="pedidos-limit" className="small text-muted mb-0">
                      Mostrar
                    </label>
                    <select
                      id="pedidos-limit"
                      className="form-select form-select-sm"
                      style={{ width: '90px' }}
                      value={pagination.limit}
                      onChange={handleLimitChange}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'pendientes' && loadingOrders ? (
                <div className="p-4 text-center">Cargando pedidos...</div>
              ) : activeTab === 'pendientes' && ordersError ? (
                <div className="p-4 text-center text-danger">{ordersError}</div>
              ) : (
                <>
                  <DataTable
                    columns={currentConfig.columns}
                    data={currentConfig.rows}
                    expandable={activeTab === 'pendientes'}
                    renderExpandedRow={currentConfig.renderExpandedRow}
                    getRowId={(row, index) =>
                      row._rowId ??
                      row.id ??
                      row._id ??
                      row.uuid ??
                      row.numero_remito ??
                      row.numero_factura ??
                      `pedido-${index}`
                    }
                  />

                  {activeTab === 'pendientes' && (
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 px-3 py-3 border-top">
                      <div className="small text-muted">
                        Página {pagination.page} de {pagination.totalPages}
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={handlePrevPage}
                          disabled={!pagination.hasPrevPage || loadingOrders}
                        >
                          Anterior
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={handleNextPage}
                          disabled={!pagination.hasNextPage || loadingOrders}
                        >
                          Siguiente
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TableCard>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Pedidos;