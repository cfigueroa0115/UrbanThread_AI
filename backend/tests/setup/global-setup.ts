/**
 * Vitest global setup for backend tests.
 *
 * Sets environment variables required by the application config
 * before any test file is imported, so the Zod env schema
 * validates successfully in test mode.
 */
export function setup(): void {
  // ── Core environment ───────────────────────────────────────────────────────
  process.env.NODE_ENV = 'test';
  process.env.PORT = '4001';

  // ── Database — points to a dedicated test database ─────────────────────────
  process.env.DATABASE_URL =
    process.env.DATABASE_URL_TEST ??
    'postgresql://postgres:postgres@localhost:5432/urbanthread_test';

  // ── JWT ────────────────────────────────────────────────────────────────────
  process.env.JWT_SECRET = 'test-jwt-secret-minimum-16-chars';
  process.env.JWT_EXPIRES_IN = '1h';

  // ── OTP ────────────────────────────────────────────────────────────────────
  process.env.OTP_EXPIRY_MINUTES = '5';
  process.env.OTP_MAX_ATTEMPTS = '3';
  process.env.OTP_BLOCK_MINUTES = '15';

  // ── Email / SMTP (disabled in tests) ───────────────────────────────────────
  process.env.SMTP_HOST = 'localhost';
  process.env.SMTP_PORT = '1025';
  process.env.SMTP_USER = '';
  process.env.SMTP_PASS = '';
  process.env.SMTP_FROM = 'test@urbanthread.ai';

  // ── External services (stubs) ──────────────────────────────────────────────
  process.env.OPENAI_API_KEY = 'test-openai-key';
  process.env.WHATSAPP_TOKEN = 'test-whatsapp-token';
  process.env.WHATSAPP_PHONE_ID = 'test-phone-id';
  process.env.WHATSAPP_VERIFY_TOKEN = 'test-verify-token';
  process.env.N8N_WEBHOOK_BASE_URL = 'http://localhost:5678';

  // ── Rate limiting (relaxed for tests) ──────────────────────────────────────
  process.env.RATE_LIMIT_WINDOW_MS = '900000';
  process.env.RATE_LIMIT_MAX = '1000';

  // ── CORS ───────────────────────────────────────────────────────────────────
  process.env.CORS_ORIGIN = 'http://localhost:3000';
}

export function teardown(): void {
  // Nothing to tear down for now.
  // Future: close DB connections, stop containers, etc.
}
