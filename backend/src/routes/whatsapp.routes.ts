import { Router } from 'express';
import {
  receiveMessage,
  verifyWebhookEndpoint,
  sendMessage,
  getConversations,
} from '../controllers/whatsapp.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { PaginationSchema } from '@shared/schemas/index.js';

// ── WhatsApp Router ──────────────────────────────────────────────────────────

const router = Router();

/** POST /whatsapp/webhook — Receive inbound message from Meta (webhook token verification) */
router.post('/webhook', receiveMessage);

/** GET /whatsapp/webhook — Meta webhook subscription verification */
router.get('/webhook', verifyWebhookEndpoint);

/** POST /whatsapp/send — Send a WhatsApp message (JWT + RBAC) */
router.post(
  '/send',
  authMiddleware,
  requirePermission('whatsapp', 'create'),
  sendMessage,
);

/** GET /whatsapp/conversations — List WhatsApp conversations (JWT + RBAC) */
router.get(
  '/conversations',
  authMiddleware,
  requirePermission('whatsapp', 'read'),
  validate({ query: PaginationSchema }),
  getConversations,
);

export default router;
