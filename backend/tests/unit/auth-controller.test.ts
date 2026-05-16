import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

// ── Mock auth service ────────────────────────────────────────────────────────

const mockAuthenticateAdmin = vi.fn();
const mockRefreshToken = vi.fn();
const mockRevokeToken = vi.fn();

vi.mock('../../src/services/auth.service.js', () => ({
  authenticateAdmin: (...args: unknown[]) => mockAuthenticateAdmin(...args),
  refreshToken: (...args: unknown[]) => mockRefreshToken(...args),
  revokeToken: (...args: unknown[]) => mockRevokeToken(...args),
}));

// ── Import after mocks ───────────────────────────────────────────────────────

const { loginAdmin, refreshToken, logout } = await import(
  '../../src/controllers/auth.controller.js'
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function createMockReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
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

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Auth Controller', () => {
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    next = vi.fn();
  });

  // ── loginAdmin ─────────────────────────────────────────────────────────

  describe('loginAdmin', () => {
    it('returns 200 with token and user on successful login', async () => {
      const mockResult = {
        token: 'jwt-token-123',
        user: { id: 'user-001', email: 'admin@test.com' },
      };
      mockAuthenticateAdmin.mockResolvedValue(mockResult);

      const req = createMockReq({
        body: { email: 'admin@test.com', password: 'SecurePass123!' },
      });
      const res = createMockRes();

      await loginAdmin(req, res, next);

      expect(mockAuthenticateAdmin).toHaveBeenCalledWith('admin@test.com', 'SecurePass123!');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          token: 'jwt-token-123',
          user: { id: 'user-001', email: 'admin@test.com' },
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('passes errors to next on authentication failure', async () => {
      const error = new Error('Invalid credentials');
      mockAuthenticateAdmin.mockRejectedValue(error);

      const req = createMockReq({
        body: { email: 'bad@test.com', password: 'wrong' },
      });
      const res = createMockRes();

      await loginAdmin(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  // ── refreshToken ───────────────────────────────────────────────────────

  describe('refreshToken', () => {
    it('returns 200 with new token on successful refresh', async () => {
      mockRefreshToken.mockReturnValue('new-jwt-token');

      const req = createMockReq({
        headers: { authorization: 'Bearer old-jwt-token' },
      });
      const res = createMockRes();

      await refreshToken(req, res, next);

      expect(mockRefreshToken).toHaveBeenCalledWith('old-jwt-token');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { token: 'new-jwt-token' },
      });
    });

    it('extracts token from Bearer header correctly', async () => {
      mockRefreshToken.mockReturnValue('refreshed');

      const req = createMockReq({
        headers: { authorization: 'Bearer my-token-value' },
      });
      const res = createMockRes();

      await refreshToken(req, res, next);

      expect(mockRefreshToken).toHaveBeenCalledWith('my-token-value');
    });

    it('passes empty string when no authorization header', async () => {
      mockRefreshToken.mockReturnValue('refreshed');

      const req = createMockReq({ headers: {} });
      const res = createMockRes();

      await refreshToken(req, res, next);

      expect(mockRefreshToken).toHaveBeenCalledWith('');
    });

    it('passes errors to next on refresh failure', async () => {
      const error = new Error('Token invalid');
      mockRefreshToken.mockImplementation(() => { throw error; });

      const req = createMockReq({
        headers: { authorization: 'Bearer expired-token' },
      });
      const res = createMockRes();

      await refreshToken(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── logout ─────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('returns 200 with success message on logout', async () => {
      mockRevokeToken.mockResolvedValue(undefined);

      const req = createMockReq({
        headers: { authorization: 'Bearer session-token' },
      });
      const res = createMockRes();

      await logout(req, res, next);

      expect(mockRevokeToken).toHaveBeenCalledWith('session-token');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { message: 'Sesión cerrada exitosamente' },
      });
    });

    it('passes errors to next on revoke failure', async () => {
      const error = new Error('Revoke failed');
      mockRevokeToken.mockRejectedValue(error);

      const req = createMockReq({
        headers: { authorization: 'Bearer bad-token' },
      });
      const res = createMockRes();

      await logout(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
