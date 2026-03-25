-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'estado_pedido'
    ) THEN
        CREATE TYPE estado_pedido AS ENUM (
            'Precarga',
            'Preparando',
            'Hecho',
            'Despachado'
        );
    END IF;
END$$;