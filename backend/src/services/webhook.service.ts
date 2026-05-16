import { randomUUID } from 'node:crypto';
import { env } from '../config/index.js';
import { auditRepository } from '../repositories/index.js';
import { ConflictError } from '../utils/errors.js';
import {
  WEBHOOK_MAX_RETRIES,
  WEBHOOK_RETRY_INTERVALS_MS,
  type WebhookEventType,
} from '@shared/constants/index.js';

// ── In-memory event store ───────────────────────────────────────────────────
//
// In production this would be backed by a dedicated webhook_events table.
// For now we use an in-memory Map to track event status and delivery results.
//

interface WebhookEventRecord {
  id: string;
  eventType: WebhookEventType;
  timestamp: string;
  idempotencyKey: string;
  data: Record<string, unknown>;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attempts: number;
  lastAttemptAt: string | null;
  responseCode: number | null;
  error: string | null;
}

const eventStore = new Map<string, WebhookEventRecord>();
const processedIdempotencyKeys = new Set<string>();

// ── Webhook Service ─────────────────────────────────────────────────────────

/**
 * Send a webhook event to the n8n server.
 *
 * - Validates the idempotency key to prevent duplicate processing
 * - Sends an HTTP POST to the n8n webhook URL
 * - On failure, schedules retries with exponential backoff (1s, 5s, 15s)
 * - After 3 failed retries, logs the failure to audit_logs
 *
 * Validates: Requirements 13.1, 13.2, 13.3, 13.4
 */
export async function sendWebhook(
  eventType: WebhookEventType,
  data: Record<string, unknown>,
  idempotencyKey?: string,
) {
  const key = idempotencyKey ?? randomUUID();

  // Validate idempotency
  const isDuplicate = await validateIdempotencyKey(key);
  if (isDuplicate) {
    throw new ConflictError(`Event with idempotency key "${key}" has already been processed`);
  }

  const eventId = randomUUID();
  const timestamp = new Date().toISOString();

  // Register the event
  const record: WebhookEventRecord = {
    id: eventId,
    eventType,
    timestamp,
    idempotencyKey: key,
    data,
    status: 'pending',
    attempts: 0,
    lastAttemptAt: null,
    responseCode: null,
    error: null,
  };

  eventStore.set(eventId, record);
  processedIdempotencyKeys.add(key);

  // Attempt delivery
  const result = await attemptDelivery(record);

  if (result.success) {
    record.status = 'delivered';
    record.responseCode = result.statusCode;
    record.attempts = 1;
    record.lastAttemptAt = new Date().toISOString();
  } else {
    record.status = 'retrying';
    record.error = result.error;
    record.attempts = 1;
    record.lastAttemptAt = new Date().toISOString();

    // Schedule retries
    scheduleRetry(eventId, 1);
  }

  return {
    eventId,
    status: record.status,
    attempt: record.attempts,
    responseCode: record.responseCode,
    error: record.error,
    deliveredAt: record.status === 'delivered' ? record.lastAttemptAt : null,
  };
}

/**
 * Retry a previously failed webhook delivery.
 *
 * Implements exponential backoff: 1s → 5s → 15s.
 *
 * Validates: Requirement 13.3
 */
export async function retryWebhook(eventId: string, attempt: number) {
  const record = eventStore.get(eventId);
  if (!record) {
    throw new Error(`Webhook event "${eventId}" not found`);
  }

  const result = await attemptDelivery(record);
  record.attempts = attempt + 1;
  record.lastAttemptAt = new Date().toISOString();

  if (result.success) {
    record.status = 'delivered';
    record.responseCode = result.statusCode;
    record.error = null;
  } else {
    record.error = result.error;

    if (record.attempts >= WEBHOOK_MAX_RETRIES) {
      // Final failure — log to audit_logs
      record.status = 'failed';
      await logWebhookFailure(record);
    } else {
      record.status = 'retrying';
      scheduleRetry(eventId, record.attempts);
    }
  }

  return {
    eventId,
    status: record.status,
    attempt: record.attempts,
    responseCode: record.responseCode,
    error: record.error,
    deliveredAt: record.status === 'delivered' ? record.lastAttemptAt : null,
  };
}

/**
 * Schedule a retry with exponential backoff.
 *
 * Intervals: attempt 1 → 1s, attempt 2 → 5s, attempt 3 → 15s.
 *
 * Validates: Requirement 13.3
 */
export function scheduleRetry(eventId: string, attempt: number): void {
  if (attempt >= WEBHOOK_MAX_RETRIES) return;

  const delayMs = WEBHOOK_RETRY_INTERVALS_MS[attempt] ?? WEBHOOK_RETRY_INTERVALS_MS[WEBHOOK_RETRY_INTERVALS_MS.length - 1];

  console.log(`[Webhook] Scheduling retry ${attempt + 1} for event ${eventId} in ${delayMs}ms`);

  setTimeout(() => {
    retryWebhook(eventId, attempt).catch((err) => {
      console.error(`[Webhook] Retry ${attempt + 1} for event ${eventId} failed:`, err);
    });
  }, delayMs);
}

/**
 * Validate an idempotency key to prevent duplicate event processing.
 *
 * Returns `true` if the key has already been processed (duplicate).
 *
 * Validates: Requirement 13.5
 */
export async function validateIdempotencyKey(key: string): Promise<boolean> {
  return processedIdempotencyKeys.has(key);
}

/**
 * Get the status of a webhook event by ID.
 */
export function getEventStatus(eventId: string): WebhookEventRecord | undefined {
  return eventStore.get(eventId);
}

/**
 * List all webhook events (for admin inspection).
 */
export function listEvents(page: number, pageSize: number) {
  const all = Array.from(eventStore.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const total = all.length;
  const data = all.slice((page - 1) * pageSize, page * pageSize);

  return { data, total };
}

// ── Internal helpers ────────────────────────────────────────────────────────

interface DeliveryResult {
  success: boolean;
  statusCode: number | null;
  error: string | null;
}

/**
 * Attempt to deliver a webhook payload to the n8n server.
 */
async function attemptDelivery(record: WebhookEventRecord): Promise<DeliveryResult> {
  const url = `${env.N8N_WEBHOOK_BASE_URL}/webhook/${record.eventType}`;

  const payload = {
    eventType: record.eventType,
    timestamp: record.timestamp,
    eventId: record.id,
    idempotencyKey: record.idempotencyKey,
    data: record.data,
  };

  try {
    console.log(`[Webhook] Delivering ${record.eventType} to ${url}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.ok) {
      return { success: true, statusCode: response.status, error: null };
    }

    const errorText = await response.text().catch(() => 'unknown');
    return { success: false, statusCode: response.status, error: errorText };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log(`[Webhook] Delivery failed for ${record.eventType}: ${message}`);
    return { success: false, statusCode: null, error: message };
  }
}

/**
 * Log a definitive webhook failure to the audit_logs table.
 *
 * Validates: Requirement 13.4
 */
async function logWebhookFailure(record: WebhookEventRecord): Promise<void> {
  try {
    await auditRepository.createAuditLog({
      action: 'webhook_failure',
      resource: 'webhook',
      resourceId: record.id,
      result: 'failure',
      details: {
        eventType: record.eventType,
        idempotencyKey: record.idempotencyKey,
        attempts: record.attempts,
        lastError: record.error ?? '',
      } as Record<string, string | number>,
    });
    console.error(
      `[Webhook] Event ${record.id} (${record.eventType}) failed after ${record.attempts} attempts. Logged to audit.`,
    );
  } catch (err) {
    console.error('[Webhook] Failed to log webhook failure to audit:', err);
  }
}
