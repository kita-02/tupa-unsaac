import { Router } from "express";
import { store } from "../store.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = Router();

const withOffice = (p) => ({ ...p, office_name: store.officeName(p.office_id) });

router.get("/", (req, res) => {
  const { search, office_id } = req.query;
  let list = store.db.procedures.filter((p) => p.is_active);
  if (search) {
    const s = search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || p.code.toLowerCase().includes(s));
  }
  if (office_id) list = list.filter((p) => p.office_id === Number(office_id));
  res.json(list.map(withOffice));
});

router.get("/all", auth, requireRole("admin", "office"), (req, res) => {
  res.json(store.db.procedures.map(withOffice));
});

router.get("/:id", (req, res) => {
  const p = store.procedure(Number(req.params.id));
  if (!p || !p.is_active) return res.status(404).json({ error: "Procedimiento no encontrado" });
  res.json(withOffice(p));
});

router.post("/", auth, requireRole("admin"), (req, res) => {
  const { code, name, description, office_id, requirements, cost, duration_days } = req.body;
  if (!code || !name) return res.status(400).json({ error: "Código y nombre son obligatorios" });
  if (store.db.procedures.some((p) => p.code === code)) return res.status(409).json({ error: "El código ya existe" });
  const p = {
    id: store.nextId(store.db.procedures),
    code, name,
    description: description || "",
    office_id: Number(office_id) || null,
    requirements: Array.isArray(requirements) ? requirements : [],
    cost: Number(cost) || 0,
    duration_days: Number(duration_days) || 5,
    is_active: true,
  };
  store.db.procedures.push(p);
  res.status(201).json(withOffice(p));
});

router.put("/:id", auth, requireRole("admin"), (req, res) => {
  const p = store.procedure(Number(req.params.id));
  if (!p) return res.status(404).json({ error: "Procedimiento no encontrado" });
  const { name, description, office_id, requirements, cost, duration_days, is_active } = req.body;
  if (name !== undefined) p.name = name;
  if (description !== undefined) p.description = description;
  if (office_id !== undefined) p.office_id = Number(office_id) || null;
  if (requirements !== undefined) p.requirements = requirements;
  if (cost !== undefined) p.cost = Number(cost);
  if (duration_days !== undefined) p.duration_days = Number(duration_days);
  if (is_active !== undefined) p.is_active = Boolean(is_active);
  res.json(withOffice(p));
});

router.delete("/:id", auth, requireRole("admin"), (req, res) => {
  const p = store.procedure(Number(req.params.id));
  if (!p) return res.status(404).json({ error: "Procedimiento no encontrado" });
  p.is_active = false;
  res.json({ ok: true });
});

export default router;
