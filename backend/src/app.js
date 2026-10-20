import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import procedureRoutes from "./routes/procedures.js";
import requestRoutes from "./routes/requests.js";
import notificationRoutes from "./routes/notifications.js";
import reportRoutes from "./routes/reports.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (req, res) => res.json({ status: "ok", service: "TUPA UNSAAC API" }));
  app.use("/api/auth", authRoutes);
  app.use("/api/procedures", procedureRoutes);
  app.use("/api/requests", requestRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/reports", reportRoutes);

  app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  });

  return app;
}
