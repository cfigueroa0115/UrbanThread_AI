import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { ERROR_CODES, RATE_LIMIT_AUTH_MAX_ATTEMPTS } from '@shared/constants/index.js';

// ── Mock Prisma ──────────────────────────────────────────────────────────────

const mockCreate = vi.fn().mockResolvedValue({});

vi.mock('../../src/lib/prisma.js', () => ({
  prisma: {
    auditLog: {
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}));

// ── Import after mocks ──────────────────────────────────────────────────────

const { createAuthRateLimiter, createGeneralRateLimiter } = await import(
  '../../src/middleware/rate-limiter.middleware.js'
);

// ── authRateLimiter ──────────────────────────────────────────────────────────

describe('authRateLimiter', () => {
  let app: express.Express;

  beforeEach(() => {
    vi.clearAllMocks();
    // Create a fresh Express app with a fresh rate limiter for each test.
    // The route returns 401 to simulate failed auth attempts, since
    // skipSuccessfulRequests is true and only non-2xx responses are counted.
    app = express();
    app.set('trust proxy', false);
    const limiter = createAuthRateLimiter();
    app.post('/auth/login', limiter, (_req, res) => {
      res.status(401).json({ status: 'error', errors: [{ message: 'Invalid credentials' }] });
    });
  });

  it('is a function (express middleware)', () => {
    const limiter = createAuthRateLimiter();
    expect(typeof limiter).toBe('function');
  });

  it('allows requests under the limit', async () => {
    const res = await request(app).post('/auth/login');

    // Route returns 401 (simulated failed auth), but rate limiter allows it
    expect(res.status).toBe(401);
  });

  it('blocks requests exceeding the limit with 429 and RATE_LIMIT_EXCEEDED', async () => {
    // Send max allowed failed auth requests (these should pass through the limiter)
    for (let i = 0; i < RATE_LIMIT_AUTH_MAX_ATTEMPTS; i++) {
      const res = await request(app).post('/auth/login');
      expect(res.status).toBe(401);
    }

    // The next request should be blocked by the rate limiter
    const res = await request(app).post('/auth/login');

    expect(res.status).toBe(429);
    expect(res.body).toEqual({
      status: 'error',
      errors: [
        {
          message: 'Too many authentication attempts. Please try again later.',
          code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        },
      ],
    });
  });

  it('does not count successful requests toward the limit', async () => {
    // Create an app where the route returns 200 (successful auth)
    const successApp = express();
    successApp.set('trust proxy', false);
    const limiter = createAuthRateLimiter();
    successApp.post('/auth/login', limiter, (_req, res) => {
      res.json({ status: 'success', data: { token: 'abc' } });
    });

    // Send more than max requests — all should succeed because
    // skipSuccessfulRequests is true
    for (let i = 0; i < RATE_LIMIT_AUTH_MAX_ATTEMPTS + 5; i++) {
      const res = await request(successApp).post('/auth/login');
      expect(res.status).toBe(200);
    }
  });

  it('logs rate limit block to audit_logs via Prisma', async () => {
    // Exhaust the limit
    for (let i = 0; i < RATE_LIMIT_AUTH_MAX_ATTEMPTS; i++) {
      await request(app).post('/auth/login');
    }

    // Trigger the block
    await request(app).post('/auth/login');

    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: null,
        action: 'rate_limit_block',
        resource: 'auth',
        result: 'failure',
      }),
    });
  });

  it('includes details in the audit log entry', async () => {
    for (let i = 0; i < RATE_LIMIT_AUTH_MAX_ATTEMPTS; i++) {
      await request(app).post('/auth/login');
    }

    await request(app).post('/auth/login');

    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        details: expect.objectContaining({
          reason: 'Too many authentication attempts',
          maxAttempts: RATE_LIMIT_AUTH_MAX_ATTEMPTS,
        }),
      }),
    });
  });

  it('still returns 429 even if audit log write fails', async () => {
    mockCreate.mockRejectedValueOnce(new Error('DB connection failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    for (let i = 0; i < RATE_LIMIT_AUTH_MAX_ATTEMPTS; i++) {
      await request(app).post('/auth/login');
    }

    const res = await request(app).post('/auth/login');

    expect(res.status).toBe(429);
    expect(res.body.status).toBe('error');
    expect(res.body.errors[0].code).toBe(ERROR_CODES.RATE_LIMIT_EXCEEDED);

    consoleSpy.mockRestore();
  });

  it('returns standard rate limit headers', async () => {
    const res = await request(app).post('/auth/login');

    // express-rate-limit v7 sets RateLimit-* headers
    expect(res.headers).toHaveProperty('ratelimit-limit');
    expect(res.headers).toHaveProperty('ratelimit-remaining');
  });
});

// ── generalRateLimiter ───────────────────────────────────────────────────────

describe('generalRateLimiter', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.set('trust proxy', false);
    const limiter = createGeneralRateLimiter();
    app.get('/api/test', limiter, (_req, res) => {
      res.json({ status: 'success' });
    });
  });

  it('is a function (express middleware)', () => {
    const limiter = createGeneralRateLimiter();
    expect(typeof limiter).toBe('function');
  });

  it('allows requests under the limit', async () => {
    const res = await request(app).get('/api/test');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'success' });
  });

  it('returns standard rate limit headers', async () => {
    const res = await request(app).get('/api/test');

    expect(res.headers).toHaveProperty('ratelimit-limit');
    expect(res.headers).toHaveProperty('ratelimit-remaining');
  });
});
