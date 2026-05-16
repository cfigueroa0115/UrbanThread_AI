import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ERROR_CODES } from '@shared/constants/index.js';

// ── In-memory permission cache ──────────────────────────────────────────────

interface CacheEntry {
  permissions: Set<string>;
  expiresAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const permissionCache = new Map<string, CacheEntry>();

/**
 * Build a cache key from resource and action: `"resource:action"`
 */
function permissionKey(resource: string, action: string): string {
  return `${resource}:${action}`;
}

/**
 * Retrieve the set of permission keys for a given role, using cache when available.
 */
async function getPermissionsForRole(roleId: string): Promise<Set<string>> {
  const now = Date.now();
  const cached = permissionCache.get(roleId);

  if (cached && cached.expiresAt > now) {
    return cached.permissions;
  }

  const rolePermissions = await prisma.rolePermission.findMany({
    where: { roleId },
    include: { permission: true },
  });

  const permissions = new Set(
    rolePermissions.map((rp) => permissionKey(rp.permission.resource, rp.permission.action)),
  );

  permissionCache.set(roleId, {
    permissions,
    expiresAt: now + CACHE_TTL_MS,
  });

  return permissions;
}

/**
 * Clear the permission cache for a specific role, or all roles if no roleId is provided.
 * Useful after role/permission changes.
 */
export function clearPermissionCache(roleId?: string): void {
  if (roleId) {
    permissionCache.delete(roleId);
  } else {
    permissionCache.clear();
  }
}

// ── RBAC Middleware ──────────────────────────────────────────────────────────

/**
 * Factory function that returns Express middleware enforcing RBAC.
 *
 * Usage:
 * ```ts
 * router.get('/users', authMiddleware, requirePermission('users', 'read'), controller.getAll);
 * ```
 *
 * - Requires `req.user` to be set (by `authMiddleware`).
 * - Queries the database (with caching) to check if the user's role has the
 *   required permission (resource + action).
 * - Returns 403 `RBAC_FORBIDDEN` when the permission is missing.
 */
export function requirePermission(resource: string, action: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;

    if (!user) {
      res.status(403).json({
        status: 'error',
        errors: [{ message: 'Insufficient permissions', code: ERROR_CODES.RBAC_FORBIDDEN }],
      });
      return;
    }

    try {
      const permissions = await getPermissionsForRole(user.roleId);
      const required = permissionKey(resource, action);

      if (permissions.has(required)) {
        next();
        return;
      }

      res.status(403).json({
        status: 'error',
        errors: [{ message: 'Insufficient permissions', code: ERROR_CODES.RBAC_FORBIDDEN }],
      });
    } catch {
      res.status(403).json({
        status: 'error',
        errors: [{ message: 'Insufficient permissions', code: ERROR_CODES.RBAC_FORBIDDEN }],
      });
    }
  };
}
