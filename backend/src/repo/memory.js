import bcrypt from "bcryptjs";

const hash = (p) => bcrypt.hashSync(p, 8);

const db = {
  offices: [
    { id: 1, name: "Oficina General de Registros (OGR)", floor: "Planta Baja - Administrativo", schedule: "Lun a Vie 8:00 - 17:00" },
    { id: 2, name: "Dirección de Admisión y Promoción (DAP)", floor: "Segundo Piso - Administrativo", schedule: "Lun a Vie 8:30 - 16:30" },
    { id: 3, name: "Dirección de Asuntos Económicos (DAE)", floor: "Primer Piso - Financiero", schedule: "Lun a Vie 8:00 - 16:00" },
    { id: 4, name: "Unidad de Bienestar Estudiantil", floor: "Casa Estudiantil", schedule: "Lun a Vie 8:00 - 17:00" },
  ],
  users: [
    { id: 1, code: "20231234", full_name: "Administrador del Sistema", email: "admin@unsaac.edu.pe", password_hash: hash("admin123"), role: "admin", office_id: null, created_at: new Date() },
    { id: 2, code: "19870001", full_name: "María Quispe Mamani", email: "oficina.ogr@unsaac.edu.pe", password_hash: hash("oficina123"), role: "office", office_id: 1, created_at: new Date() },
    { id: 3, code: "70985432", full_name: "Juan Carlos Huamán Ccahuana", email: "juan.hamann@alum.unsaac.edu.pe", password_hash: hash("estudiante123"), role: "student", office_id: null, created_at: new Date() },
  ],
  procedures: [
    { id: 1, code: "TUPA-001", name: "Constancia de Estudios", description: "Documento que acredita que el estudiante se encuentra matriculado en el periodo académico vigente.", office_id: 1, cost: 0, duration_days: 2, is_active: true, requirements: ["Solicitud dirigida al Decano (formato OGR-01)", "Carné de identidad universitario (copia)", "Boleta de pago por derecho de constancia (si aplica)"] },
    { id: 2, code: "TUPA-002", name: "Certificado de Notas", description: "Documento que detalla las calificaciones obtenidas por el estudiante en los cursos aprobados y cursados.", office_id: 1, cost: 15, duration_days: 3, is_active: true, requirements: ["Solicitud dirigida al Decano (formato OGR-02)", "Carné de identidad universitario (copia)", "Comprobante de pago (Banco de la Nación)", "Libreta digital descargada del SIAG"] },
    { id: 3, code: "TUPA-003", name: "Solicitud de Beca 18", description: "Registro y renovación de la beca de excelencia académica Beca 18 para estudiantes de pregrado.", office_id: 4, cost: 0, duration_days: 10, is_active: true, requirements: ["Formulario de renovación Beca 18 (firmado)", "Certificado de notas del periodo anterior", "Declaración jurada de no tener otra beca", "Carné de identidad (copia)"] },
    { id: 4, code: "TUPA-004", name: "Reingreso a la Universidad", description: "Trámite para estudiantes que interrumpieron sus estudios y desean reactivar su matrícula.", office_id: 2, cost: 50, duration_days: 15, is_active: true, requirements: ["Carta de reingreso dirigida al Director de Facultad", "Certificado de notas original", "Informe de la Comisión de Becas (si aplica)", "Comprobante de pago de derechos"] },
    { id: 5, code: "TUPA-005", name: "Constancia de No Adeudo", description: "Documento que certifica que el estudiante no registra deudas con la institución.", office_id: 3, cost: 10, duration_days: 2, is_active: true, requirements: ["Solicitud (formato DAE-03)", "Carné de identidad universitario (copia)"] },
    { id: 6, code: "TUPA-006", name: "Cambio de Carrera", description: "Trámite de traslado interno de carrera dentro de la UNSAAC sujeto a requisitos académicos.", office_id: 2, cost: 120, duration_days: 20, is_active: true, requirements: ["Solicitud de cambio de carrera", "Certificado de notas (promedio mínimo 14)", "Informe psicológico", "Formato DAP-10"] },
  ],
  requests: [
    { id: 1, code: "TRAM-2026-0001", user_id: 3, procedure_id: 1, state: "approved", data: { motivo: "Trámite de prácticas preprofesionales" }, observations: "Requisitos completos.", created_at: new Date("2026-10-10T10:00:00"), updated_at: new Date("2026-10-12T09:30:00") },
    { id: 2, code: "TRAM-2026-0002", user_id: 3, procedure_id: 2, state: "under_review", data: { motivo: "Postulación a programa de intercambio" }, observations: null, created_at: new Date("2026-10-15T15:20:00"), updated_at: new Date("2026-10-16T08:00:00") },
  ],
  documents: [
    { id: 1, request_id: 1, doc_name: "solicitud_constancia.pdf", file_path: "uploads/req1_solicitud.pdf", file_size: 102400, verified: true, verified_by: 2, created_at: new Date("2026-10-10T10:05:00") },
    { id: 2, request_id: 1, doc_name: "carne_copia.pdf", file_path: "uploads/req1_carne.pdf", file_size: 51200, verified: true, verified_by: 2, created_at: new Date("2026-10-10T10:06:00") },
    { id: 3, request_id: 2, doc_name: "solicitud_certificado.pdf", file_path: "uploads/req2_solicitud.pdf", file_size: 88000, verified: false, verified_by: null, created_at: new Date("2026-10-15T15:25:00") },
  ],
  history: [
    { id: 1, request_id: 1, from_state: null, to_state: "submitted", changed_by: 3, comment: "Solicitud registrada", created_at: new Date("2026-10-10T10:00:00") },
    { id: 2, request_id: 1, from_state: "submitted", to_state: "under_review", changed_by: 2, comment: "Inicio de revisión", created_at: new Date("2026-10-11T09:00:00") },
    { id: 3, request_id: 1, from_state: "under_review", to_state: "approved", changed_by: 2, comment: "Aprobado por la OGR", created_at: new Date("2026-10-12T09:30:00") },
    { id: 4, request_id: 2, from_state: null, to_state: "submitted", changed_by: 3, comment: "Solicitud registrada", created_at: new Date("2026-10-15T15:20:00") },
    { id: 5, request_id: 2, from_state: "submitted", to_state: "under_review", changed_by: 2, comment: "Inicio de revisión", created_at: new Date("2026-10-16T08:00:00") },
  ],
  notifications: [
    { id: 1, user_id: 3, request_id: 1, title: "Solicitud aprobada", message: "Su solicitud TRAM-2026-0001 (Constancia de Estudios) fue APROBADA. Puede recoger su documento en la OGR.", is_read: false, created_at: new Date("2026-10-12T09:30:00") },
    { id: 2, user_id: 3, request_id: 2, title: "Trámite en revisión", message: "Su solicitud TRAM-2026-0002 (Certificado de Notas) está siendo revisada por la oficina responsable.", is_read: false, created_at: new Date("2026-10-16T08:00:00") },
  ],
};

const nextId = (arr) => (arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1);
const now = () => new Date();

export const memRepo = {
  kind: "memory",
  offices: {
    list: async () => db.offices,
    name: async (id) => db.offices.find((o) => o.id === id)?.name ?? null,
  },
  users: {
    findByEmail: async (email) => db.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase()) || null,
    findById: async (id) => db.users.find((u) => u.id === Number(id)) || null,
    create: async (u) => {
      const user = { id: nextId(db.users), created_at: now(), office_id: null, ...u };
      db.users.push(user);
      return user;
    },
    countStudents: async () => db.users.filter((u) => u.role === "student").length,
  },
  procedures: {
    list: async ({ activeOnly = false, search = "", officeId = null } = {}) => {
      let list = [...db.procedures];
      if (activeOnly) list = list.filter((p) => p.is_active);
      if (search) {
        const s = search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(s) || (p.description || "").toLowerCase().includes(s) || p.code.toLowerCase().includes(s));
      }
      if (officeId) list = list.filter((p) => p.office_id === Number(officeId));
      return list;
    },
    findById: async (id) => db.procedures.find((p) => p.id === Number(id)) || null,
    create: async (p) => {
      const proc = { id: nextId(db.procedures), is_active: true, created_at: now(), ...p };
      db.procedures.push(proc);
      return proc;
    },
    update: async (id, patch) => {
      const p = db.procedures.find((x) => x.id === Number(id));
      if (p) Object.assign(p, patch);
      return p || null;
    },
    countActive: async () => db.procedures.filter((p) => p.is_active).length,
  },
  requests: {
    list: async ({ userId = null } = {}) => {
      let list = [...db.requests];
      if (userId) list = list.filter((r) => r.user_id === Number(userId));
      return list.sort((a, b) => b.created_at - a.created_at);
    },
    findById: async (id) => db.requests.find((r) => r.id === Number(id)) || null,
    create: async (r) => {
      const year = new Date().getFullYear();
      const code = `TRAM-${year}-${String(nextId(db.requests)).padStart(4, "0")}`;
      const req = { id: nextId(db.requests), code, state: "submitted", data: {}, observations: null, created_at: now(), updated_at: now(), ...r };
      db.requests.push(req);
      return req;
    },
    update: async (id, patch) => {
      const r = db.requests.find((x) => x.id === Number(id));
      if (r) Object.assign(r, patch);
      return r || null;
    },
  },
  documents: {
    listByRequest: async (requestId) => db.documents.filter((d) => d.request_id === Number(requestId)),
    create: async (d) => {
      const doc = { id: nextId(db.documents), verified: false, verified_by: null, created_at: now(), ...d };
      db.documents.push(doc);
      return doc;
    },
    update: async (id, patch) => {
      const d = db.documents.find((x) => x.id === Number(id));
      if (d) Object.assign(d, patch);
      return d || null;
    },
  },
  history: {
    listByRequest: async (requestId) =>
      db.history.filter((h) => h.request_id === Number(requestId)).sort((a, b) => a.created_at - b.created_at),
    create: async (h) => {
      const entry = { id: nextId(db.history), created_at: now(), ...h };
      db.history.push(entry);
      return entry;
    },
  },
  notifications: {
    listByUser: async (userId) =>
      db.notifications.filter((n) => n.user_id === Number(userId)).sort((a, b) => b.created_at - a.created_at),
    unreadCount: async (userId) => db.notifications.filter((n) => n.user_id === Number(userId) && !n.is_read).length,
    create: async (n) => {
      const entry = { id: nextId(db.notifications), is_read: false, request_id: null, created_at: now(), ...n };
      db.notifications.push(entry);
      return entry;
    },
    markRead: async (id, userId) => {
      const n = db.notifications.find((x) => x.id === Number(id) && x.user_id === Number(userId));
      if (n) n.is_read = true;
      return n || null;
    },
    markAllRead: async (userId) => {
      db.notifications.filter((n) => n.user_id === Number(userId)).forEach((n) => (n.is_read = true));
    },
  },
  reports: {
    stats: async () => {
      const requests = db.requests;
      const byState = {};
      requests.forEach((r) => (byState[r.state] = (byState[r.state] || 0) + 1));
      const byProcedure = db.procedures.map((p) => ({
        procedure: p.name, code: p.code,
        total: requests.filter((r) => r.procedure_id === p.id).length,
      }));
      const byOffice = db.offices.map((o) => ({
        office: o.name,
        total: requests.filter((r) => db.procedures.find((p) => p.id === r.procedure_id)?.office_id === o.id).length,
      }));
      const byMonth = {};
      requests.forEach((r) => {
        const m = new Date(r.created_at).toISOString().slice(0, 7);
        byMonth[m] = (byMonth[m] || 0) + 1;
      });
      return {
        total: requests.length,
        total_students: db.users.filter((u) => u.role === "student").length,
        total_procedures: db.procedures.filter((p) => p.is_active).length,
        pending: (byState.submitted || 0) + (byState.under_review || 0),
        by_state: byState,
        by_procedure: byProcedure.sort((a, b) => b.total - a.total),
        by_office: byOffice,
        by_month: Object.entries(byMonth).sort().map(([month, total]) => ({ month, total })),
      };
    },
    exportRows: async () =>
      db.requests.map((r) => {
        const p = db.procedures.find((x) => x.id === r.procedure_id);
        const u = db.users.find((x) => x.id === r.user_id);
        return [r.code, p?.name || "", u?.full_name || "", r.state, new Date(r.created_at).toISOString().slice(0, 10), (r.observations || "").replace(/[\r\n]+/g, " ")];
      }),
  },
  officeName: async (id) => db.offices.find((o) => o.id === id)?.name ?? null,
  now: () => new Date(),
};
