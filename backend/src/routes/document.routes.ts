import { Router } from 'express';
import multer from 'multer';
import {
  upload,
  download,
  getById,
  remove,
} from '../controllers/document.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { IdParamSchema } from '@shared/schemas/index.js';
import { MAX_FILE_SIZE_BYTES } from '@shared/constants/index.js';

// ── Multer configuration ─────────────────────────────────────────────────────

const storage = multer.memoryStorage();

const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES, // 10 MB
  },
});

// ── Document Router ──────────────────────────────────────────────────────────

const router = Router();

/** POST /documents/upload — Upload a document */
router.post(
  '/upload',
  authMiddleware,
  requirePermission('documents', 'create'),
  uploadMiddleware.single('file'),
  upload,
);

/** GET /documents/:id/download — Download a document */
router.get(
  '/:id/download',
  authMiddleware,
  validate({ params: IdParamSchema }),
  download,
);

/** GET /documents/:id — Get document metadata */
router.get(
  '/:id',
  authMiddleware,
  requirePermission('documents', 'read'),
  validate({ params: IdParamSchema }),
  getById,
);

/** DELETE /documents/:id — Delete a document */
router.delete(
  '/:id',
  authMiddleware,
  requirePermission('documents', 'delete'),
  validate({ params: IdParamSchema }),
  remove,
);

export default router;
