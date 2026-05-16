import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

// ── Pagination helper ───────────────────────────────────────────────────────

interface PaginationParams {
  page: number;
  pageSize: number;
}

// ── WhatsApp Repository ─────────────────────────────────────────────────────

export async function createMessage(data: Prisma.WhatsappMessageCreateInput) {
  return prisma.whatsappMessage.create({ data });
}

export async function findByClient(clientId: string) {
  return prisma.whatsappMessage.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findBySession(sessionId: string) {
  return prisma.whatsappMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function findConversations({ page, pageSize }: PaginationParams) {
  // Group messages by sessionId, returning the latest message per session
  const [data, total] = await Promise.all([
    prisma.whatsappMessage.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      distinct: ['sessionId'],
    }),
    prisma.whatsappMessage
      .groupBy({ by: ['sessionId'] })
      .then((groups) => groups.length),
  ]);

  return { data, total };
}
