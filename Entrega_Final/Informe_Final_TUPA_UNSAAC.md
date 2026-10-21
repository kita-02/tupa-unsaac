# INFORME FINAL DE PROYECTO

## Plataforma Web para la Optimización de la Gestión del TUPA de la UNSAAC

| Campo | Detalle |
|-------|---------|
| Universidad | Universidad Nacional de San Antonio Abad del Cusco |
| Programa Académico | Ingeniería Informática y de Sistemas |
| Asignatura | Desarrollo de Software I |
| Docentes responsables | Mtro. Luis Álvaro Monzón Condori — Mtro. Julio Vladimir Quispe Sota |
| Semestre | 2026 - 2 |
| Integrantes | [Nombre 1] — [Código] / [Nombre 2] — [Código] / [Nombre 3] — [Código] |
| Atributo evaluado | AG_C12 — Aplica Teoría de la Ciencia de la Computación |
| Repositorio | https://github.com/kita-02/tupa-unsaac |

---

## RESUMEN

Se desarrolló una plataforma web para optimizar la gestión del Texto Único de Procedimientos Administrativos (TUPA) de la Universidad Nacional de San Antonio Abad del Cusco. El sistema permite a los estudiantes consultar procedimientos, requisitos y costos; registrar solicitudes de trámite con carga de documentos digitales; y seguir el estado de sus solicitudes en línea con notificaciones automáticas. El personal administrativo cuenta con un panel de control para validar documentos, gestionar el catálogo de procedimientos y generar reportes y estadísticas. La solución se construyó con una arquitectura cliente-servidor (React + Node.js/Express), base de datos PostgreSQL, autenticación JWT con roles, metodología Scrum y control de versiones en GitHub. Las 15 pruebas automatizadas del backend fueron aprobadas y la aplicación fue desplegable en servicios en la nube de nivel gratuito.

**Palabras clave:** TUPA, trámites administrativos, plataforma web, UNSAAC, gestión en línea.

---

## 1. INTRODUCCIÓN

El Texto Único de Procedimientos Administrativos (TUPA) regula los procedimientos, requisitos, costos y plazos con los que la universidad atiende a su comunidad. En la UNSAAC, la gestión de estos procedimientos presenta limitaciones de accesibilidad y seguimiento que obligan a los estudiantes a acudir presencialmente de forma reiterada.

El presente informe documenta el desarrollo de una solución web que digitaliza el ciclo completo del trámite administrativo: consulta, solicitud, revisión, aprobación y entrega, con información disponible 24/7 desde cualquier dispositivo con conexión a Internet.

---

## 2. PROBLEMÁTICA

El sistema actual de gestión del TUPA presenta las siguientes limitaciones:

1. **Accesibilidad limitada**: imposibilidad de consultar requisitos o registrar solicitudes de forma remota y eficiente.
2. **Falta de seguimiento**: los usuarios no pueden verificar el estado de sus trámites de manera oportuna.
3. **Desorganización de la información**: requisitos, costos y plazos no están presentados de forma clara y estandarizada.
4. **Deficiente experiencia de usuario**: interfaz no intuitiva ni moderna.
5. **Validaciones manuales**: procesos sin soporte digital adecuado.
6. **Falta de integración entre oficinas**: las unidades responsables no comparten información del trámite.
7. **Consultas presenciales constantes**: sobrecarga administrativa y demoras en la atención.

**Consecuencias:** demoras en la atención, sobrecarga del personal, baja satisfacción de la comunidad y dificultad para obtener indicadores de gestión.

---

## 3. OBJETIVOS

### 3.1. Objetivo general

Desarrollar una plataforma web de gestión del TUPA de la UNSAAC para mejorar la administración de trámites, el acceso a la información y el seguimiento de procedimientos administrativos.

### 3.2. Objetivos específicos

| Nro. | Objetivo | Estado |
|------|----------|--------|
| 1 | Mejorar la interfaz y experiencia de usuario | Logrado |
| 2 | Facilitar la consulta de procedimientos, requisitos y costos | Logrado |
| 3 | Optimizar el registro y seguimiento de trámites | Logrado |
| 4 | Implementar notificaciones del estado de los procedimientos | Logrado |
| 5 | Mejorar la gestión y validación de documentos digitales | Logrado |
| 6 | Implementar un panel de control para las oficinas | Logrado |
| 7 | Generar reportes y estadísticas de trámites | Logrado |
| 8 | Garantizar accesibilidad y disponibilidad web | Logrado |

---

## 4. METODOLOGÍA

### 4.1. Proceso de desarrollo: Scrum

El trabajo se ejecutó con la metodología **Scrum** en sprints de una a dos semanas, con Product Owner, Scrum Master y equipo de desarrollo; artefactos (Product Backlog, Sprint Backlog, incremento) y reuniones de planning, review y retrospectiva. La Definición de Terminado exigió código revisado, probado, documentado y desplegado en el entorno de pruebas.

### 4.2. Marco de diseño de software

- **Arquitectura cliente-servidor** con API RESTful desacoplada del cliente.
- **Patrón MVC** (Modelo–Vista–Controlador) en el backend: rutas (controladores), repositorio (modelo) y respuestas JSON consumidas por el frontend (vista).
- **Principios aplicados**: separación de capas, modularidad, validación de entradas, manejo centralizado de errores, principio de mínimo privilegio (roles).

### 4.3. Control de versiones

Todo el código se gestionó en **GitHub** (https://github.com/kita-02/tupa-unsaac) con rama principal `main`, commits descriptivos por entregable y flujo colaborativo.

---

## 5. DISEÑO DE LA SOLUCIÓN

### 5.1. Arquitectura general

```
[Frontend React + Tailwind]  --HTTP/JSON + JWT-->  [Backend Express]  --SQL-->  [PostgreSQL / Memoria]
        Vercel / :5173                                 Render / :4000
```

### 5.2. Modelo de datos

La base de datos PostgreSQL contiene 7 tablas:

| Tabla | Propósito |
|-------|-----------|
| offices | Oficinas responsables del TUPA |
| users | Usuarios con rol (estudiante / oficina / administrador) |
| procedures | Procedimientos del catálogo con requisitos en JSONB |
| requests | Solicitudes de trámite con máquina de estados |
| request_documents | Documentos adjuntos y su verificación |
| request_history | Auditoría de cambios de estado |
| notifications | Alertas por usuario |

El diagrama entidad-relación completo se incluye en Anexos y en `database/diagrama_ER.md`.

### 5.3. Máquina de estados del trámite

```
Enviada → En revisión → Aprobada → Entregada
               ↓ ↑
           Observada
               ↓
           Rechazada
```

Cada transición es realizada exclusivamente por personal de oficina o administrador, genera historial de auditoría y una notificación automática al estudiante.

---

## 6. IMPLEMENTACIÓN

### 6.1. Módulos implementados

| Módulo | Funcionalidad |
|--------|---------------|
| Autenticación y usuarios | Registro de estudiantes, inicio de sesión con JWT (12 h), contraseñas con bcrypt, roles student/office/admin |
| Catálogo TUPA | Consulta pública con búsqueda por nombre/código/descripción; detalle con oficina, costo, plazo y requisitos |
| Solicitudes de trámite | Registro con motivo y carga de documentos (PDF/JPG/PNG, máx. 5 MB), código automático TRAM-YYYY-NNNN |
| Seguimiento | Línea de estado, historial completo, observaciones y documentos verificados |
| Notificaciones | Alertas in-app automáticas en cada cambio de estado; correo electrónico opcional (Nodemailer) |
| Documentos digitales | Carga, listado y verificación por la oficina responsable |
| Panel administrativo | Estadísticas de solicitudes totales, pendientes y distribución |
| Bandeja de solicitudes | Atención con filtros por estado y acciones: iniciar revisión, aprobar, rechazar, observar, entregar |
| Gestión del catálogo | CRUD de procedimientos (alta, edición, baja lógica) restringido al administrador |
| Reportes | Gráficos de solicitudes por estado, procedimiento y oficina; exportación CSV para Excel |

### 6.2. Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, React Router, Tailwind CSS 4, Recharts, Vite |
| Backend | Node.js 24, Express, JWT, bcryptjs, Multer, Nodemailer |
| Base de datos | PostgreSQL (Neon en producción) con repositorio intercambiable (memoria en demo) |
| Despliegue | Vercel (frontend), Render (backend), GitHub (código) |
| Pruebas | Jest + Supertest (15 pruebas) |

### 6.3. Seguridad

- Contraseñas hasheadas con bcrypt (8 rondas); nunca en texto plano.
- Tokens JWT con expiración de 12 horas.
- Control de acceso por rol en cada endpoint sensible.
- Whitelist de estados de trámite y validación de entradas.
- Límite de tamaño y sanitización de nombres de archivo subido.

---

## 7. PRUEBAS DE SOFTWARE

Se implementaron 15 pruebas automatizadas con Jest y Supertest sobre la API. Resultado: **15/15 aprobadas**.

| # | Caso de prueba | Resultado |
|---|----------------|-----------|
| 1 | Health check de la API | Aprobado |
| 2 | Listado público de procedimientos | Aprobado |
| 3 | Búsqueda de procedimientos | Aprobado |
| 4 | Login con credenciales inválidas (401) | Aprobado |
| 5 | Login como estudiante con token | Aprobado |
| 6 | Registro de nuevo estudiante | Aprobado |
| 7 | Crear solicitud sin autenticación (401) | Aprobado |
| 8 | Estudiante crea solicitud válida | Aprobado |
| 9 | Control de acceso: estudiantes ven solo sus solicitudes | Aprobado |
| 10 | Oficina cambia estado y genera historial/notificación | Aprobado |
| 11 | Estado inválido es rechazado (400) | Aprobado |
| 12 | Estudiante recibe notificaciones | Aprobado |
| 13 | Reportes denegados a estudiantes (403) | Aprobado |
| 14 | Estadísticas para oficina | Aprobado |
| 15 | Exportación CSV | Aprobado |

Además, el build de producción del frontend compila sin errores y el servidor de desarrollo responde correctamente los endpoints principales.

---

## 8. RESULTADOS

Se obtuvo una plataforma web funcional que cumple los ocho objetivos específicos:

- Consulta en línea del catálogo TUPA con 6 procedimientos de ejemplo y búsqueda instantánea.
- Registro de solicitudes con carga de documentos y código de trámite único.
- Seguimiento en tiempo real con línea de estado, historial y notificaciones.
- Panel administrativo con bandeja de atención, validación de documentos y gestión del catálogo.
- Reportes con gráficos y exportación CSV para la toma de decisiones.
- Interfaz moderna, adaptable a dispositivos móviles, sin costo económico (herramientas free tier: S/ 0.00).

**Entregables:** plan de proyecto, prototipo dinámico, GUIs, base de datos, aplicación completa, 15 pruebas, documentación técnica y de usuario, y despliegue en la nube.

---

## 9. CONCLUSIONES

1. La digitalización del ciclo del trámite TUPA elimina las consultas presenciales innecesarias y mejora la accesibilidad (objetivo 8 logrado: 24/7 desde cualquier dispositivo).
2. La arquitectura cliente-servidor con API REST y roles demostró ser adecuada para separar responsabilidades estudiante/oficina y garantizar la seguridad (AG_C12: fundamentos de ciencias de la computación aplicados: máquina de estados, capas, autenticación).
3. La metodología Scrum y el trabajo modular permitieron entregar incrementos funcionales verificables con pruebas automatizadas.
4. El costo económico del proyecto es nulo: toda la pila tecnológica y los servicios de despliegue utilizan licencias open source o niveles gratuitos.

---

## 10. RECOMENDACIONES

1. Conectar la base de datos PostgreSQL en la nube (Neon) para persistencia en producción.
2. Integrar el pago en línea de derechos de trámite y la descarga automática de documentos firmados.
3. Implementar envío masivo de recordatorios por correo y SMS.
4. Realizar un estudio de usabilidad con estudiantes y personal administrativo antes del despliegue institucional.
5. Evaluar la integración con el SIAG de la UNSAAC para validar el estado de matrícula automáticamente.

---

## 11. REFERENCIAS

1. Universia. (s.f.). *¿Qué es el TUPA?* Recuperado de https://universia.net
2. Scrum Guide. (2020). *The Scrum Guide*. https://scrumguides.org
3. MDN Web Docs. (2026). *React, Express y JWT*. Mozilla Foundation.
4. Universidad Nacional de San Antonio Abad del Cusco. *Texto Único de Procedimientos Administrativos*.

---

## 12. ANEXOS

- **Anexo A.** Diagrama entidad-relación: `database/diagrama_ER.md`
- **Anexo B.** Esquema SQL: `database/schema.sql`
- **Anexo C.** Manual de usuario: `docs/manual_usuario.md` (versión Word en Entrega_Final)
- **Anexo D.** Manual técnico: `docs/manual_tecnico.md`
- **Anexo E.** Prototipo dinámico: `01_Plan_Proyecto/prototipo_dinamico.html`
- **Anexo F.** Código fuente y pruebas: https://github.com/kita-02/tupa-unsaac

**Cuentas de demostración:**

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Estudiante | juan.hamann@alum.unsaac.edu.pe | estudiante123 |
| Oficina | oficina.ogr@unsaac.edu.pe | oficina123 |
| Admin | admin@unsaac.edu.pe | admin123 |

---

*Cusco, diciembre de 2026*
*[Nombres de los integrantes]*
