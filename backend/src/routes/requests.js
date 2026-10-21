import { Router } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { repo } from "../repo/index.js";
import { auth, requireRole } from "../middleware/auth.js";
import { sendEmail } from "../mailer.js";

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

async function fullRequest(r) {
  const proc = await repo.procedures.findById(r.procedure_id);
  const user = await repo.users.findById(r.user_id);
  return {
    ...r,
    state_label: STATE_LABELS[r.state],
    procedure_name: proc?.name,
    procedure_code: proc?.code,
    procedure_cost: proc?.cost,
    office_name: proc ? (await repo.offices.name(proc.office_id)) : null,
    user_name: user?.full_name,
    user_email: user?.email,
    user_code: user?.code,
    documents: await repo.documents.listByRequest(r.id),
    history: await repo.history.listByRequest(r.id),
  };
}

router.get("/", auth, async (req, res) => {
  try {
    const list = await repo.requests.list(req.user.role === "student" ? { userId: req.user.id } : {});
    res.json(await Promise.all(list.map(fullRequest)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar solicitudes" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const r = await repo.requests.findById(req.params.id);
    if (!r) return res.status(404).json({ error: "Solicitud no encontrada" });
    if (req.user.role === "student" && r.user_id !== req.user.id)
      return res.status(403).json({ error: "No tiene acceso a esta solicitud" });
    res.json(await fullRequest(r));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener solicitud" });
  }
});

router.post("/", auth, requireRole("student"), async (req, res) => {
  try {
    const { procedure_id, motivo, data } = req.body;
    const proc = await repo.procedures.findById(procedure_id);
    if (!proc || !proc.is_active) return res.status(404).json({ error: "Procedimiento no encontrado" });

    const r = await repo.requests.create({
      user_id: req.user.id,
      procedure_id: proc.id,
      data: { motivo: motivo || "", ...(data || {}) },
    });
    await repo.history.create({ request_id: r.id, from_state: null, to_state: "submitted", changed_by: req.user.id, comment: "Solicitud registrada" });
    await repo.notifications.create({ user_id: r.user_id, request_id: r.id, title: "Solicitud registrada", message: `Su solicitud ${r.code} (${proc.name}) fue registrada correctamente y está pendiente de revisión.` });
    res.status(201).json(await fullRequest(r));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar solicitud" });
  }
});

router.patch("/:id/status", auth, requireRole("office", "admin"), async (req, res) => {
  try {
    const r = await repo.requests.findById(req.params.id);
    if (!r) return res.status(404).json({ error: "Solicitud no encontrada" });
    const { state, observations } = req.body;
    if (!VALID_STATES.includes(state)) return res.status(400).json({ error: "Estado inválido" });
    if (state === "observed" && !observations) return res.status(400).json({ error: "Debe indicar las observaciones" });

    const from = r.state;
    const updated = await repo.requests.update(r.id, { state, observations: observations || r.observations });
    await repo.history.create({ request_id: r.id, from_state: from, to_state: state, changed_by: req.user.id, comment: observations || `Cambio de estado a ${STATE_LABELS[state]}` });

    const proc = await repo.procedures.findById(r.procedure_id);
    const message = `Su solicitud ${r.code} (${proc?.name}) ahora está: ${STATE_LABELS[state].toUpperCase()}.${observations ? " Observaciones: " + observations : ""}`;
    await repo.notifications.create({ user_id: r.user_id, request_id: r.id, title: `Solicitud ${STATE_LABELS[state].toLowerCase()}`, message });

    const owner = await repo.users.findById(r.user_id);
    if (owner?.email) sendEmail(owner.email, `TUPA UNSAAC — Solicitud ${STATE_LABELS[state].toLowerCase()}`, message);

    res.json(await fullRequest(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});

router.post("/:id/documents", auth, requireRole("student", "office", "admin"), upload.single("file"), async (req, res) => {
  try {
    const r = await repo.requests.findById(req.params.id);
    if (!r) return res.status(404).json({ error: "Solicitud no encontrada" });
    if (req.user.role === "student" && r.user_id !== req.user.id)
      return res.status(403).json({ error: "No tiene acceso a esta solicitud" });
    if (!req.file) return res.status(400).json({ error: "Archivo no recibido" });

    const doc = await repo.documents.create({
      request_id: r.id,
      doc_name: req.file.originalname,
      file_path: req.file.path,
      file_size: req.file.size,
    });
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al subir documento" });
  }
});

router.patch("/:id/documents/:docId", auth, requireRole("office", "admin"), async (req, res) => {
  try {
    const r = await repo.requests.findById(req.params.id);
    if (!r) return res.status(404).json({ error: "Solicitud no encontrada" });
    const docs = await repo.documents.listByRequest(r.id);
    const doc = docs.find((d) => d.id === Number(req.params.docId));
    if (!doc) return res.status(404).json({ error: "Documento no encontrado" });
    const updated = await repo.documents.update(doc.id, {
      verified: Boolean(req.body.verified),
      verified_by: req.body.verified ? req.user.id : null,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al verificar documento" });
  }
});

export { STATE_LABELS };
export default router;
