import { Router } from "express";
import { repo } from "../repo/index.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = Router();

const decorate = async (p) => ({ ...p, office_name: p.office_name ?? (await repo.offices.name(p.office_id)) });

router.get("/", async (req, res) => {
  try {
    const { search, office_id } = req.query;
    const list = await repo.procedures.list({ activeOnly: true, search: search || "", officeId: office_id || null });
    res.json(await Promise.all(list.map(decorate)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar procedimientos" });
  }
});

router.get("/all", auth, requireRole("admin", "office"), async (req, res) => {
  try {
    const list = await repo.procedures.list({});
    res.json(await Promise.all(list.map(decorate)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar procedimientos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const p = await repo.procedures.findById(req.params.id);
    if (!p || !p.is_active) return res.status(404).json({ error: "Procedimiento no encontrado" });
    res.json(await decorate(p));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener procedimiento" });
  }
});

router.post("/", auth, requireRole("admin"), async (req, res) => {
  try {
    const { code, name, description, office_id, requirements, cost, duration_days } = req.body;
    if (!code || !name) return res.status(400).json({ error: "Código y nombre son obligatorios" });
    const existing = await repo.procedures.list({});
    if (existing.some((p) => p.code === code)) return res.status(409).json({ error: "El código ya existe" });
    const p = await repo.procedures.create({
      code, name,
      description: description || "",
      office_id: Number(office_id) || null,
      requirements: Array.isArray(requirements) ? requirements : [],
      cost: Number(cost) || 0,
      duration_days: Number(duration_days) || 5,
    });
    res.status(201).json(await decorate(p));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear procedimiento" });
  }
});

router.put("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const p = await repo.procedures.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Procedimiento no encontrado" });
    const { name, description, office_id, requirements, cost, duration_days, is_active } = req.body;
    const patch = {};
    if (name !== undefined) patch.name = name;
    if (description !== undefined) patch.description = description;
    if (office_id !== undefined) patch.office_id = Number(office_id) || null;
    if (requirements !== undefined) patch.requirements = requirements;
    if (cost !== undefined) patch.cost = Number(cost);
    if (duration_days !== undefined) patch.duration_days = Number(duration_days);
    if (is_active !== undefined) patch.is_active = Boolean(is_active);
    const updated = await repo.procedures.update(req.params.id, patch);
    res.json(await decorate(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar procedimiento" });
  }
});

router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const p = await repo.procedures.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Procedimiento no encontrado" });
    await repo.procedures.update(req.params.id, { is_active: false });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al desactivar procedimiento" });
  }
});

export default router;
