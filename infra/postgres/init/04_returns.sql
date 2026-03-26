CREATE TABLE IF NOT EXISTS returns (

    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),

    -- Relación con pedido
    order_id BIGINT NOT NULL,

    -- Datos principales
    cliente VARCHAR(255) NOT NULL,
    numero_operacion VARCHAR(100),
    razon TEXT,
    remito VARCHAR(100),

    -- Estado físico
    condicion condicion_producto NOT NULL,
    vuelva_a_la_venta BOOLEAN DEFAULT FALSE,

    -- Operativo
    observaciones TEXT,
    ubicacion ubicacion_producto NOT NULL DEFAULT 'deposito',
    testeado BOOLEAN DEFAULT FALSE,

    -- 🆕 Notas del técnico
    notas_tecnico TEXT,

    -- Relaciones con usuarios
    ejecutivo_id BIGINT NOT NULL,
    tecnico_id BIGINT,

    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- =========================
    -- RELACIONES
    -- =========================

    CONSTRAINT fk_returns_order
    FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_returns_ejecutivo
    FOREIGN KEY (ejecutivo_id)
    REFERENCES users(id)
    ON DELETE RESTRICT,

    CONSTRAINT fk_returns_tecnico
    FOREIGN KEY (tecnico_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);

-- =========================
-- ÍNDICES
-- =========================

CREATE INDEX IF NOT EXISTS idx_returns_order_id ON returns(order_id);
CREATE INDEX IF NOT EXISTS idx_returns_ejecutivo_id ON returns(ejecutivo_id);
CREATE INDEX IF NOT EXISTS idx_returns_tecnico_id ON returns(tecnico_id);
CREATE INDEX IF NOT EXISTS idx_returns_remito ON returns(remito);
CREATE INDEX IF NOT EXISTS idx_returns_condicion ON returns(condicion);
CREATE INDEX IF NOT EXISTS idx_returns_ubicacion ON returns(ubicacion);

-- =========================
-- VALIDACIÓN: técnico debe ser rol "soporte"
-- =========================

CREATE OR REPLACE FUNCTION validar_tecnico_soporte()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tecnico_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1
            FROM users
            WHERE id = NEW.tecnico_id
              AND rol = 'soporte'
        ) THEN
            RAISE EXCEPTION 'El usuario asignado como técnico no tiene rol soporte';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Re-crear trigger por si existe
DROP TRIGGER IF EXISTS trg_validar_tecnico_soporte ON returns;

CREATE TRIGGER trg_validar_tecnico_soporte
BEFORE INSERT OR UPDATE ON returns
FOR EACH ROW
EXECUTE FUNCTION validar_tecnico_soporte();