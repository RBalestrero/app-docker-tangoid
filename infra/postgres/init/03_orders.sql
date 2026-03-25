CREATE TABLE IF NOT EXISTS orders (
    
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),

    -- Obligatorios
    fecha DATE NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    ejecutivo_cuenta_id BIGINT NOT NULL,
    plataforma_venta VARCHAR(150) NOT NULL,
    numero_remito VARCHAR(100) NOT NULL,
    numero_factura VARCHAR(100) NOT NULL,
    tipo_envio_retiro VARCHAR(100) NOT NULL,

    -- Operativos
    hecho BOOLEAN DEFAULT FALSE,
    despachado_recibido BOOLEAN DEFAULT FALSE,

    metodo_envio_retiro VARCHAR(150),

    nombre_apellido VARCHAR(255),
    dni_cuit_puerta VARCHAR(50),

    observaciones_deposito TEXT,

    transporte VARCHAR(150),
    destinatario VARCHAR(255),
    dni_cuit_encomienda VARCHAR(50),

    guia_direccion TEXT,

    valor_declarado NUMERIC(12,2),

    telefono VARCHAR(50),

    paga_envio BOOLEAN DEFAULT FALSE,

    observaciones_transporte TEXT,

    bultos INTEGER,

    correo_depo_enviado BOOLEAN DEFAULT FALSE,
    confirmo_pedido BOOLEAN DEFAULT FALSE,
    despacho_recibio BOOLEAN DEFAULT FALSE,
    preparo_pedido BOOLEAN DEFAULT FALSE,
    pagado BOOLEAN DEFAULT FALSE,

    external_id VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Relación con users
    CONSTRAINT fk_orders_user
    FOREIGN KEY (ejecutivo_cuenta_id)
    REFERENCES users(id)
    ON DELETE RESTRICT
);

-- Índices importantes
CREATE INDEX IF NOT EXISTS idx_orders_fecha ON orders(fecha);
CREATE INDEX IF NOT EXISTS idx_orders_remito ON orders(numero_remito);
CREATE INDEX IF NOT EXISTS idx_orders_factura ON orders(numero_factura);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(ejecutivo_cuenta_id);
CREATE INDEX IF NOT EXISTS idx_orders_estado ON orders(despachado_recibido, pagado);