import type { Request, Response, NextFunction } from 'express';
import * as webhookService from '../services/webhook.service.js';
import { NotFoundError } from '../utils/errors.js';
import type { WebhookEventType } from '@shared/constants/index.js';

// ── Webhook Controller ──────────────────────────────────────────────────────

/**
 * POST /api/v1/webhooks/trigger
 *
 * Trigger a webhook event to be delivered to the n8n server.
 * Requires JWT + RBAC.
 *
 * Validates: Requirements 13.1, 13.2
 */
export async function triggerEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { eventType, data, idempotencyKey } = req.body as {
      eventType: WebhookEventType;
      data: Record<string, unknown>;
      idempotencyKey?: string;
    };

    const result = await webhookService.sendWebhook(eventType, data, idempotencyKey);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/webhooks/events
 *
 * List all webhook events (paginated). Requires JWT + RBAC.
 */
export async function listEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };

    const result = webhookService.listEvents(page, pageSize);

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
 * GET /api/v1/webhooks/events/:id
 *
 * Get the status of a specific webhook event. Requires JWT + RBAC.
 *
 * Validates: Requirement 13.2
 */
export async function getEventStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const event = webhookService.getEventStatus(id);

    if (!event) {
      throw new NotFoundError(`Webhook event "${id}" not found`);
    }

    res.status(200).json({
      status: 'success',
      data: event,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/webhooks/events/:id/retry
 *
 * Manually retry a failed webhook event. Requires JWT + RBAC.
 *
 * Validates: Requirement 13.3
 */
export async function retryEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const event = webhookService.getEventStatus(id);

    if (!event) {
      throw new NotFoundError(`Webhook event "${id}" not found`);
    }

    const result = await webhookService.retryWebhook(id, event.attempts);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
