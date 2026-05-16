import { Router } from 'express';
import {
  getAll,
  getById,
  getByRadicationNumber,
  create,
  updateStatus,
  getHistory,
  getFiles,
} from '../controllers/request.controller.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  CreateRequestSchema,
  UpdateRequestStatusSchema,
  PaginationSchema,
  IdParamSchema,
} from '@shared/schemas/index.js';

// ── Request Router ───────────────────────────────────────────────────────────

const router = Router();

/** GET /requests — Paginated list of requests */
router.get(
  '/',
  optionalAuth,
  validate({ query: PaginationSchema }),
  getAll,
);

/** GET /requests/radication/:number — Find request by radication number */
router.get(
  '/radication/:number',
  optionalAuth,
  getByRadicationNumber,
);

/** GET /requests/:id — Get request by ID with details */
router.get(
  '/:id',
  optionalAuth,
  validate({ params: IdParamSchema }),
  getById,
);

/** POST /requests — Create a new request (radicación). Clients can always create. */
router.post(
  '/',
  optionalAuth,
  validate({ body: CreateRequestSchema }),
  create,
);

/** PUT /requests/:id/status — Update request status */
router.put(
  '/:id/status',
  authMiddleware,
  requirePermission('requests', 'update'),
  validate({ params: IdParamSchema, body: UpdateRequestStatusSchema }),
  updateStatus,
);

/** GET /requests/:id/history — Get request status history */
router.get(
  '/:id/history',
  authMiddleware,
  requirePermission('requests', 'read'),
  validate({ params: IdParamSchema }),
  getHistory,
);

/** GET /requests/:id/files — Get request attached files */
router.get(
  '/:id/files',
  authMiddleware,
  requirePermission('requests', 'read'),
  validate({ params: IdParamSchema }),
  getFiles,
);

export default router;
