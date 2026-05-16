import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  CreateUserSchema,
  UpdateUserSchema,
  IdParamSchema,
} from '@shared/schemas/index.js';

// ── User Router ──────────────────────────────────────────────────────────────

const router = Router();

/** GET /users — List all users */
router.get(
  '/',
  authMiddleware,
  requirePermission('users', 'read'),
  getAll,
);

/** GET /users/:id — Get user by ID */
router.get(
  '/:id',
  authMiddleware,
  requirePermission('users', 'read'),
  validate({ params: IdParamSchema }),
  getById,
);

/** POST /users — Create a new user */
router.post(
  '/',
  authMiddleware,
  requirePermission('users', 'create'),
  validate({ body: CreateUserSchema }),
  create,
);

/** PUT /users/:id — Update an existing user */
router.put(
  '/:id',
  authMiddleware,
  requirePermission('users', 'update'),
  validate({ params: IdParamSchema, body: UpdateUserSchema }),
  update,
);

/** DELETE /users/:id — Delete a user */
router.delete(
  '/:id',
  authMiddleware,
  requirePermission('users', 'delete'),
  validate({ params: IdParamSchema }),
  remove,
);

export default router;
