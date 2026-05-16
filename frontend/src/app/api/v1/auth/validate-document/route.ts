import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documentType, documentNumber } = body;

    if (!documentType || !documentNumber) {
      return NextResponse.json(
        { status: 'error', errors: [{ message: 'Tipo y número de documento son requeridos', code: 'VALIDATION_ERROR' }] },
        { status: 400 }
      );
    }

    const client = await prisma.client.findFirst({
      where: { documentType, documentNumber },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        documentType: true,
        documentNumber: true,
        emails: { select: { email: true }, take: 1 },
      },
    });

    if (client) {
      const primaryEmail = client.emails[0]?.email || '';
      const [user, domain] = primaryEmail.split('@');
      const maskedEmail = user
        ? `${user.substring(0, 2)}${'*'.repeat(Math.max(0, user.length - 2))}@${domain || ''}`
        : '';

      return NextResponse.json({
        status: 'success',
        data: {
          found: true,
          client: {
            firstName: client.firstName,
            lastName: client.lastName,
            documentType: client.documentType,
            documentNumber: client.documentNumber,
            maskedEmail,
          },
        },
      });
    }

    return NextResponse.json({
      status: 'success',
      data: { found: false, message: 'Cliente no encontrado en el sistema' },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { status: 'error', errors: [{ message: msg, code: 'INTERNAL_ERROR' }] },
      { status: 500 }
    );
  }
}
