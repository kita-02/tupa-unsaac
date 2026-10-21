# Manual técnico — Plataforma TUPA UNSAAC

## 1. Arquitectura general

```
┌─────────────────┐     HTTP/JSON + JWT      ┌──────────────────┐      SQL      ┌──────────────┐
│   Frontend      │ ───────────────────────► │     Backend      │ ────────────► │ PostgreSQL / │
│ React + Vite +  │ ◄─────────────────────── │  Node + Express  │   (opcional)  │   Memoria    │
│   Tailwind      │                          │   API REST       │               └──────────────┘
└─────────────────┘                          └──────────────────┘
   Vercel / localhost:5173                    Render / localhost:4000
```

- **Patrón de diseño**: MVC (Modelo–Vista–Controlador) con API REST.
- **Autenticación**: JWT (12 h) con contraseñas hasheadas (bcrypt).
- **Autorización**: roles `student`, `office`, `admin` mediante middleware `requireRole`.
- **Persistencia**: capa de repositorio interchangeable:
  - `repo/memory.js` — datos en memoria con siembra (demo y pruebas).
  - `repo/pg.js` — PostgreSQL (Neon/Render) con autodiseño del esquema y siembra inicial.
  - Selección automática: si existe `DATABASE_URL` se usa PostgreSQL; si no, memoria.

## 2. Estructura del código

```
backend/src/
├── index.js              # Bootstrap (carga .env, init repositorio, arranca servidor)
├── app.js                # Express: CORS, JSON, rutas, manejo de errores
├── mailer.js             # Nodemailer opcional (EMAIL_USER/EMAIL_PASS)
├── middleware/auth.js    # Verificación JWT + control de roles
├── repo/
│   ├── index.js          # Selector de repositorio (memory | pg)
│   ├── memory.js         # Implementación en memoria con datos semilla
│   └── pg.js             # Implementación PostgreSQL (tablas + seed idempotente)
└── routes/
    ├── auth.js           # Registro, login, perfil
    ├── procedures.js     # Catálogo TUPA (público) + CRUD (admin)
    ├── requests.js       # Solicitudes, estados, documentos (multer)
    ├── notifications.js  # Notificaciones in-app
    └── reports.js        # Estadísticas + exportación CSV
```

## 3. Modelo de datos

Ver `database/schema.sql` y diagrama E-R en `database/diagrama_ER.md`.

| Tabla | Propósito |
|-------|-----------|
| offices | Oficinas responsables del TUPA |
| users | Usuarios con rol (student/office/admin) |
| procedures | Procedimientos del catálogo (requirements en JSONB) |
| requests | Solicitudes de trámite con máquina de estados |
| request_documents | Documentos adjuntos y su verificación |
| request_history | Auditoría de cambios de estado |
| notifications | Alertas por usuario |

### Máquina de estados de un trámite

```
submitted ──► under_review ──► approved ──► delivered
                  │ ▲
                  ├──► observed ──┘
                  └──► rejected
```

Transiciones controladas en `PATCH /api/requests/:id/status` (solo oficina/admin).

## 4. API REST

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | /api/auth/register | público | Registro de estudiante |
| POST | /api/auth/login | público | Login → token JWT |
| GET | /api/auth/me | autenticado | Perfil del token |
| GET | /api/procedures | público | Catálogo activo (?search=&office_id=) |
| GET | /api/procedures/:id | público | Detalle de procedimiento |
| GET | /api/procedures/all | office/admin | Catálogo completo (incluye inactivos) |
| POST | /api/procedures | admin | Crear procedimiento |
| PUT | /api/procedures/:id | admin | Editar procedimiento |
| DELETE | /api/procedures/:id | admin | Baja lógica |
| GET | /api/requests | autenticado | Solicitudes (propias si es estudiante) |
| GET | /api/requests/:id | autenticado | Detalle con documentos e historial |
| POST | /api/requests | student | Crear solicitud |
| PATCH | /api/requests/:id/status | office/admin | Cambiar estado (notifica + historial + correo) |
| POST | /api/requests/:id/documents | autenticado | Subir documento (multipart, máx. 5 MB) |
| PATCH | /api/requests/:id/documents/:docId | office/admin | Verificar documento |
| GET | /api/notifications | autenticado | Notificaciones del usuario |
| GET | /api/notifications/unread/count | autenticado | Contador de no leídas |
| PATCH | /api/notifications/:id/read | autenticado | Marcar leída |
| PATCH | /api/notifications/read-all | autenticado | Marcar todas |
| GET | /api/reports/stats | office/admin | Estadísticas agregadas |
| GET | /api/reports/export | office/admin | Exportación CSV |
| GET | /api/health | público | Health check |

## 5. Seguridad

- Contraseñas con bcrypt (8 rondas); nunca se almacenan en texto plano.
- Tokens JWT con expiración de 12 horas.
- Control de acceso por rol en cada endpoint sensible.
- Validación de estados de trámite (whitelist).
- Límite de tamaño de archivo (5 MB) y sanitización de nombres de archivo (multer).
- Cabeceras CORS configuradas; en producción restringir al dominio del frontend.

## 6. Pruebas automatizadas

`backend/tests/api.test.js` — Jest + Supertest (15 casos):

- Health check y catálogo con búsqueda.
- Registro y login (credenciales válidas e inválidas).
- Control de autenticación y roles (401/403).
- Ciclo completo: crear solicitud → cambio de estado → notificaciones → historial.
- Validación de estados inválidos.
- Estadísticas y exportación CSV.

Ejecución: `cd backend && npm test`.

## 7. Despliegue

Guía paso a paso en `docs/despliegue.md` (Neon + Render + Vercel, todo con tier gratuito). Archivos de configuración:

- `render.yaml` — definición de servicio para Render.
- `frontend/vercel.json` — SPA routing en Vercel.
- `backend/.env.example` y `frontend/.env.example` — variables de entorno.

## 8. Decisiones técnicas

| Decisión | Justificación |
|----------|---------------|
| API REST desacoplada del frontend | Escalabilidad, permitir app móvil futura, prueba con Supertest |
| Repositorio intercambiable (memoria/PostgreSQL) | Demo sin dependencias + producción persistente sin reescribir rutas |
| JWT sin sesiones en servidor | Adecuado para API stateless y despliegue serverless |
| Tailwind CSS | Iteración rápida de GUIs consistentes con la rúbrica |
| Notificaciones in-app + correo opcional | Cumple objetivo 4 sin depender de servicios de pago |
| Borrado lógico de procedimientos | Conserva integridad referencial de solicitudes históricas |
