import { Router } from 'express';
import {
  getAuditLogs,
  getActivityLogs,
} from '../controllers/audit.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { PaginationSchema } from '@shared/schemas/index.js';

// ── Audit Router ─────────────────────────────────────────────────────────────

const router = Router();

/** GET /audit-logs — Get paginated audit logs (JWT + RBAC) */
router.get(
  '/',
  authMiddleware,
  requirePermission('audit', 'read'),
  validate({ query: PaginationSchema }),
  getAuditLogs,
);

export default router;

// ── Activity Log Router ──────────────────────────────────────────────────────

export const activityLogRouter = Router();

/** GET /activity-logs — Get paginated activity logs (JWT + RBAC) */
activityLogRouter.get(
  '/',
  authMiddleware,
  requirePermission('audit', 'read'),
  validate({ query: PaginationSchema }),
  getActivityLogs,
);
