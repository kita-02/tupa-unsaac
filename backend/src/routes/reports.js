import { Router } from "express";
import { store } from "../store.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(auth, requireRole("office", "admin"));

router.get("/stats", (req, res) => {
  const requests = store.db.requests;
  const byState = {};
  requests.forEach((r) => (byState[r.state] = (byState[r.state] || 0) + 1));
  const byProcedure = store.db.procedures.map((p) => ({
    procedure: p.name,
    code: p.code,
    total: requests.filter((r) => r.procedure_id === p.id).length,
  }));
  const byOffice = store.db.offices.map((o) => ({
    office: o.name,
    total: requests.filter((r) => store.procedure(r.procedure_id)?.office_id === o.id).length,
  }));
  const byMonth = {};
  requests.forEach((r) => {
    const m = r.created_at.toISOString().slice(0, 7);
    byMonth[m] = (byMonth[m] || 0) + 1;
  });
  res.json({
    total: requests.length,
    total_students: store.db.users.filter((u) => u.role === "student").length,
    total_procedures: store.db.procedures.filter((p) => p.is_active).length,
    pending: (byState.submitted || 0) + (byState.under_review || 0),
    by_state: byState,
    by_procedure: byProcedure.sort((a, b) => b.total - a.total),
    by_office: byOffice,
    by_month: Object.entries(byMonth).sort().map(([month, total]) => ({ month, total })),
  });
});

router.get("/export", (req, res) => {
  const rows = [["Codigo", "Procedimiento", "Estudiante", "Estado", "Fecha registro", "Observaciones"]];
  store.db.requests.forEach((r) => {
    const p = store.procedure(r.procedure_id);
    const u = store.user(r.user_id);
    rows.push([r.code, p?.name || "", u?.full_name || "", r.state, r.created_at.toISOString().slice(0, 10), (r.observations || "").replace(/[\r\n]+/g, " ")]);
  });
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=reporte_tramites_TUPA.csv");
  res.send("﻿" + csv);
});

export default router;
