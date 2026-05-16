import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/index.js';
import type { TokenPayload } from '@shared/types/index.js';

/**
 * Payload used when generating a new JWT token.
 * Excludes `iat` and `exp` which are set automatically by jsonwebtoken.
 */
export type GenerateTokenPayload = Pick<TokenPayload, 'userId' | 'email' | 'roleId' | 'roleName'>;

/**
 * Generate a signed JWT with configurable expiration from `env.JWT_EXPIRES_IN`.
 */
export function generateToken(payload: GenerateTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

/**
 * Verify and decode a JWT token.
 *
 * @throws {jwt.TokenExpiredError} when the token has expired
 * @throws {jwt.JsonWebTokenError}  when the token is malformed / invalid
 */
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
