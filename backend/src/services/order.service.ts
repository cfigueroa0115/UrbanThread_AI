import { orderRepository } from '../repositories/index.js';
import { NotFoundError } from '../utils/errors.js';
import { ORDER_STATUSES } from '@shared/constants/index.js';
import type { Prisma } from '@prisma/client';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generate a unique order number with format ORD-YYYYMMDD-XXXX.
 *
 * The suffix is derived from the current timestamp to ensure uniqueness
 * within the same day.
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePart = `${year}${month}${day}`;

  // Use last 4 digits of timestamp + random component for uniqueness
  const suffix = String(Date.now() % 10000).padStart(4, '0');

  return `ORD-${datePart}-${suffix}`;
}

// ── Order item input ─────────────────────────────────────────────────────────

export interface OrderItemInput {
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

// ── Create order input ───────────────────────────────────────────────────────

export interface CreateOrderInput {
  clientId: string;
  items: OrderItemInput[];
  currency?: string;
  notes?: string;
}

// ── Order Service ────────────────────────────────────────────────────────────

/**
 * Retrieve a paginated list of orders.
 *
 * Validates: Requirements 2.6, 7.5
 *
 * @returns Object with `data` (order array) and `total` count.
 */
export async function getAll(page: number, pageSize: number) {
  return orderRepository.findAll({ page, pageSize });
}

/**
 * Find an order by its unique ID.
 *
 * @throws {NotFoundError} when no order exists with the given ID
 */
export async function getById(id: string) {
  const order = await orderRepository.findById(id);

  if (!order) {
    throw new NotFoundError(`Order with id "${id}" not found`);
  }

  return order;
}

/**
 * Get all orders for a specific client.
 */
export async function getByClient(clientId: string) {
  return orderRepository.findByClient(clientId);
}

/**
 * Retrieve full order detail including items, status history and client.
 *
 * @throws {NotFoundError} when no order exists with the given ID
 */
export async function getOrderDetail(id: string) {
  const detail = await orderRepository.findWithDetails(id);

  if (!detail) {
    throw new NotFoundError(`Order with id "${id}" not found`);
  }

  return detail;
}

/**
 * Create a new order with items.
 *
 * - Generates a unique order number (ORD-YYYYMMDD-XXXX)
 * - Calculates totalAmount from items (quantity × unitPrice)
 * - Creates an initial status history entry with status "pending"
 *
 * Validates: Requirements 2.6, 7.5
 */
export async function create(data: CreateOrderInput) {
  const orderNumber = generateOrderNumber();

  // Calculate total amount from items
  const totalAmount = data.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const orderData: Prisma.OrderCreateInput = {
    client: { connect: { id: data.clientId } },
    orderNumber,
    status: ORDER_STATUSES.PENDING,
    totalAmount,
    currency: data.currency ?? 'COP',
    notes: data.notes,
    items: {
      create: data.items.map((item) => ({
        productName: item.productName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
      })),
    },
    statusHistory: {
      create: {
        status: ORDER_STATUSES.PENDING,
        comment: 'Order created',
      },
    },
  };

  return orderRepository.create(orderData);
}

/**
 * Update the status of an order and record the change in the status history.
 *
 * Uses the repository's transactional updateStatus to ensure both the order
 * status and the history entry are created atomically.
 *
 * Validates: Requirements 2.6, 7.5
 *
 * @throws {NotFoundError} when no order exists with the given ID
 */
export async function updateStatus(
  id: string,
  status: string,
  changedBy: string | null,
  comment: string | null,
) {
  const existing = await orderRepository.findById(id);

  if (!existing) {
    throw new NotFoundError(`Order with id "${id}" not found`);
  }

  return orderRepository.updateStatus(id, status, changedBy, comment);
}
