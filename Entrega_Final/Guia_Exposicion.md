# GUÍA DE EXPOSICIÓN — Plataforma TUPA UNSAAC

Guía completa para presentar el proyecto: preparación, guion, demostración en vivo y manejo de preguntas del jurado.

---

## 1. ANTES DE LA EXPOSICIÓN (checklist del día)

### 1.1. Equipo técnico

- [ ] Computadora cargada y **copia de seguridad** del proyecto en USB/Google Drive.
- [ ] Node.js instalado y dependencias verificadas:
  ```bash
  cd backend && npm install && npm test     # deben pasar 15/15
  cd frontend && npm install && npm run dev
  ```
- [ ] Backend corriendo en **http://localhost:4000** (terminal 1).
- [ ] Frontend corriendo en **http://localhost:5173** (terminal 2).
- [ ] Navegador abierto en la página de Inicio, con estas pestañas preparadas:
  1. http://localhost:5173 (demo principal)
  2. https://github.com/kita-02/tupa-unsaac (commits)
  3. `01_Plan_Proyecto/prototipo_dinamico.html` (plan B si falla todo)
  4. Capturas de respaldo en una carpeta (capturas de todas las pantallas).
- [ ] Probar la demo completa ANTES de exponer (guion de la sección 3).

### 1.2. Documentos

- [ ] Plan de Proyecto (Word) con nombres completados.
- [ ] Informe final (Word) con nombres completados.
- [ ] Diapositivas en la USB y en Google Drive (por si el proyector falla).
- [ ] Manual de usuario (Word).

### 1.3. Presentación personal

- [ ] Cada integrante sabe SU parte del guion (sección 2).
- [ ] Ensayar al menos 2 veces con cronómetro (meta: 12-15 min).
- [ ] Vestimenta presentable, llegar 20 minutos antes.

---

## 2. GUIÓN MINUTO A MINUTO (equipo de 3; para 2, fusionar roles)

| Min | Diapositiva | Expositor | Qué dice/hace |
|-----|-------------|-----------|---------------|
| 0:00 | 1 Portada | Todos | "Buenos días. Somos [nombres], del curso de Desarrollo de Software I. Presentamos la Plataforma Web para la Gestión del TUPA de la UNSAAC." |
| 0:45 | 2 Problema | Integrante A | Expone los 4 puntos del problema. Cierra con: "Esto obliga a viajes y filas innecesarias." |
| 1:30 | 3 Solución | Integrante A | "Digitalizamos el ciclo completo: consulta, solicitud, seguimiento y reportes." |
| 2:00 | 4 Objetivos | Integrante A | "Cumplimos los 8 objetivos del enunciado." |
| 2:30 | 5 Metodología | Integrante B | Scrum, API REST, MVC, roles JWT, GitHub. |
| 3:30 | 6 Base de datos | Integrante B | 7 tablas PostgreSQL, historial de auditoría. |
| 4:15 | 7 Módulos | Integrante B | Lista los 8 módulos brevemente. |
| 5:00 | 8-9 DEMO | Integrante B (maneja) + C (narra) | Demo en vivo (ver guion sección 3): estudiante → oficina → seguimiento. ~4 min. |
| 9:00 | 10 Reportes | Integrante C | Gráficos y export CSV. |
| 9:45 | 11 Pruebas | Integrante C | "15 pruebas automatizadas, todas aprobadas." |
| 10:30 | 12 Despliegue | Integrante C | GitHub público, Vercel/Render/Neon gratis. |
| 11:15 | 13 Resultados | Integrante C | 8/8 objetivos, interfaz moderna, costo S/ 0.00. |
| 12:00 | 14 Conclusiones | Todos | Cada uno dice una conclusión. "Muchas gracias, quedamos atentos a sus preguntas." |

**Reglas:**
- Mirar al jurado, no a la pantalla.
- Hablar claro y con seguridad; si algo falla en la demo, continuar con el plan B sin disculparse de más.
- El integrante que no habla apoya en silencio (no celular).

---

## 3. GUIÓN DE LA DEMO EN VIVO (4 minutos)

**Narrador (Integrante C):** explica qué se hace. **Operador (Integrante B):** maneja el mouse.

### Paso 1 — Consulta pública (40 s)
1. En la página de Inicio, escribir "**constancia**" en el buscador → Buscar.
2. "El catálogo muestra los procedimientos que coinciden con la búsqueda."
3. Abrir **TUPA-001 Constancia de Estudios**: "vemos oficina responsable, costo, plazo y los tres requisitos."

### Paso 2 — Estudiante (1 min 20 s)
4. Botón **Iniciar este trámite** (si no hay sesión, el sistema pide login).
5. Iniciar sesión como estudiante: `juan.hamann@alum.unsaac.edu.pe` / `estudiante123`.
6. En el formulario escribir motivo: "Trámite de prácticas preprofesionales" → adjuntar un PDF cualquiera → **Enviar solicitud**.
7. "El sistema generó el código **TRAM-2026-000X** y la solicitud quedó como ENVIADA."
8. Ir a **Mis trámites** → abrir la solicitud: mostrar línea de estado e historial.

### Paso 3 — Oficina (1 min 20 s)
9. Cerrar sesión → Iniciar sesión como oficina: `oficina.ogr@unsaac.edu.pe` / `oficina123`.
10. Ir a **Panel → Bandeja de solicitudes**: "aquí el personal ve todas las solicitudes con filtros."
11. Abrir la solicitud recién creada → botón **Iniciar revisión** → luego **Aprobar**.
12. "Cada acción genera historial y una **notificación** automática."

### Paso 4 — Notificación y reportes (40 s)
13. Cerrar sesión → volver como estudiante → abrir **Notificaciones**: "ahí está el aviso de aprobación."
14. Entrar como oficina/admin → **Reportes**: mostrar gráfico de estados y **Exportar CSV**.
15. "Esto es lo que una oficina necesita para tomar decisiones."

### Plan B si algo falla
- Si el servidor no responde: usar **prototipo dinámico** (`prototipo_dinamico.html`) que simula todos los flujos con clics.
- Si el navegador falla: mostrar **capturas** de la carpeta de respaldo.
- Frase de transición: "Permítanme mostrarles la funcionalidad con nuestro prototipo interactivo / estas capturas del sistema funcionando."

---

## 4. PREGUNTAS DEL JURADO Y RESPUESTAS

**Tecnología**
1. **¿Por qué eligieron React y Node.js?** → "Son tecnologías modernas, con gran comunidad y documentación; React para una interfaz reactiva y Node/Express para una API REST ligera y en el mismo lenguaje (JavaScript), lo que simplifica el desarrollo en equipo."
2. **¿Por qué una API REST y no un monolito?** → "La separación permite escalar frontend y backend por separado, reutilizar la API desde una futura app móvil y probarla automáticamente con Supertest."
3. **¿Por qué PostgreSQL?** → "Es una base de datos robusta y gratuita; sus JSONB nos permiten guardar requisitos flexibles por procedimiento."
4. **¿Qué pasa si no hay conexión a la base de datos?** → "El sistema cuenta con un modo de demostración en memoria y, en producción, se conecta a PostgreSQL en la nube (Neon) con reintento automático."

**Seguridad**
5. **¿Cómo protegen los datos de los usuarios?** → "Contraseñas con bcrypt (nunca en texto plano), tokens JWT con expiración de 12 horas y control de acceso por rol en cada endpoint."
6. **¿Puede un estudiante ver trámites de otro?** → "No; el endpoint filtra por el usuario del token y lo cubrimos con la prueba 'estudiante ve solo sus solicitudes'."
7. **¿Quién puede cambiar el estado de un trámite?** → "Solo personal de oficina y administradores; los estados tienen una lista permitida validada en el servidor."

**Proceso y calidad**
8. **¿Qué metodología usaron y cómo les fue?** → "Scrum con sprints; nos permitió entregar incrementos verificables y priorizar el backlog según el enunciado."
9. **¿Cómo probaron el sistema?** → "15 pruebas automatizadas con Jest y Supertest sobre el ciclo completo: auth, roles, solicitudes, notificaciones y reportes; todas aprobadas."
10. **¿Cómo controlaron el código?** → "Git con rama main, commits descriptivos por entregable y repositorio público en GitHub: kita-02/tupa-unsaac."
11. **¿Cuál fue la mayor dificultad y cómo la resolvieron?** → "Coordinar la integración de módulos; la resolvimos definiendo la API por adelantado y trabajando en ramas independientes."

**Producto y futuro**
12. **¿Cuánto cuesta implementarlo en la universidad?** → "El desarrollo con estas herramientas es gratuito (S/ 0.00); en producción solo implicaría hosting y dominio, con planes que arrancan en decenas de soles al mes."
13. **¿Qué diferencia tiene con el sistema actual?** → "Actualmente no hay seguimiento en línea ni notificaciones; nosotros centralizamos consulta, solicitud, seguimiento y reportes en una sola plataforma accesible 24/7."
14. **¿Qué mejorarían a futuro?** → "Pagos en línea, integración con el SIAG para validar matrícula, descarga de documentos firmados y notificaciones por SMS."
15. **¿El sistema es escalable?** → "Sí: la API sin estado permite añadir más instancias del backend y migrar a base de datos gestionada sin cambiar el código."

**Consejo para responder:** escuchar la pregunta completa, responder en 30-60 segundos, mirar al jurado y si no saben algo, decir honestamente "no lo contemplamos en esta fase, pero sería..." en lugar de inventar.

---

## 5. DESPUÉS DE EXPOSICIÓN

- Entregar (impreso o por correo según indique el docente): Plan de Proyecto, Informe final, Manual de usuario y enlace al repositorio.
- Subir el video o evidencias si el docente lo solicita.
- Actualizar el repo con los últimos ajustes (`git push`).
