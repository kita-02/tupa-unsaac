import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false } });
const q = (text, params) => pool.query(text, params);

export const pgRepo = {
  kind: "postgresql",
  init: async () => {
    await q(`CREATE TABLE IF NOT EXISTS offices (id SERIAL PRIMARY KEY, name VARCHAR(150) NOT NULL, floor VARCHAR(50), schedule VARCHAR(100) DEFAULT 'Lun a Vie 8:00 - 17:00', created_at TIMESTAMP DEFAULT NOW())`);
    await q(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, code VARCHAR(20) UNIQUE, full_name VARCHAR(150) NOT NULL, email VARCHAR(150) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, role VARCHAR(20) NOT NULL, office_id INTEGER REFERENCES offices(id), created_at TIMESTAMP DEFAULT NOW())`);
    await q(`CREATE TABLE IF NOT EXISTS procedures (id SERIAL PRIMARY KEY, code VARCHAR(20) UNIQUE NOT NULL, name VARCHAR(200) NOT NULL, description TEXT, office_id INTEGER REFERENCES offices(id), requirements JSONB NOT NULL DEFAULT '[]', cost NUMERIC(10,2) DEFAULT 0, duration_days INTEGER DEFAULT 5, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW())`);
    await q(`CREATE TABLE IF NOT EXISTS requests (id SERIAL PRIMARY KEY, code VARCHAR(30) UNIQUE NOT NULL, user_id INTEGER NOT NULL REFERENCES users(id), procedure_id INTEGER NOT NULL REFERENCES procedures(id), state VARCHAR(20) NOT NULL DEFAULT 'submitted', data JSONB DEFAULT '{}', observations TEXT, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW())`);
    await q(`CREATE TABLE IF NOT EXISTS request_documents (id SERIAL PRIMARY KEY, request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE, doc_name VARCHAR(150) NOT NULL, file_path VARCHAR(300) NOT NULL, file_size INTEGER, verified BOOLEAN DEFAULT FALSE, verified_by INTEGER REFERENCES users(id), created_at TIMESTAMP DEFAULT NOW())`);
    await q(`CREATE TABLE IF NOT EXISTS request_history (id SERIAL PRIMARY KEY, request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE, from_state VARCHAR(20), to_state VARCHAR(20) NOT NULL, changed_by INTEGER REFERENCES users(id), comment TEXT, created_at TIMESTAMP DEFAULT NOW())`);
    await q(`CREATE TABLE IF NOT EXISTS notifications (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, request_id INTEGER REFERENCES requests(id) ON DELETE CASCADE, title VARCHAR(200) NOT NULL, message TEXT NOT NULL, is_read BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT NOW())`);
    await q(`CREATE INDEX IF NOT EXISTS idx_requests_user ON requests(user_id)`);
    await q(`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)`);

    const offices = (await q(`SELECT COUNT(*)::int AS n FROM offices`)).rows[0].n;
    if (offices === 0) {
      const { default: bcrypt } = await import("bcryptjs");
      const hash = (p) => bcrypt.hashSync(p, 8);
      const o = await q(`INSERT INTO offices (name, floor, schedule) VALUES ($1,$2,$3),($4,$5,$6),($7,$8,$9),($10,$11,$12) RETURNING id`, [
        "Oficina General de Registros (OGR)", "Planta Baja - Administrativo", "Lun a Vie 8:00 - 17:00",
        "Dirección de Admisión y Promoción (DAP)", "Segundo Piso - Administrativo", "Lun a Vie 8:30 - 16:30",
        "Dirección de Asuntos Económicos (DAE)", "Primer Piso - Financiero", "Lun a Vie 8:00 - 16:00",
        "Unidad de Bienestar Estudiantil", "Casa Estudiantil", "Lun a Vie 8:00 - 17:00",
      ]);
      const ids = o.rows.map((r) => r.id);
      await q(`INSERT INTO users (code, full_name, email, password_hash, role, office_id) VALUES ($1,$2,$3,$4,$5,NULL),($6,$7,$8,$9,$10,$11),($12,$13,$14,$15,$16,NULL)`, [
        "20231234", "Administrador del Sistema", "admin@unsaac.edu.pe", hash("admin123"), "admin",
        "19870001", "María Quispe Mamani", "oficina.ogr@unsaac.edu.pe", hash("oficina123"), "office", ids[0],
        "70985432", "Juan Carlos Huamán Ccahuana", "juan.hamann@alum.unsaac.edu.pe", hash("estudiante123"), "student",
      ]);
      const p = await q(`INSERT INTO procedures (code, name, description, office_id, requirements, cost, duration_days) VALUES
        ($1,$2,$3,$4,$5,0,2),($6,$7,$8,$9,$10,15,3),($11,$12,$13,$14,$15,0,10),($16,$17,$18,$19,$20,50,15),($21,$22,$23,$24,$25,10,2),($26,$27,$28,$29,$30,120,20) RETURNING id`, [
        "TUPA-001", "Constancia de Estudios", "Documento que acredita que el estudiante se encuentra matriculado en el periodo académico vigente.", ids[0], JSON.stringify(["Solicitud dirigida al Decano (formato OGR-01)", "Carné de identidad universitario (copia)", "Boleta de pago por derecho de constancia (si aplica)"]),
        "TUPA-002", "Certificado de Notas", "Documento que detalla las calificaciones obtenidas por el estudiante.", ids[0], JSON.stringify(["Solicitud dirigida al Decano (formato OGR-02)", "Carné de identidad universitario (copia)", "Comprobante de pago (Banco de la Nación)", "Libreta digital descargada del SIAG"]),
        "TUPA-003", "Solicitud de Beca 18", "Registro y renovación de la beca de excelencia académica Beca 18.", ids[3], JSON.stringify(["Formulario de renovación Beca 18 (firmado)", "Certificado de notas del periodo anterior", "Declaración jurada de no tener otra beca", "Carné de identidad (copia)"]),
        "TUPA-004", "Reingreso a la Universidad", "Trámite para estudiantes que interrumpieron sus estudios y desean reactivar su matrícula.", ids[1], JSON.stringify(["Carta de reingreso dirigida al Director de Facultad", "Certificado de notas original", "Informe de la Comisión de Becas (si aplica)", "Comprobante de pago de derechos"]),
        "TUPA-005", "Constancia de No Adeudo", "Documento que certifica que el estudiante no registra deudas con la institución.", ids[2], JSON.stringify(["Solicitud (formato DAE-03)", "Carné de identidad universitario (copia)"]),
        "TUPA-006", "Cambio de Carrera", "Trámite de traslado interno de carrera dentro de la UNSAAC.", ids[1], JSON.stringify(["Solicitud de cambio de carrera", "Certificado de notas (promedio mínimo 14)", "Informe psicológico", "Formato DAP-10"]),
      ]);
      const students = (await q(`SELECT id FROM users WHERE role='student'`)).rows;
      const prs = p.rows;
      const r1 = await q(`INSERT INTO requests (code, user_id, procedure_id, state, data, observations, created_at, updated_at) VALUES ($1,$2,$3,'approved',$4,$5,'2026-10-10','2026-10-12') RETURNING id`, ["TRAM-2026-0001", students[0].id, prs[0].id, JSON.stringify({ motivo: "Trámite de prácticas preprofesionales" }), "Requisitos completos."]);
      await q(`INSERT INTO requests (code, user_id, procedure_id, state, data, created_at, updated_at) VALUES ($1,$2,$3,'under_review',$4,'2026-10-15','2026-10-16')`, ["TRAM-2026-0002", students[0].id, prs[1].id, JSON.stringify({ motivo: "Postulación a programa de intercambio" })]);
      await q(`INSERT INTO notifications (user_id, request_id, title, message, created_at) VALUES ($1,$2,$3,$4,'2026-10-12'),($1,$5,$6,$7,'2026-10-16')`, [
        students[0].id, r1.rows[0].id, "Solicitud aprobada", "Su solicitud TRAM-2026-0001 (Constancia de Estudios) fue APROBADA.",
        r1.rows[0].id + 1, "Trámite en revisión", "Su solicitud TRAM-2026-0002 (Certificado de Notas) está en revisión.",
      ]);
      console.log("[pg] Base de datos inicializada con datos semilla.");
    }
  },
  offices: {
    list: async () => (await q(`SELECT * FROM offices ORDER BY id`)).rows,
    name: async (id) => (await q(`SELECT name FROM offices WHERE id=$1`, [id])).rows[0]?.name ?? null,
  },
  users: {
    findByEmail: async (email) => (await q(`SELECT * FROM users WHERE lower(email)=lower($1)`, [email])).rows[0] || null,
    findById: async (id) => (await q(`SELECT * FROM users WHERE id=$1`, [id])).rows[0] || null,
    create: async (u) =>
      (await q(`INSERT INTO users (code, full_name, email, password_hash, role, office_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [u.code, u.full_name, u.email, u.password_hash, u.role, u.office_id])).rows[0],
    countStudents: async () => (await q(`SELECT COUNT(*)::int AS n FROM users WHERE role='student'`)).rows[0].n,
  },
  procedures: {
    list: async ({ activeOnly = false, search = "", officeId = null } = {}) => {
      const where = []; const params = [];
      if (activeOnly) where.push(`is_active = TRUE`);
      if (search) { params.push(`%${search}%`); where.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length} OR code ILIKE $${params.length})`); }
      if (officeId) { params.push(Number(officeId)); where.push(`office_id = $${params.length}`); }
      const sql = `SELECT p.*, o.name AS office_name FROM procedures p LEFT JOIN offices o ON o.id=p.office_id ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY p.id`;
      return (await q(sql, params)).rows;
    },
    findById: async (id) => (await q(`SELECT p.*, o.name AS office_name FROM procedures p LEFT JOIN offices o ON o.id=p.office_id WHERE p.id=$1`, [id])).rows[0] || null,
    create: async (p) =>
      (await q(`INSERT INTO procedures (code, name, description, office_id, requirements, cost, duration_days, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,TRUE) RETURNING *`,
        [p.code, p.name, p.description, p.office_id, JSON.stringify(p.requirements || []), p.cost, p.duration_days])).rows[0],
    update: async (id, patch) => {
      const current = await pgRepo.procedures.findById(id);
      if (!current) return null;
      const merged = { ...current, ...patch };
      return (await q(`UPDATE procedures SET name=$1, description=$2, office_id=$3, requirements=$4, cost=$5, duration_days=$6, is_active=$7 WHERE id=$8 RETURNING *`,
        [merged.name, merged.description, merged.office_id, JSON.stringify(merged.requirements || []), merged.cost, merged.duration_days, merged.is_active, id])).rows[0];
    },
    countActive: async () => (await q(`SELECT COUNT(*)::int AS n FROM procedures WHERE is_active`)).rows[0].n,
  },
  requests: {
    list: async ({ userId = null } = {}) => {
      if (userId)
        return (await q(`SELECT * FROM requests WHERE user_id=$1 ORDER BY created_at DESC`, [userId])).rows;
      return (await q(`SELECT * FROM requests ORDER BY created_at DESC`)).rows;
    },
    findById: async (id) => (await q(`SELECT * FROM requests WHERE id=$1`, [id])).rows[0] || null,
    create: async (r) => {
      const year = new Date().getFullYear();
      const n = (await q(`SELECT COUNT(*)::int AS n FROM requests`)).rows[0].n + 1;
      const code = `TRAM-${year}-${String(n).padStart(4, "0")}`;
      return (await q(`INSERT INTO requests (code, user_id, procedure_id, state, data, observations) VALUES ($1,$2,$3,'submitted',$4,NULL) RETURNING *`,
        [code, r.user_id, r.procedure_id, JSON.stringify(r.data || {})])).rows[0];
    },
    update: async (id, patch) => {
      const cur = await pgRepo.requests.findById(id);
      if (!cur) return null;
      const merged = { ...cur, ...patch };
      return (await q(`UPDATE requests SET state=$1, observations=$2, data=$3, updated_at=NOW() WHERE id=$4 RETURNING *`,
        [merged.state, merged.observations, JSON.stringify(merged.data || {}), id])).rows[0];
    },
  },
  documents: {
    listByRequest: async (requestId) => (await q(`SELECT * FROM request_documents WHERE request_id=$1 ORDER BY id`, [requestId])).rows,
    create: async (d) =>
      (await q(`INSERT INTO request_documents (request_id, doc_name, file_path, file_size) VALUES ($1,$2,$3,$4) RETURNING *`,
        [d.request_id, d.doc_name, d.file_path, d.file_size])).rows[0],
    update: async (id, patch) => {
      const cur = (await q(`SELECT * FROM request_documents WHERE id=$1`, [id])).rows[0];
      if (!cur) return null;
      const merged = { ...cur, ...patch };
      return (await q(`UPDATE request_documents SET verified=$1, verified_by=$2 WHERE id=$3 RETURNING *`,
        [merged.verified, merged.verified_by, id])).rows[0];
    },
  },
  history: {
    listByRequest: async (requestId) => (await q(`SELECT * FROM request_history WHERE request_id=$1 ORDER BY created_at`, [requestId])).rows,
    create: async (h) =>
      (await q(`INSERT INTO request_history (request_id, from_state, to_state, changed_by, comment) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [h.request_id, h.from_state, h.to_state, h.changed_by, h.comment])).rows[0],
  },
  notifications: {
    listByUser: async (userId) => (await q(`SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC`, [userId])).rows,
    unreadCount: async (userId) => (await q(`SELECT COUNT(*)::int AS n FROM notifications WHERE user_id=$1 AND NOT is_read`, [userId])).rows[0].n,
    create: async (n) =>
      (await q(`INSERT INTO notifications (user_id, request_id, title, message) VALUES ($1,$2,$3,$4) RETURNING *`,
        [n.user_id, n.request_id, n.title, n.message])).rows[0],
    markRead: async (id, userId) =>
      (await q(`UPDATE notifications SET is_read=TRUE WHERE id=$1 AND user_id=$2 RETURNING *`, [id, userId])).rows[0] || null,
    markAllRead: async (userId) => { await q(`UPDATE notifications SET is_read=TRUE WHERE user_id=$1`, [userId]); },
  },
  reports: {
    stats: async () => {
      const total = (await q(`SELECT COUNT(*)::int AS n FROM requests`)).rows[0].n;
      const students = (await q(`SELECT COUNT(*)::int AS n FROM users WHERE role='student'`)).rows[0].n;
      const procTotal = (await q(`SELECT COUNT(*)::int AS n FROM procedures WHERE is_active`)).rows[0].n;
      const stateRows = (await q(`SELECT state, COUNT(*)::int AS total FROM requests GROUP BY state`)).rows;
      const byState = {};
      stateRows.forEach((r) => (byState[r.state] = r.total));
      const byProcedure = (await q(`SELECT p.name AS procedure, p.code, COUNT(r.id)::int AS total FROM procedures p LEFT JOIN requests r ON r.procedure_id=p.id GROUP BY p.id ORDER BY p.id`)).rows;
      const byOffice = (await q(`SELECT o.name AS office, COUNT(r.id)::int AS total FROM offices o LEFT JOIN procedures p ON p.office_id=o.id LEFT JOIN requests r ON r.procedure_id=p.id GROUP BY o.id ORDER BY o.id`)).rows;
      const byMonth = (await q(`SELECT to_char(created_at,'YYYY-MM') AS month, COUNT(*)::int AS total FROM requests GROUP BY 1 ORDER BY 1`)).rows;
      return {
        total, total_students: students, total_procedures: procTotal,
        pending: (byState.submitted || 0) + (byState.under_review || 0),
        by_state: byState, by_procedure: byProcedure, by_office: byOffice, by_month: byMonth,
      };
    },
    exportRows: async () =>
      (await q(`SELECT r.code, p.name AS procedure, u.full_name AS student, r.state, to_char(r.created_at,'YYYY-MM-DD') AS date, COALESCE(replace(replace(r.observations,E'\n',' '),E'\r',' '),'') AS obs FROM requests r JOIN procedures p ON p.id=r.procedure_id JOIN users u ON u.id=r.user_id ORDER BY r.id`))
        .rows.map((r) => [r.code, r.procedure, r.student, r.state, r.date, r.obs]),
  },
  officeName: async (id) => pgRepo.offices.name(id),
  now: () => new Date(),
};
