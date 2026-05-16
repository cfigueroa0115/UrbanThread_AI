import { randomUUID } from 'node:crypto';
import { whatsappRepository } from '../repositories/index.js';
import {
  sendTextMessage,
  parseWebhookPayload,
  type WhatsAppInboundMessage,
} from '../integrations/whatsapp.js';

// ── WhatsApp Service ────────────────────────────────────────────────────────

/**
 * Process an inbound WhatsApp message from the Meta webhook.
 *
 * - Parses the webhook payload
 * - Stores the message in `whatsapp_messages`
 * - Classifies the intent (placeholder)
 * - Returns the stored message record
 *
 * Validates: Requirements 4.2, 4.5
 */
export async function receiveMessage(webhookBody: Record<string, unknown>) {
  const parsed = parseWebhookPayload(webhookBody);

  if (!parsed) {
    console.log('[WhatsApp] No message found in webhook payload');
    return null;
  }

  // Generate a session ID based on the sender's phone number
  const sessionId = `wa_${parsed.from}_${new Date().toISOString().slice(0, 10)}`;

  // Store the inbound message
  const message = await whatsappRepository.createMessage({
    sessionId,
    direction: 'inbound',
    phoneNumber: parsed.from,
    content: parsed.text ?? '',
    messageType: parsed.type,
    mediaUrl: parsed.mediaUrl ?? null,
    status: 'received',
    metadata: {
      externalMessageId: parsed.messageId,
      timestamp: parsed.timestamp,
    },
  });

  // Classify intent (placeholder — real classification would use NLP/AI)
  const intent = classifyIntent(parsed.text ?? '');
  console.log(`[WhatsApp] Inbound from ${parsed.from} — intent: ${intent}`);

  return { message, intent };
}

/**
 * Send a WhatsApp message to a phone number.
 *
 * - Calls the Meta Cloud API (or mock)
 * - Stores the outbound message in `whatsapp_messages`
 *
 * Validates: Requirement 4.1
 */
export async function sendMessage(phoneNumber: string, content: string, clientId?: string) {
  const result = await sendTextMessage(phoneNumber, content);

  const sessionId = `wa_${phoneNumber}_${new Date().toISOString().slice(0, 10)}`;

  const message = await whatsappRepository.createMessage({
    sessionId,
    direction: 'outbound',
    phoneNumber,
    content,
    messageType: 'text',
    status: result.success ? 'sent' : 'failed',
    ...(clientId ? { client: { connect: { id: clientId } } } : {}),
    metadata: {
      externalMessageId: result.messageId,
      isMock: result.isMock,
    },
  });

  return { message, deliveryResult: result };
}

/**
 * Classify the intent of a WhatsApp message.
 *
 * This is a placeholder implementation that uses keyword matching.
 * A production system would use NLP or an AI model for classification.
 *
 * Validates: Requirement 4.3
 */
export function classifyIntent(text: string): string {
  const lower = text.toLowerCase();

  if (/\b(comprar|compra|precio|costo|cotiz)\b/.test(lower)) return 'purchase_intent';
  if (/\b(pedido|orden|envío|envio|seguimiento|tracking)\b/.test(lower)) return 'order_inquiry';
  if (/\b(solicitud|radicación|radicacion|queja|reclamo)\b/.test(lower)) return 'request_inquiry';
  if (/\b(documento|adjunto|archivo|factura|cédula|cedula)\b/.test(lower)) return 'document_attachment';
  if (/\b(ayuda|soporte|help|asistencia)\b/.test(lower)) return 'support';
  if (/\b(hola|buenos|buenas|saludos)\b/.test(lower)) return 'greeting';

  return 'general';
}

/**
 * Process a document attachment from a WhatsApp message.
 *
 * Placeholder — in production this would download the media from Meta's
 * servers and associate it with the client's profile.
 *
 * Validates: Requirement 4.4
 */
export async function processAttachment(
  inboundMessage: WhatsAppInboundMessage,
  _clientId?: string,
) {
  console.log(
    `[WhatsApp] Processing attachment from ${inboundMessage.from}: ` +
    `type=${inboundMessage.type}, mediaUrl=${inboundMessage.mediaUrl ?? 'N/A'}`,
  );

  // Placeholder: return metadata about the attachment
  return {
    processed: true,
    type: inboundMessage.type,
    from: inboundMessage.from,
    note: 'Attachment processing is a placeholder — media download requires Meta API credentials',
  };
}

/**
 * Retrieve paginated WhatsApp conversations (grouped by session).
 *
 * Validates: Requirement 4.5
 */
export async function getConversations(page: number, pageSize: number) {
  return whatsappRepository.findConversations({ page, pageSize });
}
