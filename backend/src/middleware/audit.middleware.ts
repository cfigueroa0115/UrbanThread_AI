import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

// ── HTTP method → audit action mapping ──────────────────────────────────────

const METHOD_ACTION_MAP: Record<string, string> = {
  POST: 'create',
  PUT: 'update',
  DELETE: 'delete',
};

// ── Methods that trigger audit logging ──────────────────────────────────────

const AUDITABLE_METHODS = new Set(['POST', 'PUT', 'DELETE']);

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract the resource name from a URL path.
 * E.g. `/api/v1/clients/123` → `clients`
 *      `/api/v1/orders/456/status` → `orders`
 */
function extractResource(path: string): string {
  // Remove query string if present
  const cleanPath = path.split('?')[0]!;
  // Split into segments and filter empties
  const segments = cleanPath.split('/').filter(Boolean);

  // Walk past the version prefix (e.g. "api", "v1")
  let startIndex = 0;
  for (let i = 0; i < segments.length; i++) {
    if (segments[i] === 'api') {
      // Skip "api" and the version segment that follows (e.g. "v1")
      startIndex = i + 2;
      break;
    }
  }

  // The first meaningful segment after the prefix is the resource
  return segments[startIndex] ?? segments[segments.length - 1] ?? 'unknown';
}

/**
 * Extract a resource ID from the URL path.
 * Looks for UUID-like segments or numeric IDs after the resource segment.
 * E.g. `/api/v1/clients/550e8400-e29b-41d4-a716-446655440000` → that UUID
 *      `/api/v1/clients` → null
 */
function extractResourceId(path: string): string | null {
  const cleanPath = path.split('?')[0]!;
  const segments = cleanPath.split('/').filter(Boolean);

  // Find the resource segment index
  let startIndex = 0;
  for (let i = 0; i < segments.length; i++) {
    if (segments[i] === 'api') {
      startIndex = i + 2;
      break;
    }
  }

  // The segment right after the resource name is typically the ID
  const idSegment = segments[startIndex + 1];
  if (idSegment && !isNaN(Number(idSegment))) {
    return idSegment;
  }
  // UUID pattern
  if (idSegment && /^[0-9a-f-]{36}$/i.test(idSegment)) {
    return idSegment;
  }
  // Any non-keyword segment that looks like an ID (alphanumeric, dashes)
  if (idSegment && /^[a-zA-Z0-9_-]+$/.test(idSegment) && !isReservedSegment(idSegment)) {
    return idSegment;
  }

  return null;
}

/** Segments that are sub-resources rather than IDs */
function isReservedSegment(segment: string): boolean {
  const reserved = new Set([
    'status', 'history', 'items', 'files', 'addresses', 'documents',
    'orders', 'requests', 'upload', 'download', 'read', 'read-all',
    'unread', 'count', 'escalate', 'retry', 'trigger', 'events',
    'webhook', 'send', 'conversations', 'message', 'dashboard',
    'metrics', 'login', 'logout', 'refresh', 'request', 'verify',
    'resend',
  ]);
  return reserved.has(segment.toLowerCase());
}

// ── Middleware ───────────────────────────────────────────────────────────────

/**
 * Express middleware that logs write operations (POST, PUT, DELETE) to the
 * `audit_logs` table. Logging is fire-and-forget — it never blocks or
 * delays the HTTP response.
 *
 * Implements Requirement 14.5: register every write/update/delete operation
 * with user, action, resource, timestamp, IP and result.
 */
export function auditMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Skip read-only methods
  if (!AUDITABLE_METHODS.has(req.method)) {
    next();
    return;
  }

  // Capture data before the response is sent
  const userId = req.user?.userId ?? null;
  const action = METHOD_ACTION_MAP[req.method] ?? req.method.toLowerCase();
  const resource = extractResource(req.originalUrl);
  const resourceId = extractResourceId(req.originalUrl);
  const ipAddress = req.ip ?? null;
  const userAgent = req.headers['user-agent'] ?? null;

  res.on('finish', () => {
    const result = res.statusCode < 400 ? 'success' : 'failure';

    // Fire-and-forget — don't await, don't block
    prisma.auditLog
      .create({
        data: {
          userId,
          action,
          resource,
          resourceId,
          ipAddress,
          userAgent,
          result,
        },
      })
      .catch((err: unknown) => {
        console.error('[AuditMiddleware] Failed to write audit log:', err);
      });
  });

  next();
}

// ── Exported for testing ────────────────────────────────────────────────────

export { extractResource, extractResourceId };
