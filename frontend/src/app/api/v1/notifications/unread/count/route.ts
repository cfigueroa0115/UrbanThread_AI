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
      return NextResponse.json({ status: 'success', data: { count: 0 } });
    }

    const count = await prisma.notification.count({
      where: { clientId, isRead: false },
    });

    return NextResponse.json({ status: 'success', data: { count } });
  } catch (error) {
    console.error('notifications/unread/count error:', error);
    return NextResponse.json({ status: 'success', data: { count: 0 } });
  }
}
