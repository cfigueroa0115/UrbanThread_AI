import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { auditMiddleware, extractResource, extractResourceId } from '../../src/middleware/audit.middleware.js';

// ── Mock Prisma ──────────────────────────────────────────────────────────────

const mockCreate = vi.fn().mockResolvedValue({});

vi.mock('../../src/lib/prisma.js', () => ({
  prisma: {
    auditLog: {
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    method: 'POST',
    originalUrl: '/api/v1/clients',
    ip: '127.0.0.1',
    headers: { 'user-agent': 'test-agent' },
    user: undefined,
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response {
  const listeners: Record<string, Array<() => void>> = {};
  const res = {
    statusCode: 200,
    on: vi.fn((event: string, cb: () => void) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event]!.push(cb);
      return res;
    }),
    // Helper to trigger the 'finish' event in tests
    _emit: (event: string) => {
      (listeners[event] ?? []).forEach((cb) => cb());
    },
  };
  return res as unknown as Response;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('auditMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls next() immediately for GET requests without registering a finish listener', () => {
    const req = mockReq({ method: 'GET' });
    const res = mockRes();
    const next = vi.fn();

    auditMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.on).not.toHaveBeenCalled();
  });

  it('calls next() immediately for OPTIONS requests without registering a finish listener', () => {
    const req = mockReq({ method: 'OPTIONS' });
    const res = mockRes();
    const next = vi.fn();

    auditMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.on).not.toHaveBeenCalled();
  });

  it('registers a finish listener and calls next() for POST requests', () => {
    const req = mockReq({ method: 'POST' });
    const res = mockRes();
    const next = vi.fn();

    auditMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });

  it('logs a create action with success result for POST with status < 400', () => {
    const req = mockReq({
      method: 'POST',
      originalUrl: '/api/v1/clients',
      ip: '192.168.1.1',
      headers: { 'user-agent': 'Mozilla/5.0' },
      user: { userId: 'u-1', email: 'a@b.com', roleId: 'r-1', roleName: 'admin', iat: 0, exp: 0 },
    });
    const res = mockRes();
    res.statusCode = 201;
    const next = vi.fn();

    auditMiddleware(req, res, next);
    (res as unknown as { _emit: (e: string) => void })._emit('finish');

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        userId: 'u-1',
        action: 'create',
        resource: 'clients',
        resourceId: null,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        result: 'success',
      },
    });
  });

  it('logs an update action for PUT requests', () => {
    const req = mockReq({
      method: 'PUT',
      originalUrl: '/api/v1/clients/abc-123',
    });
    const res = mockRes();
    res.statusCode = 200;
    const next = vi.fn();

    auditMiddleware(req, res, next);
    (res as unknown as { _emit: (e: string) => void })._emit('finish');

    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: 'update',
        resource: 'clients',
        resourceId: 'abc-123',
      }),
    });
  });

  it('logs a delete action for DELETE requests', () => {
    const req = mockReq({
      method: 'DELETE',
      originalUrl: '/api/v1/documents/doc-456',
    });
    const res = mockRes();
    res.statusCode = 204;
    const next = vi.fn();

    auditMiddleware(req, res, next);
    (res as unknown as { _emit: (e: string) => void })._emit('finish');

    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: 'delete',
        resource: 'documents',
        resourceId: 'doc-456',
      }),
    });
  });

  it('logs failure result when status code is >= 400', () => {
    const req = mockReq({
      method: 'POST',
      originalUrl: '/api/v1/orders',
    });
    const res = mockRes();
    res.statusCode = 400;
    const next = vi.fn();

    auditMiddleware(req, res, next);
    (res as unknown as { _emit: (e: string) => void })._emit('finish');

    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        result: 'failure',
      }),
    });
  });

  it('logs null userId when request is unauthenticated', () => {
    const req = mockReq({
      method: 'POST',
      originalUrl: '/api/v1/auth/otp/request',
      user: undefined,
    });
    const res = mockRes();
    res.statusCode = 200;
    const next = vi.fn();

    auditMiddleware(req, res, next);
    (res as unknown as { _emit: (e: string) => void })._emit('finish');

    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: null,
      }),
    });
  });

  it('does not crash when prisma.create rejects', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockCreate.mockRejectedValueOnce(new Error('DB connection lost'));

    const req = mockReq({ method: 'POST', originalUrl: '/api/v1/clients' });
    const res = mockRes();
    res.statusCode = 201;
    const next = vi.fn();

    auditMiddleware(req, res, next);
    (res as unknown as { _emit: (e: string) => void })._emit('finish');

    // Wait for the promise rejection to be handled
    await vi.waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        '[AuditMiddleware] Failed to write audit log:',
        expect.any(Error),
      );
    });

    consoleError.mockRestore();
  });
});

// ── extractResource ──────────────────────────────────────────────────────────

describe('extractResource', () => {
  it('extracts resource from /api/v1/clients', () => {
    expect(extractResource('/api/v1/clients')).toBe('clients');
  });

  it('extracts resource from /api/v1/clients/123', () => {
    expect(extractResource('/api/v1/clients/123')).toBe('clients');
  });

  it('extracts resource from /api/v1/orders/abc/status', () => {
    expect(extractResource('/api/v1/orders/abc/status')).toBe('orders');
  });

  it('extracts resource from /api/v1/auth/otp/request', () => {
    expect(extractResource('/api/v1/auth/otp/request')).toBe('auth');
  });

  it('extracts resource from path without api prefix', () => {
    expect(extractResource('/health')).toBe('health');
  });

  it('extracts resource from /api/v1/documents/upload', () => {
    expect(extractResource('/api/v1/documents/upload')).toBe('documents');
  });

  it('handles query strings', () => {
    expect(extractResource('/api/v1/clients?page=1&pageSize=20')).toBe('clients');
  });
});

// ── extractResourceId ────────────────────────────────────────────────────────

describe('extractResourceId', () => {
  it('returns null when no ID is present', () => {
    expect(extractResourceId('/api/v1/clients')).toBeNull();
  });

  it('extracts UUID from /api/v1/clients/550e8400-e29b-41d4-a716-446655440000', () => {
    expect(extractResourceId('/api/v1/clients/550e8400-e29b-41d4-a716-446655440000'))
      .toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  it('extracts numeric ID from /api/v1/clients/123', () => {
    expect(extractResourceId('/api/v1/clients/123')).toBe('123');
  });

  it('extracts alphanumeric ID from /api/v1/clients/abc-123', () => {
    expect(extractResourceId('/api/v1/clients/abc-123')).toBe('abc-123');
  });

  it('returns null for reserved sub-resource segments like /upload', () => {
    expect(extractResourceId('/api/v1/documents/upload')).toBeNull();
  });

  it('returns null for reserved sub-resource segments like /status', () => {
    expect(extractResourceId('/api/v1/orders/status')).toBeNull();
  });

  it('handles query strings', () => {
    expect(extractResourceId('/api/v1/clients/abc-123?include=orders')).toBe('abc-123');
  });
});
