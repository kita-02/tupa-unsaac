import { memRepo } from "./memory.js";

export let repo = memRepo;

export async function initRepo() {
  if (process.env.DATABASE_URL) {
    try {
      const { pgRepo } = await import("./pg.js");
      await pgRepo.init();
      repo = pgRepo;
      console.log("[repo] Conectado a PostgreSQL (DATABASE_URL detectada)");
    } catch (err) {
      console.error("[repo] No se pudo conectar a PostgreSQL, usando memoria:", err.message);
    }
  } else {
    console.log("[repo] Modo memoria (sin DATABASE_URL) — datos de demostración");
  }
  return repo;
}
