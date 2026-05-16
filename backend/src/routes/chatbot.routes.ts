import { Router } from 'express';
import {
  sendMessage,
  getConversations,
  getConversation,
  escalate,
} from '../controllers/chatbot.controller.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { PaginationSchema, IdParamSchema } from '@shared/schemas/index.js';

// ── Chatbot Router ───────────────────────────────────────────────────────────

const router = Router();

/** POST /chatbot/message — Send a message to the chatbot (optional auth) */
router.post(
  '/message',
  optionalAuth,
  sendMessage,
);

/** GET /chatbot/conversations — List all conversations (JWT + RBAC) */
router.get(
  '/conversations',
  authMiddleware,
  requirePermission('chatbot', 'read'),
  validate({ query: PaginationSchema }),
  getConversations,
);

/** GET /chatbot/conversations/:id — Get a single conversation (JWT) */
router.get(
  '/conversations/:id',
  authMiddleware,
  validate({ params: IdParamSchema }),
  getConversation,
);

/** POST /chatbot/conversations/:id/escalate — Escalate to human agent (JWT) */
router.post(
  '/conversations/:id/escalate',
  authMiddleware,
  validate({ params: IdParamSchema }),
  escalate,
);

export default router;
