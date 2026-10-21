import { Router } from "express";
import { repo } from "../repo/index.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    res.json(await repo.notifications.listByUser(req.user.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar notificaciones" });
  }
});

router.get("/unread/count", auth, async (req, res) => {
  try {
    res.json({ count: await repo.notifications.unreadCount(req.user.id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al contar notificaciones" });
  }
});

router.patch("/read-all", auth, async (req, res) => {
  try {
    await repo.notifications.markAllRead(req.user.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al marcar notificaciones" });
  }
});

router.patch("/:id/read", auth, async (req, res) => {
  try {
    const n = await repo.notifications.markRead(req.params.id, req.user.id);
    if (!n) return res.status(404).json({ error: "Notificación no encontrada" });
    res.json(n);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al marcar notificación" });
  }
});

export default router;
