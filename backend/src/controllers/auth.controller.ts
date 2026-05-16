import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';

// ── Auth Controller ──────────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/admin/login
 *
 * Authenticate an admin user with email and password.
 * Returns a JWT token and user profile on success.
 *
 * Validates: Requirements 3.1, 14.1
 */
export async function loginAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    const result = await authService.authenticateAdmin(email, password);

    res.status(200).json({
      status: 'success',
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/admin/refresh
 *
 * Refresh an existing valid JWT token. Requires authentication.
 * Returns a new token with a fresh expiration.
 *
 * Validates: Requirements 3.1, 14.1
 */
export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';

    const newToken = authService.refreshToken(token);

    res.status(200).json({
      status: 'success',
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/admin/logout
 *
 * Revoke the current session token. Requires authentication.
 *
 * Validates: Requirements 3.1, 14.1
 */
export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';

    await authService.revokeToken(token);

    res.status(200).json({
      status: 'success',
      data: {
        message: 'Sesión cerrada exitosamente',
      },
    });
  } catch (error) {
    next(error);
  }
}
