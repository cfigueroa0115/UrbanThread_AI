import type { Request, Response, NextFunction } from 'express';

// ── HTML entity map for XSS prevention ───────────────────────────────────────

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

const HTML_ESCAPE_RE = /[&<>"']/g;

// ── Null byte pattern ────────────────────────────────────────────────────────

const NULL_BYTE_RE = /\0/g;

// ── Core sanitizer ───────────────────────────────────────────────────────────

/**
 * Sanitize a single string value:
 * 1. Remove null bytes
 * 2. Escape HTML-significant characters to prevent XSS
 * 3. Trim leading/trailing whitespace
 */
export function sanitizeString(value: string): string {
  return value
    .replace(NULL_BYTE_RE, '')
    .replace(HTML_ESCAPE_RE, (ch) => HTML_ESCAPE_MAP[ch]!)
    .trim();
}

/**
 * Recursively sanitize all string values in an object, array, or primitive.
 * Non-string primitives (numbers, booleans, null, undefined) pass through
 * unchanged. Arrays and plain objects are traversed recursively.
 */
export function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }

  // numbers, booleans, null, undefined — pass through
  return value;
}

// ── Express middleware ───────────────────────────────────────────────────────

/**
 * Express middleware that sanitizes `req.body`, `req.query`, and `req.params`
 * to prevent XSS and null-byte injection.
 *
 * - Escapes HTML-significant characters (`<`, `>`, `&`, `"`, `'`)
 * - Removes null bytes (`\0`)
 * - Trims whitespace from string values
 * - Preserves non-string values (numbers, booleans) unchanged
 * - Recursively traverses nested objects and arrays
 *
 * Lightweight by design — does not alter legitimate content such as email
 * addresses or URLs in data fields.
 */
export function sanitizationMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query) as typeof req.query;
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params) as typeof req.params;
  }

  next();
}
