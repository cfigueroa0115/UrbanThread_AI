import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

// ── Pagination & filter helpers ─────────────────────────────────────────────

interface PaginationParams {
  page: number;
  pageSize: number;
}

interface AuditLogFilters {
  userId?: string;
  action?: string;
  resource?: string;
  result?: string;
  startDate?: Date;
  endDate?: Date;
}

interface ActivityLogFilters {
  userId?: string;
  module?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
}

// ── Audit Repository ────────────────────────────────────────────────────────

export async function createAuditLog(data: Prisma.AuditLogCreateInput) {
  return prisma.auditLog.create({ data });
}

export async function findAuditLogs(
  { page, pageSize }: PaginationParams,
  filters: AuditLogFilters = {},
) {
  const where: Prisma.AuditLogWhereInput = {};

  if (filters.userId) where.userId = filters.userId;
  if (filters.action) where.action = filters.action;
  if (filters.resource) where.resource = filters.resource;
  if (filters.result) where.result = filters.result;
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = filters.startDate;
    if (filters.endDate) where.createdAt.lte = filters.endDate;
  }

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { data, total };
}

export async function createActivityLog(data: Prisma.ActivityLogCreateInput) {
  return prisma.activityLog.create({ data });
}

export async function findActivityLogs(
  { page, pageSize }: PaginationParams,
  filters: ActivityLogFilters = {},
) {
  const where: Prisma.ActivityLogWhereInput = {};

  if (filters.userId) where.userId = filters.userId;
  if (filters.module) where.module = filters.module;
  if (filters.action) where.action = filters.action;
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = filters.startDate;
    if (filters.endDate) where.createdAt.lte = filters.endDate;
  }

  const [data, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.activityLog.count({ where }),
  ]);

  return { data, total };
}
