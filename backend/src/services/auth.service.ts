import { userRepository } from '../repositories/index.js';
import { comparePassword } from '../utils/crypto.js';
import {
  generateToken as jwtGenerateToken,
  verifyToken as jwtVerifyToken,
} from '../utils/jwt.js';
import { AuthenticationError } from '../utils/errors.js';
import { ERROR_CODES } from '@shared/constants/index.js';
import type { AuthResult, TokenPayload } from '@shared/types/index.js';
import type { GenerateTokenPayload } from '../utils/jwt.js';
import { prisma } from '../lib/prisma.js';

// ── Auth Service ─────────────────────────────────────────────────────────────

/**
 * Authenticate an admin user with email and password.
 *
 * - Looks up the user by email (including role)
 * - Verifies the password against the stored bcrypt hash
 * - Checks that the account is active
 * - Generates a JWT token
 * - Updates `lastLoginAt`
 *
 * @throws {AuthenticationError} when credentials are invalid or account is inactive
 */
export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AuthResult> {
  // Find user with role included
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AuthenticationError(
      'Invalid email or password',
      ERROR_CODES.AUTH_CREDENTIALS_INVALID,
    );
  }

  const passwordValid = await comparePassword(password, user.passwordHash);

  if (!passwordValid) {
    throw new AuthenticationError(
      'Invalid email or password',
      ERROR_CODES.AUTH_CREDENTIALS_INVALID,
    );
  }

  if (!user.isActive) {
    throw new AuthenticationError(
      'Account is deactivated',
      ERROR_CODES.AUTH_CREDENTIALS_INVALID,
    );
  }

  // Fetch role name for the token payload
  const userWithRole = await userRepository.findWithRole(user.id);
  const roleName = userWithRole?.role?.name ?? 'unknown';

  const token = generateToken({
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
    roleName,
  });

  // Update last login timestamp
  await userRepository.update(user.id, { lastLoginAt: new Date() });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      isActive: user.isActive,
      lastLoginAt: new Date().toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      role: userWithRole?.role
        ? {
            id: userWithRole.role.id,
            name: userWithRole.role.name,
            description: userWithRole.role.description,
            isSystem: userWithRole.role.isSystem,
            createdAt: userWithRole.role.createdAt.toISOString(),
            updatedAt: userWithRole.role.updatedAt.toISOString(),
          }
        : undefined,
    },
  };
}

/**
 * Generate a JWT token for the given user data.
 */
export function generateToken(payload: GenerateTokenPayload): string {
  return jwtGenerateToken(payload);
}

/**
 * Verify and decode a JWT token.
 *
 * @throws {jwt.TokenExpiredError} when the token has expired
 * @throws {jwt.JsonWebTokenError} when the token is malformed / invalid
 */
export function verifyToken(token: string): TokenPayload {
  return jwtVerifyToken(token);
}

/**
 * Refresh an existing valid token by verifying it and issuing a new one
 * with a fresh expiration.
 *
 * @throws {AuthenticationError} when the provided token is invalid or expired
 */
export function refreshToken(token: string): string {
  try {
    const payload = jwtVerifyToken(token);

    return jwtGenerateToken({
      userId: payload.userId,
      email: payload.email,
      roleId: payload.roleId,
      roleName: payload.roleName,
    });
  } catch {
    throw new AuthenticationError(
      'Invalid or expired token',
      ERROR_CODES.AUTH_TOKEN_INVALID,
    );
  }
}

/**
 * Revoke a token by deleting its associated session from the database.
 * If no session exists for the token, the operation is a no-op.
 */
export async function revokeToken(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { token },
  });
}
