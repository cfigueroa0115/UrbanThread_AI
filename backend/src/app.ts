import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/index.js';
import { errorHandler } from './middleware/error-handler.middleware.js';
import { sanitizationMiddleware } from './middleware/sanitization.middleware.js';
import { auditMiddleware } from './middleware/audit.middleware.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import roleRoutes from './routes/role.routes.js';
import clientRoutes from './routes/client.routes.js';
import orderRoutes from './routes/order.routes.js';
import requestRoutes from './routes/request.routes.js';
import documentRoutes from './routes/document.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import auditRoutes, { activityLogRouter } from './routes/audit.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';
import whatsappRoutes from './routes/whatsapp.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

// ── Express app ──────────────────────────────────────────────────────────────

const app = express();

// ── Security middleware ──────────────────────────────────────────────────────

app.use(helmet());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

// ── Rate limiting (Req 14.1 — JWT + security controls) ──────────────────────

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', errors: [{ message: 'Too many requests, please try again later.' }] },
});

app.use(limiter);

// ── Body parsing ─────────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Sanitization middleware (Req 14.4 — XSS/injection prevention) ────────────

app.use(sanitizationMiddleware);

// ── Audit middleware (Req 14.5 — log write operations) ───────────────────────

app.use(auditMiddleware);

// ── Health check ─────────────────────────────────────────────────────────────

app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API routes ───────────────────────────────────────────────────────────────

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/audit-logs', auditRoutes);
app.use('/api/v1/activity-logs', activityLogRouter);
app.use('/api/v1/chatbot', chatbotRoutes);
app.use('/api/v1/whatsapp', whatsappRoutes);
app.use('/api/v1/webhooks', webhookRoutes);

// ── Global error handler (Req 3.3, 3.4, 3.5 — typed errors + standard responses) ──

app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────────────────────

const PORT = env.PORT;

// Only listen when not running as serverless function (Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 UrbanThread AI backend running on http://localhost:${PORT}`);
    console.log(`   Environment: ${env.NODE_ENV}`);
  });
}

export default app;
