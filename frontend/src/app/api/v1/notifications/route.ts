import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'urbanthread-dev-secret-key-change-in-production-2024');

async function getClientIdFromToken(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const { payload } = await jwtVerify(auth.slice(7), JWT_SECRET);
    return payload.userId as string;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  try {
    const clientId = await getClientIdFromToken(req);
    if (!clientId) {
      return NextResponse.json({ status: 'success', data: [], meta: { total: 0 } });
    }

    const notifications = await prisma.notification.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ status: 'success', data: notifications, meta: { total: notifications.length } });
  } catch (error) {
    console.error('notifications error:', error);
    return NextResponse.json({ status: 'error', errors: [{ message: 'Error interno', code: 'INTERNAL_ERROR' }] }, { status: 500 });
  }
}
