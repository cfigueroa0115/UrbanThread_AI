import { requestRepository, clientRepository } from '../repositories/index.js';
import { NotFoundError } from '../utils/errors.js';
import { REQUEST_STATUSES, WEBHOOK_EVENT_TYPES } from '@shared/constants/index.js';
import type { Prisma } from '@prisma/client';

// ── Types ────────────────────────────────────────────────────────────────────

export interface CreateRequestInput {
  clientId: string;
  type: string;
  description: string;
  priority?: string;
  attachments?: string[];
}

// ── Internal counter for sequential radication numbers ───────────────────────

let sequenceCounter = 0;
let counterInitialized = false;

/**
 * Initialize the sequence counter from the database (highest existing number).
 */
async function initializeCounter(): Promise<void> {
  if (counterInitialized) return;
  try {
    const latest = await requestRepository.findLatestRadicationNumber();
    if (latest) {
      // Extract the sequence number from formats like RAD-2026-000007 or RAD-202604-00044
      const match = latest.match(/(\d+)$/);
      if (match) {
        sequenceCounter = parseInt(match[1], 10);
      }
    }
    counterInitialized = true;
  } catch {
    counterInitialized = true;
  }
}

/**
 * Reset the internal sequence counter.
 * Exposed for testing purposes only.
 */
export function _resetSequenceCounter(value = 0): void {
  sequenceCounter = value;
  counterInitialized = true;
}

// ── Radicacion Service ───────────────────────────────────────────────────────

/**
 * Look up a client by document type and number.
 *
 * Returns the client with full details if found, or `null` if not found.
 * Unlike `clientService.getByDocument`, this does NOT throw on missing client —
 * the radicación flow needs to handle the "not found" case gracefully
 * (Requirement 6.3: show informative message and allow manual entry).
 *
 * Validates: Requirements 6.1, 6.2
 */
export async function lookupClient(documentType: string, documentNumber: string) {
  const client = await clientRepository.findByDocument(documentType, documentNumber);
  return client ?? null;
}

/**
 * Generate a unique alphanumeric sequential radication number.
 *
 * Format: RAD-YYYY-NNNNNN where YYYY is the current year and NNNNNN is a
 * zero-padded sequential number.
 *
 * Example: RAD-2025-000001, RAD-2025-000002, …
 *
 * Validates: Requirement 6.4
 */
export async function generateRadicationNumber(): Promise<string> {
  await initializeCounter();
  sequenceCounter += 1;
  const year = new Date().getFullYear();
  const seq = String(sequenceCounter).padStart(6, '0');
  return `RAD-${year}-${seq}`;
}

/**
 * Create a new request (radicación) with a generated radication number,
 * initial status "registered", and an initial status history entry.
 *
 * Validates: Requirements 6.1, 6.4
 */
export async function createRequest(data: CreateRequestInput) {
  const radicationNumber = await generateRadicationNumber();

  const requestData: Prisma.RequestCreateInput = {
    client: { connect: { id: data.clientId } },
    radicationNumber,
    type: data.type,
    description: data.description,
    priority: data.priority ?? 'medium',
    status: REQUEST_STATUSES.REGISTERED,
    statusHistory: {
      create: {
        status: REQUEST_STATUSES.REGISTERED,
        comment: 'Solicitud radicada',
      },
    },
  };

  return requestRepository.create(requestData);
}

/**
 * Placeholder for sending a confirmation email with the radication number
 * and request summary.
 *
 * Will be wired to Nodemailer in task 8.4.
 *
 * Validates: Requirement 6.5
 */
export async function sendConfirmationEmail(request: {
  radicationNumber: string;
  clientId: string;
  type: string;
  description: string;
}): Promise<void> {
  // TODO: Wire to Nodemailer (task 8.4)
  // Will send email with:
  // - Radication number
  // - Request summary (type, description)
  // - Tracking link
  console.log(
    `[radicacion] Confirmation email placeholder — radicación: ${request.radicationNumber}`,
  );
}

/**
 * Placeholder for triggering an n8n webhook with the full request data.
 *
 * Will be wired to the webhook service in task 8.3.
 *
 * Validates: Requirement 6.6
 */
export async function triggerN8nWorkflow(request: {
  id: string;
  radicationNumber: string;
  clientId: string;
  type: string;
  description: string;
  priority: string;
  status: string;
}): Promise<void> {
  // TODO: Wire to webhook service (task 8.3)
  // Will send payload with:
  // - eventType: WEBHOOK_EVENT_TYPES.REQUEST_CREATED
  // - Full request data
  // - Timestamp and idempotency key
  console.log(
    `[radicacion] n8n workflow placeholder — event: ${WEBHOOK_EVENT_TYPES.REQUEST_CREATED}, radicación: ${request.radicationNumber}`,
  );
}

/**
 * Get the status history for a request identified by its radication number.
 *
 * Validates: Requirement 6.1
 *
 * @throws {NotFoundError} when no request exists with the given radication number
 */
export async function getRequestStatus(radicationNumber: string) {
  const request = await requestRepository.findByRadicationNumber(radicationNumber);

  if (!request) {
    throw new NotFoundError(
      `Request with radication number "${radicationNumber}" not found`,
    );
  }

  const detail = await requestRepository.findWithDetails(request.id);

  if (!detail) {
    throw new NotFoundError(
      `Request with radication number "${radicationNumber}" not found`,
    );
  }

  return detail.statusHistory;
}
