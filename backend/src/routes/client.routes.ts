import { Router } from 'express';
import {
  getAll,
  getById,
  getByDocument,
  create,
  update,
  remove,
  getAddresses,
  createAddress,
  getDocuments,
  getOrders,
  getRequests,
} from '../controllers/client.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  CreateClientSchema,
  PaginationSchema,
  IdParamSchema,
} from '@shared/schemas/index.js';

// ── Client Router ────────────────────────────────────────────────────────────

const router = Router();

/** GET /clients — Paginated list of clients */
router.get(
  '/',
  authMiddleware,
  requirePermission('clients', 'read'),
  validate({ query: PaginationSchema }),
  getAll,
);

/** GET /clients/me — Get current authenticated client's full profile (no RBAC needed) */
router.get(
  '/me',
  authMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) { res.status(401).json({ status: 'error', errors: [{ message: 'Not authenticated', code: 'AUTH_REQUIRED' }] }); return; }
      const { clientRepository } = await import('../repositories/index.js');
      const detail = await clientRepository.findWithDetails(userId);
      if (!detail) { res.status(404).json({ status: 'error', errors: [{ message: 'Client not found', code: 'NOT_FOUND' }] }); return; }
      res.status(200).json({ status: 'success', data: detail });
    } catch (error) { next(error); }
  },
);

/** GET /clients/document/:type/:number — Find client by document */
router.get(
  '/document/:type/:number',
  authMiddleware,
  getByDocument,
);

/** GET /clients/:id — Get client by ID */
router.get(
  '/:id',
  authMiddleware,
  requirePermission('clients', 'read'),
  validate({ params: IdParamSchema }),
  getById,
);

/** POST /clients — Create a new client */
router.post(
  '/',
  authMiddleware,
  requirePermission('clients', 'create'),
  validate({ body: CreateClientSchema }),
  create,
);

/** PUT /clients/:id — Update an existing client */
router.put(
  '/:id',
  authMiddleware,
  requirePermission('clients', 'update'),
  validate({ params: IdParamSchema }),
  update,
);

/** DELETE /clients/:id — Delete a client */
router.delete(
  '/:id',
  authMiddleware,
  requirePermission('clients', 'delete'),
  validate({ params: IdParamSchema }),
  remove,
);

// ── Sub-resource routes ──────────────────────────────────────────────────────

/** GET /clients/:id/addresses — Get client addresses */
router.get(
  '/:id/addresses',
  authMiddleware,
  validate({ params: IdParamSchema }),
  getAddresses,
);

/** POST /clients/:id/addresses — Add address to client */
router.post(
  '/:id/addresses',
  authMiddleware,
  validate({ params: IdParamSchema }),
  createAddress,
);

/** GET /clients/:id/documents — Get client documents */
router.get(
  '/:id/documents',
  authMiddleware,
  validate({ params: IdParamSchema }),
  getDocuments,
);

/** GET /clients/:id/orders — Get client orders */
router.get(
  '/:id/orders',
  authMiddleware,
  validate({ params: IdParamSchema }),
  getOrders,
);

/** GET /clients/:id/requests — Get client requests */
router.get(
  '/:id/requests',
  authMiddleware,
  validate({ params: IdParamSchema }),
  getRequests,
);

export default router;
