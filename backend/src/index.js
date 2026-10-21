import "dotenv/config";
import { initRepo } from "./repo/index.js";
import { createApp } from "./app.js";

const PORT = process.env.PORT || 4000;
await initRepo();
createApp().listen(PORT, () => console.log(`API TUPA UNSAAC escuchando en http://localhost:${PORT}`));
