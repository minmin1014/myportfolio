import nodemailer from "nodemailer";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error("SMTP environment variables are not fully configured.");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

export async function sendContactEmail(payload: ContactPayload) {
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? process.env.SMTP_USER;
  if (!to) throw new Error("CONTACT_TO_EMAIL is not configured.");

  const transporter = getTransporter();

  await transporter.sendMail({
    to,
    from,
    replyTo: `"${payload.name}" <${payload.email}>`,
    subject: `[minforge.dev] ${payload.subject}`,
    text: [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Subject: ${payload.subject}`,
      "",
      payload.message,
    ].join("\n"),
  });
}
