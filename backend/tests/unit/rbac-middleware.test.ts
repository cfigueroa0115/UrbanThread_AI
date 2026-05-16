import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { requirePermission, clearPermissionCache } from '../../src/middleware/rbac.middleware.js';
import { ERROR_CODES } from '@shared/constants/index.js';

// ── Mock Prisma ──────────────────────────────────────────────────────────────

const mockFindMany = vi.fn();

vi.mock('../../src/lib/prisma.js', () => ({
  prisma: {
    rolePermission: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
  },
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockReq(user?: { userId: string; email: string; roleId: string; roleName: string }): Partial<Request> {
  return { user: user as Request['user'] };
}

function mockRes() {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis() as unknown as Response['status'],
    json: vi.fn().mockReturnThis() as unknown as Response['json'],
  };
  return res as Response;
}

const forbiddenResponse = {
  status: 'error',
  errors: [{ message: 'Insufficient permissions', code: ERROR_CODES.RBAC_FORBIDDEN }],
};

const testUser = {
  userId: 'u-1',
  email: 'admin@urbanthread.ai',
  roleId: 'role-admin',
  roleName: 'admin',
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('requirePermission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearPermissionCache();
  });

  it('returns 403 RBAC_FORBIDDEN when req.user is not set', async () => {
    const middleware = requirePermission('users', 'read');
    const req = mockReq() as Request;
    const res = mockRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(forbiddenResponse);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() when user role has the required permission', async () => {
    mockFindMany.mockResolvedValue([
      {
        roleId: 'role-admin',
        permissionId: 'perm-1',
        permission: { id: 'perm-1', resource: 'users', action: 'read', name: 'users:read' },
      },
    ]);

    const middleware = requirePermission('users', 'read');
    const req = mockReq(testUser) as Request;
    const res = mockRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 403 RBAC_FORBIDDEN when user role lacks the required permission', async () => {
    mockFindMany.mockResolvedValue([
      {
        roleId: 'role-admin',
        permissionId: 'perm-1',
        permission: { id: 'perm-1', resource: 'users', action: 'read', name: 'users:read' },
      },
    ]);

    const middleware = requirePermission('users', 'delete');
    const req = mockReq(testUser) as Request;
    const res = mockRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(forbiddenResponse);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 RBAC_FORBIDDEN when role has no permissions at all', async () => {
    mockFindMany.mockResolvedValue([]);

    const middleware = requirePermission('clients', 'create');
    const req = mockReq(testUser) as Request;
    const res = mockRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(forbiddenResponse);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 RBAC_FORBIDDEN when Prisma query throws an error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const middleware = requirePermission('users', 'read');
    const req = mockReq(testUser) as Request;
    const res = mockRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(forbiddenResponse);
    expect(next).not.toHaveBeenCalled();
  });

  it('caches permissions and does not query DB on second call for same role', async () => {
    mockFindMany.mockResolvedValue([
      {
        roleId: 'role-admin',
        permissionId: 'perm-1',
        permission: { id: 'perm-1', resource: 'orders', action: 'read', name: 'orders:read' },
      },
    ]);

    const middleware = requirePermission('orders', 'read');
    const req = mockReq(testUser) as Request;
    const res = mockRes();
    const next = vi.fn();

    // First call — hits DB
    await middleware(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(mockFindMany).toHaveBeenCalledOnce();

    // Second call — should use cache
    const req2 = mockReq(testUser) as Request;
    const res2 = mockRes();
    const next2 = vi.fn();

    await middleware(req2, res2, next2);
    expect(next2).toHaveBeenCalledOnce();
    expect(mockFindMany).toHaveBeenCalledOnce(); // still 1 call total
  });

  it('clearPermissionCache forces a fresh DB query', async () => {
    mockFindMany.mockResolvedValue([
      {
        roleId: 'role-admin',
        permissionId: 'perm-1',
        permission: { id: 'perm-1', resource: 'orders', action: 'read', name: 'orders:read' },
      },
    ]);

    const middleware = requirePermission('orders', 'read');
    const req = mockReq(testUser) as Request;
    const res = mockRes();
    const next = vi.fn();

    await middleware(req, res, next);
    expect(mockFindMany).toHaveBeenCalledOnce();

    // Clear cache and call again
    clearPermissionCache('role-admin');

    const req2 = mockReq(testUser) as Request;
    const res2 = mockRes();
    const next2 = vi.fn();

    await middleware(req2, res2, next2);
    expect(mockFindMany).toHaveBeenCalledTimes(2);
  });

  it('queries with the correct roleId and includes permission relation', async () => {
    mockFindMany.mockResolvedValue([]);

    const middleware = requirePermission('clients', 'update');
    const req = mockReq(testUser) as Request;
    const res = mockRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { roleId: 'role-admin' },
      include: { permission: true },
    });
  });
});
