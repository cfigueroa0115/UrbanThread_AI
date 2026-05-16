import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ status: 'success', data: testimonials });
  } catch (error) {
    console.error('testimonials error:', error);
    return NextResponse.json({ status: 'success', data: [] });
  }
}
