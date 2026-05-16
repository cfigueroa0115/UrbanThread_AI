import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@***';
  return `${local[0]}${'*'.repeat(Math.max(0, local.length - 1))}@${domain}`;
}

async function sendOTPEmail(to: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@urbanthread.ai',
    to,
    subject: `UrbanThread AI - Código de verificación: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #C4956A; text-align: center;">UrbanThread AI</h2>
        <p style="text-align: center; color: #333;">Tu código de verificación es:</p>
        <div style="background: #FAF8F5; border: 2px solid #C4956A; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1A1A1A;">${code}</span>
        </div>
        <p style="text-align: center; color: #666; font-size: 14px;">Este código expira en 5 minutos.</p>
        <p style="text-align: center; color: #999; font-size: 12px;">Si no solicitaste este código, ignora este mensaje.</p>
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  return { previewUrl: previewUrl || null };
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
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Invalidate previous OTPs
    await prisma.otpCode.updateMany({
      where: { clientId: client.id, isUsed: false },
      data: { isUsed: true },
    });

    // Create new OTP
    await prisma.otpCode.create({
      data: {
        client: { connect: { id: client.id } },
        code,
        email,
        expiresAt,
        isUsed: false,
        attempts: 0,
      },
    });

    // Send email and get preview URL
    let previewUrl: string | null = null;
    try {
      const result = await sendOTPEmail(email, code);
      previewUrl = result.previewUrl as string | null;
    } catch (e) {
      console.error('Error sending OTP email:', e);
    }

    const responseData: Record<string, unknown> = {
      message: 'Codigo OTP enviado exitosamente',
      expiresIn: 300,
      maskedEmail: maskEmail(email),
      devCode: code,
    };

    if (previewUrl) {
      responseData.devPreviewUrl = previewUrl;
    }

    return NextResponse.json({ status: 'success', data: responseData });
  } catch (error) {
    console.error('otp/request error:', error);
    return NextResponse.json(
      { status: 'error', errors: [{ message: 'Error interno del servidor', code: 'INTERNAL_ERROR' }] },
      { status: 500 }
    );
  }
}
