import { env } from '../config/index.js';

// ── Meta Cloud API / WhatsApp Business Client Wrapper ───────────────────────
//
// Wraps calls to the Meta Cloud API for WhatsApp Business messaging.
// When WHATSAPP_TOKEN is not configured the client logs placeholder actions
// and returns mock responses so the rest of the application keeps working.
//

/** Timeout for WhatsApp API calls (10 seconds). */
const WHATSAPP_TIMEOUT_MS = 10_000;

/** Base URL for the Meta Graph API. */
const META_API_BASE = 'https://graph.facebook.com/v18.0';

/** Response from sending a WhatsApp message. */
export interface WhatsAppSendResult {
  messageId: string;
  success: boolean;
  isMock: boolean;
}

/** Parsed inbound message from the Meta webhook payload. */
export interface WhatsAppInboundMessage {
  from: string;
  messageId: string;
  timestamp: string;
  type: 'text' | 'image' | 'document' | 'audio';
  text?: string;
  mediaUrl?: string;
  mimeType?: string;
}

/**
 * Send a text message to a WhatsApp number via Meta Cloud API.
 *
 * Falls back to a mock response when the API token is not configured.
 */
export async function sendTextMessage(
  to: string,
  text: string,
): Promise<WhatsAppSendResult> {
  if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_ID) {
    console.log(`[WhatsApp] Mock send to ${to}: "${text.slice(0, 80)}..."`);
    return {
      messageId: `mock_wa_${Date.now()}`,
      success: true,
      isMock: true,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WHATSAPP_TIMEOUT_MS);

  try {
    const url = `${META_API_BASE}/${env.WHATSAPP_PHONE_ID}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'unknown error');
      console.error(`[WhatsApp] API returned ${response.status}: ${errorText}`);
      return { messageId: '', success: false, isMock: false };
    }

    const data = (await response.json()) as {
      messages?: { id: string }[];
    };

    return {
      messageId: data.messages?.[0]?.id ?? '',
      success: true,
      isMock: false,
    };
  } catch (error) {
    console.error('[WhatsApp] Send failed:', error);
    return { messageId: '', success: false, isMock: false };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Parse the Meta webhook payload into a simplified inbound message.
 *
 * Meta sends a nested structure; this extracts the first message from the
 * first entry/change.
 */
export function parseWebhookPayload(body: Record<string, unknown>): WhatsAppInboundMessage | null {
  try {
    const entry = (body.entry as Array<Record<string, unknown>>)?.[0];
    const changes = (entry?.changes as Array<Record<string, unknown>>)?.[0];
    const value = changes?.value as Record<string, unknown> | undefined;
    const messages = (value?.messages as Array<Record<string, unknown>>)?.[0];

    if (!messages) return null;

    const type = (messages.type as string) ?? 'text';
    const textBody = (messages.text as Record<string, unknown>)?.body as string | undefined;

    return {
      from: (messages.from as string) ?? '',
      messageId: (messages.id as string) ?? '',
      timestamp: (messages.timestamp as string) ?? new Date().toISOString(),
      type: type as 'text' | 'image' | 'document' | 'audio',
      text: textBody,
      mediaUrl: undefined, // Media download requires a separate API call
    };
  } catch {
    console.error('[WhatsApp] Failed to parse webhook payload');
    return null;
  }
}

/**
 * Verify the Meta webhook subscription challenge.
 *
 * Meta sends a GET request with `hub.mode`, `hub.verify_token`, and
 * `hub.challenge`. We must respond with the challenge value if the
 * verify token matches.
 */
export function verifyWebhook(
  mode: string | undefined,
  token: string | undefined,
  challenge: string | undefined,
): { valid: boolean; challenge?: string } {
  if (mode === 'subscribe' && token === env.WHATSAPP_VERIFY_TOKEN) {
    return { valid: true, challenge };
  }
  return { valid: false };
}
