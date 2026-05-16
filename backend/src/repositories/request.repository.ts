import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

// ── Pagination helper ───────────────────────────────────────────────────────

interface PaginationParams {
  page: number;
  pageSize: number;
}

// ── Request Repository ──────────────────────────────────────────────────────

export async function findLatestRadicationNumber(): Promise<string | null> {
  const latest = await prisma.request.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { radicationNumber: true },
  });
  return latest?.radicationNumber ?? null;
}

export async function findAll({ page, pageSize }: PaginationParams) {
  const [data, total] = await Promise.all([
    prisma.request.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.request.count(),
  ]);

  return { data, total };
}

export async function findById(id: string) {
  return prisma.request.findUnique({
    where: { id },
  });
}

export async function findByRadicationNumber(radicationNumber: string) {
  return prisma.request.findUnique({
    where: { radicationNumber },
  });
}

export async function findByClient(clientId: string) {
  return prisma.request.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findWithDetails(id: string) {
  return prisma.request.findUnique({
    where: { id },
    include: {
      statusHistory: { orderBy: { createdAt: 'desc' } },
      attachedFiles: true,
      client: true,
    },
  });
}

export async function create(data: Prisma.RequestCreateInput) {
  return prisma.request.create({ data });
}

export async function updateStatus(
  id: string,
  status: string,
  changedBy: string | null,
  comment: string | null,
) {
  return prisma.$transaction([
    prisma.request.update({
      where: { id },
      data: { status },
    }),
    prisma.requestStatus.create({
      data: {
        requestId: id,
        status,
        changedBy,
        comment,
      },
    }),
  ]);
}
