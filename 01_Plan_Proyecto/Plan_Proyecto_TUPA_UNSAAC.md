# PLAN DE PROYECTO

## Plataforma Web para la Optimización de la Gestión del TUPA de la UNSAAC

---

## 1. CARÁTULA

| Campo | Detalle |
|-------|---------|
| **Universidad** | Universidad Nacional de San Antonio Abad del Cusco |
| **Programa Académico** | Ingeniería Informática y de Sistemas |
| **Asignatura** | Desarrollo de Software I |
| **Docentes responsables** | Mtro. Luis Álvaro Monzón Condori — Mtro. Julio Vladimir Quispe Sota |
| **Proyecto** | Plataforma Web para la Optimización de la Gestión del TUPA de la UNSAAC |
| **Semestre académico** | 2026 - 2 |
| **Entrega** | Entrega Semestral Nro. 01 — Plan de Proyecto |
| **Integrantes** | [Nombre 1] — [Código] / [Nombre 2] — [Código] / [Nombre 3] — [Código] |
| **Fecha de entrega** | 27 de octubre de 2026 |
| **Atributo a medir** | AG_C12 — Aplica Teoría de la Ciencia de la Computación |

---

## 2. PRESENTACIÓN

El presente plan de proyecto describe la formulación y planificación del desarrollo de una **Plataforma Web para la Optimización de la Gestión del TUPA de la UNSAAC**, solución propuesta por el equipo de trabajo para la asignatura Desarrollo de Software I del semestre 2026-2.

El Texto Único de Procedimientos Administrativos (TUPA) de la Universidad Nacional de San Antonio Abad del Cusco define los procedimientos, requisitos, costos y plazos que rigen la atención a la comunidad universitaria. Actualmente, la gestión de dichos procedimientos presenta limitaciones de accesibilidad, seguimiento, organización y experiencia de usuario, lo que genera demoras, confusión y sobrecarga administrativa.

La solución propuesta es una plataforma web moderna, intuitiva y centralizada que permite a los estudiantes y al personal administrativo consultar procedimientos, registrar solicitudes digitales, dar seguimiento al estado de sus trámites en línea y recibir notificaciones, además de contar con un panel de control para las oficinas administrativas con reportes y estadísticas.

Este documento establece el ámbito de aplicación, la problemática, los objetivos, la metodología de trabajo (Scrum), las actividades, la infraestructura, los recursos, el cronograma, el presupuesto, los participantes y el prototipado de la solución.

---

## 3. ÁMBITO DE APLICACIÓN O INFLUENCIA

### 3.1. Ámbito funcional

La plataforma abarca la gestión digital de los procedimientos administrativos definidos en el TUPA de la UNSAAC, incluyendo:

- **Consulta pública del catálogo TUPA**: procedimientos, requisitos, costos, plazos y unidades responsables.
- **Registro de solicitudes digitales**: inicio en línea de trámites con carga de documentos.
- **Seguimiento de trámites**: consulta del estado y historial de cada solicitud.
- **Notificaciones**: alertas sobre cambios de estado de los procedimientos.
- **Gestión y validación de documentos digitales**: carga, revisión y validación por parte de las oficinas.
- **Panel administrativo**: módulo de trabajo para el personal de las oficinas responsables.
- **Reportes y estadísticas**: métricas de trámites procesados para la toma de decisiones.

### 3.2. Ámbito de influencia (usuarios)

| Usuario | Descripción |
|---------|-------------|
| Estudiantes de la UNSAAC | Consultan requisitos, registran solicitudes y dan seguimiento a sus trámites |
| Personal administrativo | Validan documentos, procesan solicitudes y emiten respuestas |
| Oficinas del TUPA | Gestionan sus procedimientos, generan reportes y estadísticas |
| Comunidad universitaria | Accede a la información pública del TUPA desde cualquier dispositivo |

### 3.3. Ámbito institucional y geográfico

La plataforma está dirigida a la **UNSAAC** (sede Cusco), con influencia potencial en las facultades y oficinas administrativas que intervienen en los procedimientos del TUPA. Al ser una plataforma web, su acceso es **24/7 desde cualquier lugar con conexión a Internet**, superando la restricción de la atención presencial.

### 3.4. Ámbito temporal

El desarrollo del proyecto se ejecuta durante el **semestre académico 2026-2**, con entregas parciales el **27 de octubre de 2026** (Plan de Proyecto y GUIs) y la entrega final de la aplicación en la segunda unidad (fecha por definir).

---

## 4. DESCRIPCIÓN DE LA PROBLEMÁTICA

### 4.1. Situación actual

La UNSAAC cuenta con un sistema para la gestión de procedimientos administrativos del TUPA. Sin embargo, dicho sistema presenta limitaciones en cuanto a **accesibilidad, seguimiento de trámites, organización de la información y experiencia de usuario**, lo que dificulta una gestión eficiente tanto para los estudiantes como para el personal administrativo.

### 4.2. Problemas identificados

1. **Accesibilidad limitada**: los usuarios no pueden consultar requisitos ni registrar solicitudes de forma remota y eficiente.
2. **Falta de seguimiento**: los usuarios no pueden verificar el estado de sus trámites de manera oportuna, lo que genera incertidumbre.
3. **Desorganización de la información**: los requisitos, costos y plazos no están presentados de forma clara y estandarizada.
4. **Deficiente experiencia de usuario**: la interfaz actual no es intuitiva ni moderna.
5. **Validaciones manuales**: algunos procesos administrativos aún requieren validaciones manuales sin soporte digital adecuado.
6. **Falta de integración entre oficinas**: no existe una integración adecuada entre las distintas unidades responsables de los procedimientos.
7. **Consultas presenciales constantes**: los usuarios acuden de manera recurrente a las oficinas para consultar información que debería estar disponible en línea.

### 4.3. Consecuencias

- Demoras en la atención a la comunidad universitaria.
- Sobrecarga administrativa del personal de las oficinas.
- Experiencia poco eficiente para estudiantes y personal.
- Dificultad para obtener indicadores y estadísticas de gestión.

### 4.4. Solución propuesta

Desarrollar una **plataforma web moderna, intuitiva y centralizada** que optimice la gestión del TUPA de la UNSAAC, permitiendo la consulta de procedimientos, el registro y seguimiento digital de trámites, las notificaciones de estado, la gestión validada de documentos y la generación de reportes para las oficinas administrativas.

---

## 5. OBJETIVOS DE LA PROPUESTA

### 5.1. Objetivo general

Desarrollar una plataforma web de gestión del TUPA de la UNSAAC para mejorar la administración de trámites, el acceso a la información y el seguimiento de procedimientos administrativos.

### 5.2. Objetivos específicos

| Nro. | Objetivo específico |
|------|---------------------|
| 1 | Mejorar la interfaz y experiencia de usuario de la plataforma actual |
| 2 | Facilitar la consulta de procedimientos, requisitos y costos del TUPA |
| 3 | Optimizar el registro y seguimiento de trámites administrativos |
| 4 | Implementar notificaciones sobre el estado de los procedimientos |
| 5 | Mejorar la gestión y validación de documentos digitales |
| 6 | Implementar un panel de control más eficiente para las oficinas administrativas |
| 7 | Generar reportes y estadísticas de trámites procesados |
| 8 | Garantizar accesibilidad y disponibilidad de la plataforma web |

---

## 6. METODOLOGÍA

### 6.1. Metodología de desarrollo: Scrum

El equipo utilizará la metodología **Scrum** (marco ágil), complementada con prácticas de ingeniería de software:

- **Sprints** de 1 a 2 semanas con objetivos claros.
- **Roles**: Product Owner ([Nombre]), Scrum Master ([Nombre]), Equipo de desarrollo (todos).
- **Artefactos**: Product Backlog, Sprint Backlog, Incremento funcional.
- **Reuniones**: Daily (breve, sincrónica o por chat), Sprint Planning, Sprint Review (demo), Retrospectiva.
- **Definición de Terminado (DoD)**: código revisado, probado, documentado y desplegado en el entorno de pruebas.

### 6.2. Marco de trabajo tecnológico (patrón de diseño de software)

- **Arquitectura**: aplicación web **client–server** con API RESTful.
- **Patrón**: **MVC (Modelo–Vista–Controlador)** en el backend para una arquitectura consistente y modular.
- **Principios**: separación de capas, modularidad, validación de entradas, manejo centralizado de errores, seguridad (autenticación JWT, protección de rutas por rol).

### 6.3. Actividades principales

| Actividad | Descripción |
|-----------|-------------|
| Investigación y planificación | Investigar plataformas similares (trámites en línea de otras universidades) y definir requerimientos funcionales y no funcionales |
| Levantamiento de requerimientos | Entrevistas/documentación sobre el TUPA: procedimientos, requisitos, flujos y roles |
| Diseño de GUIs | Creación de interfaces en Figma y desarrollo de los componentes de interfaz |
| Diseño de base de datos | Modelamiento entidad-relación, esquema y migraciones |
| Desarrollo por módulos | Implementación modular: autenticación, catálogo TUPA, solicitudes, seguimiento, panel administrativo, reportes |
| Integración de módulos | Unificación de módulos independientes en el sistema completo |
| Pruebas de software | Pruebas unitarias, de integración y funcionales según especificaciones |
| Despliegue | Publicación de la aplicación en servidor en la nube (Render + Vercel) |
| Documentación | Documentación técnica y de usuario, registro del avance en Git |
| Demostración final | Presentación funcional de la plataforma desarrollada |

### 6.4. Infraestructura y recursos

| Recurso | Detalle | Costo |
|---------|---------|-------|
| Hardware | Computadoras personales de los integrantes, mínimo 8 GB RAM | S/ 0.00 (ya disponibles) |
| Conexión a Internet | Para desarrollo, Git y despliegue | Variable (ya disponible) |
| Repositorio | **GitHub** — control de versiones y flujo colaborativo | Gratis |
| Frontend (hosting) | **Vercel** — despliegue continuo desde GitHub | Gratis |
| Backend (hosting) | **Render** (free tier) — API RESTful en la nube | Gratis |
| Base de datos | **Neon PostgreSQL** (free tier) o **Supabase** | Gratis |
| Autenticación | JWT + bcrypt (implementación propia) | Gratis |
| Almacenamiento de documentos | **Cloudinary** (free tier) | Gratis |
| Correo de notificaciones | **Nodemailer** con cuenta Gmail | Gratis |
| Diseño y prototipado | **Figma** (plan gratuito) | Gratis |
| Gestión ágil | **GitHub Projects** / Trello | Gratis |
| Pruebas de API | **Postman** / Thunder Client (VS Code) | Gratis |
| Documentación | Markdown, Draw.io / Mermaid para diagramas | Gratis |
| Lenguajes y frameworks | JavaScript (Node.js, Express, React, Tailwind CSS), PostgreSQL | Gratis (open source) |

### 6.5. Evaluación y monitoreo

| Mecanismo | Descripción |
|-----------|-------------|
| Tablero Kanban en GitHub Projects | Seguimiento de tareas: Pendiente → En progreso → En revisión → Terminado |
| Sprint Review | Demostración funcional al cierre de cada sprint |
| Retrospectiva | Identificación de mejoras de proceso al final de cada sprint |
| Pruebas automatizadas | Suites de pruebas ejecutadas antes de cada integración |
| Registro en Git | Commits frecuentes y descriptivos; revisiones mediante Pull Requests |
| Revisión docente | Presentación de avances en las entregas parciales (27-10-2026) |

**Indicadores de avance:**
- % de objetivos específicos cubiertos por módulo.
- % de pruebas aprobadas.
- Cumplimiento del cronograma por sprint.
- Cantidad de funcionalidades integradas y documentadas.

### 6.6. Resultados esperados

1. Una **plataforma web funcional** para la consulta, registro, seguimiento y gestión del TUPA de la UNSAAC.
2. **Interfaces modernas e intuitivas** para estudiantes y personal administrativo.
3. Una **base de datos diseñada** que centralice procedimientos, solicitudes, documentos y usuarios.
4. Un **sistema de notificaciones** que informe a los usuarios sobre el estado de sus trámites.
5. Un **panel administrativo** con validación de documentos y gestión de procedimientos.
6. **Reportes y estadísticas** de trámites procesados para las oficinas.
7. La aplicación **desplegada en un servidor en la nube**, accesible 24/7.
8. **Documentación técnica y de usuario** completa del proyecto.
9. Repositorio en **GitHub** con control de versiones y flujo colaborativo.

---

## 7. PARTICIPANTES

### 7.1. Equipo interno

| Rol | Nombre | Función |
|-----|--------|---------|
| Desarrollador / Product Owner | [Nombre 1] | Frontend, requerimientos, priorización del backlog |
| Desarrollador / Scrum Master | [Nombre 2] | Backend, proceso ágil, integración |
| Desarrollador | [Nombre 3] | Base de datos, pruebas, documentación |

*(Completar con nombres y códigos de los integrantes; eliminar filas sobrantes según el número de integrantes: 2 a 3 alumnos)*

### 7.2. Equipo externo

| Colaborador | Vínculo | Aporte |
|-------------|---------|--------|
| Mtro. Luis Álvaro Monzón Condori | Docente responsable | Asesoramiento académico y evaluación |
| Mtro. Julio Vladimir Quispe Sota | Docente responsable | Asesoramiento académico y evaluación |
| [Representante del TUPA / oficina] | Personal administrativo UNSAAC | Validación de requerimientos y flujos del TUPA |
| [Compañero externo, opcional] | Colaborador externo | Revisión de pruebas o apoyo en diseño |

---

## 8. ASPECTOS ADMINISTRATIVOS

- **Duración**: Semestre académico 2026-2.
- **Entregas parciales**: 27 de octubre de 2026 (Plan de Proyecto e Implementación de GUIs).
- **Entrega final**: Segunda unidad (fecha por definir) — desarrollo completo, despliegue, pruebas y documentación final.
- **Presupuesto**: S/ 0.00 — el proyecto utiliza exclusivamente herramientas y servicios de nivel gratuito (free tier), equipo personal de los integrantes e infraestructura existente.
- **Propiedad intelectual**: el código fuente desarrollado pertenece al equipo de trabajo y a la UNSAAC con fines académicos; se publicará en un repositorio de GitHub.
- **Control de versiones**: todo el código será gestionado en **GitHub** con flujo colaborativo (ramas feature/*, revisión mediante Pull Requests, integración a main).
- **Reuniones de coordinación**: semanales (presencial o remota) más daily breve durante los sprints.
- **Riesgos administrativos**: disponibilidad de los integrantes, cambios de requerimientos y restricciones de los tiers gratuitos; se mitigarán con planificación por sprints y alternativas de herramientas.

---

## 9. CRONOGRAMA

### 9.1. Cronograma por entregas (según enunciado)

| Entrega | Descripción | Fecha |
|---------|-------------|-------|
| Entrega Semestral Nro. 01 | Plan de Proyecto | 27-10-2026 |
| Entrega Semestral Nro. 02 | Implementación de las GUIs, diseño de BD, Git, documentación de avance | 27-10-2026 |
| Entrega Semestral Nro. 03 | Desarrollo de la aplicación, pruebas, despliegue en la nube, documentación final | Por definir |

### 9.2. Cronograma de actividades (Sprints Scrum)

| Sprint | Periodo | Actividades principales | Resultado |
|--------|---------|------------------------|-----------|
| Sprint 0 | 20 al 27 oct 2026 | Investigación, formulación del plan de proyecto, configuración de GitHub y herramientas | Plan de Proyecto entregado; entorno configurado |
| Sprint 1 | 27 oct al 03 nov 2026 | Diseño de GUIs en Figma, diseño de la base de datos (modelo E-R), estructura del proyecto | GUIs y modelo de BD entregados (Entrega 02) |
| Sprint 2 | 03 al 10 nov 2026 | Módulo de autenticación y usuarios; catálogo TUPA (consulta de procedimientos) | API y frontend de auth + catálogo funcionales |
| Sprint 3 | 10 al 17 nov 2026 | Registro de solicitudes, carga de documentos, seguimiento de trámites | Flujo completo de solicitud y seguimiento |
| Sprint 4 | 17 al 24 nov 2026 | Notificaciones, panel administrativo, validación de documentos | Módulos de oficina integrados |
| Sprint 5 | 24 nov al 01 dic 2026 | Reportes y estadísticas, pulido de UX, optimización y mejora del diseño | Funcionalidad completa |
| Sprint 6 | 01 al 08 dic 2026 | Pruebas, corrección de errores, despliegue en la nube, documentación final | Sistema desplegado y documentado (Entrega 03) |
| Demo final | 08 dic 2026 | Demostración funcional de la plataforma | Presentación final |

> *Nota: los periodos de los sprints 3 a 6 son estimados y se ajustarán según la fecha definitiva de la Entrega 03.*

---

## 10. PRESUPUESTO

| Rubro | Descripción | Costo |
|-------|-------------|-------|
| Hardware | Computadoras personales de los integrantes | S/ 0.00 |
| Internet | Conexión existente de los integrantes | S/ 0.00 |
| Hosting frontend | Vercel (free tier) | S/ 0.00 |
| Hosting backend | Render (free tier) | S/ 0.00 |
| Base de datos | Neon PostgreSQL / Supabase (free tier) | S/ 0.00 |
| Almacenamiento de archivos | Cloudinary (free tier) | S/ 0.00 |
| Correo electrónico | Cuenta Gmail para notificaciones | S/ 0.00 |
| Herramientas de desarrollo | VS Code, Node.js, React, Tailwind, Postman | S/ 0.00 |
| Control de versiones | GitHub | S/ 0.00 |
| Diseño y prototipado | Figma (plan gratuito) | S/ 0.00 |
| **TOTAL** | | **S/ 0.00** |

*El proyecto no requiere inversión económica; se aprovechan herramientas open source y servicios con nivel gratuito, adecuados para el alcance académico.*

---

## 11. PROTOTIPADO

### 11.1. Prototipado estático

Se realizará el diseño de baja y alta fidelidad de las interfaces principales en **Figma**:

- Pantalla de inicio / portal público del TUPA.
- Registro e inicio de sesión.
- Catálogo de procedimientos (búsqueda, filtros, detalle con requisitos y costos).
- Formulario de solicitud de trámite con carga de documentos.
- Panel del estudiante (mis trámites, seguimiento, notificaciones).
- Panel administrativo (bandeja de solicitudes, validación, gestión de procedimientos).
- Reportes y estadísticas (tablas y gráficos).

### 11.2. Prototipado dinámico

En Figma se habilitará la **presentación interactiva (modo Presentación)** que simula la navegación real entre pantallas mediante enlaces e interacciones:

- Flujo público: Inicio → Catálogo → Detalle de procedimiento → Iniciar sesión.
- Flujo estudiante: Iniciar sesión → Nueva solicitud → Cargar documentos → Enviar → Seguimiento → Recibir notificación.
- Flujo administrativo: Iniciar sesión → Bandeja de solicitudes → Revisar documentos → Validar/Rechazar → Registrar resolución → Ver reportes.

Este prototipo dinámico permitirá validar la experiencia de usuario y los flujos con los usuarios (estudiantes y personal) **antes de la implementación**, y servirá como guía visual para el desarrollo de las GUIs en la Entrega 02.

*El enlace al prototipo dinámico de Figma se incluirá en la presentación de la Entrega 01: [enlace Figma]*

---

*Documento elaborado por el equipo de trabajo — [Nombres de los integrantes]*
*Desarrollo de Software I — Semestre 2026-2 — UNSAAC*
