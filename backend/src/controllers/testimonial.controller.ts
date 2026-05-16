import type { Request, Response, NextFunction } from 'express';
import { testimonialRepository } from '../repositories/index.js';
import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../utils/errors.js';

// ── Testimonial Controller ──────────────────────────────────────────────────

/**
 * GET /api/v1/testimonials
 *
 * Get all published testimonials. Public endpoint — no auth required.
 *
 * Validates: Requirements 10.1, 10.5
 */
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const testimonials = await testimonialRepository.findPublished();

    res.status(200).json({
      status: 'success',
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/testimonials
 *
 * Create a new testimonial. Requires JWT + RBAC (testimonials:create).
 *
 * Validates: Requirements 10.5
 */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const testimonial = await testimonialRepository.create(req.body);

    res.status(201).json({
      status: 'success',
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/testimonials/:id
 *
 * Update a testimonial. Requires JWT + RBAC (testimonials:update).
 *
 * Validates: Requirements 10.5
 */
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const existing = await testimonialRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Testimonial with id "${id}" not found`);
    }

    const testimonial = await testimonialRepository.update(id, req.body);

    res.status(200).json({
      status: 'success',
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/testimonials/:id
 *
 * Delete a testimonial. Requires JWT + RBAC (testimonials:delete).
 *
 * Validates: Requirements 10.5
 */
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const existing = await testimonialRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Testimonial with id "${id}" not found`);
    }

    await testimonialRepository.remove(id);

    res.status(200).json({
      status: 'success',
      data: { message: 'Testimonio eliminado exitosamente' },
    });
  } catch (error) {
    next(error);
  }
}

// ── Experience sub-resource controllers ─────────────────────────────────────

/**
 * GET /api/v1/testimonials/experiences
 *
 * Get all published customer experiences. Public endpoint.
 *
 * Validates: Requirements 10.1
 */
export async function getExperiences(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const experiences = await prisma.customerExperience.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: experiences,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/testimonials/experiences
 *
 * Create a new customer experience. Requires JWT + RBAC (testimonials:create).
 *
 * Validates: Requirements 10.5
 */
export async function createExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const experience = await prisma.customerExperience.create({
      data: req.body,
    });

    res.status(201).json({
      status: 'success',
      data: experience,
    });
  } catch (error) {
    next(error);
  }
}
