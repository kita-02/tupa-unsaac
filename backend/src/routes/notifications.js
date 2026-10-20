import { Router } from "express";
import { store } from "../store.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", auth, (req, res) => {
  const list = store.db.notifications
    .filter((n) => n.user_id === req.user.id)
    .sort((a, b) => b.created_at - a.created_at);
  res.json(list);
});

router.get("/unread/count", auth, (req, res) => {
  const count = store.db.notifications.filter((n) => n.user_id === req.user.id && !n.is_read).length;
  res.json({ count });
});

router.patch("/:id/read", auth, (req, res) => {
  const n = store.db.notifications.find((x) => x.id === Number(req.params.id) && x.user_id === req.user.id);
  if (!n) return res.status(404).json({ error: "Notificación no encontrada" });
  n.is_read = true;
  res.json(n);
});

router.patch("/read-all", auth, (req, res) => {
  store.db.notifications.filter((n) => n.user_id === req.user.id).forEach((n) => (n.is_read = true));
  res.json({ ok: true });
});

export default router;
