import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { ERROR_CODES } from '@shared/constants/index.js';
import { AuthenticationError } from '../../src/utils/errors.js';
import { generateToken as jwtGenerateToken } from '../../src/utils/jwt.js';

// ── Mock repositories and prisma ─────────────────────────────────────────────

const mockFindByEmail = vi.fn();
const mockFindWithRole = vi.fn();
const mockUpdate = vi.fn();

vi.mock('../../src/repositories/index.js', () => ({
  userRepository: {
    findByEmail: (...args: unknown[]) => mockFindByEmail(...args),
    findWithRole: (...args: unknown[]) => mockFindWithRole(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
  },
}));

const mockDeleteMany = vi.fn();

vi.mock('../../src/lib/prisma.js', () => ({
  prisma: {
    session: {
      deleteMany: (...args: unknown[]) => mockDeleteMany(...args),
    },
  },
}));

// ── Import after mocks ───────────────────────────────────────────────────────

const {
  authenticateAdmin,
  generateToken,
  verifyToken,
  refreshToken,
  revokeToken,
} = await import('../../src/services/auth.service.js');

// ── Test data ────────────────────────────────────────────────────────────────

// bcrypt hash for "SecurePass123!" with 12 rounds
const HASHED_PASSWORD = '$2a$12$LJ3m4ys3Lk0TSwMCkGKJiOZ0C0W/Z9Fqo8/.jKj5YQPWV7q5C6Xqy';

const now = new Date();

const mockUser = {
  id: 'user-001',
  email: 'admin@urbanthread.ai',
  passwordHash: HASHED_PASSWORD,
  firstName: 'Admin',
  lastName: 'User',
  roleId: 'role-001',
  isActive: true,
  lastLoginAt: null,
  createdAt: now,
  updatedAt: now,
};

const mockRole = {
  id: 'role-001',
  name: 'admin',
  description: 'System administrator',
  isSystem: true,
  createdAt: now,
  updatedAt: now,
};

const mockUserWithRole = {
  ...mockUser,
  role: {
    ...mockRole,
    permissions: [],
  },
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── authenticateAdmin ────────────────────────────────────────────────────

  describe('authenticateAdmin', () => {
    it('throws AuthenticationError when user is not found', async () => {
      mockFindByEmail.mockResolvedValue(null);

      await expect(
        authenticateAdmin('unknown@test.com', 'password'),
      ).rejects.toThrow(AuthenticationError);

      await expect(
        authenticateAdmin('unknown@test.com', 'password'),
      ).rejects.toMatchObject({
        code: ERROR_CODES.AUTH_CREDENTIALS_INVALID,
      });
    });

    it('throws AuthenticationError when password is incorrect', async () => {
      mockFindByEmail.mockResolvedValue(mockUser);

      await expect(
        authenticateAdmin('admin@urbanthread.ai', 'wrong-password'),
      ).rejects.toThrow(AuthenticationError);
    });

    it('throws AuthenticationError when account is deactivated', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      mockFindByEmail.mockResolvedValue(inactiveUser);

      // We need a valid password hash for this test — mock comparePassword
      // by providing a user whose hash matches. Instead, we mock at a higher level.
      // Since bcrypt.compare is real, we use a known hash/password pair.
      // For this test, we'll mock the crypto module.
      const { hashPassword } = await import('../../src/utils/crypto.js');
      const hash = await hashPassword('TestPass123!');
      inactiveUser.passwordHash = hash;

      await expect(
        authenticateAdmin('admin@urbanthread.ai', 'TestPass123!'),
      ).rejects.toThrow(AuthenticationError);

      await expect(
        authenticateAdmin('admin@urbanthread.ai', 'TestPass123!'),
      ).rejects.toMatchObject({
        message: 'Account is deactivated',
      });
    });

    it('returns token and user on successful authentication', async () => {
      const { hashPassword } = await import('../../src/utils/crypto.js');
      const hash = await hashPassword('ValidPass123!');
      const userWithHash = { ...mockUser, passwordHash: hash };

      mockFindByEmail.mockResolvedValue(userWithHash);
      mockFindWithRole.mockResolvedValue({ ...userWithHash, role: mockRole });
      mockUpdate.mockResolvedValue(userWithHash);

      const result = await authenticateAdmin(
        'admin@urbanthread.ai',
        'ValidPass123!',
      );

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(typeof result.token).toBe('string');
      expect(result.token.split('.')).toHaveLength(3); // valid JWT format
      expect(result.user.email).toBe('admin@urbanthread.ai');
      expect(result.user.id).toBe('user-001');
      expect(result.user.role?.name).toBe('admin');
    });

    it('updates lastLoginAt on successful authentication', async () => {
      const { hashPassword } = await import('../../src/utils/crypto.js');
      const hash = await hashPassword('ValidPass123!');
      const userWithHash = { ...mockUser, passwordHash: hash };

      mockFindByEmail.mockResolvedValue(userWithHash);
      mockFindWithRole.mockResolvedValue({ ...userWithHash, role: mockRole });
      mockUpdate.mockResolvedValue(userWithHash);

      await authenticateAdmin('admin@urbanthread.ai', 'ValidPass123!');

      expect(mockUpdate).toHaveBeenCalledWith(
        'user-001',
        expect.objectContaining({ lastLoginAt: expect.any(Date) }),
      );
    });

    it('calls findByEmail with the provided email', async () => {
      mockFindByEmail.mockResolvedValue(null);

      await expect(
        authenticateAdmin('test@example.com', 'password'),
      ).rejects.toThrow();

      expect(mockFindByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  // ── generateToken ────────────────────────────────────────────────────────

  describe('generateToken', () => {
    it('returns a valid JWT string', () => {
      const token = generateToken({
        userId: 'user-001',
        email: 'admin@urbanthread.ai',
        roleId: 'role-001',
        roleName: 'admin',
      });

      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('embeds the correct payload claims', () => {
      const payload = {
        userId: 'user-002',
        email: 'manager@urbanthread.ai',
        roleId: 'role-002',
        roleName: 'manager',
      };

      const token = generateToken(payload);
      const decoded = jwt.decode(token) as Record<string, unknown>;

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.roleId).toBe(payload.roleId);
      expect(decoded.roleName).toBe(payload.roleName);
    });
  });

  // ── verifyToken ──────────────────────────────────────────────────────────

  describe('verifyToken', () => {
    it('returns decoded payload for a valid token', () => {
      const token = jwtGenerateToken({
        userId: 'user-001',
        email: 'admin@urbanthread.ai',
        roleId: 'role-001',
        roleName: 'admin',
      });

      const payload = verifyToken(token);

      expect(payload.userId).toBe('user-001');
      expect(payload.email).toBe('admin@urbanthread.ai');
      expect(payload.iat).toBeTypeOf('number');
      expect(payload.exp).toBeTypeOf('number');
    });

    it('throws for an invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });

    it('throws for an expired token', () => {
      const secret = process.env.JWT_SECRET ?? 'test-jwt-secret-minimum-16-chars';
      const expiredToken = jwt.sign(
        { userId: 'u-1', email: 'a@b.com', roleId: 'r-1', roleName: 'admin' },
        secret,
        { expiresIn: '0s' },
      );

      expect(() => verifyToken(expiredToken)).toThrow();
    });
  });

  // ── refreshToken ─────────────────────────────────────────────────────────

  describe('refreshToken', () => {
    it('returns a new valid token when given a valid token', () => {
      const originalToken = jwtGenerateToken({
        userId: 'user-001',
        email: 'admin@urbanthread.ai',
        roleId: 'role-001',
        roleName: 'admin',
      });

      const newToken = refreshToken(originalToken);

      expect(typeof newToken).toBe('string');
      expect(newToken.split('.')).toHaveLength(3);

      // Verify the new token is valid and decodable
      const decoded = jwt.decode(newToken) as Record<string, unknown>;
      expect(decoded).toBeTruthy();
      expect(decoded.userId).toBe('user-001');
    });

    it('preserves user claims in the refreshed token', () => {
      const originalToken = jwtGenerateToken({
        userId: 'user-001',
        email: 'admin@urbanthread.ai',
        roleId: 'role-001',
        roleName: 'admin',
      });

      const newToken = refreshToken(originalToken);
      const decoded = jwt.decode(newToken) as Record<string, unknown>;

      expect(decoded.userId).toBe('user-001');
      expect(decoded.email).toBe('admin@urbanthread.ai');
      expect(decoded.roleId).toBe('role-001');
      expect(decoded.roleName).toBe('admin');
    });

    it('throws AuthenticationError for an invalid token', () => {
      expect(() => refreshToken('invalid-token')).toThrow(AuthenticationError);
    });

    it('throws AuthenticationError for an expired token', () => {
      const secret = process.env.JWT_SECRET ?? 'test-jwt-secret-minimum-16-chars';
      const expiredToken = jwt.sign(
        { userId: 'u-1', email: 'a@b.com', roleId: 'r-1', roleName: 'admin' },
        secret,
        { expiresIn: '0s' },
      );

      expect(() => refreshToken(expiredToken)).toThrow(AuthenticationError);
    });
  });

  // ── revokeToken ──────────────────────────────────────────────────────────

  describe('revokeToken', () => {
    it('calls prisma.session.deleteMany with the token', async () => {
      mockDeleteMany.mockResolvedValue({ count: 1 });

      await revokeToken('some-jwt-token');

      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { token: 'some-jwt-token' },
      });
    });

    it('does not throw when no session exists for the token', async () => {
      mockDeleteMany.mockResolvedValue({ count: 0 });

      await expect(revokeToken('nonexistent-token')).resolves.toBeUndefined();
    });
  });
});
