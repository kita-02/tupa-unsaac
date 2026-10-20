import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { store } from "../store.js";
import { auth, JWT_SECRET } from "../middleware/auth.js";

const router = Router();

const publicUser = (u) => ({ id: u.id, code: u.code, full_name: u.full_name, email: u.email, role: u.role, office_id: u.office_id });

router.post("/register", (req, res) => {
  const { code, full_name, email, password } = req.body;
  if (!full_name || !email || !password) return res.status(400).json({ error: "Nombre, correo y contraseña son obligatorios" });
  if (password.length < 6) return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  if (store.db.users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ error: "El correo ya está registrado" });

  const user = {
    id: store.nextId(store.db.users),
    code: code || null,
    full_name,
    email,
    password_hash: bcrypt.hashSync(password, 8),
    role: "student",
    office_id: null,
  };
  store.db.users.push(user);
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "12h" });
  res.status(201).json({ token, user: publicUser(user) });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = store.db.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user || !bcrypt.compareSync(password || "", user.password_hash))
    return res.status(401).json({ error: "Credenciales incorrectas" });
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token, user: publicUser(user) });
});

router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
