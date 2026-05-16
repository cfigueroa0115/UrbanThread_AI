import type { Request, Response, NextFunction } from 'express';
import * as radicacionService from '../services/radicacion.service.js';
import * as notificationService from '../services/notification.service.js';
import { requestRepository, documentRepository } from '../repositories/index.js';
import { NotFoundError } from '../utils/errors.js';

// ── Request Controller ──────────────────────────────────────────────────────

/**
 * GET /api/v1/requests
 *
 * Paginated list of requests. Requires JWT + RBAC (requests:read).
 *
 * Validates: Requirements 6.1, 6.4
 */
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    const result = await requestRepository.findAll({ page, pageSize });

    res.status(200).json({
      status: 'success',
      data: result.data,
      meta: {
        total: result.total,
        page,
        pageSize,
        totalPages: Math.ceil(result.total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/requests/:id
 *
 * Get a single request by ID with details. Requires JWT + RBAC (requests:read).
 *
 * Validates: Requirements 6.1
 */
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const request = await requestRepository.findWithDetails(id);

    if (!request) {
      throw new NotFoundError(`Request with id "${id}" not found`);
    }

    res.status(200).json({
      status: 'success',
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/requests/radication/:number
 *
 * Find a request by its radication number. Requires JWT.
 *
 * Validates: Requirements 6.1, 6.4
 */
export async function getByRadicationNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const radicationNumber = req.params.number as string;
    const request = await requestRepository.findByRadicationNumber(radicationNumber);

    if (!request) {
      throw new NotFoundError(`Request with radication number "${radicationNumber}" not found`);
    }

    const detail = await requestRepository.findWithDetails(request.id);

    res.status(200).json({
      status: 'success',
      data: detail,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/requests
 *
 * Create a new request (radicación). Requires JWT + RBAC (requests:create).
 *
 * Validates: Requirements 6.1, 6.4, 6.5, 6.6
 */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const request = await radicacionService.createRequest(req.body);

    // Fire-and-forget: send confirmation email and trigger n8n workflow
    radicacionService.sendConfirmationEmail({
      radicationNumber: request.radicationNumber,
      clientId: request.clientId,
      type: request.type,
      description: request.description,
    }).catch(() => { /* email failure is non-blocking */ });

    radicacionService.triggerN8nWorkflow({
      id: request.id,
      radicationNumber: request.radicationNumber,
      clientId: request.clientId,
      type: request.type,
      description: request.description,
      priority: request.priority,
      status: request.status,
    }).catch(() => { /* webhook failure is non-blocking */ });

    res.status(201).json({
      status: 'success',
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/requests/:id/status
 *
 * Update the status of a request. Requires JWT + RBAC (requests:update).
 *
 * Validates: Requirements 6.1, 17.1
 */
export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status, comment } = req.body;
    const changedBy = req.user?.userId ?? null;

    const existing = await requestRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Request with id "${id}" not found`);
    }

    const result = await requestRepository.updateStatus(id, status, changedBy, comment ?? null);

    // Create notification for the client (fire-and-forget)
    notificationService.createRequestStatusNotification(
      existing.clientId,
      id,
      existing.radicationNumber,
      status,
    ).catch(() => { /* notification failure is non-blocking */ });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/requests/:id/history
 *
 * Get the status history for a request. Requires JWT + RBAC (requests:read).
 *
 * Validates: Requirements 6.1
 */
export async function getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const detail = await requestRepository.findWithDetails(id);

    if (!detail) {
      throw new NotFoundError(`Request with id "${id}" not found`);
    }

    res.status(200).json({
      status: 'success',
      data: detail.statusHistory,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/requests/:id/files
 *
 * Get the attached files for a request. Requires JWT + RBAC (requests:read).
 *
 * Validates: Requirements 6.1, 16.4
 */
export async function getFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const existing = await requestRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Request with id "${id}" not found`);
    }

    const files = await documentRepository.findByRequest(id);

    res.status(200).json({
      status: 'success',
      data: files,
    });
  } catch (error) {
    next(error);
  }
}
