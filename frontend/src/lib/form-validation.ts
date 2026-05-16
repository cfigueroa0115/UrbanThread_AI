/**
 * UrbanThread AI — Shared form validation utilities
 *
 * Provides helpers for Zod-based form validation with per-field error display.
 */

import type { ZodSchema, ZodError } from 'zod';

export interface FieldErrors {
  [key: string]: string;
}

/**
 * Parse a ZodError into a flat map of field → first error message.
 */
export function parseZodErrors(error: ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path.join('.');
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

/**
 * Validate data against a Zod schema.
 * Returns { success: true, data } or { success: false, errors }.
 */
export function validateForm<T>(
  schema: ZodSchema<T>,
  data: unknown,
): { success: true; data: T; errors?: never } | { success: false; data?: never; errors: FieldErrors } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: parseZodErrors(result.error) };
}
