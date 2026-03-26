-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para orders
DROP TRIGGER IF EXISTS trg_update_orders_updated_at ON orders;
CREATE TRIGGER trg_update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para users
DROP TRIGGER IF EXISTS trg_update_users_updated_at ON users;
CREATE TRIGGER trg_update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para devoluciones
DROP TRIGGER IF EXISTS trg_update_devoluciones_updated_at ON devoluciones;
CREATE TRIGGER trg_update_devoluciones_updated_at
BEFORE UPDATE ON devoluciones
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();