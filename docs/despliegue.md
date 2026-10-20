# Guía de despliegue en la nube (tier gratuito)

## Base de datos (Neon PostgreSQL)

1. Crear cuenta en https://neon.tech y crear un proyecto.
2. Ejecutar el esquema `database/schema.sql` en el SQL Editor de Neon.
3. Copiar la cadena de conexión (`DATABASE_URL`).

## Backend en Render

1. Subir el código a GitHub.
2. En https://render.com → **New Web Service** → conectar el repositorio.
3. Configurar:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Environment variables:
   - `JWT_SECRET` = clave secreta fuerte
   - `DATABASE_URL` = cadena de conexión de Neon (cuando se conecte la BD)
5. Guardar. Render asignará una URL tipo `https://tupa-api.onrender.com`.

## Frontend en Vercel

1. En https://vercel.com → **Add New Project** → importar el repositorio.
2. Configurar:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Environment variable (si el API no está en proxy local):
   - Crear archivo `frontend/.env.production` con `VITE_API_URL=https://tupa-api.onrender.com`
4. Deploy. Vercel asignará una URL tipo `https://tupa-unsaac.vercel.app`.

## Alternativa: backend en Railway

- https://railway.app permite desplegar Node.js gratis con crédito mensual; mismo procedimiento que Render.

## Consideraciones

- El backend en memoria reinicia los datos al redeploy; para persistencia real usar Neon (schema.sql) con `pg`.
- Los archivos subidos (`backend/uploads/`) no persisten en Render (disco efímero): usar Cloudinary o almacenamiento S3-compatible para producción.
- Activar el envío de correos con Nodemailer requiere una cuenta Gmail con "contraseña de aplicación".
