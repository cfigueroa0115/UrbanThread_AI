import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  try {
    const { radicationNumber, status } = await req.json();

    if (!radicationNumber || !status) {
      return NextResponse.json(
        { status: 'error', errors: [{ message: 'radicationNumber y status son requeridos', code: 'VALIDATION_ERROR' }] },
        { status: 400 }
      );
    }

    const request = await prisma.request.findFirst({
      where: { radicationNumber },
    });

    if (!request) {
      return NextResponse.json(
        { status: 'error', errors: [{ message: 'Solicitud no encontrada', code: 'NOT_FOUND' }] },
        { status: 404 }
      );
    }

    // Actualizar estado
    const updated = await prisma.request.update({
      where: { id: request.id },
      data: { status },
    });

    // Registrar en historial
    await prisma.requestStatus.create({
      data: {
        requestId: request.id,
        status,
        comment: `Estado actualizado a: ${status}`,
        changedBy: 'system',
      },
    });

    return NextResponse.json({ status: 'success', data: updated });
  } catch (error) {
    console.error('requests/status error:', error);
    return NextResponse.json(
      { status: 'error', errors: [{ message: 'Error interno', code: 'INTERNAL_ERROR' }] },
      { status: 500 }
    );
  }
}
