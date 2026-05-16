import type { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notification.service.js';

// ── Notification Controller ─────────────────────────────────────────────────

/**
 * GET /api/v1/notifications
 *
 * Get notifications for the authenticated user (client). Requires JWT.
 *
 * Validates: Requirements 17.2
 */
export async function getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const clientId = req.user?.userId ?? '';
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };

    const result = await notificationService.getByClient(clientId, page, pageSize);

    res.status(200).json({
      status: 'success',
      data: result.data,
      meta: {
        total: result.total,
        page,
        pageSize,
        totalPages: Math.ceil(result.total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/notifications/unread/count
 *
 * Get the count of unread notifications for the authenticated user. Requires JWT.
 *
 * Validates: Requirements 17.2
 */
export async function getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const clientId = req.user?.userId ?? '';
    const count = await notificationService.getUnreadCount(clientId);

    res.status(200).json({
      status: 'success',
      data: { count },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/notifications/:id/read
 *
 * Mark a single notification as read. Requires JWT.
 *
 * Validates: Requirements 17.3
 */
export async function markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const notification = await notificationService.markAsRead(id);

    res.status(200).json({
      status: 'success',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/notifications/read-all
 *
 * Mark all notifications as read for the authenticated user. Requires JWT.
 *
 * Validates: Requirements 17.3
 */
export async function markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const clientId = req.user?.userId ?? '';
    const result = await notificationService.markAllAsRead(clientId);

    res.status(200).json({
      status: 'success',
      data: { updated: result.count },
    });
  } catch (error) {
    next(error);
  }
}
