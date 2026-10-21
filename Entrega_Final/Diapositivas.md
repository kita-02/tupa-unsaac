# CONTENIDO PARA DIAPOSITIVAS

Copia el texto de cada diapositiva a PowerPoint, Canva o Google Slides. Sugerencia visual: fondo blanco o azul institucional UNSAAC (#1e3a8a / #4f46e5), tipografía sans-serif, capturas de pantalla reales del sistema en las diapositivas de módulos.

**Duración sugerida:** 12-15 minutos + 5 de preguntas.
**Integrantes:** Integrante A (slide 1-4 y 11-14) · Integrante B (slide 5-7, demo) · Integrante C (slide 8-10) — ajustar según su número.

---

## Slide 1 — Portada

- **Plataforma Web para la Optimización de la Gestión del TUPA de la UNSAAC**
- Desarrollo de Software I — Semestre 2026-2
- Universidad Nacional de San Antonio Abad del Cusco
- Ingeniería Informática y de Sistemas
- Integrantes: [Nombre 1], [Nombre 2], [Nombre 3]
- Docentes: Mtro. Luis Álvaro Monzón Condori, Mtro. Julio Vladimir Quispe Sota

*Nota del expositor:* saludar, presentarse y presentar al equipo (cada uno dice su nombre y módulo que lideró).

---

## Slide 2 — Problema

**Título:** ¿Qué problema resolvemos?

- Los estudiantes deben acudir **presencialmente** para consultar requisitos o verificar el estado de sus trámites.
- El sistema actual **no permite seguimiento en línea** ni notificaciones.
- Información dispersa: costos, plazos y requisitos **no claros ni centralizados**.
- Sobrecarga administrativa y demoras en las oficinas.

*Nota:* "Esto genera filas, viajes perdidos y pérdida de tiempo para toda la comunidad universitaria."

---

## Slide 3 — Solución

**Título:** Nuestra propuesta

Una **plataforma web centralizada** donde:
- El **estudiante** consulta el TUPA, registra trámites, adjunta documentos y sigue el estado 24/7.
- La **oficina** valida documentos, atiende solicitudes y ve reportes.
- Todos reciben **notificaciones automáticas**.

*Nota:* "En resumen: digitalizamos el ciclo completo del trámite administrativo."

---

## Slide 4 — Objetivos

**Título:** Objetivos

- **General:** Desarrollar una plataforma web de gestión del TUPA para mejorar la administración de trámites, el acceso a la información y el seguimiento.
- **Específicos:** mejorar UX, consulta del catálogo, registro/seguimiento, notificaciones, documentos digitales, panel administrativo, reportes y disponibilidad 24/7.

*Nota:* breve; decir "los ocho objetivos fueron logrados".

---

## Slide 5 — Metodología y arquitectura

**Título:** Cómo lo construimos

- Metodología **Scrum**: sprints, backlog, revisiones.
- **API REST** desacoplada (patrón MVC): frontend y backend independientes.
- Autenticación **JWT** con roles: estudiante, oficina, administrador.
- Control de versiones en **GitHub**.

*Nota:* "Trabajamos en módulos independientes que luego integramos, tal como pide el enunciado."

---

## Slide 6 — Base de datos

**Título:** Diseño de la base de datos

- **PostgreSQL** con 7 tablas: usuarios, oficinas, procedimientos, solicitudes, documentos, historial y notificaciones.
- Diagrama entidad-relación con integridad referencial e índices.
- Cada cambio de estado queda **auditado** en la tabla de historial.

*Nota:* mostrar captura del diagrama E-R (Anexo del informe o `database/diagrama_ER.md`).

---

## Slide 7 — Módulos del sistema

**Título:** ¿Qué incluye la plataforma?

1. Consulta pública del catálogo TUPA con búsqueda
2. Registro e inicio de sesión con roles
3. Nueva solicitud con carga de documentos
4. Seguimiento con línea de estado e historial
5. Notificaciones automáticas
6. Panel de oficina: bandeja y validación
7. Gestión del catálogo (CRUD)
8. Reportes con gráficos y exportación CSV

*Nota:* "Ocho módulos funcionales e integrados".

---

## Slide 8 — Demo en vivo (inicio)

**Título:** Demostración — Parte 1: Estudiante

- Abrir http://localhost:5173
- Buscar "constancia" en el catálogo → abrir TUPA-001
- Iniciar sesión como estudiante
- Registrar nueva solicitud con motivo y documento

*Nota:* seguir el guion de la Guía de Exposición (sección de demo). Si falla el internet, usar el prototipo HTML o videos/capturas de respaldo.

---

## Slide 9 — Demo en vivo (oficina)

**Título:** Demostración — Parte 2: Oficina

- Cerrar sesión → entrar como oficina
- Abrir Bandeja → ver la solicitud nueva
- Cambiar estado a "En revisión" y luego "Aprobada"
- Volver como estudiante: ver notificación, línea de estado y historial

*Nota:* "El ciclo completo estudiante → oficina → estudiante en menos de un minuto".

---

## Slide 10 — Reportes

**Título:** Reportes y estadísticas

- Panel con totales y pendientes.
- Gráficos: solicitudes por estado, por procedimiento y por oficina.
- **Exportación CSV** para análisis en Excel.

*Nota:* mostrar captura de la pantalla de Reportes.

---

## Slide 11 — Pruebas

**Título:** Verificación de calidad

- **15 pruebas automatizadas** (Jest + Supertest): autenticación, roles, ciclo de vida de solicitudes, notificaciones, reportes.
- Resultado: **15/15 aprobadas**.
- Build de producción sin errores.

*Nota:* mostrar terminal con `npm test` (captura o en vivo si hay tiempo).

---

## Slide 12 — Despliegue

**Título:** Disponible en la nube (gratis)

- Código en **GitHub**: https://github.com/kita-02/tupa-unsaac
- Frontend en **Vercel**, backend en **Render**, base de datos en **Neon** (tier gratuito).
- Costo total del proyecto: **S/ 0.00**

*Nota:* "Escalable y accesible 24/7 sin inversión".

---

## Slide 13 — Resultados

**Título:** Resultados

- 8/8 objetivos específicos logrados.
- Interfaz moderna y adaptable a móvil.
- Ciclo completo del trámite digitalizado.
- 15 pruebas aprobadas y documentación completa (manual de usuario, manual técnico, informe).

---

## Slide 14 — Conclusiones

**Título:** Conclusiones

1. La plataforma elimina las consultas presenciales innecesarias.
2. La arquitectura por capas con roles garantiza seguridad y claridad.
3. Scrum y la modularidad permitieron entregar incrementos verificables.
4. El proyecto es 100% gratuito y replicable en otras instituciones.

- **¡Gracias! Preguntas**

*Nota:* agradecer al jurado y dar paso a preguntas con seguridad.
