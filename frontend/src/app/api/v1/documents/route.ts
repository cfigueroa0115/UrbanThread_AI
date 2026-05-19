import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const clientId = req.nextUrl.searchParams.get('clientId');
    
    if (!clientId) {
      return NextResponse.json({ status: 'success', data: [] });
    }

    const documents = await prisma.clientDocument.findMany({
      where: { clientId, status: 'active' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        filePath: true,
        fileSize: true,
        mimeType: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ status: 'success', data: documents });
  } catch (error) {
    console.error('documents error:', error);
    return NextResponse.json({ status: 'success', data: [] });
  }
}
