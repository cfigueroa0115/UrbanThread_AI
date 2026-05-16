import { Router } from 'express';
import { getAll, getById, create, update, getPermissions } from '../controllers/role.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  CreateRoleSchema,
  UpdateRoleSchema,
  IdParamSchema,
} from '@shared/schemas/index.js';

// ── Role Router ──────────────────────────────────────────────────────────────

const router = Router();

/** GET /roles/permissions/all — List all available permissions (must be before /:id) */
router.get(
  '/permissions/all',
  authMiddleware,
  getPermissions,
);

/** GET /roles — List all roles */
router.get(
  '/',
  authMiddleware,
  requirePermission('roles', 'read'),
  getAll,
);

/** GET /roles/:id — Get role by ID */
router.get(
  '/:id',
  authMiddleware,
  requirePermission('roles', 'read'),
  validate({ params: IdParamSchema }),
  getById,
);

/** POST /roles — Create a new role */
router.post(
  '/',
  authMiddleware,
  requirePermission('roles', 'create'),
  validate({ body: CreateRoleSchema }),
  create,
);

/** PUT /roles/:id — Update an existing role */
router.put(
  '/:id',
  authMiddleware,
  requirePermission('roles', 'update'),
  validate({ params: IdParamSchema, body: UpdateRoleSchema }),
  update,
);

export default router;
