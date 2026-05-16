import type { Request, Response, NextFunction } from 'express';
import * as documentService from '../services/document.service.js';
import { documentRepository } from '../repositories/index.js';
import { NotFoundError } from '../utils/errors.js';

// ── Document Controller ─────────────────────────────────────────────────────

/**
 * POST /api/v1/documents/upload
 *
 * Upload a document. Requires JWT + RBAC (documents:create).
 * File is handled by multer middleware.
 *
 * Validates: Requirements 16.1, 16.3, 16.4
 */
export async function upload(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        status: 'error',
        errors: [{ message: 'No file provided', code: 'VALIDATION_ERROR' }],
      });
      return;
    }

    const { clientId, documentType, description } = req.body;

    const document = await documentService.upload(
      {
        size: file.size,
        mimetype: file.mimetype,
        originalname: file.originalname,
      },
      clientId,
      { documentType },
    );

    res.status(201).json({
      status: 'success',
      data: document,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/documents/:id/download
 *
 * Download a document. Requires JWT.
 *
 * Validates: Requirements 16.2
 */
export async function download(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    // Use the user's userId as the requesting client for authorization
    const requestingClientId = req.user?.userId ?? '';

    const document = await documentService.download(id, requestingClientId);

    res.status(200).json({
      status: 'success',
      data: {
        ...document,
        downloadUrl: document.filePath,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/documents/:id
 *
 * Get document metadata by ID. Requires JWT + RBAC (documents:read).
 *
 * Validates: Requirements 16.4
 */
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const document = await documentRepository.findById(id);

    if (!document) {
      throw new NotFoundError(`Document with id "${id}" not found`);
    }

    res.status(200).json({
      status: 'success',
      data: document,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/documents/:id
 *
 * Delete a document. Requires JWT + RBAC (documents:delete).
 *
 * Validates: Requirements 16.4
 */
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    await documentService.deleteDocument(id);

    res.status(200).json({
      status: 'success',
      data: { message: 'Documento eliminado exitosamente' },
    });
  } catch (error) {
    next(error);
  }
}
