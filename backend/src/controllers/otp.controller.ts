import type { Request, Response, NextFunction } from 'express';
import * as otpService from '../services/otp.service.js';
import * as clientService from '../services/client.service.js';
import { generateToken } from '../utils/jwt.js';
import { NotFoundError, AuthenticationError } from '../utils/errors.js';
import { ERROR_CODES, OTP_EXPIRATION_SECONDS, SESSION_EXPIRATION_MINUTES } from '@shared/constants/index.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Mask an email address for privacy.
 * "john.doe@example.com" → "j***@example.com"
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@***';
  return `${local[0]}***@${domain}`;
}

// ── OTP Controller ───────────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/otp/request
 *
 * Request a new OTP code for client authentication.
 * Looks up the client by document, generates an OTP, and sends it to
 * the client's registered email.
 *
 * Validates: Requirements 8.1, 8.2, 8.3
 */
export async function requestOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { documentType, documentNumber } = req.body;

    // Look up client by document
    const client = await clientService.getByDocument(documentType, documentNumber);

    // Get client detail to find primary email
    const detail = await clientService.getClientDetail(client.id);
    const primaryEmail = detail.emails?.find((e: { isPrimary: boolean }) => e.isPrimary);

    if (!primaryEmail) {
      throw new NotFoundError('No se encontró un correo electrónico registrado para este cliente');
    }

    // Generate and send OTP
    const otpRecord = await otpService.generateOTP(client.id, primaryEmail.email);
    const sendResult = await otpService.sendOTP(primaryEmail.email, otpRecord.code);

    const responseData: Record<string, unknown> = {
      message: 'Codigo OTP enviado exitosamente',
      expiresIn: OTP_EXPIRATION_SECONDS,
      maskedEmail: maskEmail(primaryEmail.email),
    };

    // In development, include the OTP code and email preview in the response for testing
    if (process.env.NODE_ENV !== 'production') {
      responseData.devCode = otpRecord.code;
      responseData.devEmail = primaryEmail.email;
      if (sendResult.previewUrl) {
        responseData.devPreviewUrl = sendResult.previewUrl;
      }
    }

    res.status(200).json({
      status: 'success',
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/otp/verify
 *
 * Verify an OTP code and generate a client session token.
 * Returns a JWT token and the client's full profile on success.
 *
 * Validates: Requirements 8.1, 8.4
 */
export async function verifyOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { documentType, documentNumber, code } = req.body;

    // Look up client by document
    const client = await clientService.getByDocument(documentType, documentNumber);

    // Verify the OTP code
    await otpService.verifyOTP(client.id, code);

    // Generate a client session token
    const token = generateToken({
      userId: client.id,
      email: `${documentType}-${documentNumber}`,
      roleId: 'client',
      roleName: 'client',
    });

    // Get full client detail for the response
    const detail = await clientService.getClientDetail(client.id);

    res.status(200).json({
      status: 'success',
      data: {
        token,
        expiresIn: SESSION_EXPIRATION_MINUTES * 60,
        client: detail,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/otp/resend
 *
 * Resend an OTP code to the client's registered email.
 * Generates a new OTP and sends it, replacing any previous active code.
 *
 * Validates: Requirements 8.1, 8.2
 */
export async function resendOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { documentType, documentNumber } = req.body;

    // Look up client by document
    const client = await clientService.getByDocument(documentType, documentNumber);

    // Check if client is blocked
    const blocked = await otpService.isBlocked(client.id);
    if (blocked) {
      throw new AuthenticationError(
        'Acceso bloqueado temporalmente por demasiados intentos fallidos. Intente más tarde.',
        ERROR_CODES.OTP_BLOCKED,
      );
    }

    // Get client detail to find primary email
    const detail = await clientService.getClientDetail(client.id);
    const primaryEmail = detail.emails?.find((e: { isPrimary: boolean }) => e.isPrimary);

    if (!primaryEmail) {
      throw new NotFoundError('No se encontró un correo electrónico registrado para este cliente');
    }

    // Generate and send new OTP
    const otpRecord = await otpService.generateOTP(client.id, primaryEmail.email);
    await otpService.sendOTP(primaryEmail.email, otpRecord.code);

    res.status(200).json({
      status: 'success',
      data: {
        message: 'Código OTP reenviado exitosamente',
        expiresIn: OTP_EXPIRATION_SECONDS,
        maskedEmail: maskEmail(primaryEmail.email),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/validate-document
 *
 * Validate a client document by calling the n8n webhook and checking the local DB.
 * Returns client data if found, or a "not found" status if not.
 */
export async function validateDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { documentType, documentNumber } = req.body;

    // 1. Call n8n webhook for external validation
    let n8nResult: Record<string, unknown> | null = null;
    try {
      const n8nResponse = await fetch('https://carlosfigueroama.app.n8n.cloud/webhook/validacion_de_documento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType, documentNumber }),
        signal: AbortSignal.timeout(10000),
      });
      if (n8nResponse.ok) {
        n8nResult = await n8nResponse.json() as Record<string, unknown>;
      }
    } catch (err) {
      console.log('[n8n] Webhook call failed (continuing with local DB):', (err as Error).message);
    }

    // 2. Check local database
    let client = null;
    let clientDetail = null;
    try {
      client = await clientService.getByDocument(documentType, documentNumber);
      clientDetail = await clientService.getClientDetail(client.id);
    } catch {
      // Client not found in local DB
    }

    if (client && clientDetail) {
      // Client found
      const primaryEmail = clientDetail.emails?.find((e: { isPrimary: boolean }) => e.isPrimary);
      res.status(200).json({
        status: 'success',
        data: {
          found: true,
          client: {
            id: client.id,
            firstName: clientDetail.firstName,
            lastName: clientDetail.lastName,
            documentType: clientDetail.documentType,
            documentNumber: clientDetail.documentNumber,
            email: primaryEmail?.email ?? null,
            maskedEmail: primaryEmail ? maskEmail(primaryEmail.email) : null,
          },
          n8nValidation: n8nResult,
        },
      });
    } else {
      // Client not found
      res.status(200).json({
        status: 'success',
        data: {
          found: false,
          message: 'Cliente no encontrado en el sistema',
          n8nValidation: n8nResult,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/register-client
 *
 * Register a new client in the database.
 * Creates the client record with email and enables OTP authentication.
 */
export async function registerClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { firstName, lastName, documentType, documentNumber, email } = req.body;

    // Check if client already exists
    try {
      const existing = await clientService.getByDocument(documentType, documentNumber);
      if (existing) {
        res.status(409).json({
          status: 'error',
          errors: [{ message: 'Ya existe un cliente con este documento', code: 'CONFLICT' }],
        });
        return;
      }
    } catch {
      // Not found — good, we can create
    }

    // Create client
    const newClient = await clientService.create({
      firstName,
      lastName,
      documentType,
      documentNumber,
      isActive: true,
    });

    // Create primary email for the client
    const { prisma } = await import('../lib/prisma.js');
    await prisma.clientEmail.create({
      data: {
        clientId: newClient.id,
        email,
        isPrimary: true,
        isVerified: false,
      },
    });

    // Create customer profile
    await prisma.customerProfile.create({
      data: {
        clientId: newClient.id,
        preferredLanguage: 'es',
        loyaltyPoints: 0,
        tier: 'standard',
      },
    });

    // Notify n8n about new client registration
    try {
      await fetch('https://carlosfigueroama.app.n8n.cloud/webhook/validacion_de_documento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'client_registered',
          documentType,
          documentNumber,
          firstName,
          lastName,
          email,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      console.log('[n8n] Failed to notify about new client registration');
    }

    res.status(201).json({
      status: 'success',
      data: {
        message: 'Cliente registrado exitosamente',
        client: {
          id: newClient.id,
          firstName,
          lastName,
          documentType,
          documentNumber,
          email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/social/lookup
 *
 * Look up a client by email (from Google/Apple social login).
 * If found, sends an OTP to the client's registered email.
 * Returns client info and OTP status.
 */
export async function socialLookup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, displayName } = req.body;

    if (!email) {
      res.status(400).json({
        status: 'error',
        errors: [{ message: 'El correo electrónico es requerido', code: 'VALIDATION_ERROR' }],
      });
      return;
    }

    // Look up client by email
    const client = await clientService.getByEmail(email);

    if (!client) {
      res.status(200).json({
        status: 'success',
        data: {
          found: false,
          message: 'No se encontró un cliente con este correo electrónico',
          email,
        },
      });
      return;
    }

    // Client found — get detail and send OTP
    const detail = await clientService.getClientDetail(client.id);
    const primaryEmail = detail.emails?.find((e: { isPrimary: boolean }) => e.isPrimary);

    if (!primaryEmail) {
      res.status(200).json({
        status: 'success',
        data: {
          found: true,
          otpSent: false,
          message: 'Cliente encontrado pero sin correo registrado para OTP',
          client: {
            id: client.id,
            firstName: detail.firstName,
            lastName: detail.lastName,
            documentType: detail.documentType,
            documentNumber: detail.documentNumber,
          },
        },
      });
      return;
    }

    // Generate and send OTP
    const otpRecord = await otpService.generateOTP(client.id, primaryEmail.email);
    const sendResult = await otpService.sendOTP(primaryEmail.email, otpRecord.code);

    const responseData: Record<string, unknown> = {
      found: true,
      otpSent: true,
      message: 'OTP enviado exitosamente',
      expiresIn: OTP_EXPIRATION_SECONDS,
      maskedEmail: maskEmail(primaryEmail.email),
      client: {
        id: client.id,
        firstName: detail.firstName,
        lastName: detail.lastName,
        documentType: detail.documentType,
        documentNumber: detail.documentNumber,
      },
    };

    // In development, include the OTP code for testing
    if (process.env.NODE_ENV !== 'production') {
      responseData.devCode = otpRecord.code;
      if (sendResult.previewUrl) {
        responseData.devPreviewUrl = sendResult.previewUrl;
      }
    }

    res.status(200).json({
      status: 'success',
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
}
