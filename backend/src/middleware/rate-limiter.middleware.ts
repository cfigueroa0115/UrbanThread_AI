import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/index.js';
import {
  RATE_LIMIT_AUTH_MAX_ATTEMPTS,
  RATE_LIMIT_AUTH_WINDOW_MINUTES,
  RATE_LIMIT_AUTH_BLOCK_MINUTES,
  ERROR_CODES,
} from '@shared/constants/index.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract the client IP address from the request.
 * Falls back to socket remote address or 'unknown'.
 */
function getClientIp(req: Request): string {
  return req.ip ?? req.socket?.remoteAddress ?? 'unknown';
}

// ── Factory: Auth rate limiter (Req 14.6) ────────────────────────────────────

/**
 * Creates a rate limiter specifically for authentication endpoints.
 *
 * - Window: 30 minutes (block duration after exceeding limit)
 * - Max attempts: 10 failed auth requests per window
 * - On limit exceeded: returns 429 with RATE_LIMIT_EXCEEDED, logs to audit_logs
 * - Only counts failed requests (skipSuccessfulRequests: true)
 */
export function createAuthRateLimiter() {
  return rateLimit({
    windowMs: RATE_LIMIT_AUTH_BLOCK_MINUTES * 60 * 1000,
    max: RATE_LIMIT_AUTH_MAX_ATTEMPTS,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: getClientIp,
    validate: false,
    handler: async (req: Request, res: Response) => {
      const ipAddress = getClientIp(req);

      // Log the block event to audit_logs
      try {
        await prisma.auditLog.create({
          data: {
            userId: null,
            action: 'rate_limit_block',
            resource: 'auth',
            ipAddress,
            result: 'failure',
            details: {
              reason: 'Too many authentication attempts',
              windowMinutes: RATE_LIMIT_AUTH_WINDOW_MINUTES,
              maxAttempts: RATE_LIMIT_AUTH_MAX_ATTEMPTS,
              blockMinutes: RATE_LIMIT_AUTH_BLOCK_MINUTES,
            },
          },
        });
      } catch {
        // Audit logging failure should not prevent the rate limit response
        console.error('[RATE_LIMIT] Failed to write audit log for IP:', ipAddress);
      }

      res.status(429).json({
        status: 'error',
        errors: [
          {
            message: 'Too many authentication attempts. Please try again later.',
            code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
          },
        ],
      });
    },
  });
}

// ── Factory: General rate limiter ────────────────────────────────────────────

/**
 * Creates a general rate limiter for all API endpoints.
 *
 * - Window: from env.RATE_LIMIT_WINDOW_MS (default 15 min)
 * - Max: from env.RATE_LIMIT_MAX (default 100)
 * - Standard 429 response
 */
export function createGeneralRateLimiter() {
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getClientIp,
    validate: false,
    message: {
      status: 'error',
      errors: [
        {
          message: 'Too many requests, please try again later.',
          code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        },
      ],
    },
  });
}

// ── Default singleton instances ──────────────────────────────────────────────

/** Auth rate limiter singleton for use in route definitions */
export const authRateLimiter = createAuthRateLimiter();

/** General rate limiter singleton for use as app-level middleware */
export const generalRateLimiter = createGeneralRateLimiter();
