import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

// ── Pagination helper ───────────────────────────────────────────────────────

interface PaginationParams {
  page: number;
  pageSize: number;
}

// ── Testimonial Repository ──────────────────────────────────────────────────

export async function findAll({ page, pageSize }: PaginationParams) {
  const [data, total] = await Promise.all([
    prisma.testimonial.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.testimonial.count(),
  ]);

  return { data, total };
}

export async function findPublished() {
  return prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function findById(id: string) {
  return prisma.testimonial.findUnique({
    where: { id },
  });
}

export async function create(data: Prisma.TestimonialCreateInput) {
  return prisma.testimonial.create({ data });
}

export async function update(id: string, data: Prisma.TestimonialUpdateInput) {
  return prisma.testimonial.update({
    where: { id },
    data,
  });
}

export async function remove(id: string) {
  return prisma.testimonial.delete({
    where: { id },
  });
}
