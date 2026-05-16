import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { env } from '../config/index.js';

// ── Nodemailer Configuration ────────────────────────────────────────────────

/** Timeout for SMTP operations (15 seconds). */
const SMTP_TIMEOUT_MS = 15_000;

/** Maximum number of send attempts per email. */
const MAX_SEND_ATTEMPTS = 3;

/** Delay between retry attempts (ms). */
const RETRY_DELAY_MS = 2_000;

let transporter: Transporter | null = null;

/**
 * Get or create the Nodemailer transporter singleton.
 *
 * Uses the SMTP configuration from environment variables.
 * Falls back to a console-logging stub when SMTP_HOST is 'localhost'
 * and no real SMTP server is expected.
 */
function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth:
        env.SMTP_USER && env.SMTP_PASS
          ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
          : undefined,
      connectionTimeout: SMTP_TIMEOUT_MS,
      greetingTimeout: SMTP_TIMEOUT_MS,
      socketTimeout: SMTP_TIMEOUT_MS,
    });
  }
  return transporter;
}

// ── HTML Email Templates ────────────────────────────────────────────────────

const BRAND_STYLES = `
  body { font-family: 'Inter', Arial, sans-serif; background-color: #F8FAFB; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #0A1628 0%, #1A2A4A 100%); padding: 32px; text-align: center; }
  .header h1 { color: #00D4AA; font-size: 24px; margin: 0; font-weight: 700; }
  .header p { color: #E8ECF0; font-size: 14px; margin: 8px 0 0; }
  .body { padding: 32px; color: #1A1A2E; line-height: 1.6; }
  .code-box { background: #F8FAFB; border: 2px dashed #00D4AA; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0; }
  .code { font-family: 'JetBrains Mono', monospace; font-size: 36px; font-weight: 700; color: #0A1628; letter-spacing: 8px; }
  .info-box { background: #F0F9FF; border-left: 4px solid #3B82F6; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; }
  .btn { display: inline-block; background: #00D4AA; color: #0A1628; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
  .footer { background: #F8FAFB; padding: 24px 32px; text-align: center; color: #6B7280; font-size: 12px; border-top: 1px solid #E8ECF0; }
`;

/**
 * Generate the OTP email HTML template.
 *
 * Validates: Requirement 8.2
 */
export function otpEmailTemplate(code: string, expiresInMinutes: number): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><style>${BRAND_STYLES}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>UrbanThread AI</h1>
      <p>Smart Commerce Platform</p>
    </div>
    <div class="body">
      <h2 style="margin-top:0;">Código de Verificación</h2>
      <p>Hola, has solicitado acceso al Portal de Cliente de UrbanThread AI. Usa el siguiente código para verificar tu identidad:</p>
      <div class="code-box">
        <div class="code">${code}</div>
      </div>
      <div class="info-box">
        <strong>⏱ Este código expira en ${expiresInMinutes} minutos.</strong><br>
        Si no solicitaste este código, puedes ignorar este correo de forma segura.
      </div>
      <p>Por tu seguridad, no compartas este código con nadie.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} UrbanThread AI. Todos los derechos reservados.</p>
      <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate the radicación confirmation email HTML template.
 *
 * Validates: Requirement 6.5
 */
export function confirmationEmailTemplate(
  radicationNumber: string,
  requestType: string,
  description: string,
  trackingUrl?: string,
): string {
  const trackingLink = trackingUrl
    ? `<a href="${trackingUrl}" class="btn">Seguir mi solicitud</a>`
    : '';

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><style>${BRAND_STYLES}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>UrbanThread AI</h1>
      <p>Confirmación de Radicación</p>
    </div>
    <div class="body">
      <h2 style="margin-top:0;">Solicitud Registrada Exitosamente</h2>
      <p>Tu solicitud ha sido radicada correctamente en nuestra plataforma. A continuación los detalles:</p>
      <div class="code-box">
        <p style="margin:0 0 8px;color:#6B7280;font-size:14px;">Número de Radicación</p>
        <div class="code" style="font-size:24px;letter-spacing:4px;">${radicationNumber}</div>
      </div>
      <div class="info-box">
        <strong>Tipo:</strong> ${requestType}<br>
        <strong>Descripción:</strong> ${description.slice(0, 200)}${description.length > 200 ? '...' : ''}
      </div>
      <p>Puedes hacer seguimiento del estado de tu solicitud en cualquier momento desde el Portal de Cliente.</p>
      ${trackingLink}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} UrbanThread AI. Todos los derechos reservados.</p>
      <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate a generic notification email HTML template.
 */
export function notificationEmailTemplate(
  title: string,
  message: string,
  actionUrl?: string,
  actionLabel?: string,
): string {
  const actionButton =
    actionUrl && actionLabel
      ? `<a href="${actionUrl}" class="btn">${actionLabel}</a>`
      : '';

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><style>${BRAND_STYLES}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>UrbanThread AI</h1>
      <p>Notificación</p>
    </div>
    <div class="body">
      <h2 style="margin-top:0;">${title}</h2>
      <p>${message}</p>
      ${actionButton}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} UrbanThread AI. Todos los derechos reservados.</p>
      <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Send Email Function ─────────────────────────────────────────────────────

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email with retry logic (up to 3 attempts).
 *
 * - Uses the configured SMTP transporter
 * - Retries on transient failures with a 2-second delay
 * - Logs to console when SMTP is not properly configured
 *
 * Validates: Requirements 6.5, 8.2
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; previewUrl?: string }> {
  const { to, subject, html } = options;

  // If SMTP is not configured, log and return mock success
  if (!env.SMTP_USER && env.SMTP_HOST === 'localhost') {
    console.log(`[Email] Mock send to ${to}: "${subject}"`);
    console.log(`[Email] (SMTP not configured — email not actually sent)`);
    return { success: true, messageId: `mock_${Date.now()}` };
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_SEND_ATTEMPTS; attempt++) {
    try {
      const transport = getTransporter();

      const info = await transport.sendMail({
        from: env.SMTP_FROM,
        to,
        subject,
        html,
      });

      console.log(`[Email] Sent to ${to} (attempt ${attempt}): ${info.messageId}`);
      
      // Show Ethereal preview URL if available
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`[Email] Preview URL: ${previewUrl}`);
      }
      return { success: true, messageId: info.messageId, previewUrl: previewUrl || undefined };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[Email] Attempt ${attempt}/${MAX_SEND_ATTEMPTS} failed for ${to}:`, lastError.message);

      if (attempt < MAX_SEND_ATTEMPTS) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  console.error(`[Email] All ${MAX_SEND_ATTEMPTS} attempts failed for ${to}`);
  return { success: false };
}

// ── Convenience functions ───────────────────────────────────────────────────

/**
 * Send an OTP verification email.
 */
export async function sendOTPEmail(to: string, code: string, expiresInMinutes = 5) {
  return sendEmail({
    to,
    subject: `Tu código de verificación UrbanThread AI: ${code}`,
    html: otpEmailTemplate(code, expiresInMinutes),
  });
}

/**
 * Send a radicación confirmation email.
 */
export async function sendConfirmationEmail(
  to: string,
  radicationNumber: string,
  requestType: string,
  description: string,
  trackingUrl?: string,
) {
  return sendEmail({
    to,
    subject: `Confirmación de Radicación ${radicationNumber} — UrbanThread AI`,
    html: confirmationEmailTemplate(radicationNumber, requestType, description, trackingUrl),
  });
}

/**
 * Send a generic notification email.
 */
export async function sendNotificationEmail(
  to: string,
  title: string,
  message: string,
  actionUrl?: string,
  actionLabel?: string,
) {
  return sendEmail({
    to,
    subject: `${title} — UrbanThread AI`,
    html: notificationEmailTemplate(title, message, actionUrl, actionLabel),
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
