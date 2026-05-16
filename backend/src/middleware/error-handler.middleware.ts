import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import crypto from 'node:crypto';
import { AppError } from '../utils/errors.js';
import { ERROR_CODES } from '@shared/constants/index.js';
import { env } from '../config/index.js';

// ── Types ────────────────────────────────────────────────────────────────────

interface ErrorResponseItem {
  field?: string;
  message: string;
  code: string;
}

interface ErrorResponseBody {
  status: 'error';
  errors: ErrorResponseItem[];
  meta: {
    requestId: string;
    timestamp: string;
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function mapZodError(err: ZodError): ErrorResponseItem[] {
  return err.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join('.') : undefined,
    message: issue.message,
    code: ERROR_CODES.VALIDATION_ERROR,
  }));
}

// ── Global error handler ─────────────────────────────────────────────────────

/**
 * Express global error-handling middleware.
 *
 * - `AppError` subclasses → uses their statusCode, code, message, and field.
 * - `ZodError`            → 400 with per-field validation errors.
 * - Everything else       → 500 (details hidden in production).
 *
 * Every response includes `meta.requestId` (UUID v4) and `meta.timestamp`.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ErrorResponseBody>,
  _next: NextFunction,
): void {
  const meta = {
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  // ── AppError (typed application errors) ──────────────────────────────────
  if (err instanceof AppError) {
    if (env.NODE_ENV !== 'production') {
      console.error(`[ERROR] ${err.name}: ${err.message}`, err.stack);
    }

    const errorItem: ErrorResponseItem = {
      message: err.message,
      code: err.code,
    };
    if (err.field) {
      errorItem.field = err.field;
    }

    res.status(err.statusCode).json({
      status: 'error',
      errors: [errorItem],
      meta,
    });
    return;
  }

  // ── ZodError (schema validation failures) ────────────────────────────────
  if (err instanceof ZodError) {
    if (env.NODE_ENV !== 'production') {
      console.error('[ERROR] ZodError:', err.issues);
    }

    res.status(400).json({
      status: 'error',
      errors: mapZodError(err),
      meta,
    });
    return;
  }

  // ── Unknown / unexpected errors ──────────────────────────────────────────
  if (env.NODE_ENV !== 'production') {
    console.error(`[ERROR] Unhandled: ${err.message}`, err.stack);
  }

  res.status(500).json({
    status: 'error',
    errors: [
      {
        message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        code: ERROR_CODES.INTERNAL_ERROR,
      },
    ],
    meta,
  });
}
