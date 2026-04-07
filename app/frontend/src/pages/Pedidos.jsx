import { useEffect, useMemo, useState } from "react";
import DataTable from "../components/DataTable";
import { getOrders, createOrder } from "../api/ordersService";
import "../styles/Pedidos.css";
import "../styles/newOrderModal.css";

const tabs = [
  { id: "pendientes", label: "Pedidos" },
  { id: "devoluciones", label: "Devoluciones" },
  { id: "reservas", label: "Reservas" },
];

const initialFilters = {
  page: 1,
  limit: 10,
  search: "",
  estado: "",
  tipo_envio_retiro: "",
  ejecutivo: "",
};

const initialDraftFilters = {
  search: "",
  estado: "",
  tipo_envio_retiro: "",
  ejecutivo: "",
};

const initialOrderForm = {
  fecha: "",
  razon_social: "",
  ejecutivo_cuenta_id: "",
  plataforma_venta: "",
  numero_remito: "",
  numero_factura: "",
  tipo_envio_retiro: "",
  estado: "Precarga",
  metodo_envio_retiro: "",
  nombre_apellido: "",
  dni_cuit_puerta: "",
  observaciones_deposito: "",
  transporte: "",
  destinatario: "",
  dni_cuit_encomienda: "",
  guia_direccion: "",
  valor_declarado: "",
  telefono: "",
  paga_envio: false,
  observaciones_transporte: "",
  bultos: "",
  external_id: "",
};

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
    <div
      className={`pedidos-detail-item ${wide ? "pedidos-detail-item-wide" : ""}`}
    >
      <div className="pedidos-detail-label">{label}</div>
      <div className="pedidos-detail-value">{value}</div>
    </div>
  );
}

function isVisibleValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return true;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-AR");
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-AR");
}

function formatBoolean(value) {
  if (value === true) return "Sí";
  if (value === false) return "No";
  return "";
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") return "";
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return value;

  return numberValue.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
}

function Pedidos() {
  const [activeTab, setActiveTab] = useState("pendientes");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialDraftFilters);
  const [reloadKey, setReloadKey] = useState(0);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [orderForm, setOrderForm] = useState(initialOrderForm);

  useEffect(() => {
    const loadOrders = async () => {
      if (activeTab !== "pendientes") return;

      try {
        setLoadingOrders(true);
        setOrdersError("");

        const response = await getOrders(filters);
        const rawOrders = Array.isArray(response?.data) ? response.data : [];

        const normalizedOrders = rawOrders.map((order, index) => ({
          ...order,
          _rowId:
            order.id ??
            order._id ??
            order.uuid ??
            order.numero_remito ??
            order.numero_factura ??
            `pedido-${filters.page}-${index}`,
          ejecutivo_cuenta:
            `${order.ejecutivo_nombre || ""} ${order.ejecutivo_apellido || ""}`.trim(),
        }));

        setOrders(normalizedOrders);

        setPagination({
          total: response?.meta?.total ?? 0,
          page: response?.meta?.page ?? filters.page,
          limit: response?.meta?.limit ?? filters.limit,
          totalPages: response?.meta?.totalPages ?? 1,
          hasNextPage: response?.meta?.hasNextPage ?? false,
          hasPrevPage: response?.meta?.hasPrevPage ?? false,
        });
      } catch (error) {
        console.error("Error cargando pedidos:", error);
        setOrdersError("No se pudieron cargar los pedidos.");
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
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: draftFilters.search,
      estado: draftFilters.estado,
      tipo_envio_retiro: draftFilters.tipo_envio_retiro,
      ejecutivo: draftFilters.ejecutivo,
    }));
  };

  const clearFilters = () => {
    setDraftFilters(initialDraftFilters);
    setFilters((prev) => ({
      ...prev,
      ...initialFilters,
      limit: prev.limit,
    }));
  };

  const handleFilterKeyDown = (event) => {
    if (event.key === "Enter") {
      applyFilters();
    }
  };

  const handlePrevPage = () => {
    if (!pagination.hasPrevPage) return;
    setFilters((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }));
  };

  const handleNextPage = () => {
    if (!pagination.hasNextPage) return;
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const handleLimitChange = (event) => {
    const newLimit = Number(event.target.value) || 10;
    setFilters((prev) => ({ ...prev, page: 1, limit: newLimit }));
  };

  const openCreateModal = () => {
    setCreateError("");
    setOrderForm(initialOrderForm);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    if (createLoading) return;
    setShowCreateModal(false);
    setCreateError("");
  };

  const handleFormChange = (key, value) => {
    setOrderForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateCreateForm = () => {
    if (!orderForm.fecha) return "La fecha es obligatoria.";
    if (!orderForm.razon_social.trim())
      return "La razón social es obligatoria.";
    if (!orderForm.ejecutivo_cuenta_id)
      return "El ejecutivo de cuenta es obligatorio.";
    if (!orderForm.plataforma_venta.trim())
      return "La plataforma de venta es obligatoria.";
    if (!orderForm.tipo_envio_retiro)
      return "El tipo de envío/retiro es obligatorio.";
    return "";
  };

  const handleCreateOrder = async (event) => {
    event.preventDefault();

    const validationError = validateCreateForm();
    if (validationError) {
      setCreateError(validationError);
      return;
    }

    try {
      setCreateLoading(true);
      setCreateError("");

      const payload = {
        ...orderForm,
        ejecutivo_cuenta_id: Number(orderForm.ejecutivo_cuenta_id),
        valor_declarado:
          orderForm.valor_declarado === ""
            ? null
            : Number(orderForm.valor_declarado),
        bultos: orderForm.bultos === "" ? null : Number(orderForm.bultos),
      };

      await createOrder(payload);

      setShowCreateModal(false);
      setOrderForm(initialOrderForm);
      setFilters((prev) => ({ ...prev, page: 1 }));
      setReloadKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error creando pedido:", error);
      setCreateError(error?.message || "No se pudo crear el pedido.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleVer = (row) => {
    console.log("Ver registro:", row);
  };

  const handleEditar = (row) => {
    console.log("Editar registro:", row);
  };

  const handleEliminar = (row) => {
    console.log("Eliminar registro:", row);
  };

  const pedidosColumns = useMemo(
    () => [
      { key: "fecha", label: "Fecha", render: (value) => formatDate(value) },
      { key: "razon_social", label: "Razón social" },
      { key: "ejecutivo_cuenta", label: "Ejecutivo de cuenta" },
      { key: "plataforma_venta", label: "Plataforma de venta" },
      { key: "numero_remito", label: "N° de remito" },
      { key: "numero_factura", label: "N° de factura" },
      { key: "tipo_envio_retiro", label: "Tipo de envío/retiro" },
      {
        key: "estado",
        label: "Estado",
        render: (value) => <StatusBadge>{value}</StatusBadge>,
      },
      {
        key: "acciones",
        label: "Acciones",
        headerClassName: "text-center",
        cellClassName: "text-center",
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
    [],
  );

  const devolucionesColumns = useMemo(
    () => [{ key: "placeholder", label: "Sin datos por el momento" }],
    [],
  );

  const reservasColumns = useMemo(
    () => [{ key: "placeholder", label: "Sin datos por el momento" }],
    [],
  );

  const renderPedidoDetails = (row) => (
    <div className="pedidos-detail-grid">
      {isVisibleValue(row.metodo_envio_retiro) && (
        <DetailItem
          label="Método de envío/retiro"
          value={row.metodo_envio_retiro}
        />
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
        <DetailItem label="Guía / Dirección" value={row.guia_direccion} wide />
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
        <DetailItem label="Pagado el" value={formatDateTime(row.pagado_at)} />
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
      case "devoluciones":
        return {
          title: "Devoluciones",
          columns: devolucionesColumns,
          rows: [],
          renderExpandedRow: renderEmptySectionDetails,
        };
      case "reservas":
        return {
          title: "Reservas",
          columns: reservasColumns,
          rows: [],
          renderExpandedRow: renderEmptySectionDetails,
        };
      case "pendientes":
      default:
        return {
          title: "Pedidos",
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
        count: tab.id === "pendientes" ? pagination.total : 0,
      })),
    [pagination.total],
  );

  return (
    <div className="pedidos-page">
      <div className="container-fluid px-4">
        <header className="pedidos-header pedidos-header-compact">
          <div className="pedidos-header-main">
            <div>
              <span className="pedidos-kicker">Gestión operativa</span>
              <h1 className="pedidos-title">Pedidos</h1>
              <p className="pedidos-subtitle">
                Visualización centralizada de pedidos obtenidos desde el
                backend.
              </p>
            </div>

            {activeTab === "pendientes" && (
              <div className="pedidos-header-actions">
                <button
                  type="button"
                  className="btn btn-light fw-semibold pedidos-btn-compact"
                  onClick={openCreateModal}
                >
                  Nuevo pedido
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="pedidos-panel">
          <div className="pedidos-tabs">
            {tabsWithCounts.map((tab) => (
              <button
                key={tab.id}
                className={`pedidos-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <span>{tab.label}</span>
                <span className="pedidos-tab-count">{tab.count}</span>
              </button>
            ))}
          </div>

          {activeTab === "pendientes" && (
            <div className="pedidos-filters pedidos-filters-compact card border-0 shadow-sm mb-3">
              <div className="card-body pedidos-filters-body">
                <div className="row g-2">
                  <div className="col-12 col-md-4">
                    <label className="form-label pedidos-filter-label">
                      Buscar
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm pedidos-filter-control"
                      placeholder="Razón social, remito, factura, destinatario..."
                      value={draftFilters.search}
                      onChange={(e) =>
                        handleDraftChange("search", e.target.value)
                      }
                      onKeyDown={handleFilterKeyDown}
                    />
                  </div>

                  <div className="col-12 col-md-3">
                    <label className="form-label pedidos-filter-label">
                      Estado
                    </label>
                    <select
                      className="form-select form-select-sm pedidos-filter-control"
                      value={draftFilters.estado}
                      onChange={(e) =>
                        handleDraftChange("estado", e.target.value)
                      }
                      onKeyDown={handleFilterKeyDown}
                    >
                      <option value="">Todos</option>
                      <option value="Precarga">Precarga</option>
                      <option value="Confirmado">Confirmado</option>
                      <option value="Preparado">Preparado</option>
                      <option value="Despachado">Despachado</option>
                      <option value="Pagado">Pagado</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-3">
                    <label className="form-label pedidos-filter-label">
                      Tipo envío/retiro
                    </label>
                    <select
                      className="form-select form-select-sm pedidos-filter-control"
                      value={draftFilters.tipo_envio_retiro}
                      onChange={(e) =>
                        handleDraftChange("tipo_envio_retiro", e.target.value)
                      }
                      onKeyDown={handleFilterKeyDown}
                    >
                      <option value="">Todos</option>
                      <option value="PUERTA">PUERTA</option>
                      <option value="ENCOMIENDA">ENCOMIENDA</option>
                      <option value="RETIRO">RETIRO</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-2">
                    <label className="form-label pedidos-filter-label">
                      Ejecutivo
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm pedidos-filter-control form-control form-control-sm pedidos-filter-control-sm pedidos-filter-control"
                      placeholder="Nombre o apellido"
                      value={draftFilters.ejecutivo}
                      onChange={(e) =>
                        handleDraftChange("ejecutivo", e.target.value)
                      }
                      onKeyDown={handleFilterKeyDown}
                    />
                  </div>

                  <div className="col-12 d-flex flex-wrap gap-2 justify-content-end mt-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary pedidos-btn-compact"
                      onClick={clearFilters}
                    >
                      Limpiar filtros
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-primary pedidos-btn-compact"
                      onClick={applyFilters}
                    >
                      Buscar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pedidos-table-wrapper">
            <TableCard title={currentConfig.title}>
              {activeTab === "pendientes" && (
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 px-3 pt-3">
                  <div className="text-muted small">
                    {pagination.total > 0 ? (
                      <>
                        Mostrando página <strong>{pagination.page}</strong> de{" "}
                        <strong>{pagination.totalPages}</strong> — Total de
                        registros: <strong>{pagination.total}</strong>
                      </>
                    ) : (
                      "Sin registros"
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <label
                      htmlFor="pedidos-limit"
                      className="small text-muted mb-0"
                    >
                      Mostrar
                    </label>
                    <select
                      id="pedidos-limit"
                      className="form-select form-select-sm pedidos-filter-control form-select form-select-sm pedidos-filter-control-sm"
                      style={{ width: "90px" }}
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
              )}

              {activeTab === "pendientes" && loadingOrders ? (
                <div className="p-4 text-center">Cargando pedidos...</div>
              ) : activeTab === "pendientes" && ordersError ? (
                <div className="p-4 text-center text-danger">{ordersError}</div>
              ) : (
                <>
                  <DataTable
                    columns={currentConfig.columns}
                    data={currentConfig.rows}
                    expandable={activeTab === "pendientes"}
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

                  {activeTab === "pendientes" && (
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

      {showCreateModal && (
        <div
          className="modal fade show d-block pedidos-modal-overlay"
          tabIndex="-1"
          role="dialog"
        >
          <div
            className="modal-dialog modal-xl modal-dialog-scrollable"
            role="document"
          >
            <div className="modal-content">
              <form onSubmit={handleCreateOrder}>
                <div className="modal-header">
                  <h5 className="modal-title">Nuevo pedido</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeCreateModal}
                  />
                </div>

                <div className="modal-body">
                  {createError && (
                    <div className="alert alert-danger" role="alert">
                      {createError}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label">Fecha *</label>
                      <input
                        type="date"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.fecha}
                        onChange={(e) =>
                          handleFormChange("fecha", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-5">
                      <label className="form-label">Razón social *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.razon_social}
                        onChange={(e) =>
                          handleFormChange("razon_social", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">Ejecutivo ID *</label>
                      <input
                        type="number"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.ejecutivo_cuenta_id}
                        onChange={(e) =>
                          handleFormChange(
                            "ejecutivo_cuenta_id",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">Estado</label>
                      <select
                        className="form-select form-select-sm pedidos-filter-control"
                        value={orderForm.estado}
                        onChange={(e) =>
                          handleFormChange("estado", e.target.value)
                        }
                      >
                        <option value="Precarga">Precarga</option>
                        <option value="Confirmado">Confirmado</option>
                        <option value="Preparado">Preparado</option>
                        <option value="Despachado">Despachado</option>
                        <option value="Pagado">Pagado</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">
                        Plataforma de venta *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.plataforma_venta}
                        onChange={(e) =>
                          handleFormChange("plataforma_venta", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Tipo envío/retiro *</label>
                      <select
                        className="form-select form-select-sm pedidos-filter-control"
                        value={orderForm.tipo_envio_retiro}
                        onChange={(e) =>
                          handleFormChange("tipo_envio_retiro", e.target.value)
                        }
                      >
                        <option value="">Seleccionar</option>
                        <option value="PUERTA">PUERTA</option>
                        <option value="ENCOMIENDA">ENCOMIENDA</option>
                        <option value="RETIRO">RETIRO</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Método envío/retiro</label>
                      <input
                        type="text"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.metodo_envio_retiro}
                        onChange={(e) =>
                          handleFormChange(
                            "metodo_envio_retiro",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">N° Remito</label>
                      <input
                        type="text"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.numero_remito}
                        onChange={(e) =>
                          handleFormChange("numero_remito", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">N° Factura</label>
                      <input
                        type="text"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.numero_factura}
                        onChange={(e) =>
                          handleFormChange("numero_factura", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Nombre y apellido</label>
                      <input
                        type="text"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.nombre_apellido}
                        onChange={(e) =>
                          handleFormChange("nombre_apellido", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Destinatario</label>
                      <input
                        type="text"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.destinatario}
                        onChange={(e) =>
                          handleFormChange("destinatario", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Teléfono</label>
                      <input
                        type="text"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.telefono}
                        onChange={(e) =>
                          handleFormChange("telefono", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">DNI/CUIT puerta</label>
                      <input
                        type="text"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.dni_cuit_puerta}
                        onChange={(e) =>
                          handleFormChange("dni_cuit_puerta", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">DNI/CUIT encomienda</label>
                      <input
                        type="text"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.dni_cuit_encomienda}
                        onChange={(e) =>
                          handleFormChange(
                            "dni_cuit_encomienda",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Transporte</label>
                      <input
                        type="text"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.transporte}
                        onChange={(e) =>
                          handleFormChange("transporte", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Guía / Dirección</label>
                      <input
                        type="text"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.guia_direccion}
                        onChange={(e) =>
                          handleFormChange("guia_direccion", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">Valor declarado</label>
                      <input
                        type="number"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.valor_declarado}
                        onChange={(e) =>
                          handleFormChange("valor_declarado", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">Bultos</label>
                      <input
                        type="number"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.bultos}
                        onChange={(e) =>
                          handleFormChange("bultos", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">External ID</label>
                      <input
                        type="text"
                        className="form-control form-control-sm pedidos-filter-control"
                        value={orderForm.external_id}
                        onChange={(e) =>
                          handleFormChange("external_id", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Observaciones depósito
                      </label>
                      <textarea
                        className="form-control form-control-sm pedidos-filter-control"
                        rows="3"
                        value={orderForm.observaciones_deposito}
                        onChange={(e) =>
                          handleFormChange(
                            "observaciones_deposito",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Observaciones transporte
                      </label>
                      <textarea
                        className="form-control form-control-sm pedidos-filter-control"
                        rows="3"
                        value={orderForm.observaciones_transporte}
                        onChange={(e) =>
                          handleFormChange(
                            "observaciones_transporte",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-md-3">
                      <div className="form-check mt-4 pt-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="paga_envio"
                          checked={orderForm.paga_envio}
                          onChange={(e) =>
                            handleFormChange("paga_envio", e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="paga_envio"
                        >
                          Paga envío
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary pedidos-btn-compact"
                    onClick={closeCreateModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary pedidos-btn-compact"
                    disabled={createLoading}
                  >
                    {createLoading ? "Guardando..." : "Guardar pedido"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-backdrop fade show" onClick={closeCreateModal} />
      )}
    </div>
  );
}

export default Pedidos;
