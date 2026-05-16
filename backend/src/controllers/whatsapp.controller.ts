import type { Request, Response, NextFunction } from 'express';
import * as whatsappService from '../services/whatsapp.service.js';
import { verifyWebhook } from '../integrations/whatsapp.js';

// ── WhatsApp Controller ─────────────────────────────────────────────────────

/**
 * POST /api/v1/whatsapp/webhook
 *
 * Receive an inbound WhatsApp message from the Meta Cloud API webhook.
 * Meta expects a 200 response quickly, so processing is kept lightweight.
 *
 * Validates: Requirements 4.2, 4.5
 */
export async function receiveMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await whatsappService.receiveMessage(req.body);

    // Meta expects a 200 regardless of processing outcome
    res.status(200).json({
      status: 'success',
      data: result
        ? { messageId: result.message.id, intent: result.intent }
        : { message: 'No actionable message in payload' },
    });
  } catch (error) {
    // Still return 200 to Meta to avoid retries, but log the error
    console.error('[WhatsApp Webhook] Processing error:', error);
    res.status(200).json({ status: 'success', data: { message: 'Acknowledged' } });
  }
}

/**
 * GET /api/v1/whatsapp/webhook
 *
 * Meta webhook verification endpoint. Meta sends a GET request with
 * `hub.mode`, `hub.verify_token`, and `hub.challenge` query params.
 * We must echo back the challenge if the token matches.
 */
export function verifyWebhookEndpoint(req: Request, res: Response): void {
  const mode = req.query['hub.mode'] as string | undefined;
  const token = req.query['hub.verify_token'] as string | undefined;
  const challenge = req.query['hub.challenge'] as string | undefined;

  const result = verifyWebhook(mode, token, challenge);

  if (result.valid && result.challenge) {
    res.status(200).send(result.challenge);
  } else {
    res.status(403).json({
      status: 'error',
      errors: [{ message: 'Webhook verification failed', code: 'WEBHOOK_VERIFY_FAILED' }],
    });
  }
}

/**
 * POST /api/v1/whatsapp/send
 *
 * Send a WhatsApp message to a phone number. Requires JWT + RBAC.
 *
 * Validates: Requirement 4.1
 */
export async function sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { phoneNumber, message, clientId } = req.body as {
      phoneNumber: string;
      message: string;
      clientId?: string;
    };

    const result = await whatsappService.sendMessage(phoneNumber, message, clientId);

    res.status(200).json({
      status: 'success',
      data: {
        messageId: result.message.id,
        delivered: result.deliveryResult.success,
        isMock: result.deliveryResult.isMock,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/whatsapp/conversations
 *
 * List WhatsApp conversations (paginated). Requires JWT + RBAC.
 *
 * Validates: Requirement 4.5
 */
export async function getConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };

    const result = await whatsappService.getConversations(page, pageSize);

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
