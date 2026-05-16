import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

// ── Pagination helper ───────────────────────────────────────────────────────

interface PaginationParams {
  page: number;
  pageSize: number;
}

// ── Order Repository ────────────────────────────────────────────────────────

export async function findAll({ page, pageSize }: PaginationParams) {
  const [data, total] = await Promise.all([
    prisma.order.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count(),
  ]);

  return { data, total };
}

export async function findById(id: string) {
  return prisma.order.findUnique({
    where: { id },
  });
}

export async function findByClient(clientId: string) {
  return prisma.order.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findWithDetails(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: 'desc' } },
      client: true,
    },
  });
}

export async function create(data: Prisma.OrderCreateInput) {
  return prisma.order.create({ data });
}

export async function updateStatus(
  id: string,
  status: string,
  changedBy: string | null,
  comment: string | null,
) {
  return prisma.$transaction([
    prisma.order.update({
      where: { id },
      data: { status },
    }),
    prisma.orderStatus.create({
      data: {
        orderId: id,
        status,
        changedBy,
        comment,
      },
    }),
  ]);
}
