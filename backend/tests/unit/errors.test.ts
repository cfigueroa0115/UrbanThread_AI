import { describe, it, expect } from 'vitest';
import { ERROR_CODES } from '@shared/constants/index.js';
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
} from '../../src/utils/errors.js';

// ── AppError base class ──────────────────────────────────────────────────────

describe('AppError', () => {
  it('sets message, statusCode, code, and name', () => {
    const err = new AppError('boom', 500, ERROR_CODES.INTERNAL_ERROR);

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
    expect(err.message).toBe('boom');
    expect(err.statusCode).toBe(500);
    expect(err.code).toBe(ERROR_CODES.INTERNAL_ERROR);
    expect(err.name).toBe('AppError');
    expect(err.field).toBeUndefined();
  });

  it('accepts an optional field parameter', () => {
    const err = new AppError('bad field', 400, ERROR_CODES.VALIDATION_ERROR, 'email');

    expect(err.field).toBe('email');
  });

  it('has a proper stack trace', () => {
    const err = new AppError('trace', 500, ERROR_CODES.INTERNAL_ERROR);

    expect(err.stack).toBeDefined();
    expect(err.stack).toContain('AppError');
  });
});

// ── ValidationError ──────────────────────────────────────────────────────────

describe('ValidationError', () => {
  it('defaults to 400 / VALIDATION_ERROR', () => {
    const err = new ValidationError();

    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(err.message).toBe('Validation failed');
  });

  it('accepts custom message and field', () => {
    const err = new ValidationError('Email is required', 'email');

    expect(err.message).toBe('Email is required');
    expect(err.field).toBe('email');
  });
});

// ── AuthenticationError ──────────────────────────────────────────────────────

describe('AuthenticationError', () => {
  it('defaults to 401 / AUTH_TOKEN_INVALID', () => {
    const err = new AuthenticationError();

    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe(ERROR_CODES.AUTH_TOKEN_INVALID);
    expect(err.message).toBe('Authentication required');
  });

  it('accepts custom message and code', () => {
    const err = new AuthenticationError('Token expired', ERROR_CODES.AUTH_TOKEN_EXPIRED);

    expect(err.message).toBe('Token expired');
    expect(err.code).toBe(ERROR_CODES.AUTH_TOKEN_EXPIRED);
    expect(err.statusCode).toBe(401);
  });
});

// ── AuthorizationError ──────────────────────────────────────────────────────

describe('AuthorizationError', () => {
  it('defaults to 403 / RBAC_FORBIDDEN', () => {
    const err = new AuthorizationError();

    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe(ERROR_CODES.RBAC_FORBIDDEN);
    expect(err.message).toBe('Forbidden');
  });

  it('accepts custom message', () => {
    const err = new AuthorizationError('Insufficient permissions');

    expect(err.message).toBe('Insufficient permissions');
  });
});

// ── NotFoundError ────────────────────────────────────────────────────────────

describe('NotFoundError', () => {
  it('defaults to 404 / NOT_FOUND', () => {
    const err = new NotFoundError();

    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe(ERROR_CODES.NOT_FOUND);
    expect(err.message).toBe('Resource not found');
  });

  it('accepts custom message', () => {
    const err = new NotFoundError('Client not found');

    expect(err.message).toBe('Client not found');
  });
});

// ── ConflictError ────────────────────────────────────────────────────────────

describe('ConflictError', () => {
  it('defaults to 409 / CONFLICT', () => {
    const err = new ConflictError();

    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe(ERROR_CODES.CONFLICT);
    expect(err.message).toBe('Resource conflict');
  });

  it('accepts custom message', () => {
    const err = new ConflictError('Email already registered');

    expect(err.message).toBe('Email already registered');
  });
});
