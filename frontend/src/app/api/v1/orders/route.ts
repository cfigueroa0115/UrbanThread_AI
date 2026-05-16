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

    const orders = await prisma.order.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    return NextResponse.json({ status: 'success', data: orders, meta: { total: orders.length } });
  } catch (error) {
    console.error('orders error:', error);
    return NextResponse.json({ status: 'error', errors: [{ message: 'Error interno', code: 'INTERNAL_ERROR' }] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientId = await getClientIdFromToken(req);
    if (!clientId) {
      return NextResponse.json({ status: 'error', errors: [{ message: 'No autorizado', code: 'UNAUTHORIZED' }] }, { status: 401 });
    }

    const body = await req.json();
    
    // Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        client: { connect: { id: clientId } },
        orderNumber,
        status: 'pending',
        totalAmount: body.totalAmount || 0,
        currency: 'COP',
        notes: body.notes || null,
      },
      include: { items: true },
    });

    return NextResponse.json({ status: 'success', data: order }, { status: 201 });
  } catch (error) {
    console.error('orders POST error:', error);
    return NextResponse.json({ status: 'error', errors: [{ message: 'Error interno', code: 'INTERNAL_ERROR' }] }, { status: 500 });
  }
}
