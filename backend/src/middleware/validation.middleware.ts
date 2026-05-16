import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema, ZodError } from 'zod';
import { ERROR_CODES } from '@shared/constants/index.js';

// ── Types ────────────────────────────────────────────────────────────────────

interface ValidationSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

interface ValidationErrorItem {
  field: string;
  message: string;
  code: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Maps a ZodError to the standard API error format.
 */
function mapZodErrors(error: ZodError): ValidationErrorItem[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
    code: ERROR_CODES.VALIDATION_ERROR,
  }));
}

// ── Middleware factory ────────────────────────────────────────────────────────

/**
 * Express middleware factory that validates `req.body`, `req.params` and/or
 * `req.query` against the supplied Zod schemas.
 *
 * On success the parsed (coerced) values replace the originals and `next()` is
 * called.  On failure a 400 response is returned with the standard error
 * structure.
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationErrorItem[] = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.push(...mapZodErrors(result.error));
      } else {
        req.body = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.push(...mapZodErrors(result.error));
      } else {
        req.params = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.push(...mapZodErrors(result.error));
      } else {
        req.query = result.data;
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        status: 'error',
        errors,
      });
      return;
    }

    next();
  };
}
