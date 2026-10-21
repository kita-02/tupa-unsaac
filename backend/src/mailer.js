let transporter = null;

async function getTransporter() {
  if (transporter !== null) return transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    transporter = false;
    return transporter;
  }
  try {
    const { default: nodemailer } = await import("nodemailer");
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    console.log("[mailer] Notificaciones por correo activadas");
  } catch (err) {
    console.error("[mailer] Error configurando correo:", err.message);
    transporter = false;
  }
  return transporter;
}

export async function sendEmail(to, subject, text) {
  try {
    const t = await getTransporter();
    if (!t) return false;
    await t.sendMail({ from: `"TUPA UNSAAC" <${process.env.EMAIL_USER}>`, to, subject, text });
    return true;
  } catch (err) {
    console.error("[mailer] Error enviando correo:", err.message);
    return false;
  }
}
