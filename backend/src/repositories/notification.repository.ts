import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

// ── Pagination helper ───────────────────────────────────────────────────────

interface PaginationParams {
  page: number;
  pageSize: number;
}

// ── Notification Repository ─────────────────────────────────────────────────

export async function findByClient(clientId: string, { page, pageSize }: PaginationParams) {
  const [data, total] = await Promise.all([
    prisma.notification.findMany({
      where: { clientId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where: { clientId } }),
  ]);

  return { data, total };
}

export async function countUnread(clientId: string) {
  return prisma.notification.count({
    where: { clientId, isRead: false },
  });
}

export async function markAsRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function markAllAsRead(clientId: string) {
  return prisma.notification.updateMany({
    where: { clientId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function create(data: Prisma.NotificationCreateInput) {
  return prisma.notification.create({ data });
}
