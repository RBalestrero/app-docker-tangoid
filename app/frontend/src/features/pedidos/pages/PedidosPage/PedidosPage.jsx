import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../../components/DataTable/DataTable.jsx';
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from '../../api/orders.service.js';
import CreateOrderModal from '../../components/CreateOrderModal/CreateOrderModal.jsx';
import DetailItem from '../../components/DetailItem/DetailItem.jsx';
import PedidoActionsMenu from '../../components/PedidoActionsMenu/PedidoActionsMenu.jsx';
import PedidosFilters from '../../components/PedidosFilters/PedidosFilters.jsx';
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx';
import TableCard from '../../components/TableCard/TableCard.jsx';
import {
  DEFAULT_PAGINATION,
  INITIAL_DRAFT_FILTERS,
  INITIAL_FILTERS,
  INITIAL_ORDER_FORM,
  TABS,
} from '../../constants/Pedidos.constants.jsx';
import { PEDIDO_DETAIL_FIELDS } from '../../constants/pedidos.details.config.js';
import {
  buildCreateOrderPayload,
  formatDate,
  isVisibleValue,
  normalizeOrders,
  validateCreateOrderForm,
} from '../../utils/pedidos.formatters.jsx';
import { groupOrdersByPipeline } from '../../utils/pedidos.pipeline.js';
import styles from './PedidosPage.module.css';

function PedidosPage() {
  const [activeTab, setActiveTab] = useState('pendientes');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [draftFilters, setDraftFilters] = useState(INITIAL_DRAFT_FILTERS);
  const [reloadKey, setReloadKey] = useState(0);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [expandedRowId, setExpandedRowId] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [orderForm, setOrderForm] = useState(INITIAL_ORDER_FORM);

  useEffect(() => {
    const loadOrders = async () => {
      if (activeTab !== 'pendientes') return;

      try {
        setLoadingOrders(true);
        setOrdersError('');

        const response = await getOrders(filters);
        const rawOrders = Array.isArray(response?.data) ? response.data : [];
        const normalizedOrders = normalizeOrders(rawOrders, filters.page);

        setOrders(normalizedOrders);
        setExpandedRowId(null);

        setPagination({
          total: response?.meta?.total ?? 0,
          page: response?.meta?.page ?? filters.page,
          limit: response?.meta?.limit ?? filters.limit,
          totalPages: response?.meta?.totalPages ?? 1,
          hasNextPage: response?.meta?.hasNextPage ?? false,
          hasPrevPage: response?.meta?.hasPrevPage ?? false,
        });
      } catch (error) {
        console.error('Error cargando pedidos:', error);
        setOrdersError('No se pudieron cargar los pedidos.');
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [activeTab, filters, reloadKey]);

  const handleDraftChange = (key, value) => {
    setDraftFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    setExpandedRowId(null);
    setFilters((prev) => ({
      ...prev,
      page: 1,
      quick_search: draftFilters.quick_search,
      estado: draftFilters.estado,
      tipo_envio_retiro: draftFilters.tipo_envio_retiro,
      ejecutivo: draftFilters.ejecutivo,
    }));
  };

  const clearFilters = () => {
    setExpandedRowId(null);
    setDraftFilters(INITIAL_DRAFT_FILTERS);
    setFilters((prev) => ({
      ...prev,
      ...INITIAL_FILTERS,
      limit: prev.limit,
    }));
  };

  const handleFilterKeyDown = (event) => {
    if (event.key === 'Enter') {
      applyFilters();
    }
  };

  const handlePrevPage = () => {
    if (!pagination.hasPrevPage) return;
    setExpandedRowId(null);
    setFilters((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }));
  };

  const handleNextPage = () => {
    if (!pagination.hasNextPage) return;
    setExpandedRowId(null);
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const handleLimitChange = (event) => {
    const newLimit = Number(event.target.value) || 10;
    setExpandedRowId(null);
    setFilters((prev) => ({ ...prev, page: 1, limit: newLimit }));
  };

  const openCreateModal = () => {
    setCreateError('');
    setOrderForm(INITIAL_ORDER_FORM);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    if (createLoading) return;
    setShowCreateModal(false);
    setCreateError('');
  };

  const handleFormChange = (key, value) => {
    setOrderForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreateOrder = async (event) => {
    event.preventDefault();

    const validationError = validateCreateOrderForm(orderForm);
    if (validationError) {
      setCreateError(validationError);
      return;
    }

    try {
      setCreateLoading(true);
      setCreateError('');

      const payload = buildCreateOrderPayload(orderForm);

      await createOrder(payload);

      setShowCreateModal(false);
      setOrderForm(INITIAL_ORDER_FORM);
      setExpandedRowId(null);
      setFilters((prev) => ({ ...prev, page: 1 }));
      setReloadKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error creando pedido:', error);
      setCreateError(error?.message || 'No se pudo crear el pedido.');
    } finally {
      setCreateLoading(false);
    }
  };

  const getResolvedRowId = (row) =>
    row._rowId ??
    row.id ??
    row._id ??
    row.uuid ??
    row.numero_remito ??
    row.numero_factura;

  const handleVer = (row) => {
    const rowId = getResolvedRowId(row);
    setExpandedRowId((prev) => (prev === rowId ? null : rowId));
  };

  const handleEditar = (row) => {
    console.log('Editar registro:', row);
  };

  const handleEliminar = (row) => {
    console.log('Eliminar registro:', row);
  };

  const handleChangeOrderStatus = async (row, newStatus) => {
    try {
      const orderId = row.id || row._id;
      if (!orderId) {
        console.error('No se encontró el ID del pedido para actualizar estado.');
        return;
      }

      await updateOrderStatus(orderId, newStatus);
      setExpandedRowId(null);
      setReloadKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  const pedidosColumns = useMemo(
    () => [
      {
        key: 'fecha',
        label: 'Fecha',
        sortable: true,
        sortType: 'date',
        render: (value) => formatDate(value),
      },
      {
        key: 'razon_social',
        label: 'Razón social',
        sortable: true,
        sortType: 'string',
      },
      {
        key: 'ejecutivo_cuenta',
        label: 'Ejecutivo de cuenta',
        sortable: true,
        sortType: 'string',
      },
      {
        key: 'plataforma_venta',
        label: 'Plataforma de venta',
        sortable: true,
        sortType: 'string',
      },
      {
        key: 'numero_remito',
        label: 'N° de remito',
        sortable: true,
        sortType: 'string',
      },
      {
        key: 'numero_factura',
        label: 'N° de factura',
        sortable: true,
        sortType: 'string',
      },
      {
        key: 'tipo_envio_retiro',
        label: 'Tipo de envío/retiro',
        sortable: true,
        sortType: 'string',
      },
      {
        key: 'estado',
        label: 'Estado',
        sortable: true,
        sortType: 'string',
        render: (value) => <StatusBadge>{value}</StatusBadge>,
      },
      {
        key: 'acciones',
        label: 'Acciones',
        headerClassName: 'text-center',
        cellClassName: 'text-center',
        stopRowClick: true,
        render: (_, row) => {
          const rowId = getResolvedRowId(row);
          const isOpen = expandedRowId === rowId;

          return (
            <div className="d-flex gap-2 justify-content-center align-items-center flex-wrap">
              <button
                type="button"
                className={`btn btn-sm ${
                  isOpen ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => handleVer(row)}
              >
                {isOpen ? 'Ocultar' : 'Ver'}
              </button>

              <PedidoActionsMenu
                actions={[
                  { label: 'Editar', onClick: () => handleEditar(row) },
                  {
                    label: 'Pasar a Comercial',
                    onClick: () => handleChangeOrderStatus(row, 'Confirmado'),
                  },
                  {
                    label: 'Pasar a Facturación',
                    onClick: () => handleChangeOrderStatus(row, 'Facturar'),
                  },
                  {
                    label: 'Pasar a Logística',
                    onClick: () => handleChangeOrderStatus(row, 'Preparado'),
                  },
                  {
                    label: 'Marcar despachado',
                    onClick: () => handleChangeOrderStatus(row, 'Despachado'),
                  },
                  {
                    label: 'Marcar pagado',
                    onClick: () => handleChangeOrderStatus(row, 'Pagado'),
                  },
                  { label: 'Eliminar', onClick: () => handleEliminar(row) },
                ]}
              />
            </div>
          );
        },
      },
    ],
    [expandedRowId]
  );

  const devolucionesColumns = useMemo(
    () => [
      { key: 'fecha', label: 'Fecha', sortable: true, sortType: 'date' },
      { key: 'razon_social', label: 'Razón social', sortable: true, sortType: 'string' },
      { key: 'ejecutivo_cuenta', label: 'Ejecutivo de cuenta', sortable: true, sortType: 'string' },
      { key: 'tecnico', label: 'Técnico asignado', sortable: true, sortType: 'string' },
      { key: 'motivo', label: 'Motivo', sortable: true, sortType: 'string' },
      { key: 'venta', label: 'Apto para venta', sortable: true, sortType: 'string' },
    ],
    []
  );

  const reservasColumns = useMemo(
    () => [{ key: 'placeholder', label: 'Sin datos por el momento' }],
    []
  );

  const renderPedidoDetails = (row) => (
    <div className={styles.detailGrid}>
      {PEDIDO_DETAIL_FIELDS.map((field) => {
        const rawValue = field.getValue ? field.getValue(row) : row[field.key];
        const finalValue = field.format ? field.format(rawValue) : rawValue;

        if (!isVisibleValue(finalValue)) return null;

        return (
          <DetailItem
            key={field.key}
            label={field.label}
            value={finalValue}
            wide={field.wide}
          />
        );
      })}
    </div>
  );

  const renderEmptySectionDetails = () => (
    <div className={styles.detailGrid}>
      <DetailItem
        label="Estado"
        value="Todavía no hay registros disponibles en esta sección."
        wide
      />
    </div>
  );

  const tabsWithCounts = useMemo(
    () =>
      TABS.map((tab) => ({
        ...tab,
        count: tab.id === 'pendientes' ? pagination.total : 0,
      })),
    [pagination.total]
  );

  const pipelineSections = useMemo(() => {
    if (activeTab !== 'pendientes') return [];
    return groupOrdersByPipeline(orders);
  }, [activeTab, orders]);

  return (
    <div className={styles.page}>
      <div className="container-fluid px-4">
        <header className={`${styles.header} ${styles.headerCompact}`}>
          <div className={styles.headerMain}>
            <div>
              <span className={styles.kicker}>Gestión operativa</span>
              <h1 className={styles.title}>Pedidos</h1>
              <p className={styles.subtitle}>
                Visualización centralizada de pedidos obtenidos desde el backend.
              </p>
            </div>

            {activeTab === 'pendientes' && (
              <div className={styles.headerActions}>
                <button
                  type="button"
                  className={`btn btn-light fw-semibold ${styles.buttonCompact}`}
                  onClick={openCreateModal}
                >
                  Nuevo pedido
                </button>
              </div>
            )}
          </div>
        </header>

        <section className={styles.panel}>
          <div className={styles.tabs}>
            {tabsWithCounts.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => {
                  setExpandedRowId(null);
                  setActiveTab(tab.id);
                }}
                type="button"
              >
                <span>{tab.label}</span>
                <span className={styles.tabCount}>{tab.count}</span>
              </button>
            ))}
          </div>

          {activeTab === 'pendientes' && (
            <PedidosFilters
              draftFilters={draftFilters}
              onDraftChange={handleDraftChange}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              onKeyDown={handleFilterKeyDown}
            />
          )}

          <div className={styles.tableWrapper}>
            {activeTab === 'pendientes' ? (
              <>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 px-1 pb-3">
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
                      className={`form-select form-select-sm ${styles.limitSelect}`}
                      style={{ width: '90px' }}
                      value={filters.limit}
                      onChange={handleLimitChange}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                {loadingOrders ? (
                  <div className="p-4 text-center">Cargando pedidos...</div>
                ) : ordersError ? (
                  <div className="p-4 text-center text-danger">{ordersError}</div>
                ) : (
                  <>
                    <div className={styles.pipelineSections}>
                      {pipelineSections.map((section) => (
                        <div key={section.id} className={styles.pipelineBlock}>
                          <TableCard title={`${section.title} (${section.rows.length})`}>
                            <DataTable
                              columns={pedidosColumns}
                              data={section.rows}
                              expandable
                              expandedRowId={expandedRowId}
                              onToggleExpand={(rowId) =>
                                setExpandedRowId((prev) => (prev === rowId ? null : rowId))
                              }
                              renderExpandedRow={renderPedidoDetails}
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
                          </TableCard>
                        </div>
                      ))}
                    </div>

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 px-1 pt-3">
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
                  </>
                )}
              </>
            ) : (
              <TableCard
                title={activeTab === 'devoluciones' ? 'Devoluciones' : 'Reservas'}
              >
                <DataTable
                  columns={activeTab === 'devoluciones' ? devolucionesColumns : reservasColumns}
                  data={[]}
                  expandable={false}
                  renderExpandedRow={renderEmptySectionDetails}
                />
              </TableCard>
            )}
          </div>
        </section>
      </div>

      <CreateOrderModal
        show={showCreateModal}
        orderForm={orderForm}
        createError={createError}
        createLoading={createLoading}
        onClose={closeCreateModal}
        onSubmit={handleCreateOrder}
        onFormChange={handleFormChange}
      />
    </div>
  );
}

export default PedidosPage;