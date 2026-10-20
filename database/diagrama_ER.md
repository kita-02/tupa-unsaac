# Modelo Entidad-Relación — Plataforma TUPA UNSAAC

```mermaid
erDiagram
    OFFICES ||--o{ USERS : "agrupa"
    OFFICES ||--o{ PROCEDURES : "responsable de"
    USERS ||--o{ REQUESTS : "registra"
    PROCEDURES ||--o{ REQUESTS : "genera"
    REQUESTS ||--o{ REQUEST_DOCUMENTS : "incluye"
    REQUESTS ||--o{ REQUEST_HISTORY : "historial"
    REQUESTS ||--o{ NOTIFICATIONS : "origina"
    USERS ||--o{ NOTIFICATIONS : "recibe"
    USERS ||--o{ REQUEST_HISTORY : "modifica"
    USERS ||--o{ REQUEST_DOCUMENTS : "verifica"

    OFFICES {
        int id PK
        varchar name
        varchar floor
        varchar schedule
    }
    USERS {
        int id PK
        varchar code UK
        varchar full_name
        varchar email UK
        varchar password_hash
        varchar role "student | office | admin"
        int office_id FK
    }
    PROCEDURES {
        int id PK
        varchar code UK
        varchar name
        text description
        int office_id FK
        jsonb requirements
        numeric cost
        int duration_days
        boolean is_active
    }
    REQUESTS {
        int id PK
        varchar code UK
        int user_id FK
        int procedure_id FK
        varchar state "submitted|under_review|observed|approved|rejected|delivered"
        jsonb data
        text observations
    }
    REQUEST_DOCUMENTS {
        int id PK
        int request_id FK
        varchar doc_name
        varchar file_path
        boolean verified
        int verified_by FK
    }
    REQUEST_HISTORY {
        int id PK
        int request_id FK
        varchar from_state
        varchar to_state
        int changed_by FK
        text comment
    }
    NOTIFICATIONS {
        int id PK
        int user_id FK
        int request_id FK
        varchar title
        text message
        boolean is_read
    }
```

## Estados de un trámite

```mermaid
stateDiagram-v2
    [*] --> submitted : Estudiante envía solicitud
    submitted --> under_review : Oficina inicia revisión
    under_review --> observed : Documentos observados
    observed --> under_review : Estudiante corrige
    under_review --> approved : Aprobado
    under_review --> rejected : Rechazado
    approved --> delivered : Resolución entregada
    delivered --> [*]
```

## Relaciones principales

| Relación | Cardinalidad | Descripción |
|----------|--------------|-------------|
| offices — users | 1 : N | Cada usuario (oficina) pertenece a una oficina |
| offices — procedures | 1 : N | Cada procedimiento tiene una oficina responsable |
| users — requests | 1 : N | Un estudiante registra muchas solicitudes |
| procedures — requests | 1 : N | Un procedimiento genera muchas solicitudes |
| requests — request_documents | 1 : N | Cada solicitud adjunta varios documentos |
| requests — request_history | 1 : N | Cada solicitud registra sus cambios de estado |
| users — notifications | 1 : N | Cada usuario recibe notificaciones |
