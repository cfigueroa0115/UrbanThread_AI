import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  // Database
  DATABASE_URL: z.string().url().default('postgresql://postgres:postgres@localhost:5432/urbanthread'),

  // JWT
  JWT_SECRET: z.string().min(16).default('dev-jwt-secret-change-in-production'),
  JWT_EXPIRES_IN: z.string().default('1h'),

  // OTP
  OTP_EXPIRY_MINUTES: z.coerce.number().int().positive().default(5),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(3),
  OTP_BLOCK_MINUTES: z.coerce.number().int().positive().default(15),

  // Email / SMTP
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_FROM: z.string().email().default('noreply@urbanthread.ai'),

  // OpenAI
  OPENAI_API_KEY: z.string().default(''),

  // Google Gemini
  GEMINI_API_KEY: z.string().default(''),

  // WhatsApp / Meta Cloud API
  WHATSAPP_TOKEN: z.string().default(''),
  WHATSAPP_PHONE_ID: z.string().default(''),
  WHATSAPP_VERIFY_TOKEN: z.string().default(''),

  // n8n
  N8N_WEBHOOK_BASE_URL: z.string().url().default('http://localhost:5678'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  return parsed.data;
}

export const env = loadEnv();
