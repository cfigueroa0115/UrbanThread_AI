import { randomUUID } from 'node:crypto';
import { chatbotRepository } from '../repositories/index.js';
import { chatCompletion, type OpenAIChatMessage } from '../integrations/openai.js';
import { NotFoundError } from '../utils/errors.js';
import { CHAT_ROLES } from '@shared/constants/index.js';

// ── Chatbot Service ─────────────────────────────────────────────────────────

/**
 * Remove emojis and 4-byte UTF-8 characters that may not be supported by the DB encoding.
 */
function sanitizeForDb(text: string): string {
  // Remove surrogate pairs (emojis and other 4-byte chars)
  return text.replace(/[\u{10000}-\u{10FFFF}]/gu, '').replace(/[\uD800-\uDFFF]/g, '');
}

/**
 * Send a user message to the chatbot and get an AI-generated response.
 *
 * - Creates or reuses a conversation
 * - Persists the user message
 * - Calls OpenAI (or fallback) to generate a response
 * - Persists the assistant message
 * - Returns the assistant reply with metadata
 *
 * Validates: Requirements 5.2, 5.3, 5.4
 */
export async function sendMessage(
  content: string,
  conversationId?: string,
  clientId?: string,
) {
  // 1. Resolve or create conversation
  let conversation;

  if (conversationId) {
    conversation = await chatbotRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new NotFoundError(`Conversation "${conversationId}" not found`);
    }
  } else {
    conversation = await chatbotRepository.createConversation({
      sessionId: randomUUID(),
      status: 'active',
      ...(clientId ? { client: { connect: { id: clientId } } } : {}),
    });
  }

  // 2. Persist user message
  const userMessage = await chatbotRepository.createMessage({
    conversation: { connect: { id: conversation.id } },
    role: CHAT_ROLES.USER,
    content: sanitizeForDb(content),
  });

  // 3. Build message history for OpenAI
  const fullConversation = conversationId
    ? await chatbotRepository.findConversationById(conversation.id)
    : null;
  const existingMessages = fullConversation?.messages ?? [];
  const chatHistory: OpenAIChatMessage[] = existingMessages.map((m: { role: string; content: string }) => ({
    role: m.role as 'user' | 'assistant' | 'system',
    content: m.content,
  }));
  chatHistory.push({ role: 'user', content });

  // 4. Call OpenAI
  const aiResponse = await chatCompletion(chatHistory);

  // 5. Persist assistant message
  const assistantMessage = await chatbotRepository.createMessage({
    conversation: { connect: { id: conversation.id } },
    role: CHAT_ROLES.ASSISTANT,
    content: sanitizeForDb(aiResponse.content),
    tokensUsed: aiResponse.tokensUsed,
    responseTimeMs: aiResponse.responseTimeMs,
  });

  return {
    conversationId: conversation.id,
    userMessage,
    assistantMessage,
    isFallback: aiResponse.isFallback,
  };
}

/**
 * Retrieve a single conversation with all its messages.
 *
 * Validates: Requirement 5.4
 *
 * @throws {NotFoundError} when the conversation does not exist
 */
export async function getConversation(conversationId: string) {
  const conversation = await chatbotRepository.findConversationById(conversationId);
  if (!conversation) {
    throw new NotFoundError(`Conversation "${conversationId}" not found`);
  }
  return conversation;
}

/**
 * Retrieve a paginated list of conversations.
 *
 * Validates: Requirement 5.4
 */
export async function getConversations(page: number, pageSize: number) {
  return chatbotRepository.findConversations({ page, pageSize });
}

/**
 * Escalate a conversation to a human agent.
 *
 * - Updates conversation status to 'escalated'
 * - Generates a support ticket ID
 * - Persists a system message noting the escalation
 *
 * Validates: Requirement 5.5
 *
 * @throws {NotFoundError} when the conversation does not exist
 */
export async function escalateToAgent(conversationId: string) {
  const conversation = await chatbotRepository.findConversationById(conversationId);
  if (!conversation) {
    throw new NotFoundError(`Conversation "${conversationId}" not found`);
  }

  const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}`;

  await chatbotRepository.updateConversationStatus(conversationId, 'escalated', {
    escalatedAt: new Date(),
    ticketId,
  });

  // Persist a system message about the escalation
  await chatbotRepository.createMessage({
    conversation: { connect: { id: conversationId } },
    role: CHAT_ROLES.SYSTEM,
    content: `Conversación escalada a agente humano. Ticket de soporte: ${ticketId}`,
  });

  return { ticketId, conversationId };
}
