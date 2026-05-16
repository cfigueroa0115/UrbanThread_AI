import type { Request, Response, NextFunction } from 'express';
import { userRepository } from '../repositories/index.js';
import { hashPassword } from '../utils/crypto.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

// ── User Controller ─────────────────────────────────────────────────────────

/**
 * GET /api/v1/users
 *
 * List all users. Requires JWT + RBAC (users:read).
 *
 * Validates: Requirements 3.1, 7.1, 7.6, 14.2
 */
export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await userRepository.findAll();

    // Strip passwordHash from response
    const sanitized = users.map(({ passwordHash: _ph, ...rest }) => rest);

    res.status(200).json({
      status: 'success',
      data: sanitized,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/users/:id
 *
 * Get a single user by ID. Requires JWT + RBAC (users:read).
 *
 * Validates: Requirements 3.1, 7.1, 7.6, 14.2
 */
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const user = await userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const { passwordHash: _ph, ...sanitized } = user;

    res.status(200).json({
      status: 'success',
      data: sanitized,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/users
 *
 * Create a new user. Hashes password with bcrypt.
 * Requires JWT + RBAC (users:create).
 *
 * Validates: Requirements 3.1, 7.1, 7.6, 14.2
 */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, firstName, lastName, roleId } = req.body;

    // Check for duplicate email
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError('Ya existe un usuario con este correo electrónico');
    }

    const passwordHash = await hashPassword(password);

    const user = await userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role: { connect: { id: roleId } },
    });

    const { passwordHash: _ph, ...sanitized } = user;

    res.status(201).json({
      status: 'success',
      data: sanitized,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/users/:id
 *
 * Update an existing user. Requires JWT + RBAC (users:update).
 *
 * Validates: Requirements 3.1, 7.1, 7.6, 14.2
 */
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const { email, password, firstName, lastName, roleId, isActive } = req.body;

    // If email is changing, check for duplicates
    if (email && email !== existing.email) {
      const duplicate = await userRepository.findByEmail(email);
      if (duplicate) {
        throw new ConflictError('Ya existe un usuario con este correo electrónico');
      }
    }

    const updateData: Record<string, unknown> = {};
    if (email !== undefined) updateData.email = email;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (roleId !== undefined) updateData.role = { connect: { id: roleId } };
    if (password) {
      updateData.passwordHash = await hashPassword(password);
    }

    const user = await userRepository.update(id, updateData);

    const { passwordHash: _ph, ...sanitized } = user;

    res.status(200).json({
      status: 'success',
      data: sanitized,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/users/:id
 *
 * Delete a user. Requires JWT + RBAC (users:delete).
 *
 * Validates: Requirements 3.1, 7.1, 7.6, 14.2
 */
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Usuario no encontrado');
    }

    await userRepository.remove(id);

    res.status(200).json({
      status: 'success',
      data: { message: 'Usuario eliminado exitosamente' },
    });
  } catch (error) {
    next(error);
  }
}
