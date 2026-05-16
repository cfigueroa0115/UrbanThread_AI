import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

// ── Mock Prisma ──────────────────────────────────────────────────────────────

const mockRoleFindMany = vi.fn();
const mockRoleFindUnique = vi.fn();
const mockRoleCreate = vi.fn();
const mockRoleUpdate = vi.fn();
const mockRolePermissionDeleteMany = vi.fn();
const mockPermissionFindMany = vi.fn();

vi.mock('../../src/lib/prisma.js', () => ({
  prisma: {
    role: {
      findMany: (...args: unknown[]) => mockRoleFindMany(...args),
      findUnique: (...args: unknown[]) => mockRoleFindUnique(...args),
      create: (...args: unknown[]) => mockRoleCreate(...args),
      update: (...args: unknown[]) => mockRoleUpdate(...args),
    },
    rolePermission: {
      deleteMany: (...args: unknown[]) => mockRolePermissionDeleteMany(...args),
    },
    permission: {
      findMany: (...args: unknown[]) => mockPermissionFindMany(...args),
    },
  },
}));

// ── Import after mocks ───────────────────────────────────────────────────────

const { getAll, getById, create, update, getPermissions } = await import(
  '../../src/controllers/role.controller.js'
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function createMockReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    params: {},
    headers: {},
    ...overrides,
  } as Request;
}

function createMockRes(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

const sampleRole = {
  id: 'role-001',
  name: 'admin',
  description: 'Administrator role',
  isSystem: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  permissions: [],
};

const samplePermission = {
  id: 'perm-001',
  name: 'users:read',
  resource: 'users',
  action: 'read',
  description: 'Read users',
  createdAt: new Date(),
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Role Controller', () => {
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    next = vi.fn();
  });

  // ── getAll ─────────────────────────────────────────────────────────────

  describe('getAll', () => {
    it('returns 200 with roles list', async () => {
      mockRoleFindMany.mockResolvedValue([sampleRole]);

      const req = createMockReq();
      const res = createMockRes();

      await getAll(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data).toHaveLength(1);
      expect(responseData.data[0].name).toBe('admin');
    });

    it('passes errors to next', async () => {
      const error = new Error('DB error');
      mockRoleFindMany.mockRejectedValue(error);

      const req = createMockReq();
      const res = createMockRes();

      await getAll(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── getById ────────────────────────────────────────────────────────────

  describe('getById', () => {
    it('returns 200 with role', async () => {
      mockRoleFindUnique.mockResolvedValue(sampleRole);

      const req = createMockReq({ params: { id: 'role-001' } as Record<string, string> });
      const res = createMockRes();

      await getById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.data.name).toBe('admin');
    });

    it('passes NotFoundError when role does not exist', async () => {
      mockRoleFindUnique.mockResolvedValue(null);

      const req = createMockReq({ params: { id: 'nonexistent' } as Record<string, string> });
      const res = createMockRes();

      await getById(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(error.statusCode).toBe(404);
    });
  });

  // ── create ─────────────────────────────────────────────────────────────

  describe('create', () => {
    it('returns 201 with created role', async () => {
      mockRoleFindUnique.mockResolvedValue(null);
      mockRoleCreate.mockResolvedValue(sampleRole);

      const req = createMockReq({
        body: { name: 'admin', description: 'Administrator role' },
      });
      const res = createMockRes();

      await create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.status).toBe('success');
    });

    it('passes ConflictError when role name already exists', async () => {
      mockRoleFindUnique.mockResolvedValue(sampleRole);

      const req = createMockReq({
        body: { name: 'admin', description: 'Duplicate' },
      });
      const res = createMockRes();

      await create(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(error.statusCode).toBe(409);
    });
  });

  // ── update ─────────────────────────────────────────────────────────────

  describe('update', () => {
    it('returns 200 with updated role', async () => {
      // First call: find existing role; second call: check duplicate name
      mockRoleFindUnique
        .mockResolvedValueOnce(sampleRole)
        .mockResolvedValueOnce(null);
      mockRoleUpdate.mockResolvedValue({ ...sampleRole, description: 'Updated' });

      const req = createMockReq({
        params: { id: 'role-001' } as Record<string, string>,
        body: { description: 'Updated' },
      });
      const res = createMockRes();

      await update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('passes NotFoundError when role does not exist', async () => {
      mockRoleFindUnique.mockResolvedValue(null);

      const req = createMockReq({
        params: { id: 'nonexistent' } as Record<string, string>,
        body: { description: 'Updated' },
      });
      const res = createMockRes();

      await update(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(error.statusCode).toBe(404);
    });
  });

  // ── getPermissions ─────────────────────────────────────────────────────

  describe('getPermissions', () => {
    it('returns 200 with permissions list', async () => {
      mockPermissionFindMany.mockResolvedValue([samplePermission]);

      const req = createMockReq();
      const res = createMockRes();

      await getPermissions(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data).toHaveLength(1);
      expect(responseData.data[0].resource).toBe('users');
    });

    it('passes errors to next', async () => {
      const error = new Error('DB error');
      mockPermissionFindMany.mockRejectedValue(error);

      const req = createMockReq();
      const res = createMockRes();

      await getPermissions(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
