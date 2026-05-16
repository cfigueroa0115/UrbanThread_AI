import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

// ── Pagination helper ───────────────────────────────────────────────────────

interface PaginationParams {
  page: number;
  pageSize: number;
}

// ── Client Repository ───────────────────────────────────────────────────────

export async function findAll({ page, pageSize }: PaginationParams) {
  const [data, total] = await Promise.all([
    prisma.client.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.client.count(),
  ]);

  return { data, total };
}

export async function findById(id: string) {
  return prisma.client.findUnique({
    where: { id },
  });
}

export async function findByDocument(documentType: string, documentNumber: string) {
  return prisma.client.findUnique({
    where: {
      documentType_documentNumber: { documentType, documentNumber },
    },
  });
}

export async function findWithDetails(id: string) {
  return prisma.client.findUnique({
    where: { id },
    include: {
      addresses: true,
      emails: true,
      phones: true,
      documents: true,
      profile: true,
      orders: { orderBy: { createdAt: 'desc' } },
      requests: { orderBy: { createdAt: 'desc' } },
    },
  });
}

export async function create(data: Prisma.ClientCreateInput) {
  return prisma.client.create({ data });
}

export async function update(id: string, data: Prisma.ClientUpdateInput) {
  return prisma.client.update({
    where: { id },
    data,
  });
}

export async function remove(id: string) {
  return prisma.client.delete({
    where: { id },
  });
}

export async function findByEmail(email: string) {
  const clientEmail = await prisma.clientEmail.findFirst({
    where: { email, isPrimary: true },
    include: { client: true },
  });
  return clientEmail?.client ?? null;
}
