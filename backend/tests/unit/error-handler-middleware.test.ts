import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import { errorHandler } from '../../src/middleware/error-handler.middleware.js';
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
} from '../../src/utils/errors.js';
import { ERROR_CODES } from '@shared/constants/index.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockReq(): Request {
  return {} as Request;
}

function mockRes() {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis() as unknown as Response['status'],
    json: vi.fn().mockReturnThis() as unknown as Response['json'],
  };
  return res as Response;
}

const noopNext: NextFunction = vi.fn();

/** UUID v4 pattern */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** ISO 8601 pattern */
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function getJsonBody(res: Response) {
  return (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('errorHandler middleware', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // ── Meta fields ────────────────────────────────────────────────────────

  describe('meta fields', () => {
    it('includes requestId (UUID) and timestamp (ISO) in every response', () => {
      const err = new Error('test');
      const res = mockRes();

      errorHandler(err, mockReq(), res, noopNext);

      const body = getJsonBody(res);
      expect(body.meta.requestId).toMatch(UUID_RE);
      expect(body.meta.timestamp).toMatch(ISO_RE);
    });

    it('generates unique requestIds for different errors', () => {
      const res1 = mockRes();
      const res2 = mockRes();

      errorHandler(new Error('a'), mockReq(), res1, noopNext);
      errorHandler(new Error('b'), mockReq(), res2, noopNext);

      const id1 = getJsonBody(res1).meta.requestId;
      const id2 = getJsonBody(res2).meta.requestId;
      expect(id1).not.toBe(id2);
    });
  });

  // ── AppError handling ──────────────────────────────────────────────────

  describe('AppError handling', () => {
    it('handles ValidationError (400)', () => {
      const err = new ValidationError('Name is required', 'name');
      const res = mockRes();

      errorHandler(err, mockReq(), res, noopNext);

      expect(res.status).toHaveBeenCalledWith(400);
      const body = getJsonBody(res);
      expect(body.status).toBe('error');
      expect(body.errors).toEqual([
        { field: 'name', message: 'Name is required', code: ERROR_CODES.VALIDATION_ERROR },
      ]);
    });

    it('handles AuthenticationError (401)', () => {
      const err = new AuthenticationError('Token expired', ERROR_CODES.AUTH_TOKEN_EXPIRED);
      const res = mockRes();

      errorHandler(err, mockReq(), res, noopNext);

      expect(res.status).toHaveBeenCalledWith(401);
      const body = getJsonBody(res);
      expect(body.errors).toEqual([
        { message: 'Token expired', code: ERROR_CODES.AUTH_TOKEN_EXPIRED },
      ]);
    });

    it('handles AuthorizationError (403)', () => {
      const err = new AuthorizationError();
      const res = mockRes();

      errorHandler(err, mockReq(), res, noopNext);

      expect(res.status).toHaveBeenCalledWith(403);
      const body = getJsonBody(res);
      expect(body.errors).toEqual([
        { message: 'Forbidden', code: ERROR_CODES.RBAC_FORBIDDEN },
      ]);
    });

    it('handles NotFoundError (404)', () => {
      const err = new NotFoundError('Client not found');
      const res = mockRes();

      errorHandler(err, mockReq(), res, noopNext);

      expect(res.status).toHaveBeenCalledWith(404);
      const body = getJsonBody(res);
      expect(body.errors).toEqual([
        { message: 'Client not found', code: ERROR_CODES.NOT_FOUND },
      ]);
    });

    it('handles ConflictError (409)', () => {
      const err = new ConflictError('Duplicate email');
      const res = mockRes();

      errorHandler(err, mockReq(), res, noopNext);

      expect(res.status).toHaveBeenCalledWith(409);
      const body = getJsonBody(res);
      expect(body.errors).toEqual([
        { message: 'Duplicate email', code: ERROR_CODES.CONFLICT },
      ]);
    });

    it('omits field from error item when AppError has no field', () => {
      const err = new NotFoundError();
      const res = mockRes();

      errorHandler(err, mockReq(), res, noopNext);

      const body = getJsonBody(res);
      expect(body.errors[0]).not.toHaveProperty('field');
    });
  });

  // ── ZodError handling ──────────────────────────────────────────────────

  describe('ZodError handling', () => {
    it('maps ZodError to 400 with field-level errors', () => {
      const schema = z.object({
        email: z.string().email('Invalid email'),
        age: z.number().min(18, 'Must be 18+'),
      });

      let zodError: ZodError;
      try {
        schema.parse({ email: 'bad', age: 10 });
        throw new Error('should not reach');
      } catch (e) {
        zodError = e as ZodError;
      }

      const res = mockRes();
      errorHandler(zodError!, mockReq(), res, noopNext);

      expect(res.status).toHaveBeenCalledWith(400);
      const body = getJsonBody(res);
      expect(body.status).toBe('error');
      expect(body.errors).toHaveLength(2);

      const fields = body.errors.map((e: { field?: string }) => e.field);
      expect(fields).toContain('email');
      expect(fields).toContain('age');

      for (const err of body.errors) {
        expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      }
    });

    it('handles ZodError with nested paths', () => {
      const schema = z.object({
        address: z.object({
          city: z.string().min(1, 'City required'),
        }),
      });

      let zodError: ZodError;
      try {
        schema.parse({ address: { city: '' } });
        throw new Error('should not reach');
      } catch (e) {
        zodError = e as ZodError;
      }

      const res = mockRes();
      errorHandler(zodError!, mockReq(), res, noopNext);

      const body = getJsonBody(res);
      expect(body.errors[0].field).toBe('address.city');
    });

    it('omits field when ZodError path is empty', () => {
      const schema = z.string().min(1, 'Required');

      let zodError: ZodError;
      try {
        schema.parse('');
        throw new Error('should not reach');
      } catch (e) {
        zodError = e as ZodError;
      }

      const res = mockRes();
      errorHandler(zodError!, mockReq(), res, noopNext);

      const body = getJsonBody(res);
      expect(body.errors[0].field).toBeUndefined();
    });
  });

  // ── Unknown errors ─────────────────────────────────────────────────────

  describe('unknown errors', () => {
    it('returns 500 with error message in non-production', () => {
      const err = new Error('Something broke');
      const res = mockRes();

      errorHandler(err, mockReq(), res, noopNext);

      expect(res.status).toHaveBeenCalledWith(500);
      const body = getJsonBody(res);
      expect(body.status).toBe('error');
      expect(body.errors).toEqual([
        { message: 'Something broke', code: ERROR_CODES.INTERNAL_ERROR },
      ]);
    });

    it('always includes status, errors array, and meta', () => {
      const err = new Error('oops');
      const res = mockRes();

      errorHandler(err, mockReq(), res, noopNext);

      const body = getJsonBody(res);
      expect(body).toHaveProperty('status', 'error');
      expect(Array.isArray(body.errors)).toBe(true);
      expect(body.errors.length).toBeGreaterThan(0);
      expect(body).toHaveProperty('meta');
      expect(body.meta).toHaveProperty('requestId');
      expect(body.meta).toHaveProperty('timestamp');
    });
  });

  // ── Console logging ────────────────────────────────────────────────────

  describe('console logging', () => {
    it('logs AppError to console in non-production', () => {
      const err = new NotFoundError('missing');
      const res = mockRes();

      errorHandler(err, mockReq(), res, noopNext);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('logs ZodError to console in non-production', () => {
      const schema = z.string().min(1);
      let zodError: ZodError;
      try {
        schema.parse('');
        throw new Error('unreachable');
      } catch (e) {
        zodError = e as ZodError;
      }

      const res = mockRes();
      errorHandler(zodError!, mockReq(), res, noopNext);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('logs unknown errors to console in non-production', () => {
      const err = new Error('unexpected');
      const res = mockRes();

      errorHandler(err, mockReq(), res, noopNext);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
