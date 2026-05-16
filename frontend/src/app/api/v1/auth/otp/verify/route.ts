import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'urbanthread-dev-secret-key-change-in-production-2024');

export async function POST(req: NextRequest) {
  try {
    const { documentType, documentNumber, code } = await req.json();

    // Find client
    const client = await prisma.client.findFirst({
      where: { documentType, documentNumber },
      include: {
        emails: { take: 1 },
        profile: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { status: 'error', errors: [{ message: 'Cliente no encontrado', code: 'NOT_FOUND' }] },
        { status: 404 }
      );
    }

    // Find valid OTP
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        clientId: client.id,
        code,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { status: 'error', errors: [{ message: 'Codigo OTP incorrecto o expirado', code: 'INVALID_OTP' }] },
        { status: 401 }
      );
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    // Generate JWT token
    const token = await new SignJWT({ userId: client.id, email: `${documentType}-${documentNumber}`, roleId: 'client', roleName: 'client' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(JWT_SECRET);

    return NextResponse.json({
      status: 'success',
      data: {
        token,
        expiresIn: 3600,
        client: {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          documentType: client.documentType,
          documentNumber: client.documentNumber,
          email: client.emails[0]?.email || null,
        },
      },
    });
  } catch (error) {
    console.error('otp/verify error:', error);
    return NextResponse.json(
      { status: 'error', errors: [{ message: 'Error interno del servidor', code: 'INTERNAL_ERROR' }] },
      { status: 500 }
    );
  }
}
