import type { Request, Response, NextFunction } from 'express';
import { analyticsRepository } from '../repositories/index.js';
import * as analyticsService from '../services/analytics.service.js';

// ── Analytics Controller ────────────────────────────────────────────────────

/**
 * GET /api/v1/analytics/dashboard
 *
 * Get comprehensive dashboard metrics summary. Requires JWT + RBAC (analytics:read).
 * Returns all metrics required by Requirement 9.1 including visits, unique users,
 * conversion rate, chatbot interactions, WhatsApp messages, OTP success rate, etc.
 *
 * Validates: Requirements 9.1, 9.2
 */
export async function getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { startDate, endDate } = req.query as Record<string, string | undefined>;

    const filters: analyticsService.DashboardFilters = {};
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const data = await analyticsService.getDashboardData(filters);

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/analytics/metrics
 *
 * Get detailed analytics metrics with filtering. Requires JWT + RBAC (analytics:read).
 * Returns events by type/device/source, top pages, daily trends, clicks,
 * new vs returning clients, and purchase metrics.
 *
 * Validates: Requirements 9.1, 9.4
 */
export async function getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { startDate, endDate, eventType, device, source } = req.query as Record<string, string | undefined>;

    const filters: analyticsService.MetricsFilters = {};
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (eventType) filters.eventType = eventType;
    if (device) filters.device = device;
    if (source) filters.source = source;

    const data = await analyticsService.getMetrics(filters);

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/analytics/events
 *
 * Track an analytics event. Uses optional auth (public tracking allowed).
 *
 * Validates: Requirements 9.4
 */
export async function trackEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const eventData: analyticsService.TrackEventInput = {
      ...req.body,
      userId: req.user?.userId ?? null,
      ipAddress: req.ip ?? null,
      userAgent: req.headers['user-agent'] ?? null,
    };

    const event = await analyticsService.trackEvent(eventData);

    res.status(201).json({
      status: 'success',
      data: event,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/analytics/events
 *
 * Get paginated analytics events with filters. Requires JWT + RBAC (analytics:read).
 *
 * Validates: Requirements 9.1, 9.4
 */
export async function getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    const { eventType, userId, startDate, endDate } = req.query as Record<string, string | undefined>;

    const filters: {
      eventType?: string;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
    } = {};

    if (eventType) filters.eventType = eventType;
    if (userId) filters.userId = userId;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const result = await analyticsRepository.findEvents({ page, pageSize }, filters);

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
