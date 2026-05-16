import { notificationRepository } from '../repositories/index.js';
import { NotFoundError } from '../utils/errors.js';
import { NOTIFICATION_TYPES } from '@shared/constants/index.js';
import type { Prisma } from '@prisma/client';

// ── Status label helpers ─────────────────────────────────────────────────────

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'En procesamiento',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const REQUEST_STATUS_LABELS: Record<string, string> = {
  registered: 'Registrada',
  in_review: 'En revisión',
  in_progress: 'En progreso',
  pending_info: 'Pendiente de información',
  resolved: 'Resuelta',
  closed: 'Cerrada',
  cancelled: 'Cancelada',
};

// ── Notification Service ─────────────────────────────────────────────────────

/**
 * Retrieve a paginated list of notifications for a client.
 *
 * Validates: Requirement 17.2
 *
 * @returns Object with `data` (notification array) and `total` count.
 */
export async function getByClient(clientId: string, page: number, pageSize: number) {
  return notificationRepository.findByClient(clientId, { page, pageSize });
}

/**
 * Get the count of unread notifications for a client.
 *
 * Validates: Requirement 17.2
 */
export async function getUnreadCount(clientId: string) {
  return notificationRepository.countUnread(clientId);
}

/**
 * Mark a single notification as read.
 *
 * Validates: Requirement 17.3
 *
 * @throws {NotFoundError} when the notification does not exist
 */
export async function markAsRead(notificationId: string) {
  try {
    return await notificationRepository.markAsRead(notificationId);
  } catch {
    throw new NotFoundError(`Notification with id "${notificationId}" not found`);
  }
}

/**
 * Mark all notifications as read for a client.
 *
 * Validates: Requirement 17.3
 */
export async function markAllAsRead(clientId: string) {
  return notificationRepository.markAllAsRead(clientId);
}

/**
 * Create a notification when an order changes status.
 *
 * Validates: Requirement 17.1
 */
export async function createOrderStatusNotification(
  clientId: string,
  orderId: string,
  orderNumber: string,
  newStatus: string,
) {
  const statusLabel = ORDER_STATUS_LABELS[newStatus] ?? newStatus;

  const data: Prisma.NotificationCreateInput = {
    client: { connect: { id: clientId } },
    type: NOTIFICATION_TYPES.ORDER_STATUS,
    title: `Pedido ${orderNumber} actualizado`,
    message: `El estado de tu pedido ${orderNumber} ha cambiado a: ${statusLabel}.`,
    metadata: { orderId, orderNumber, newStatus },
  };

  return notificationRepository.create(data);
}

/**
 * Create a notification when a request (radicación) changes status.
 *
 * Validates: Requirement 17.1
 */
export async function createRequestStatusNotification(
  clientId: string,
  requestId: string,
  radicationNumber: string,
  newStatus: string,
) {
  const statusLabel = REQUEST_STATUS_LABELS[newStatus] ?? newStatus;

  const data: Prisma.NotificationCreateInput = {
    client: { connect: { id: clientId } },
    type: NOTIFICATION_TYPES.REQUEST_STATUS,
    title: `Solicitud ${radicationNumber} actualizada`,
    message: `El estado de tu solicitud ${radicationNumber} ha cambiado a: ${statusLabel}.`,
    metadata: { requestId, radicationNumber, newStatus },
  };

  return notificationRepository.create(data);
}
