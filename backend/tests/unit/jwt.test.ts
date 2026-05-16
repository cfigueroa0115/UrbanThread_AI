import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../../src/utils/jwt.js';
import type { GenerateTokenPayload } from '../../src/utils/jwt.js';

const samplePayload: GenerateTokenPayload = {
  userId: 'user-123',
  email: 'admin@urbanthread.ai',
  roleId: 'role-1',
  roleName: 'admin',
};

describe('JWT utilities', () => {
  describe('generateToken', () => {
    it('returns a valid JWT string', () => {
      const token = generateToken(samplePayload);
      expect(typeof token).toBe('string');
      // JWT has three dot-separated parts
      expect(token.split('.')).toHaveLength(3);
    });

    it('embeds the correct payload claims', () => {
      const token = generateToken(samplePayload);
      const decoded = jwt.decode(token) as Record<string, unknown>;

      expect(decoded.userId).toBe(samplePayload.userId);
      expect(decoded.email).toBe(samplePayload.email);
      expect(decoded.roleId).toBe(samplePayload.roleId);
      expect(decoded.roleName).toBe(samplePayload.roleName);
    });

    it('includes iat and exp claims', () => {
      const token = generateToken(samplePayload);
      const decoded = jwt.decode(token) as Record<string, unknown>;

      expect(decoded.iat).toBeTypeOf('number');
      expect(decoded.exp).toBeTypeOf('number');
    });
  });

  describe('verifyToken', () => {
    it('returns the decoded payload for a valid token', () => {
      const token = generateToken(samplePayload);
      const payload = verifyToken(token);

      expect(payload.userId).toBe(samplePayload.userId);
      expect(payload.email).toBe(samplePayload.email);
      expect(payload.roleId).toBe(samplePayload.roleId);
      expect(payload.roleName).toBe(samplePayload.roleName);
      expect(payload.iat).toBeTypeOf('number');
      expect(payload.exp).toBeTypeOf('number');
    });

    it('throws TokenExpiredError for an expired token', () => {
      const secret = process.env.JWT_SECRET ?? 'test-jwt-secret-minimum-16-chars';
      const token = jwt.sign(samplePayload, secret, { expiresIn: '0s' });

      expect(() => verifyToken(token)).toThrow(jwt.TokenExpiredError);
    });

    it('throws JsonWebTokenError for a tampered token', () => {
      const token = generateToken(samplePayload);
      const tampered = token.slice(0, -4) + 'XXXX';

      expect(() => verifyToken(tampered)).toThrow(jwt.JsonWebTokenError);
    });

    it('throws JsonWebTokenError for a completely invalid string', () => {
      expect(() => verifyToken('not-a-jwt')).toThrow(jwt.JsonWebTokenError);
    });
  });
});
