import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

// ── Mock dependencies ────────────────────────────────────────────────────────

const mockFindAll = vi.fn();
const mockFindById = vi.fn();
const mockFindByEmail = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockRemove = vi.fn();

vi.mock('../../src/repositories/index.js', () => ({
  userRepository: {
    findAll: (...args: unknown[]) => mockFindAll(...args),
    findById: (...args: unknown[]) => mockFindById(...args),
    findByEmail: (...args: unknown[]) => mockFindByEmail(...args),
    create: (...args: unknown[]) => mockCreate(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
    remove: (...args: unknown[]) => mockRemove(...args),
  },
}));

const mockHashPassword = vi.fn();
vi.mock('../../src/utils/crypto.js', () => ({
  hashPassword: (...args: unknown[]) => mockHashPassword(...args),
}));

// ── Import after mocks ───────────────────────────────────────────────────────

const { getAll, getById, create, update, remove } = await import(
  '../../src/controllers/user.controller.js'
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

const sampleUser = {
  id: 'user-001',
  email: 'admin@test.com',
  passwordHash: '$2a$12$hashedpassword',
  firstName: 'Admin',
  lastName: 'User',
  roleId: 'role-001',
  isActive: true,
  lastLoginAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('User Controller', () => {
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    next = vi.fn();
  });

  // ── getAll ─────────────────────────────────────────────────────────────

  describe('getAll', () => {
    it('returns 200 with users list (passwordHash stripped)', async () => {
      mockFindAll.mockResolvedValue([sampleUser]);

      const req = createMockReq();
      const res = createMockRes();

      await getAll(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data).toHaveLength(1);
      expect(responseData.data[0]).not.toHaveProperty('passwordHash');
      expect(responseData.data[0].email).toBe('admin@test.com');
    });

    it('passes errors to next', async () => {
      const error = new Error('DB error');
      mockFindAll.mockRejectedValue(error);

      const req = createMockReq();
      const res = createMockRes();

      await getAll(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── getById ────────────────────────────────────────────────────────────

  describe('getById', () => {
    it('returns 200 with user (passwordHash stripped)', async () => {
      mockFindById.mockResolvedValue(sampleUser);

      const req = createMockReq({ params: { id: 'user-001' } as Record<string, string> });
      const res = createMockRes();

      await getById(req, res, next);

      expect(mockFindById).toHaveBeenCalledWith('user-001');
      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.data).not.toHaveProperty('passwordHash');
    });

    it('passes NotFoundError to next when user does not exist', async () => {
      mockFindById.mockResolvedValue(null);

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
    it('returns 201 with created user (password hashed via crypto.hashPassword)', async () => {
      mockFindByEmail.mockResolvedValue(null);
      mockHashPassword.mockResolvedValue('$2a$12$hashed');
      mockCreate.mockResolvedValue({ ...sampleUser, passwordHash: '$2a$12$hashed' });

      const req = createMockReq({
        body: {
          email: 'admin@test.com',
          password: 'SecurePass123!',
          firstName: 'Admin',
          lastName: 'User',
          roleId: 'role-001',
        },
      });
      const res = createMockRes();

      await create(req, res, next);

      expect(mockHashPassword).toHaveBeenCalledWith('SecurePass123!');
      expect(mockCreate).toHaveBeenCalledWith({
        email: 'admin@test.com',
        passwordHash: '$2a$12$hashed',
        firstName: 'Admin',
        lastName: 'User',
        role: { connect: { id: 'role-001' } },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.data).not.toHaveProperty('passwordHash');
    });

    it('passes ConflictError when email already exists', async () => {
      mockFindByEmail.mockResolvedValue(sampleUser);

      const req = createMockReq({
        body: {
          email: 'admin@test.com',
          password: 'SecurePass123!',
          firstName: 'Admin',
          lastName: 'User',
          roleId: 'role-001',
        },
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
    it('returns 200 with updated user', async () => {
      mockFindById.mockResolvedValue(sampleUser);
      mockFindByEmail.mockResolvedValue(null);
      mockUpdate.mockResolvedValue({ ...sampleUser, firstName: 'Updated' });

      const req = createMockReq({
        params: { id: 'user-001' } as Record<string, string>,
        body: { firstName: 'Updated' },
      });
      const res = createMockRes();

      await update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.data).not.toHaveProperty('passwordHash');
    });

    it('hashes password via crypto.hashPassword on update', async () => {
      mockFindById.mockResolvedValue(sampleUser);
      mockHashPassword.mockResolvedValue('$2a$12$newhash');
      mockUpdate.mockResolvedValue({ ...sampleUser, passwordHash: '$2a$12$newhash' });

      const req = createMockReq({
        params: { id: 'user-001' } as Record<string, string>,
        body: { password: 'NewPassword123!' },
      });
      const res = createMockRes();

      await update(req, res, next);

      expect(mockHashPassword).toHaveBeenCalledWith('NewPassword123!');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('passes NotFoundError when user does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      const req = createMockReq({
        params: { id: 'nonexistent' } as Record<string, string>,
        body: { firstName: 'Updated' },
      });
      const res = createMockRes();

      await update(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(error.statusCode).toBe(404);
    });

    it('passes ConflictError when changing to existing email', async () => {
      mockFindById.mockResolvedValue(sampleUser);
      mockFindByEmail.mockResolvedValue({ ...sampleUser, id: 'other-user' });

      const req = createMockReq({
        params: { id: 'user-001' } as Record<string, string>,
        body: { email: 'other@test.com' },
      });
      const res = createMockRes();

      await update(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(error.statusCode).toBe(409);
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('returns 200 with success message', async () => {
      mockFindById.mockResolvedValue(sampleUser);
      mockRemove.mockResolvedValue(sampleUser);

      const req = createMockReq({ params: { id: 'user-001' } as Record<string, string> });
      const res = createMockRes();

      await remove(req, res, next);

      expect(mockRemove).toHaveBeenCalledWith('user-001');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('passes NotFoundError when user does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      const req = createMockReq({ params: { id: 'nonexistent' } as Record<string, string> });
      const res = createMockRes();

      await remove(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(error.statusCode).toBe(404);
    });
  });
});
