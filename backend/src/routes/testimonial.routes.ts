import { Router } from 'express';
import {
  getAll,
  create,
  update,
  remove,
  getExperiences,
  createExperience,
} from '../controllers/testimonial.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  CreateTestimonialSchema,
  UpdateTestimonialSchema,
  IdParamSchema,
} from '@shared/schemas/index.js';

// ── Testimonial Router ───────────────────────────────────────────────────────

const router = Router();

/** GET /testimonials — Get all published testimonials (public) */
router.get(
  '/',
  getAll,
);

/** POST /testimonials — Create a new testimonial (JWT + RBAC) */
router.post(
  '/',
  authMiddleware,
  requirePermission('testimonials', 'create'),
  validate({ body: CreateTestimonialSchema }),
  create,
);

/** PUT /testimonials/:id — Update a testimonial (JWT + RBAC) */
router.put(
  '/:id',
  authMiddleware,
  requirePermission('testimonials', 'update'),
  validate({ params: IdParamSchema, body: UpdateTestimonialSchema }),
  update,
);

/** DELETE /testimonials/:id — Delete a testimonial (JWT + RBAC) */
router.delete(
  '/:id',
  authMiddleware,
  requirePermission('testimonials', 'delete'),
  validate({ params: IdParamSchema }),
  remove,
);

// ── Experience sub-routes ────────────────────────────────────────────────────

/** GET /testimonials/experiences — Get all published experiences (public) */
router.get(
  '/experiences',
  getExperiences,
);

/** POST /testimonials/experiences — Create a new experience (JWT + RBAC) */
router.post(
  '/experiences',
  authMiddleware,
  requirePermission('testimonials', 'create'),
  createExperience,
);

export default router;
