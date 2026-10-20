# Plataforma Web de Gestión del TUPA — UNSAAC

Proyecto semestral de la asignatura **Desarrollo de Software I** (2026-2) — Universidad Nacional de San Antonio Abad del Cusco.

Plataforma web para optimizar la gestión del Texto Único de Procedimientos Administrativos (TUPA): consulta de procedimientos, registro y seguimiento de trámites en línea, notificaciones, gestión de documentos digitales, panel administrativo y reportes.

## Estructura del proyecto

```
Proyecto_Desarrollo/
├── 01_Plan_Proyecto/        # Entrega 01 — Plan de proyecto (MD + Word)
├── backend/                 # API REST (Node.js + Express)
│   ├── src/
│   │   ├── index.js         # Punto de entrada
│   │   ├── app.js           # Configuración de Express
│   │   ├── store.js         # Capa de datos (semilla demo)
│   │   ├── middleware/      # Autenticación JWT + roles
│   │   └── routes/          # auth, procedures, requests, notifications, reports
│   ├── tests/               # Pruebas (Jest + Supertest)
│   └── uploads/             # Documentos subidos
├── frontend/                # GUI (React + Vite + Tailwind CSS)
│   └── src/
│       ├── pages/           # Home, catálogo, solicitudes, panel admin...
│       ├── components/      # Navbar, badges, tarjetas
│       ├── context/         # Autenticación (AuthContext)
│       └── services/        # Cliente API
├── database/
│   ├── schema.sql           # Esquema PostgreSQL
│   └── diagrama_ER.md       # Diagrama entidad-relación (Mermaid)
└── docs/                    # Documentación del proyecto
```

## Requisitos

- Node.js 18+ (probado con Node 24)
- npm 9+

## Ejecución en desarrollo

**1. Backend** (terminal 1):
```bash
cd backend
npm install
npm run dev        # API en http://localhost:4000
```

**2. Frontend** (terminal 2):
```bash
cd frontend
npm install
npm run dev        # Web en http://localhost:5173 (proxy /api → :4000)
```

## Pruebas

```bash
cd backend
npm test           # 15 pruebas (auth, trámites, reportes)
```

## Cuentas de demostración

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Estudiante | juan.hamann@alum.unsaac.edu.pe | estudiante123 |
| Oficina | oficina.ogr@unsaac.edu.pe | oficina123 |
| Admin | admin@unsaac.edu.pe | admin123 |

## API principal

| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| POST | /api/auth/register | Registro de estudiante | público |
| POST | /api/auth/login | Inicio de sesión (JWT) | público |
| GET | /api/procedures | Catálogo TUPA (con búsqueda) | público |
| POST | /api/procedures | Crear procedimiento | admin |
| GET | /api/requests | Solicitudes (propias o todas) | autenticado |
| POST | /api/requests | Registrar solicitud | estudiante |
| PATCH | /api/requests/:id/status | Cambiar estado | oficina/admin |
| POST | /api/requests/:id/documents | Subir documento | autenticado |
| GET | /api/notifications | Notificaciones | autenticado |
| GET | /api/reports/stats | Estadísticas | oficina/admin |
| GET | /api/reports/export | Exportar CSV | oficina/admin |

## Tecnologías

- **Frontend:** React 18, React Router, Tailwind CSS 4, Recharts, Vite
- **Backend:** Node.js, Express, JWT, bcryptjs, Multer, Jest + Supertest
- **Base de datos:** esquema PostgreSQL (`database/schema.sql`), datos de demo en memoria
- **Control de versiones:** Git / GitHub

## Metodología

Scrum (sprints), arquitectura MVC con API REST, implementación modular, control de versiones en GitHub.

Más documentación en [`docs/`](docs/).
