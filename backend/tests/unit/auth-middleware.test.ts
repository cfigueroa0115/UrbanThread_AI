import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { authMiddleware, optionalAuth } from '../../src/middleware/auth.middleware.js';
import { generateToken } from '../../src/utils/jwt.js';
import jwt from 'jsonwebtoken';
import { ERROR_CODES } from '@shared/constants/index.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockReq(authHeader?: string): Partial<Request> {
  return {
    headers: authHeader ? { authorization: authHeader } : {},
  };
}

function mockRes() {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis() as unknown as Response['status'],
    json: vi.fn().mockReturnThis() as unknown as Response['json'],
  };
  return res as Response;
}

const nextFn: NextFunction = vi.fn();

const validPayload = {
  userId: 'u-1',
  email: 'test@urbanthread.ai',
  roleId: 'r-1',
  roleName: 'admin',
};

// ── authMiddleware ───────────────────────────────────────────────────────────

describe('authMiddleware', () => {
  it('returns 401 AUTH_TOKEN_MISSING when no Authorization header', () => {
    const req = mockReq() as Request;
    const res = mockRes();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      errors: [{ message: 'Authentication required', code: ERROR_CODES.AUTH_TOKEN_MISSING }],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 AUTH_TOKEN_MISSING when Authorization header has no Bearer prefix', () => {
    const req = mockReq('Basic abc123') as Request;
    const res = mockRes();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: [expect.objectContaining({ code: ERROR_CODES.AUTH_TOKEN_MISSING })],
      }),
    );
  });

  it('returns 401 AUTH_TOKEN_EXPIRED for an expired token', () => {
    const secret = process.env.JWT_SECRET ?? 'test-jwt-secret-minimum-16-chars';
    const expiredToken = jwt.sign(validPayload, secret, { expiresIn: '0s' });
    const req = mockReq(`Bearer ${expiredToken}`) as Request;
    const res = mockRes();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: [expect.objectContaining({ code: ERROR_CODES.AUTH_TOKEN_EXPIRED })],
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 AUTH_TOKEN_INVALID for a tampered token', () => {
    const token = generateToken(validPayload);
    const tampered = token.slice(0, -4) + 'XXXX';
    const req = mockReq(`Bearer ${tampered}`) as Request;
    const res = mockRes();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: [expect.objectContaining({ code: ERROR_CODES.AUTH_TOKEN_INVALID })],
      }),
    );
  });

  it('attaches decoded user to req and calls next() for a valid token', () => {
    const token = generateToken(validPayload);
    const req = mockReq(`Bearer ${token}`) as Request;
    const res = mockRes();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toBeDefined();
    expect(req.user!.userId).toBe(validPayload.userId);
    expect(req.user!.email).toBe(validPayload.email);
    expect(req.user!.roleId).toBe(validPayload.roleId);
    expect(req.user!.roleName).toBe(validPayload.roleName);
  });
});

// ── optionalAuth ─────────────────────────────────────────────────────────────

describe('optionalAuth', () => {
  it('calls next() without setting user when no token is present', () => {
    const req = mockReq() as Request;
    const res = mockRes();
    const next = vi.fn();

    optionalAuth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toBeUndefined();
  });

  it('attaches user and calls next() when a valid token is present', () => {
    const token = generateToken(validPayload);
    const req = mockReq(`Bearer ${token}`) as Request;
    const res = mockRes();
    const next = vi.fn();

    optionalAuth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toBeDefined();
    expect(req.user!.userId).toBe(validPayload.userId);
  });

  it('calls next() without user when token is invalid', () => {
    const req = mockReq('Bearer invalid-token') as Request;
    const res = mockRes();
    const next = vi.fn();

    optionalAuth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toBeUndefined();
  });

  it('calls next() without user when token is expired', () => {
    const secret = process.env.JWT_SECRET ?? 'test-jwt-secret-minimum-16-chars';
    const expiredToken = jwt.sign(validPayload, secret, { expiresIn: '0s' });
    const req = mockReq(`Bearer ${expiredToken}`) as Request;
    const res = mockRes();
    const next = vi.fn();

    optionalAuth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toBeUndefined();
  });
});
