import { Router } from 'express';
import {
  getDashboard,
  getMetrics,
  trackEvent,
  getEvents,
} from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { optionalAuth } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { PaginationSchema } from '@shared/schemas/index.js';

// ── Analytics Router ─────────────────────────────────────────────────────────

const router = Router();

/** GET /analytics/dashboard — Get dashboard metrics (JWT + RBAC) */
router.get(
  '/dashboard',
  authMiddleware,
  requirePermission('analytics', 'read'),
  getDashboard,
);

/** GET /analytics/metrics — Get detailed metrics (JWT + RBAC) */
router.get(
  '/metrics',
  authMiddleware,
  requirePermission('analytics', 'read'),
  getMetrics,
);

/** POST /analytics/events — Track an analytics event (optional auth) */
router.post(
  '/events',
  optionalAuth,
  trackEvent,
);

/** GET /analytics/events — Get paginated analytics events (JWT + RBAC) */
router.get(
  '/events',
  authMiddleware,
  requirePermission('analytics', 'read'),
  validate({ query: PaginationSchema }),
  getEvents,
);

export default router;
