import type { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/order.service.js';

// ── Order Controller ────────────────────────────────────────────────────────

/**
 * GET /api/v1/orders
 *
 * Paginated list of orders. Requires JWT + RBAC (orders:read).
 *
 * Validates: Requirements 2.6, 7.5
 */
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    const result = await orderService.getAll(page, pageSize);

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
 * GET /api/v1/orders/:id
 *
 * Get a single order by ID with details. Requires JWT + RBAC (orders:read).
 *
 * Validates: Requirements 2.6, 7.5
 */
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const order = await orderService.getOrderDetail(id);

    res.status(200).json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/orders
 *
 * Create a new order with items. Requires JWT + RBAC (orders:create).
 *
 * Validates: Requirements 2.6, 7.5
 */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await orderService.create(req.body);

    res.status(201).json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/orders/:id/status
 *
 * Update the status of an order. Requires JWT + RBAC (orders:update).
 *
 * Validates: Requirements 2.6, 7.5
 */
export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status, comment } = req.body;
    const changedBy = req.user?.userId ?? null;

    const result = await orderService.updateStatus(id, status, changedBy, comment ?? null);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/orders/:id/history
 *
 * Get the status history for an order. Requires JWT + RBAC (orders:read).
 *
 * Validates: Requirements 2.6, 7.5
 */
export async function getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const detail = await orderService.getOrderDetail(id);

    res.status(200).json({
      status: 'success',
      data: detail.statusHistory,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/orders/:id/items
 *
 * Get the items for an order. Requires JWT + RBAC (orders:read).
 *
 * Validates: Requirements 2.6, 7.5
 */
export async function getItems(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const detail = await orderService.getOrderDetail(id);

    res.status(200).json({
      status: 'success',
      data: detail.items,
    });
  } catch (error) {
    next(error);
  }
}
