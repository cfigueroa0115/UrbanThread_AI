import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt.js';
import { ERROR_CODES } from '@shared/constants/index.js';
import type { TokenPayload } from '@shared/types/index.js';

// ── Extend Express Request to carry the decoded user ────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractBearerToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  return undefined;
}

function sendAuthError(res: Response, message: string, code: string): void {
  res.status(401).json({
    status: 'error',
    errors: [{ message, code }],
  });
}

// ── Middleware: require authentication ───────────────────────────────────────

/**
 * Express middleware that verifies a JWT Bearer token.
 *
 * - Missing token  → 401 `AUTH_TOKEN_MISSING`
 * - Expired token  → 401 `AUTH_TOKEN_EXPIRED`
 * - Invalid token  → 401 `AUTH_TOKEN_INVALID`
 * - Valid token    → attaches decoded payload to `req.user` and calls `next()`
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);

  if (!token) {
    sendAuthError(res, 'Authentication required', ERROR_CODES.AUTH_TOKEN_MISSING);
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      sendAuthError(res, 'Token has expired', ERROR_CODES.AUTH_TOKEN_EXPIRED);
    } else {
      sendAuthError(res, 'Invalid token', ERROR_CODES.AUTH_TOKEN_INVALID);
    }
  }
}

// ── Middleware: optional authentication ──────────────────────────────────────

/**
 * Express middleware that attaches the decoded user if a valid Bearer token is
 * present, but does **not** reject the request when the token is missing.
 *
 * Invalid or expired tokens are silently ignored — `req.user` stays `undefined`.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);

  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      // Token present but invalid/expired — continue without user
    }
  }

  next();
}
