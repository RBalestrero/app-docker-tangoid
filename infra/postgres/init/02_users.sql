CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),

    nombre VARCHAR(150) NOT NULL,
    apellido VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,

    password TEXT NOT NULL CHECK (password ~ '^[a-zA-Z0-9]{8,}$'),
    salt TEXT NOT NULL,

    rol user_rol NOT NULL DEFAULT 'invitado',
    activo BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice útil para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);