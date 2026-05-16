import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../src/middleware/validation.middleware.js';
import { ERROR_CODES } from '@shared/constants/index.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    params: {},
    query: {},
    ...overrides,
  } as unknown as Request;
}

function mockRes() {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis() as unknown as Response['status'],
    json: vi.fn().mockReturnThis() as unknown as Response['json'],
  };
  return res as Response;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('validate middleware', () => {
  // ── Body validation ──────────────────────────────────────────────────────

  describe('body validation', () => {
    const bodySchema = z.object({
      name: z.string().min(1, 'El nombre es requerido'),
      email: z.string().email('Formato de correo inválido'),
    });

    it('calls next() and replaces body with parsed data on valid input', () => {
      const middleware = validate({ body: bodySchema });
      const req = mockReq({ body: { name: 'Ana', email: 'ana@test.com' } });
      const res = mockRes();
      const next = vi.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(res.status).not.toHaveBeenCalled();
      expect(req.body).toEqual({ name: 'Ana', email: 'ana@test.com' });
    });

    it('returns 400 with field errors on invalid body', () => {
      const middleware = validate({ body: bodySchema });
      const req = mockReq({ body: { name: '', email: 'not-an-email' } });
      const res = mockRes();
      const next = vi.fn();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: 'El nombre es requerido',
            code: ERROR_CODES.VALIDATION_ERROR,
          }),
          expect.objectContaining({
            field: 'email',
            message: 'Formato de correo inválido',
            code: ERROR_CODES.VALIDATION_ERROR,
          }),
        ]),
      });
    });

    it('returns 400 when required fields are missing', () => {
      const middleware = validate({ body: bodySchema });
      const req = mockReq({ body: {} });
      const res = mockRes();
      const next = vi.fn();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      const jsonCall = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(jsonCall.status).toBe('error');
      expect(jsonCall.errors.length).toBeGreaterThanOrEqual(2);
      for (const err of jsonCall.errors) {
        expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      }
    });
  });

  // ── Params validation ────────────────────────────────────────────────────

  describe('params validation', () => {
    const paramsSchema = z.object({
      id: z.string().uuid('ID inválido'),
    });

    it('calls next() and replaces params with parsed data on valid input', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      const middleware = validate({ params: paramsSchema });
      const req = mockReq({ params: { id: validUuid } as Record<string, string> });
      const res = mockRes();
      const next = vi.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(req.params).toEqual({ id: validUuid });
    });

    it('returns 400 when params are invalid', () => {
      const middleware = validate({ params: paramsSchema });
      const req = mockReq({ params: { id: 'not-a-uuid' } as Record<string, string> });
      const res = mockRes();
      const next = vi.fn();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        errors: [
          {
            field: 'id',
            message: 'ID inválido',
            code: ERROR_CODES.VALIDATION_ERROR,
          },
        ],
      });
    });
  });

  // ── Query validation ─────────────────────────────────────────────────────

  describe('query validation', () => {
    const querySchema = z.object({
      page: z.coerce.number().int().positive().default(1),
      pageSize: z.coerce.number().int().positive().max(100).default(20),
    });

    it('calls next() and replaces query with coerced/defaulted data', () => {
      const middleware = validate({ query: querySchema });
      const req = mockReq({ query: { page: '3', pageSize: '50' } as Record<string, string> });
      const res = mockRes();
      const next = vi.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(req.query).toEqual({ page: 3, pageSize: 50 });
    });

    it('applies defaults when query params are omitted', () => {
      const middleware = validate({ query: querySchema });
      const req = mockReq({ query: {} });
      const res = mockRes();
      const next = vi.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(req.query).toEqual({ page: 1, pageSize: 20 });
    });

    it('returns 400 when query values are out of range', () => {
      const middleware = validate({ query: querySchema });
      const req = mockReq({ query: { page: '-1', pageSize: '200' } as Record<string, string> });
      const res = mockRes();
      const next = vi.fn();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      const jsonCall = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(jsonCall.status).toBe('error');
      expect(jsonCall.errors.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Combined validation ──────────────────────────────────────────────────

  describe('combined body + params + query validation', () => {
    const bodySchema = z.object({ name: z.string().min(1) });
    const paramsSchema = z.object({ id: z.string().uuid() });
    const querySchema = z.object({ include: z.string().optional() });

    it('validates all three sources and calls next() when all are valid', () => {
      const middleware = validate({ body: bodySchema, params: paramsSchema, query: querySchema });
      const req = mockReq({
        body: { name: 'Test' },
        params: { id: '550e8400-e29b-41d4-a716-446655440000' } as Record<string, string>,
        query: { include: 'details' },
      });
      const res = mockRes();
      const next = vi.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
    });

    it('aggregates errors from body and params when both are invalid', () => {
      const middleware = validate({ body: bodySchema, params: paramsSchema, query: querySchema });
      const req = mockReq({
        body: { name: '' },
        params: { id: 'bad' } as Record<string, string>,
        query: {},
      });
      const res = mockRes();
      const next = vi.fn();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      const jsonCall = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(jsonCall.errors.length).toBeGreaterThanOrEqual(2);
      const fields = jsonCall.errors.map((e: { field: string }) => e.field);
      expect(fields).toContain('name');
      expect(fields).toContain('id');
    });
  });

  // ── No schemas provided ──────────────────────────────────────────────────

  describe('no schemas provided', () => {
    it('calls next() immediately when no schemas are given', () => {
      const middleware = validate({});
      const req = mockReq({ body: { anything: true } });
      const res = mockRes();
      const next = vi.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  // ── Nested field paths ───────────────────────────────────────────────────

  describe('nested field paths', () => {
    it('reports nested field paths with dot notation', () => {
      const schema = z.object({
        address: z.object({
          city: z.string().min(1, 'La ciudad es requerida'),
        }),
      });
      const middleware = validate({ body: schema });
      const req = mockReq({ body: { address: { city: '' } } });
      const res = mockRes();
      const next = vi.fn();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        errors: [
          {
            field: 'address.city',
            message: 'La ciudad es requerida',
            code: ERROR_CODES.VALIDATION_ERROR,
          },
        ],
      });
    });
  });

  // ── Strips unknown keys (default Zod behavior) ──────────────────────────

  describe('data coercion', () => {
    it('strips unknown keys from body by default', () => {
      const schema = z.object({ name: z.string() });
      const middleware = validate({ body: schema });
      const req = mockReq({ body: { name: 'Ana', extra: 'ignored' } });
      const res = mockRes();
      const next = vi.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(req.body).toEqual({ name: 'Ana' });
    });
  });
});
