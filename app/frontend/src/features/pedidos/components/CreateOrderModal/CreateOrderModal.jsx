import {
  PEDIDO_ESTADOS,
  PEDIDO_TIPOS_ENVIO,
} from '../../constants/Pedidos.constants';
import ModalField from './ModalField/ModalField';
import styles from './CreateOrderModal.module.css';

function CreateOrderModal({
  show,
  orderForm,
  createError,
  createLoading,
  onClose,
  onSubmit,
  onFormChange,
}) {
  if (!show) return null;

  const estadoOptions = PEDIDO_ESTADOS.map((estado) => ({
    value: estado,
    label: estado,
  }));

  const tipoEnvioOptions = [
    { value: '', label: 'Seleccionar' },
    ...PEDIDO_TIPOS_ENVIO.map((tipo) => ({
      value: tipo,
      label: tipo,
    })),
  ];

  return (
    <>
      <div
        className={`modal fade show d-block ${styles.overlay}`}
        tabIndex="-1"
        role="dialog"
      >
        <div
          className="modal-dialog modal-xl modal-dialog-scrollable"
          role="document"
        >
          <div className={`modal-content ${styles.content}`}>
            <form onSubmit={onSubmit}>
              <div className={`modal-header ${styles.header}`}>
                <h5 className="modal-title">Nuevo pedido</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  disabled={createLoading}
                />
              </div>

              <div className="modal-body">
                {createError && (
                  <div className="alert alert-danger" role="alert">
                    {createError}
                  </div>
                )}

                <div className="row g-3">
                  <ModalField
                    label="Fecha"
                    required
                    type="date"
                    value={orderForm.fecha}
                    onChange={(value) => onFormChange('fecha', value)}
                    colClassName="col-md-3"
                  />

                  <ModalField
                    label="Razón social"
                    required
                    value={orderForm.razon_social}
                    onChange={(value) => onFormChange('razon_social', value)}
                    colClassName="col-md-5"
                  />

                  <ModalField
                    label="Ejecutivo ID"
                    required
                    type="number"
                    value={orderForm.ejecutivo_cuenta_id}
                    onChange={(value) =>
                      onFormChange('ejecutivo_cuenta_id', value)
                    }
                    colClassName="col-md-2"
                  />

                  <ModalField
                    label="Estado"
                    as="select"
                    value={orderForm.estado}
                    onChange={(value) => onFormChange('estado', value)}
                    options={estadoOptions}
                    colClassName="col-md-2"
                  />

                  <ModalField
                    label="Plataforma de venta"
                    required
                    value={orderForm.plataforma_venta}
                    onChange={(value) =>
                      onFormChange('plataforma_venta', value)
                    }
                    colClassName="col-md-3"
                  />

                  <ModalField
                    label="Tipo envío/retiro"
                    required
                    as="select"
                    value={orderForm.tipo_envio_retiro}
                    onChange={(value) =>
                      onFormChange('tipo_envio_retiro', value)
                    }
                    options={tipoEnvioOptions}
                    colClassName="col-md-3"
                  />

                  <ModalField
                    label="Método envío/retiro"
                    value={orderForm.metodo_envio_retiro}
                    onChange={(value) =>
                      onFormChange('metodo_envio_retiro', value)
                    }
                    colClassName="col-md-3"
                  />

                  <ModalField
                    label="N° Remito"
                    value={orderForm.numero_remito}
                    onChange={(value) => onFormChange('numero_remito', value)}
                    colClassName="col-md-3"
                  />

                  <ModalField
                    label="N° Factura"
                    value={orderForm.numero_factura}
                    onChange={(value) => onFormChange('numero_factura', value)}
                    colClassName="col-md-3"
                  />

                  <ModalField
                    label="Nombre y apellido"
                    value={orderForm.nombre_apellido}
                    onChange={(value) => onFormChange('nombre_apellido', value)}
                    colClassName="col-md-4"
                  />

                  <ModalField
                    label="Destinatario"
                    value={orderForm.destinatario}
                    onChange={(value) => onFormChange('destinatario', value)}
                    colClassName="col-md-4"
                  />

                  <ModalField
                    label="Teléfono"
                    value={orderForm.telefono}
                    onChange={(value) => onFormChange('telefono', value)}
                    colClassName="col-md-4"
                  />

                  <ModalField
                    label="DNI/CUIT puerta"
                    value={orderForm.dni_cuit_puerta}
                    onChange={(value) => onFormChange('dni_cuit_puerta', value)}
                    colClassName="col-md-4"
                  />

                  <ModalField
                    label="DNI/CUIT encomienda"
                    value={orderForm.dni_cuit_encomienda}
                    onChange={(value) =>
                      onFormChange('dni_cuit_encomienda', value)
                    }
                    colClassName="col-md-4"
                  />

                  <ModalField
                    label="Transporte"
                    value={orderForm.transporte}
                    onChange={(value) => onFormChange('transporte', value)}
                    colClassName="col-md-4"
                  />

                  <ModalField
                    label="Guía / Dirección"
                    value={orderForm.guia_direccion}
                    onChange={(value) => onFormChange('guia_direccion', value)}
                    colClassName="col-md-6"
                  />

                  <ModalField
                    label="Valor declarado"
                    type="number"
                    value={orderForm.valor_declarado}
                    onChange={(value) => onFormChange('valor_declarado', value)}
                    colClassName="col-md-2"
                  />

                  <ModalField
                    label="Bultos"
                    type="number"
                    value={orderForm.bultos}
                    onChange={(value) => onFormChange('bultos', value)}
                    colClassName="col-md-2"
                  />

                  <ModalField
                    label="External ID"
                    value={orderForm.external_id}
                    onChange={(value) => onFormChange('external_id', value)}
                    colClassName="col-md-2"
                  />

                  <ModalField
                    label="Observaciones depósito"
                    as="textarea"
                    rows={3}
                    value={orderForm.observaciones_deposito}
                    onChange={(value) =>
                      onFormChange('observaciones_deposito', value)
                    }
                    colClassName="col-md-6"
                  />

                  <ModalField
                    label="Observaciones transporte"
                    as="textarea"
                    rows={3}
                    value={orderForm.observaciones_transporte}
                    onChange={(value) =>
                      onFormChange('observaciones_transporte', value)
                    }
                    colClassName="col-md-6"
                  />

                  <div className="col-md-3">
                    <div className={`form-check mt-4 pt-2 ${styles.checkboxWrap}`}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="paga_envio"
                        checked={orderForm.paga_envio}
                        onChange={(e) =>
                          onFormChange('paga_envio', e.target.checked)
                        }
                      />
                      <label className="form-check-label" htmlFor="paga_envio">
                        Paga envío
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`modal-footer ${styles.footer}`}>
                <button
                  type="button"
                  className={`btn btn-sm btn-outline-secondary ${styles.buttonCompact}`}
                  onClick={onClose}
                  disabled={createLoading}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className={`btn btn-sm btn-primary ${styles.buttonCompact}`}
                  disabled={createLoading}
                >
                  {createLoading ? 'Guardando...' : 'Guardar pedido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
}

export default CreateOrderModal;