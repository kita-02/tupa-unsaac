# Documentación del avance del proyecto

## Entrega 01 — Plan de Proyecto (27-10-2026) ✅

- Plan de proyecto completo en `01_Plan_Proyecto/` (Markdown + Word).
- **Prototipo dinámico** en `01_Plan_Proyecto/prototipo_dinamico.html` (interactivo, navegable: inicio → catálogo → detalle → solicitud → seguimiento → panel oficina con aprobación/rechazo y reportes).

## Entrega 02 — GUIs, base de datos y Git (27-10-2026) ✅

### Creación de las interfaces

Todas las GUIs implementadas con React + Vite + Tailwind CSS 4:

| Módulo | Pantallas |
|--------|-----------|
| Portal público | Inicio con buscador, catálogo, detalle con requisitos/costos/plazos |
| Autenticación | Login y registro de estudiantes |
| Estudiante | Mis trámites, nueva solicitud con carga de documentos, seguimiento con línea de estado e historial |
| Notificaciones | Lista, contador de no leídas, marcado |
| Oficina/Admin | Panel con estadísticas, bandeja con filtros, CRUD del catálogo TUPA, reportes con gráficos (pie/barras) y export CSV |

Patrones: **MVC** (backend por capas), componentes reutilizables, **AuthContext + ProtectedRoute** con roles.

### Diseño de la base de datos

- `database/schema.sql`: 7 tablas PostgreSQL con integridad referencial, constraints e índices.
- `database/diagrama_ER.md`: diagrama E-R y máquina de estados del trámite (Mermaid).

### Control de versiones

- Repositorio Git en rama `main`, estructura modular, `.gitignore` completo, despliegue continuo a GitHub.

### Verificación

- 15 pruebas (Jest + Supertest) aprobadas; build de producción del frontend verificado.

## Entrega 03 — Desarrollo de la aplicación ✅

### Implementación del sistema web de solicitud de trámites

- Flujo completo estudiante → oficina: registro de solicitud, carga de documentos (multipart, 5 MB), revisión, aprobación/rechazo/observación y cierre ("entregada").
- Historial de auditoría por solicitud y línea de estado visible.
- Autenticación JWT con roles (student/office/admin) y autorización por endpoint.

### Módulos de mantenimiento

- CRUD de procedimientos del catálogo TUPA (alta, edición, baja lógica) restringido al administrador.
- Verificación de documentos digitales por la oficina.

### Optimización y mejora del diseño

- Interfaz moderna con Tailwind (responsive, navegación móvil, estados vacíos, badges de estado, feedback de carga).
- Búsqueda instantánea de procedimientos y filtros por estado en la bandeja.

### Persistencia y despliegue

- Capa de repositorio intercambiable: **memoria** (demo/pruebas) y **PostgreSQL** (producción) con autodiseño del esquema y datos semilla.
- Notificaciones in-app automáticas + **correo opcional** (Nodemailer/Gmail) al cambiar el estado.
- Archivos de despliegue gratuito: `render.yaml` (backend), `frontend/vercel.json`, `.env.example`.
- Guía de despliegue en `docs/despliegue.md`.

### Pruebas de software

- 15 pruebas automatizadas cubriendo auth, roles, ciclo de vida de solicitudes, notificaciones, reportes y exportación CSV.

### Documentación final

- `docs/manual_usuario.md` — guía por rol (estudiante, oficina, administrador).
- `docs/manual_tecnico.md` — arquitectura, modelo de datos, API, seguridad, decisiones técnicas.
- `README.md` — ejecución local, cuentas demo, estructura.

### Pendientes operativos (requieren cuentas externas)

- [ ] Crear cuenta en Neon, ejecutar `database/schema.sql` y definir `DATABASE_URL` (pasos en `docs/despliegue.md`).
- [ ] Desplegar backend en Render y frontend en Vercel desde GitHub.
- [ ] Completar nombres de integrantes en `01_Plan_Proyecto/Plan_Proyecto_TUPA_UNSAAC.md` (.docx y .md).
