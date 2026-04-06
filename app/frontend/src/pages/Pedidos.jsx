import { useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import '../styles/Pedidos.css';

const tabs = [
  { id: 'pendientes', label: 'Pendientes', count: 3 },
  { id: 'devoluciones', label: 'Devoluciones', count: 3 },
  { id: 'reservas', label: 'Reservas', count: 3 },
];

const data = {
  pendientes: [
    {
      id: 'PD-1042',
      cliente: 'Distribuidora Norte',
      destino: 'Córdoba',
      fecha: '06/04/2026',
      estado: 'Por preparar',
      prioridad: 'Alta',
      vendedor: 'Juan Pérez',
      transporte: 'Andreani',
      telefono: '351-555-1200',
      direccion: 'Av. Colón 2450',
      observaciones: 'Entregar antes de las 16 hs',
      items: 'Impresoras ZC300 x2, Ribbon YMCKO x4',
    },
    {
      id: 'PD-1043',
      cliente: 'Farmacia Central',
      destino: 'Rosario',
      fecha: '06/04/2026',
      estado: 'Listo para despacho',
      prioridad: 'Media',
      vendedor: 'María López',
      transporte: 'OCA',
      telefono: '341-555-2200',
      direccion: 'San Martín 1180',
      observaciones: 'Confirmar recepción con encargado',
      items: 'Tarjetas PVC x500, Lanyards x500',
    },
    {
      id: 'PD-1044',
      cliente: 'Retail Sur',
      destino: 'Mendoza',
      fecha: '07/04/2026',
      estado: 'En validación',
      prioridad: 'Alta',
      vendedor: 'Carlos Díaz',
      transporte: 'Vía Cargo',
      telefono: '261-555-3300',
      direccion: 'Belgrano 540',
      observaciones: 'Pedido con prioridad comercial',
      items: 'Tags RFID UHF x1200',
    },
  ],
  devoluciones: [
    {
      id: 'DV-201',
      cliente: 'Hospital Andino',
      motivo: 'Producto incorrecto',
      fecha: '05/04/2026',
      recepcion: 'En tránsito',
      prioridad: 'Alta',
      contacto: 'Laura Gómez',
      telefono: '261-555-8100',
      direccion: 'Paso de los Andes 900',
      nroRemito: 'REM-8821',
      observaciones: 'Solicitan recambio urgente',
      detalle: 'Se enviaron tarjetas sin codificar',
    },
    {
      id: 'DV-202',
      cliente: 'Logística Pampeana',
      motivo: 'Daño de empaque',
      fecha: '05/04/2026',
      recepcion: 'Recibido',
      prioridad: 'Media',
      contacto: 'Pedro Ruiz',
      telefono: '2954-555-101',
      direccion: 'Ruta 5 Km 610',
      nroRemito: 'REM-8822',
      observaciones: 'Caja con golpe lateral',
      detalle: 'Producto funcional, revisar criterio comercial',
    },
    {
      id: 'DV-203',
      cliente: 'Insumos Alfa',
      motivo: 'Cambio solicitado',
      fecha: '06/04/2026',
      recepcion: 'En revisión',
      prioridad: 'Baja',
      contacto: 'Ana Torres',
      telefono: '11-5555-4500',
      direccion: 'Mitre 700',
      nroRemito: 'REM-8823',
      observaciones: 'Cliente pidió cambio de modelo',
      detalle: 'Reemplazo por versión con mayor capacidad',
    },
  ],
  reservas: [
    {
      id: 'RV-871',
      cliente: 'Clínica Integral',
      producto: 'Credenciales PVC',
      cantidad: 350,
      fecha: '08/04/2026',
      estado: 'Reservado',
      responsable: 'Sebastián Núñez',
      deposito: 'Depósito Central',
      ubicacion: 'Estantería A3',
      telefono: '11-5555-9898',
      observaciones: 'Stock separado para campaña interna',
      lote: 'LOT-2026-041',
    },
    {
      id: 'RV-872',
      cliente: 'Banco Regional',
      producto: 'Ribbon YMCKO',
      cantidad: 24,
      fecha: '08/04/2026',
      estado: 'En picking',
      responsable: 'Lucía Vega',
      deposito: 'Depósito Norte',
      ubicacion: 'Rack B1',
      telefono: '11-5555-7711',
      observaciones: 'Pendiente confirmación final',
      lote: 'LOT-2026-042',
    },
    {
      id: 'RV-873',
      cliente: 'Control Acceso SRL',
      producto: 'Tags RFID UHF',
      cantidad: 1200,
      fecha: '09/04/2026',
      estado: 'Confirmado',
      responsable: 'Matías Roldán',
      deposito: 'Depósito Central',
      ubicacion: 'Rack C4',
      telefono: '11-5555-6612',
      observaciones: 'Separado para instalación grande',
      lote: 'LOT-2026-043',
    },
  ],
};

function StatusBadge({ children }) {
  return <span className="pedidos-badge pedidos-badge-status">{children}</span>;
}

function PriorityBadge({ children }) {
  const cls =
    children === 'Alta'
      ? 'high'
      : children === 'Media'
      ? 'medium'
      : 'low';

  return (
    <span className={`pedidos-badge pedidos-badge-priority ${cls}`}>
      {children}
    </span>
  );
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

function DetailItem({ label, value }) {
  return (
    <div className="pedidos-detail-item">
      <span className="pedidos-detail-label">{label}</span>
      <span className="pedidos-detail-value">{value || '-'}</span>
    </div>
  );
}

function Pedidos() {
  const [activeTab, setActiveTab] = useState('pendientes');

  const handleVer = (row) => {
    console.log('Ver registro:', row);
  };

  const handleEditar = (row) => {
    console.log('Editar registro:', row);
  };

  const handleEliminar = (row) => {
    console.log('Eliminar registro:', row);
  };

  const pendientesColumns = useMemo(
    () => [
      { key: 'id', label: 'ID' },
      { key: 'cliente', label: 'Cliente' },
      { key: 'destino', label: 'Destino' },
      { key: 'fecha', label: 'Fecha' },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => <StatusBadge>{value}</StatusBadge>,
      },
      {
        key: 'prioridad',
        label: 'Prioridad',
        render: (value) => <PriorityBadge>{value}</PriorityBadge>,
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
    () => [
      { key: 'id', label: 'ID' },
      { key: 'cliente', label: 'Cliente' },
      { key: 'motivo', label: 'Motivo' },
      { key: 'fecha', label: 'Fecha' },
      {
        key: 'recepcion',
        label: 'Recepción',
        render: (value) => <StatusBadge>{value}</StatusBadge>,
      },
      {
        key: 'prioridad',
        label: 'Prioridad',
        render: (value) => <PriorityBadge>{value}</PriorityBadge>,
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

  const reservasColumns = useMemo(
    () => [
      { key: 'id', label: 'ID' },
      { key: 'cliente', label: 'Cliente' },
      { key: 'producto', label: 'Producto' },
      { key: 'cantidad', label: 'Cantidad' },
      { key: 'fecha', label: 'Fecha' },
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

  const renderPendienteDetails = (row) => (
    <div className="pedidos-detail-grid">
      <DetailItem label="Vendedor" value={row.vendedor} />
      <DetailItem label="Transporte" value={row.transporte} />
      <DetailItem label="Teléfono" value={row.telefono} />
      <DetailItem label="Dirección" value={row.direccion} />
      <DetailItem label="Items" value={row.items} />
      <DetailItem label="Observaciones" value={row.observaciones} />
    </div>
  );

  const renderDevolucionDetails = (row) => (
    <div className="pedidos-detail-grid">
      <DetailItem label="Contacto" value={row.contacto} />
      <DetailItem label="Teléfono" value={row.telefono} />
      <DetailItem label="Dirección" value={row.direccion} />
      <DetailItem label="N° Remito" value={row.nroRemito} />
      <DetailItem label="Detalle" value={row.detalle} />
      <DetailItem label="Observaciones" value={row.observaciones} />
    </div>
  );

  const renderReservaDetails = (row) => (
    <div className="pedidos-detail-grid">
      <DetailItem label="Responsable" value={row.responsable} />
      <DetailItem label="Depósito" value={row.deposito} />
      <DetailItem label="Ubicación" value={row.ubicacion} />
      <DetailItem label="Teléfono" value={row.telefono} />
      <DetailItem label="Lote" value={row.lote} />
      <DetailItem label="Observaciones" value={row.observaciones} />
    </div>
  );

  const currentConfig = useMemo(() => {
    switch (activeTab) {
      case 'devoluciones':
        return {
          title: 'Devoluciones',
          columns: devolucionesColumns,
          rows: data.devoluciones,
          renderExpandedRow: renderDevolucionDetails,
        };
      case 'reservas':
        return {
          title: 'Reservas',
          columns: reservasColumns,
          rows: data.reservas,
          renderExpandedRow: renderReservaDetails,
        };
      case 'pendientes':
      default:
        return {
          title: 'Pendientes',
          columns: pendientesColumns,
          rows: data.pendientes,
          renderExpandedRow: renderPendienteDetails,
        };
    }
  }, [activeTab, pendientesColumns, devolucionesColumns, reservasColumns]);

  return (
    <div className="pedidos-page">
      <div className="container">
        <header className="pedidos-header">
          <div>
            <span className="pedidos-kicker">Gestión operativa</span>
            <h1 className="pedidos-title">Pedidos</h1>
            <p className="pedidos-subtitle">
              Visualización centralizada de pendientes, devoluciones y reservas.
            </p>
          </div>
        </header>

        <section className="pedidos-panel">
          <div className="pedidos-tabs">
            {tabs.map((tab) => (
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
              <DataTable
                columns={currentConfig.columns}
                data={currentConfig.rows}
                expandable
                renderExpandedRow={currentConfig.renderExpandedRow}
              />
            </TableCard>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Pedidos;