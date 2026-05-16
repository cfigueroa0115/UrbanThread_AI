import { Router } from 'express';
import {
  triggerEvent,
  listEvents,
  getEventStatus,
  retryEvent,
} from '../controllers/webhook.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { PaginationSchema, IdParamSchema } from '@shared/schemas/index.js';

// ── Webhook Router ───────────────────────────────────────────────────────────

const router = Router();

/** POST /webhooks/trigger — Trigger a webhook event (JWT + RBAC) */
router.post(
  '/trigger',
  authMiddleware,
  requirePermission('webhooks', 'create'),
  triggerEvent,
);

/** GET /webhooks/events — List all webhook events (JWT + RBAC) */
router.get(
  '/events',
  authMiddleware,
  requirePermission('webhooks', 'read'),
  validate({ query: PaginationSchema }),
  listEvents,
);

/** GET /webhooks/events/:id — Get event status (JWT + RBAC) */
router.get(
  '/events/:id',
  authMiddleware,
  requirePermission('webhooks', 'read'),
  validate({ params: IdParamSchema }),
  getEventStatus,
);

/** POST /webhooks/events/:id/retry — Retry a failed event (JWT + RBAC) */
router.post(
  '/events/:id/retry',
  authMiddleware,
  requirePermission('webhooks', 'create'),
  validate({ params: IdParamSchema }),
  retryEvent,
);

export default router;
