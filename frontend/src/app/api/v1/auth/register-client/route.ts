import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, documentType, documentNumber, email } = await req.json();

    // Check if client already exists
    const existing = await prisma.client.findFirst({
      where: { documentType, documentNumber },
    });

    if (existing) {
      return NextResponse.json(
        { status: 'error', errors: [{ message: 'Ya existe un cliente con este documento', code: 'CONFLICT' }] },
        { status: 409 }
      );
    }

    // Create client
    const newClient = await prisma.client.create({
      data: {
        firstName,
        lastName,
        documentType,
        documentNumber,
        isActive: true,
      },
    });

    // Create primary email
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

    return NextResponse.json({
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
    }, { status: 201 });
  } catch (error) {
    console.error('register-client error:', error);
    return NextResponse.json(
      { status: 'error', errors: [{ message: 'Error interno del servidor', code: 'INTERNAL_ERROR' }] },
      { status: 500 }
    );
  }
}
