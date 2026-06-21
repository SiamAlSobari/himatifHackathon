import nodemailer from "nodemailer";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Helper to send emails via SMTP using Nodemailer
 * Falls back to mock logging if SMTP environment variables are not configured.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams): Promise<{ success: boolean; mocked: boolean }> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "Verimind <noreply@verimind.com>";

  // Check if SMTP configurations are set. Otherwise, fallback to mock mode.
  if (!host || !user || !pass) {
    console.warn(
      `[EMAIL MOCK] To: ${to} | Subject: ${subject}\nBody: ${text || html}`
    );
    return {
      success: true,
      mocked: true,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    })

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    return {
      success: true,
      mocked: false,
    };
  } catch (error: any) {
    console.error("[EMAIL ERROR]:", error);
    throw new Error(
      `Gagal mengirim email ke ${to}: ${error.message || "SMTP server error"}`
    );
  }
}
