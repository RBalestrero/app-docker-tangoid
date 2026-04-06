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

    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'condicion_producto'
    ) THEN
        CREATE TYPE condicion_producto AS ENUM (
            'Bien',
            'Mal'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'ubicacion_producto'
    ) THEN
        CREATE TYPE ubicacion_producto AS ENUM (
            'deposito',
            'soporte'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'user_rol'
    ) THEN
        CREATE TYPE user_rol AS ENUM (
            'administrador',
            'deposito',
            'soporte',
            'comercial',
            'administrativo',
            'invitado',
            'gerencia'
        );
    END IF;
END$$;