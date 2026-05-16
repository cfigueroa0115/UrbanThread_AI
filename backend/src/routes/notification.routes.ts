import { Router } from 'express';
import {
  getByUser,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../controllers/notification.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { PaginationSchema, IdParamSchema } from '@shared/schemas/index.js';

// ── Notification Router ──────────────────────────────────────────────────────

const router = Router();

/** GET /notifications — Get notifications for authenticated user */
router.get(
  '/',
  authMiddleware,
  validate({ query: PaginationSchema }),
  getByUser,
);

/** GET /notifications/unread/count — Get unread notification count */
router.get(
  '/unread/count',
  authMiddleware,
  getUnreadCount,
);

/** PUT /notifications/:id/read — Mark a notification as read */
router.put(
  '/:id/read',
  authMiddleware,
  validate({ params: IdParamSchema }),
  markAsRead,
);

/** PUT /notifications/read-all — Mark all notifications as read */
router.put(
  '/read-all',
  authMiddleware,
  markAllAsRead,
);

export default router;
