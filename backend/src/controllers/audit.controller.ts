import type { Request, Response, NextFunction } from 'express';
import { auditRepository } from '../repositories/index.js';

// ── Audit Controller ────────────────────────────────────────────────────────

/**
 * GET /api/v1/audit-logs
 *
 * Get paginated audit logs with filters. Requires JWT + RBAC (audit:read).
 *
 * Validates: Requirements 7.4, 14.5
 */
export async function getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    const { userId, action, resource, result, startDate, endDate } = req.query as Record<string, string | undefined>;

    const filters: {
      userId?: string;
      action?: string;
      resource?: string;
      result?: string;
      startDate?: Date;
      endDate?: Date;
    } = {};

    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (resource) filters.resource = resource;
    if (result) filters.result = result;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const data = await auditRepository.findAuditLogs({ page, pageSize }, filters);

    res.status(200).json({
      status: 'success',
      data: data.data,
      meta: {
        total: data.total,
        page,
        pageSize,
        totalPages: Math.ceil(data.total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/activity-logs
 *
 * Get paginated activity logs with filters. Requires JWT + RBAC (audit:read).
 *
 * Validates: Requirements 7.4, 14.5
 */
export async function getActivityLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    const { userId, module, action, startDate, endDate } = req.query as Record<string, string | undefined>;

    const filters: {
      userId?: string;
      module?: string;
      action?: string;
      startDate?: Date;
      endDate?: Date;
    } = {};

    if (userId) filters.userId = userId;
    if (module) filters.module = module;
    if (action) filters.action = action;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const data = await auditRepository.findActivityLogs({ page, pageSize }, filters);

    res.status(200).json({
      status: 'success',
      data: data.data,
      meta: {
        total: data.total,
        page,
        pageSize,
        totalPages: Math.ceil(data.total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
}
