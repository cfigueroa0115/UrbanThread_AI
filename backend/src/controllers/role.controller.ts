import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

// ── Role Controller ─────────────────────────────────────────────────────────

/**
 * GET /api/v1/roles
 *
 * List all roles with their permissions. Requires JWT + RBAC (roles:read).
 *
 * Validates: Requirements 3.1, 7.1, 7.6, 14.2
 */
export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json({
      status: 'success',
      data: roles,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/roles/:id
 *
 * Get a single role by ID with permissions. Requires JWT + RBAC (roles:read).
 *
 * Validates: Requirements 3.1, 7.1, 7.6, 14.2
 */
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    if (!role) {
      throw new NotFoundError('Rol no encontrado');
    }

    res.status(200).json({
      status: 'success',
      data: role,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/roles
 *
 * Create a new role. Requires JWT + RBAC (roles:create).
 *
 * Validates: Requirements 3.1, 7.1, 7.6, 14.2
 */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, description, permissionIds } = req.body;

    // Check for duplicate name
    const existing = await prisma.role.findUnique({ where: { name } });
    if (existing) {
      throw new ConflictError('Ya existe un rol con este nombre');
    }

    const role = await prisma.role.create({
      data: {
        name,
        description: description ?? null,
        permissions: permissionIds?.length
          ? {
              create: permissionIds.map((permissionId: string) => ({
                permission: { connect: { id: permissionId } },
              })),
            }
          : undefined,
      },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      data: role,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/roles/:id
 *
 * Update an existing role. Requires JWT + RBAC (roles:update).
 *
 * Validates: Requirements 3.1, 7.1, 7.6, 14.2
 */
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { name, description, permissionIds } = req.body;

    const existing = await prisma.role.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Rol no encontrado');
    }

    // If name is changing, check for duplicates
    if (name && name !== existing.name) {
      const duplicate = await prisma.role.findUnique({ where: { name } });
      if (duplicate) {
        throw new ConflictError('Ya existe un rol con este nombre');
      }
    }

    // If permissionIds provided, replace all role permissions
    if (permissionIds !== undefined) {
      await prisma.rolePermission.deleteMany({ where: { roleId: id } });
    }

    const role = await prisma.role.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(permissionIds !== undefined && {
          permissions: {
            create: permissionIds.map((permissionId: string) => ({
              permission: { connect: { id: permissionId } },
            })),
          },
        }),
      },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: role,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/roles/permissions
 *
 * List all available permissions. Requires JWT.
 *
 * Validates: Requirements 3.1, 7.1, 7.6, 14.2
 */
export async function getPermissions(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    });

    res.status(200).json({
      status: 'success',
      data: permissions,
    });
  } catch (error) {
    next(error);
  }
}
