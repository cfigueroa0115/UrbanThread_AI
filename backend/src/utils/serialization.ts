/**
 * Serialization / deserialization utilities for domain objects.
 *
 * Prisma returns rich types (Date, Decimal) that need consistent conversion
 * for JSON API responses. These helpers guarantee round-trip consistency:
 *
 *   deserialize(serialize(prismaObject)) ≈ prismaObject
 *
 * Key transformations:
 *   - Date      → ISO 8601 string  (serialize)  /  ISO string → Date (deserialize)
 *   - Decimal   → number           (serialize)  /  number → Decimal  (deserialize)
 *   - null      → null             (preserved in both directions)
 *
 * Validates: Requirements 18.1, 18.2, 18.3
 */

import { Decimal } from '@prisma/client/runtime/library';
import type {
  Client,
  Order,
  RequestRecord,
  DocumentRecord,
  ApiResponse,
  PaginationMeta,
} from '@shared/types/index.js';

// ── Prisma-shaped input types ────────────────────────────────────────────────
// These mirror the Prisma model output where Date and Decimal are native types.

export interface PrismaClient {
  id: string;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  gender: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaOrder {
  id: string;
  clientId: string;
  orderNumber: string;
  status: string;
  totalAmount: Decimal;
  currency: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaRequest {
  id: string;
  clientId: string;
  radicationNumber: string;
  type: string;
  description: string;
  priority: string;
  status: string;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaDocument {
  id: string;
  requestId: string | null;
  clientId: string | null;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  documentType: string | null;
  status: string;
  uploadedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ── Serializers (Prisma → API JSON) ──────────────────────────────────────────

/**
 * Convert a Prisma Client row to an API-safe JSON object.
 * Dates become ISO strings.
 */
export function serializeClient(client: PrismaClient): Client {
  return {
    id: client.id,
    documentType: client.documentType as Client['documentType'],
    documentNumber: client.documentNumber,
    firstName: client.firstName,
    lastName: client.lastName,
    dateOfBirth: client.dateOfBirth?.toISOString() ?? null,
    gender: client.gender,
    isActive: client.isActive,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  };
}

/**
 * Convert a Prisma Order row to an API-safe JSON object.
 * Decimal → number, Dates → ISO strings.
 */
export function serializeOrder(order: PrismaOrder): Order {
  return {
    id: order.id,
    clientId: order.clientId,
    orderNumber: order.orderNumber,
    status: order.status as Order['status'],
    totalAmount: order.totalAmount.toNumber(),
    currency: order.currency,
    notes: order.notes,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

/**
 * Convert a Prisma Request row to an API-safe JSON object.
 */
export function serializeRequest(request: PrismaRequest): RequestRecord {
  return {
    id: request.id,
    clientId: request.clientId,
    radicationNumber: request.radicationNumber,
    type: request.type,
    description: request.description,
    priority: request.priority as RequestRecord['priority'],
    status: request.status as RequestRecord['status'],
    assignedTo: request.assignedTo,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  };
}

/**
 * Convert a Prisma AttachedFile row to an API-safe JSON object.
 */
export function serializeDocument(document: PrismaDocument): DocumentRecord {
  return {
    id: document.id,
    requestId: document.requestId,
    clientId: document.clientId,
    fileName: document.fileName,
    filePath: document.filePath,
    fileSize: document.fileSize,
    mimeType: document.mimeType,
    documentType: document.documentType,
    status: document.status,
    uploadedBy: document.uploadedBy,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}

// ── Deserializers (API JSON → domain objects with native types) ──────────────

/**
 * Convert API JSON back to a domain Client with native Date objects.
 */
export function deserializeClient(json: Client): PrismaClient {
  return {
    id: json.id,
    documentType: json.documentType,
    documentNumber: json.documentNumber,
    firstName: json.firstName,
    lastName: json.lastName,
    dateOfBirth: json.dateOfBirth ? new Date(json.dateOfBirth) : null,
    gender: json.gender,
    isActive: json.isActive,
    createdAt: new Date(json.createdAt),
    updatedAt: new Date(json.updatedAt),
  };
}

/**
 * Convert API JSON back to a domain Order with native Date and Decimal objects.
 */
export function deserializeOrder(json: Order): PrismaOrder {
  return {
    id: json.id,
    clientId: json.clientId,
    orderNumber: json.orderNumber,
    status: json.status,
    totalAmount: new Decimal(json.totalAmount),
    currency: json.currency,
    notes: json.notes,
    createdAt: new Date(json.createdAt),
    updatedAt: new Date(json.updatedAt),
  };
}

/**
 * Convert API JSON back to a domain Request with native Date objects.
 */
export function deserializeRequest(json: RequestRecord): PrismaRequest {
  return {
    id: json.id,
    clientId: json.clientId,
    radicationNumber: json.radicationNumber,
    type: json.type,
    description: json.description,
    priority: json.priority,
    status: json.status,
    assignedTo: json.assignedTo,
    createdAt: new Date(json.createdAt),
    updatedAt: new Date(json.updatedAt),
  };
}

/**
 * Convert API JSON back to a domain Document with native Date objects.
 */
export function deserializeDocument(json: DocumentRecord): PrismaDocument {
  return {
    id: json.id,
    requestId: json.requestId,
    clientId: json.clientId,
    fileName: json.fileName,
    filePath: json.filePath,
    fileSize: json.fileSize,
    mimeType: json.mimeType,
    documentType: json.documentType,
    status: json.status,
    uploadedBy: json.uploadedBy,
    createdAt: new Date(json.createdAt),
    updatedAt: new Date(json.updatedAt),
  };
}

// ── API Response wrapper ─────────────────────────────────────────────────────

/**
 * Wrap data in the standard API response envelope.
 *
 * ```json
 * { "status": "success", "data": <T>, "meta": { ... } }
 * ```
 */
export function serializeApiResponse<T>(data: T, meta?: PaginationMeta): ApiResponse<T> {
  const response: ApiResponse<T> = {
    status: 'success',
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return response;
}
