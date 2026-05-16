import { ERROR_CODES, type ErrorCode } from '@shared/constants/index.js';

// ── Base application error ───────────────────────────────────────────────────

/**
 * Base class for all typed application errors.
 *
 * Carries an HTTP `statusCode`, an internal `code` from `ERROR_CODES`, and an
 * optional `field` for validation-style errors.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly field?: string;

  constructor(message: string, statusCode: number, code: ErrorCode, field?: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.field = field;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ── Concrete error classes ───────────────────────────────────────────────────

/** 400 — input validation failed */
export class ValidationError extends AppError {
  constructor(message = 'Validation failed', field?: string) {
    super(message, 400, ERROR_CODES.VALIDATION_ERROR, field);
  }
}

/** 401 — missing or invalid authentication credentials */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required', code: ErrorCode = ERROR_CODES.AUTH_TOKEN_INVALID) {
    super(message, 401, code);
  }
}

/** 403 — authenticated but not authorised for the resource */
export class AuthorizationError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, ERROR_CODES.RBAC_FORBIDDEN);
  }
}

/** 404 — requested resource does not exist */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, ERROR_CODES.NOT_FOUND);
  }
}

/** 409 — resource conflict (duplicate, state mismatch, etc.) */
export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, ERROR_CODES.CONFLICT);
  }
}
