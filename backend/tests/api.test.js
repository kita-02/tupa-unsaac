import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();
let token;
let requestId;

describe("API TUPA UNSAAC", () => {
  test("GET /api/health responde ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  test("GET /api/procedures lista procedimientos públicos", async () => {
    const res = await request(app).get("/api/procedures");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("requirements");
    expect(res.body[0]).toHaveProperty("office_name");
  });

  test("GET /api/procedures?search=constancia filtra correctamente", async () => {
    const res = await request(app).get("/api/procedures").query({ search: "constancia" });
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test("Login con credenciales inválidas falla (401)", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "juan.hamann@alum.unsaac.edu.pe", password: "mala" });
    expect(res.status).toBe(401);
  });

  test("Login como estudiante devuelve token", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "juan.hamann@alum.unsaac.edu.pe", password: "estudiante123" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.role).toBe("student");
    token = res.body.token;
  });

  test("Registro crea un nuevo estudiante", async () => {
    const res = await request(app).post("/api/auth/register").send({ code: "20249999", full_name: "Ana Prueba", email: "ana.test@alum.unsaac.edu.pe", password: "secret123" });
    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("student");
  });

  test("Crear solicitud requiere autenticación", async () => {
    const res = await request(app).post("/api/requests").send({ procedure_id: 1 });
    expect(res.status).toBe(401);
  });

  test("Estudiante crea una solicitud", async () => {
    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${token}`)
      .send({ procedure_id: 3, motivo: "Renovación de beca" });
    expect(res.status).toBe(201);
    expect(res.body.state).toBe("submitted");
    expect(res.body.code).toMatch(/^TRAM-/);
    requestId = res.body.id;
  });

  test("Estudiante ve solo sus solicitudes", async () => {
    const res = await request(app).get("/api/requests").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.every((r) => r.user_name === "Juan Carlos Huamán Ccahuana")).toBe(true);
  });

  test("La oficina cambia el estado de la solicitud y genera notificación", async () => {
    const login = await request(app).post("/api/auth/login").send({ email: "oficina.ogr@unsaac.edu.pe", password: "oficina123" });
    const res = await request(app)
      .patch(`/api/requests/${requestId}/status`)
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({ state: "under_review" });
    expect(res.status).toBe(200);
    expect(res.body.state).toBe("under_review");
    expect(res.body.history.length).toBeGreaterThanOrEqual(2);
  });

  test("Estado inválido es rechazado (400)", async () => {
    const login = await request(app).post("/api/auth/login").send({ email: "oficina.ogr@unsaac.edu.pe", password: "oficina123" });
    const res = await request(app)
      .patch(`/api/requests/${requestId}/status`)
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({ state: "inventado" });
    expect(res.status).toBe(400);
  });

  test("El estudiante recibe notificaciones", async () => {
    const res = await request(app).get("/api/notifications").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Reportes requiere rol oficina/admin", async () => {
    const res = await request(app).get("/api/reports/stats").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  test("Reporte de estadísticas para oficina", async () => {
    const login = await request(app).post("/api/auth/login").send({ email: "oficina.ogr@unsaac.edu.pe", password: "oficina123" });
    const res = await request(app).get("/api/reports/stats").set("Authorization", `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("by_state");
    expect(res.body).toHaveProperty("by_procedure");
  });

  test("Export CSV funciona para oficina", async () => {
    const login = await request(app).post("/api/auth/login").send({ email: "oficina.ogr@unsaac.edu.pe", password: "oficina123" });
    const res = await request(app).get("/api/reports/export").set("Authorization", `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.text).toContain("TRAM-");
  });
});
