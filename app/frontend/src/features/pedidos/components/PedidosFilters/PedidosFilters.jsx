import { PEDIDO_ESTADOS, PEDIDO_TIPOS_ENVIO } from '../../constants/Pedidos.constants.jsx';
import styles from './PedidosFilters.module.css';

function PedidosFilters({
  draftFilters,
  onDraftChange,
  onApplyFilters,
  onClearFilters,
  onKeyDown,
}) {
  return (
    <div className={`card border-0 shadow-sm ${styles.wrapper}`}>
      <div className={styles.body}>
        <div className={`row align-items-end ${styles.rowInline}`}>
          <div className="col-12 col-md-4 col-lg-3">
            <label className={styles.label}>Buscar</label>
            <input
              type="text"
              className={`form-control form-control-sm ${styles.control}`}
              placeholder="Razón social, remito o factura"
              value={draftFilters.quick_search}
              onChange={(e) => onDraftChange('quick_search', e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>

          <div className="col-12 col-md-3 col-lg-2">
            <label className={styles.label}>Estado</label>
            <select
              className={`form-select form-select-sm ${styles.control}`}
              value={draftFilters.estado}
              onChange={(e) => onDraftChange('estado', e.target.value)}
              onKeyDown={onKeyDown}
            >
              <option value="">Todos</option>
              {PEDIDO_ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-3 col-lg-2">
            <label className={styles.label}>Tipo envío/retiro</label>
            <select
              className={`form-select form-select-sm ${styles.control}`}
              value={draftFilters.tipo_envio_retiro}
              onChange={(e) => onDraftChange('tipo_envio_retiro', e.target.value)}
              onKeyDown={onKeyDown}
            >
              <option value="">Todos</option>
              {PEDIDO_TIPOS_ENVIO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-2 col-lg-2">
            <label className={styles.label}>Ejecutivo</label>
            <input
              type="text"
              className={`form-control form-control-sm ${styles.control}`}
              placeholder="Nombre"
              value={draftFilters.ejecutivo}
              onChange={(e) => onDraftChange('ejecutivo', e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>

          <div className="col-12 col-lg-3">
            <div className={styles.actions}>
              <button
                type="button"
                className={`btn btn-sm btn-outline-secondary ${styles.buttonCompact}`}
                onClick={onClearFilters}
              >
                Limpiar filtros
              </button>

              <button
                type="button"
                className={`btn btn-sm btn-primary ${styles.buttonCompact}`}
                onClick={onApplyFilters}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PedidosFilters;