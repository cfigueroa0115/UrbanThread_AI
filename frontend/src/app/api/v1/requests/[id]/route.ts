import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const request = await prisma.request.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, firstName: true, lastName: true, documentType: true, documentNumber: true },
        },
        statusHistory: { orderBy: { createdAt: 'desc' } },
        attachedFiles: true,
      },
    });

    if (!request) {
      return NextResponse.json(
        { status: 'error', errors: [{ message: 'Solicitud no encontrada', code: 'NOT_FOUND' }] },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: 'success', data: request });
  } catch (error) {
    console.error('requests/[id] error:', error);
    return NextResponse.json(
      { status: 'error', errors: [{ message: 'Error interno', code: 'INTERNAL_ERROR' }] },
      { status: 500 }
    );
  }
}
