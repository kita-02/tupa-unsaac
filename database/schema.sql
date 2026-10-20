-- ============================================================
-- Plataforma Web de Gestión del TUPA - UNSAAC
-- Esquema de base de datos (PostgreSQL)
-- ============================================================

CREATE TABLE offices (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    floor       VARCHAR(50),
    schedule    VARCHAR(100) DEFAULT 'Lun a Vie 8:00 - 17:00',
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    code          VARCHAR(20) UNIQUE,
    full_name     VARCHAR(150) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20) NOT NULL CHECK (role IN ('student','office','admin')),
    office_id     INTEGER REFERENCES offices(id),
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE procedures (
    id            SERIAL PRIMARY KEY,
    code          VARCHAR(20) UNIQUE NOT NULL,
    name          VARCHAR(200) NOT NULL,
    description   TEXT,
    office_id     INTEGER REFERENCES offices(id),
    requirements  JSONB NOT NULL DEFAULT '[]',
    cost          NUMERIC(10,2) DEFAULT 0,
    duration_days INTEGER DEFAULT 5,
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE requests (
    id           SERIAL PRIMARY KEY,
    code         VARCHAR(30) UNIQUE NOT NULL,
    user_id      INTEGER NOT NULL REFERENCES users(id),
    procedure_id INTEGER NOT NULL REFERENCES procedures(id),
    state        VARCHAR(20) NOT NULL DEFAULT 'submitted'
                 CHECK (state IN ('submitted','under_review','observed','approved','rejected','delivered')),
    data         JSONB DEFAULT '{}',
    observations TEXT,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE request_documents (
    id          SERIAL PRIMARY KEY,
    request_id  INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    doc_name    VARCHAR(150) NOT NULL,
    file_path   VARCHAR(300) NOT NULL,
    file_size   INTEGER,
    verified    BOOLEAN DEFAULT FALSE,
    verified_by INTEGER REFERENCES users(id),
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE request_history (
    id          SERIAL PRIMARY KEY,
    request_id  INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    from_state  VARCHAR(20),
    to_state    VARCHAR(20) NOT NULL,
    changed_by  INTEGER REFERENCES users(id),
    comment     TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    request_id INTEGER REFERENCES requests(id) ON DELETE CASCADE,
    title      VARCHAR(200) NOT NULL,
    message    TEXT NOT NULL,
    is_read    BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_requests_user      ON requests(user_id);
CREATE INDEX idx_requests_state     ON requests(state);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_procedures_active  ON procedures(is_active);
