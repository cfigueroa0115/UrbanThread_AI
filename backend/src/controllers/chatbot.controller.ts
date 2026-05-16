import type { Request, Response, NextFunction } from 'express';
import * as chatbotService from '../services/chatbot.service.js';

// ── Chatbot Controller ──────────────────────────────────────────────────────

/**
 * POST /api/v1/chatbot/message
 *
 * Send a message to the chatbot and receive an AI-generated response.
 * Auth is optional — anonymous users get a new conversation, authenticated
 * users can have their conversation linked to their client profile.
 *
 * Validates: Requirements 5.2, 5.3
 */
export async function sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { message, conversationId } = req.body as {
      message: string;
      conversationId?: string;
    };

    const clientId = req.user?.userId;

    const result = await chatbotService.sendMessage(message, conversationId, clientId);

    res.status(200).json({
      status: 'success',
      data: {
        conversationId: result.conversationId,
        message: {
          id: result.assistantMessage.id,
          role: result.assistantMessage.role,
          content: result.assistantMessage.content,
          createdAt: result.assistantMessage.createdAt,
        },
        isFallback: result.isFallback,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/chatbot/conversations
 *
 * List all chatbot conversations (paginated). Requires JWT + RBAC.
 *
 * Validates: Requirement 5.4
 */
export async function getConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };

    const result = await chatbotService.getConversations(page, pageSize);

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
 * GET /api/v1/chatbot/conversations/:id
 *
 * Get a single conversation with all messages. Requires JWT.
 *
 * Validates: Requirement 5.4
 */
export async function getConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const conversation = await chatbotService.getConversation(id);

    res.status(200).json({
      status: 'success',
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/chatbot/conversations/:id/escalate
 *
 * Escalate a conversation to a human agent. Requires JWT.
 *
 * Validates: Requirement 5.5
 */
export async function escalate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const result = await chatbotService.escalateToAgent(id);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
