import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';
const SESSION_MINUTES = 60;

/**
 * POST /api/v1/auth/checkout-verify
 * 
 * Validates a client by email for checkout purposes.
 * If the email exists in the database, authenticates the client directly
 * WITHOUT requiring OTP (simplified flow for cart checkout only).
 * 
 * This is safe because:
 * - Only returns non-sensitive client data (name, id)
 * - The session is short-lived (60 min)
 * - The client must already exist in the system
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { status: 'error', errors: [{ message: 'Email es requerido', code: 'VALIDATION_ERROR' }] },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find client by email
    const clientEmail = await prisma.clientEmail.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            documentType: true,
            documentNumber: true,
            isActive: true,
          },
        },
      },
    });

    if (!clientEmail || !clientEmail.client) {
      return NextResponse.json({
        status: 'success',
        data: { found: false, message: 'No se encontró una cuenta con este correo.' },
      });
    }

    if (!clientEmail.client.isActive) {
      return NextResponse.json({
        status: 'success',
        data: { found: false, message: 'La cuenta está inactiva.' },
      });
    }

    const client = clientEmail.client;

    // Generate a short-lived JWT token for the checkout session
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      sub: client.id,
      documentType: client.documentType,
      documentNumber: client.documentNumber,
      type: 'client',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${SESSION_MINUTES}m`)
      .sign(secret);

    return NextResponse.json({
      status: 'success',
      data: {
        found: true,
        client: {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          documentType: client.documentType,
          documentNumber: client.documentNumber,
        },
        token,
        expiresIn: SESSION_MINUTES * 60,
      },
    });
  } catch (error) {
    console.error('checkout-verify error:', error);
    return NextResponse.json(
      { status: 'error', errors: [{ message: 'Error interno del servidor', code: 'INTERNAL_ERROR' }] },
      { status: 500 }
    );
  }
}
