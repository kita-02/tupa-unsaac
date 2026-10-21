import { repo } from "../repo/index.js";

export const JWT_SECRET = process.env.JWT_SECRET || "tupa-unsaac-secret-dev";

export async function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });
  try {
    const { default: jwt } = await import("jsonwebtoken");
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await repo.users.findById(payload.id);
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });
    req.user = { id: user.id, email: user.email, full_name: user.full_name, role: user.role, office_id: user.office_id };
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "No tiene permisos para esta operación" });
    }
    next();
  };
}
