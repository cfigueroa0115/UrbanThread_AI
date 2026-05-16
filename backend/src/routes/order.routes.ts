import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  updateStatus,
  getHistory,
  getItems,
} from '../controllers/order.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
  PaginationSchema,
  IdParamSchema,
} from '@shared/schemas/index.js';

// ── Order Router ─────────────────────────────────────────────────────────────

const router = Router();

/** GET /orders — Paginated list of orders */
router.get(
  '/',
  authMiddleware,
  requirePermission('orders', 'read'),
  validate({ query: PaginationSchema }),
  getAll,
);

/** GET /orders/:id — Get order by ID with details */
router.get(
  '/:id',
  authMiddleware,
  requirePermission('orders', 'read'),
  validate({ params: IdParamSchema }),
  getById,
);

/** POST /orders — Create a new order */
router.post(
  '/',
  authMiddleware,
  requirePermission('orders', 'create'),
  validate({ body: CreateOrderSchema }),
  create,
);

/** PUT /orders/:id/status — Update order status */
router.put(
  '/:id/status',
  authMiddleware,
  requirePermission('orders', 'update'),
  validate({ params: IdParamSchema, body: UpdateOrderStatusSchema }),
  updateStatus,
);

/** GET /orders/:id/history — Get order status history */
router.get(
  '/:id/history',
  authMiddleware,
  requirePermission('orders', 'read'),
  validate({ params: IdParamSchema }),
  getHistory,
);

/** GET /orders/:id/items — Get order items */
router.get(
  '/:id/items',
  authMiddleware,
  requirePermission('orders', 'read'),
  validate({ params: IdParamSchema }),
  getItems,
);

export default router;
