import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { repo } from "../repo/index.js";
import { auth, JWT_SECRET } from "../middleware/auth.js";

const router = Router();

const publicUser = (u) => ({ id: u.id, code: u.code, full_name: u.full_name, email: u.email, role: u.role, office_id: u.office_id });

router.post("/register", async (req, res) => {
  try {
    const { code, full_name, email, password } = req.body;
    if (!full_name || !email || !password) return res.status(400).json({ error: "Nombre, correo y contraseña son obligatorios" });
    if (password.length < 6) return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    if (await repo.users.findByEmail(email)) return res.status(409).json({ error: "El correo ya está registrado" });

    const user = await repo.users.create({
      code: code || null,
      full_name,
      email,
      password_hash: bcrypt.hashSync(password, 8),
      role: "student",
      office_id: null,
    });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "12h" });
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el registro" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await repo.users.findByEmail(email || "");
    if (!user || !bcrypt.compareSync(password || "", user.password_hash))
      return res.status(401).json({ error: "Credenciales incorrectas" });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "12h" });
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
