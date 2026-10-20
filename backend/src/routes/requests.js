import { Router } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { store } from "../store.js";
import { auth, requireRole } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "../../uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname.replace(/[^\w.\-]/g, "_")}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

const VALID_STATES = ["submitted", "under_review", "observed", "approved", "rejected", "delivered"];

const STATE_LABELS = {
  submitted: "Enviada", under_review: "En revisión", observed: "Observada",
  approved: "Aprobada", rejected: "Rechazada", delivered: "Entregada",
};

const fullRequest = (r) => {
  const proc = store.procedure(r.procedure_id);
  const user = store.user(r.user_id);
  return {
    ...r,
    state_label: STATE_LABELS[r.state],
    procedure_name: proc?.name,
    procedure_code: proc?.code,
    procedure_cost: proc?.cost,
    office_name: store.officeName(proc?.office_id),
    user_name: user?.full_name,
    user_email: user?.email,
    user_code: user?.code,
    documents: store.db.documents.filter((d) => d.request_id === r.id),
    history: store.db.history.filter((h) => h.request_id === r.id).sort((a, b) => a.created_at - b.created_at),
  };
};

router.get("/", auth, (req, res) => {
  let list = store.db.requests;
  if (req.user.role === "student") list = list.filter((r) => r.user_id === req.user.id);
  list = [...list].sort((a, b) => b.created_at - a.created_at);
  res.json(list.map(fullRequest));
});

router.get("/:id", auth, (req, res) => {
  const r = store.request(Number(req.params.id));
  if (!r) return res.status(404).json({ error: "Solicitud no encontrada" });
  if (req.user.role === "student" && r.user_id !== req.user.id)
    return res.status(403).json({ error: "No tiene acceso a esta solicitud" });
  res.json(fullRequest(r));
});

router.post("/", auth, requireRole("student"), (req, res) => {
  const { procedure_id, motivo, data } = req.body;
  const proc = store.procedure(Number(procedure_id));
  if (!proc || !proc.is_active) return res.status(404).json({ error: "Procedimiento no encontrado" });

  const r = {
    id: store.nextId(store.db.requests),
    code: store.newTramCode(),
    user_id: req.user.id,
    procedure_id: proc.id,
    state: "submitted",
    data: { motivo: motivo || "", ...(data || {}) },
    observations: null,
    created_at: store.now(),
    updated_at: store.now(),
  };
  store.db.requests.push(r);
  store.addHistory(r.id, null, "submitted", req.user.id, "Solicitud registrada");
  store.notify(r.user_id, r.id, "Solicitud registrada", `Su solicitud ${r.code} (${proc.name}) fue registrada correctamente y está pendiente de revisión.`);
  store.notify(2, r.id, "Nueva solicitud", `Nueva solicitud ${r.code} de ${proc.name} pendiente de revisión.`);
  res.status(201).json(fullRequest(r));
});

router.patch("/:id/status", auth, requireRole("office", "admin"), (req, res) => {
  const r = store.request(Number(req.params.id));
  if (!r) return res.status(404).json({ error: "Solicitud no encontrada" });
  const { state, observations } = req.body;
  if (!VALID_STATES.includes(state)) return res.status(400).json({ error: "Estado inválido" });
  if (state === "observed" && !observations) return res.status(400).json({ error: "Debe indicar las observaciones" });

  const from = r.state;
  r.state = state;
  r.observations = observations || r.observations;
  r.updated_at = store.now();
  store.addHistory(r.id, from, state, req.user.id, observations || `Cambio de estado a ${STATE_LABELS[state]}`);
  const proc = store.procedure(r.procedure_id);
  store.notify(r.user_id, r.id, `Solicitud ${STATE_LABELS[state].toLowerCase()}`, `Su solicitud ${r.code} (${proc?.name}) ahora está: ${STATE_LABELS[state].toUpperCase()}.${observations ? " Observaciones: " + observations : ""}`);
  res.json(fullRequest(r));
});

router.post("/:id/documents", auth, requireRole("student", "office", "admin"), upload.single("file"), (req, res) => {
  const r = store.request(Number(req.params.id));
  if (!r) return res.status(404).json({ error: "Solicitud no encontrada" });
  if (req.user.role === "student" && r.user_id !== req.user.id)
    return res.status(403).json({ error: "No tiene acceso a esta solicitud" });
  if (!req.file) return res.status(400).json({ error: "Archivo no recibido" });

  const doc = {
    id: store.nextId(store.db.documents),
    request_id: r.id,
    doc_name: req.file.originalname,
    file_path: req.file.path,
    file_size: req.file.size,
    verified: false,
    verified_by: null,
    created_at: store.now(),
  };
  store.db.documents.push(doc);
  res.status(201).json(doc);
});

router.patch("/:id/documents/:docId", auth, requireRole("office", "admin"), (req, res) => {
  const r = store.request(Number(req.params.id));
  if (!r) return res.status(404).json({ error: "Solicitud no encontrada" });
  const doc = store.db.documents.find((d) => d.id === Number(req.params.docId) && d.request_id === r.id);
  if (!doc) return res.status(404).json({ error: "Documento no encontrado" });
  doc.verified = Boolean(req.body.verified);
  doc.verified_by = doc.verified ? req.user.id : null;
  res.json(doc);
});

export { STATE_LABELS };
export default router;
