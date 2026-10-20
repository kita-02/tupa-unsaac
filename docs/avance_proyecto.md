# Documentación del avance del proyecto

## Entrega 01 — Plan de Proyecto (27-10-2026) ✅

- Plan de proyecto completo en `01_Plan_Proyecto/` (Markdown + Word).
- Contiene: carátula, presentación, ámbito, problemática, objetivos, metodología Scrum, actividades, infraestructura, evaluación, resultados esperados, participantes, aspectos administrativos, cronograma, presupuesto y prototipado dinámico.

## Entrega 02 — GUIs, base de datos y Git (27-10-2026) ✅

### Creación de las interfaces

Implementación de todas las GUIs con React + Vite + Tailwind CSS:

| Módulo | Pantallas |
|--------|-----------|
| Portal público | Inicio con buscador, catálogo de procedimientos, detalle con requisitos/costos/plazos |
| Autenticación | Iniciar sesión, registro de estudiantes |
| Estudiante | Mis trámites (lista + estados), nueva solicitud con carga de documentos, seguimiento con línea de tiempo e historial |
| Notificaciones | Lista, marcado de leídas |
| Oficina/Admin | Panel con estadísticas, bandeja de solicitudes con filtros, gestión del catálogo TUPA (CRUD), reportes con gráficos (pie, barras) y exportación CSV |

Patrones de diseño usados: **MVC** (backend por capas rutas/servicios/datos), **componentes reutilizables** (Navbar, StatusBadge, ProcedureCard), **patrón de autenticación por contexto** (AuthContext + ProtectedRoute con roles).

### Diseño de la base de datos

- Esquema PostgreSQL en `database/schema.sql`: 7 tablas (offices, users, procedures, requests, request_documents, request_history, notifications) con integridad referencial, constraints y índices.
- Diagrama entidad-relación y de estados del trámite en `database/diagrama_ER.md` (Mermaid).

### Control de versiones

- Repositorio Git inicializado con rama `main`.
- Estructura modular por carpetas (backend, frontend, database, docs, entregas).
- `.gitignore` configurado (node_modules, .env, uploads, dist).

### Verificación

- **15 pruebas automatizadas** (Jest + Supertest) cubren: salud de la API, catálogo con búsqueda, registro, login, creación de solicitudes, control de acceso por roles, cambio de estado con historial y notificaciones, reportes y exportación CSV. Todas pasan.
- **Build de producción** del frontend verificado (`npm run build`).

## Entrega 03 — Desarrollo de la aplicación (fecha por definir) 🔄

### Implementado

- Sistema web completo de solicitud de trámites (flujo estudiante → oficina).
- Módulos de mantenimiento: CRUD de procedimientos (alta/edición/baja lógica), gestión de usuarios por autenticación.
- Notificaciones in-app automáticas en cada cambio de estado.
- Validación y verificación de documentos digitales por la oficina.
- Reportes y estadísticas con gráficos y exportación CSV.
- Optimización y mejora del diseño (Tailwind, responsive, UX de seguimiento).

### Pendiente para la entrega final

- [ ] Conectar el backend a PostgreSQL (Neon) usando `database/schema.sql` (hoy usa datos de demo en memoria).
- [ ] Despliegue en la nube: frontend en Vercel, backend en Render (guía en `docs/despliegue.md`).
- [ ] Pruebas de usabilidad con usuarios reales y ajustes finales.
- [ ] Documentación final: manual de usuario y manual técnico.
- [ ] Demo funcional.
