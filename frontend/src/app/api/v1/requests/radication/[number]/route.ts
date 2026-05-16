import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { number: string } }) {
  try {
    const { number } = params;

    const request = await prisma.request.findFirst({
      where: { radicationNumber: number },
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
        { status: 'error', errors: [{ message: 'Solicitud no encontrada con ese número de radicación', code: 'NOT_FOUND' }] },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: 'success', data: request });
  } catch (error) {
    console.error('requests/radication/[number] error:', error);
    return NextResponse.json(
      { status: 'error', errors: [{ message: 'Error interno', code: 'INTERNAL_ERROR' }] },
      { status: 500 }
    );
  }
}
