import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@***';
  return `${local[0]}${'*'.repeat(Math.max(0, local.length - 1))}@${domain}`;
}

export async function POST(req: NextRequest) {
  try {
    const { documentType, documentNumber } = await req.json();

    // Find client
    const client = await prisma.client.findFirst({
      where: { documentType, documentNumber },
      include: { emails: { take: 1 } },
    });

    if (!client) {
      return NextResponse.json(
        { status: 'error', errors: [{ message: 'Cliente no encontrado', code: 'NOT_FOUND' }] },
        { status: 404 }
      );
    }

    const email = client.emails[0]?.email;
    if (!email) {
      return NextResponse.json(
        { status: 'error', errors: [{ message: 'No se encontró correo registrado', code: 'NO_EMAIL' }] },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Invalidate previous OTPs
    await prisma.otpCode.updateMany({
      where: { clientId: client.id, isUsed: false },
      data: { isUsed: true },
    });

    // Create new OTP
    await prisma.otpCode.create({
      data: {
        clientId: client.id,
        code,
        expiresAt,
        isUsed: false,
        attempts: 0,
      },
    });

    // In production, send email via SMTP. For now, include devCode for testing.
    const responseData: Record<string, unknown> = {
      message: 'Codigo OTP enviado exitosamente',
      expiresIn: 300,
      maskedEmail: maskEmail(email),
    };

    // Include dev code for testing (remove in real production)
    responseData.devCode = code;

    return NextResponse.json({ status: 'success', data: responseData });
  } catch (error) {
    console.error('otp/request error:', error);
    return NextResponse.json(
      { status: 'error', errors: [{ message: 'Error interno del servidor', code: 'INTERNAL_ERROR' }] },
      { status: 500 }
    );
  }
}
