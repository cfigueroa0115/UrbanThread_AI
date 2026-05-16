import { documentRepository } from '../repositories/index.js';
import { ValidationError, NotFoundError, AuthorizationError } from '../utils/errors.js';
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '@shared/constants/index.js';
import type { Prisma } from '@prisma/client';

// ── Types ────────────────────────────────────────────────────────────────────

export interface FileInput {
  size: number;
  mimetype: string;
  originalname: string;
}

export interface DocumentMetadata {
  documentType?: string;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// ── File Validation ──────────────────────────────────────────────────────────

/**
 * Validate a file's MIME type and size.
 *
 * Allowed types: PDF, JPG, PNG, DOCX.
 * Maximum size: 10 MB.
 *
 * Validates: Requirements 16.1, 16.3
 */
export function validateFile(file: FileInput): FileValidationResult {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: `File type "${file.mimetype}" is not allowed. Accepted types: PDF, JPG, PNG, DOCX`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the maximum allowed (10 MB)`,
    };
  }

  return { valid: true };
}

// ── Upload ───────────────────────────────────────────────────────────────────

/**
 * Upload a document: validate the file, then store metadata in attached_files.
 *
 * Validates: Requirements 16.1, 16.3, 16.4
 *
 * @throws {ValidationError} when the file fails validation (type or size)
 */
export async function upload(
  file: FileInput,
  clientId: string,
  metadata: DocumentMetadata,
) {
  const validation = validateFile(file);

  if (!validation.valid) {
    throw new ValidationError(validation.error);
  }

  const data: Prisma.AttachedFileCreateInput = {
    client: { connect: { id: clientId } },
    fileName: file.originalname,
    fileSize: file.size,
    mimeType: file.mimetype,
    filePath: `uploads/${clientId}/${file.originalname}`,
    documentType: metadata.documentType,
  };

  return documentRepository.create(data);
}

// ── Download ─────────────────────────────────────────────────────────────────

/**
 * Retrieve a document record for download after verifying ownership.
 *
 * The requesting client must own the document (clientId must match).
 *
 * Validates: Requirements 16.2
 *
 * @throws {NotFoundError}      when no document exists with the given ID
 * @throws {AuthorizationError} when the requesting client does not own the document
 */
export async function download(documentId: string, requestingClientId: string) {
  const document = await documentRepository.findById(documentId);

  if (!document) {
    throw new NotFoundError(`Document with id "${documentId}" not found`);
  }

  if (document.clientId !== requestingClientId) {
    throw new AuthorizationError('You are not authorized to access this document');
  }

  return document;
}

// ── Delete ───────────────────────────────────────────────────────────────────

/**
 * Delete a document by ID.
 *
 * @throws {NotFoundError} when no document exists with the given ID
 */
export async function deleteDocument(documentId: string) {
  const document = await documentRepository.findById(documentId);

  if (!document) {
    throw new NotFoundError(`Document with id "${documentId}" not found`);
  }

  return documentRepository.remove(documentId);
}
