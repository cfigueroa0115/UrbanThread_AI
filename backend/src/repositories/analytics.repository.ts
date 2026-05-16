import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

// ── Pagination & filter helpers ─────────────────────────────────────────────

interface PaginationParams {
  page: number;
  pageSize: number;
}

interface EventFilters {
  eventType?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

// ── Analytics Repository ────────────────────────────────────────────────────

export async function createEvent(data: Prisma.AnalyticsEventCreateInput) {
  return prisma.analyticsEvent.create({ data });
}

export async function findEvents(
  { page, pageSize }: PaginationParams,
  filters: EventFilters = {},
) {
  const where: Prisma.AnalyticsEventWhereInput = {};

  if (filters.eventType) where.eventType = filters.eventType;
  if (filters.userId) where.userId = filters.userId;
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = filters.startDate;
    if (filters.endDate) where.createdAt.lte = filters.endDate;
  }

  const [data, total] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.analyticsEvent.count({ where }),
  ]);

  return { data, total };
}

export async function createPageVisit(data: Prisma.PageVisitCreateInput) {
  return prisma.pageVisit.create({ data });
}

export async function getDashboardMetrics() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalClients, totalOrders, totalRequests, recentEvents, pageVisitsCount] =
    await Promise.all([
      prisma.client.count(),
      prisma.order.count(),
      prisma.request.count(),
      prisma.analyticsEvent.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.pageVisit.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
    ]);

  return {
    totalClients,
    totalOrders,
    totalRequests,
    recentEvents,
    pageVisitsCount,
  };
}
