import { Router } from "express";
import { repo } from "../repo/index.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(auth, requireRole("office", "admin"));

router.get("/stats", async (req, res) => {
  try {
    res.json(await repo.reports.stats());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar estadísticas" });
  }
});

router.get("/export", async (req, res) => {
  try {
    const rows = [["Codigo", "Procedimiento", "Estudiante", "Estado", "Fecha registro", "Observaciones"]];
    rows.push(...(await repo.reports.exportRows()));
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=reporte_tramites_TUPA.csv");
    res.send("﻿" + csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al exportar reporte" });
  }
});

export default router;
