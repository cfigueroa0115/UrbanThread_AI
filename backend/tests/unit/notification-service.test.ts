import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundError } from '../../src/utils/errors.js';
import { NOTIFICATION_TYPES } from '@shared/constants/index.js';

// ── Mock repositories ────────────────────────────────────────────────────────

const mockFindByClient = vi.fn();
const mockCountUnread = vi.fn();
const mockMarkAsRead = vi.fn();
const mockMarkAllAsRead = vi.fn();
const mockCreate = vi.fn();

vi.mock('../../src/repositories/index.js', () => ({
  notificationRepository: {
    findByClient: (...args: unknown[]) => mockFindByClient(...args),
    countUnread: (...args: unknown[]) => mockCountUnread(...args),
    markAsRead: (...args: unknown[]) => mockMarkAsRead(...args),
    markAllAsRead: (...args: unknown[]) => mockMarkAllAsRead(...args),
    create: (...args: unknown[]) => mockCreate(...args),
  },
}));

// ── Import after mocks ───────────────────────────────────────────────────────

const {
  getByClient,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createOrderStatusNotification,
  createRequestStatusNotification,
} = await import('../../src/services/notification.service.js');

// ── Test data ────────────────────────────────────────────────────────────────

const now = new Date();

const mockNotification = {
  id: 'notif-001',
  clientId: 'client-001',
  type: 'order_status',
  title: 'Pedido ORD-20250101-0001 actualizado',
  message: 'El estado de tu pedido ORD-20250101-0001 ha cambiado a: Confirmado.',
  isRead: false,
  readAt: null,
  metadata: { orderId: 'order-001', orderNumber: 'ORD-20250101-0001', newStatus: 'confirmed' },
  createdAt: now,
};

const mockReadNotification = {
  ...mockNotification,
  id: 'notif-002',
  isRead: true,
  readAt: now,
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Notification Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── getByClient ──────────────────────────────────────────────────────

  describe('getByClient', () => {
    it('returns paginated list of notifications for a client', async () => {
      const result = { data: [mockNotification], total: 1 };
      mockFindByClient.mockResolvedValue(result);

      const response = await getByClient('client-001', 1, 20);

      expect(response).toEqual(result);
      expect(mockFindByClient).toHaveBeenCalledWith('client-001', { page: 1, pageSize: 20 });
    });

    it('passes pagination parameters correctly', async () => {
      mockFindByClient.mockResolvedValue({ data: [], total: 0 });

      await getByClient('client-001', 3, 10);

      expect(mockFindByClient).toHaveBeenCalledWith('client-001', { page: 3, pageSize: 10 });
    });

    it('returns empty data when client has no notifications', async () => {
      mockFindByClient.mockResolvedValue({ data: [], total: 0 });

      const result = await getByClient('client-no-notifs', 1, 20);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  // ── getUnreadCount ───────────────────────────────────────────────────

  describe('getUnreadCount', () => {
    it('returns count of unread notifications', async () => {
      mockCountUnread.mockResolvedValue(5);

      const count = await getUnreadCount('client-001');

      expect(count).toBe(5);
      expect(mockCountUnread).toHaveBeenCalledWith('client-001');
    });

    it('returns zero when all notifications are read', async () => {
      mockCountUnread.mockResolvedValue(0);

      const count = await getUnreadCount('client-001');

      expect(count).toBe(0);
    });
  });

  // ── markAsRead ───────────────────────────────────────────────────────

  describe('markAsRead', () => {
    it('marks a notification as read', async () => {
      mockMarkAsRead.mockResolvedValue(mockReadNotification);

      const result = await markAsRead('notif-001');

      expect(result).toEqual(mockReadNotification);
      expect(mockMarkAsRead).toHaveBeenCalledWith('notif-001');
    });

    it('throws NotFoundError when notification does not exist', async () => {
      mockMarkAsRead.mockRejectedValue(new Error('Record not found'));

      await expect(markAsRead('nonexistent')).rejects.toThrow(NotFoundError);
      await expect(markAsRead('nonexistent')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  // ── markAllAsRead ────────────────────────────────────────────────────

  describe('markAllAsRead', () => {
    it('marks all notifications as read for a client', async () => {
      mockMarkAllAsRead.mockResolvedValue({ count: 3 });

      const result = await markAllAsRead('client-001');

      expect(result).toEqual({ count: 3 });
      expect(mockMarkAllAsRead).toHaveBeenCalledWith('client-001');
    });

    it('returns zero count when no unread notifications exist', async () => {
      mockMarkAllAsRead.mockResolvedValue({ count: 0 });

      const result = await markAllAsRead('client-001');

      expect(result).toEqual({ count: 0 });
    });
  });

  // ── createOrderStatusNotification ────────────────────────────────────

  describe('createOrderStatusNotification', () => {
    it('creates a notification with order_status type', async () => {
      mockCreate.mockResolvedValue({ id: 'notif-new', ...mockNotification });

      await createOrderStatusNotification(
        'client-001',
        'order-001',
        'ORD-20250101-0001',
        'confirmed',
      );

      expect(mockCreate).toHaveBeenCalledTimes(1);
      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.type).toBe(NOTIFICATION_TYPES.ORDER_STATUS);
    });

    it('connects to the correct client', async () => {
      mockCreate.mockResolvedValue({ id: 'notif-new' });

      await createOrderStatusNotification(
        'client-001',
        'order-001',
        'ORD-20250101-0001',
        'confirmed',
      );

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.client.connect.id).toBe('client-001');
    });

    it('includes order number in title and message', async () => {
      mockCreate.mockResolvedValue({ id: 'notif-new' });

      await createOrderStatusNotification(
        'client-001',
        'order-001',
        'ORD-20250101-0001',
        'shipped',
      );

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.title).toContain('ORD-20250101-0001');
      expect(callArg.message).toContain('ORD-20250101-0001');
    });

    it('translates known status to Spanish label', async () => {
      mockCreate.mockResolvedValue({ id: 'notif-new' });

      await createOrderStatusNotification(
        'client-001',
        'order-001',
        'ORD-20250101-0001',
        'delivered',
      );

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.message).toContain('Entregado');
    });

    it('uses raw status when no label mapping exists', async () => {
      mockCreate.mockResolvedValue({ id: 'notif-new' });

      await createOrderStatusNotification(
        'client-001',
        'order-001',
        'ORD-20250101-0001',
        'unknown_status',
      );

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.message).toContain('unknown_status');
    });

    it('stores orderId, orderNumber and newStatus in metadata', async () => {
      mockCreate.mockResolvedValue({ id: 'notif-new' });

      await createOrderStatusNotification(
        'client-001',
        'order-001',
        'ORD-20250101-0001',
        'confirmed',
      );

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.metadata).toEqual({
        orderId: 'order-001',
        orderNumber: 'ORD-20250101-0001',
        newStatus: 'confirmed',
      });
    });
  });

  // ── createRequestStatusNotification ──────────────────────────────────

  describe('createRequestStatusNotification', () => {
    it('creates a notification with request_status type', async () => {
      mockCreate.mockResolvedValue({ id: 'notif-new' });

      await createRequestStatusNotification(
        'client-001',
        'request-001',
        'RAD-20250101-0001',
        'in_review',
      );

      expect(mockCreate).toHaveBeenCalledTimes(1);
      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.type).toBe(NOTIFICATION_TYPES.REQUEST_STATUS);
    });

    it('connects to the correct client', async () => {
      mockCreate.mockResolvedValue({ id: 'notif-new' });

      await createRequestStatusNotification(
        'client-001',
        'request-001',
        'RAD-20250101-0001',
        'in_review',
      );

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.client.connect.id).toBe('client-001');
    });

    it('includes radication number in title and message', async () => {
      mockCreate.mockResolvedValue({ id: 'notif-new' });

      await createRequestStatusNotification(
        'client-001',
        'request-001',
        'RAD-20250101-0001',
        'resolved',
      );

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.title).toContain('RAD-20250101-0001');
      expect(callArg.message).toContain('RAD-20250101-0001');
    });

    it('translates known request status to Spanish label', async () => {
      mockCreate.mockResolvedValue({ id: 'notif-new' });

      await createRequestStatusNotification(
        'client-001',
        'request-001',
        'RAD-20250101-0001',
        'in_progress',
      );

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.message).toContain('En progreso');
    });

    it('uses raw status when no label mapping exists', async () => {
      mockCreate.mockResolvedValue({ id: 'notif-new' });

      await createRequestStatusNotification(
        'client-001',
        'request-001',
        'RAD-20250101-0001',
        'custom_status',
      );

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.message).toContain('custom_status');
    });

    it('stores requestId, radicationNumber and newStatus in metadata', async () => {
      mockCreate.mockResolvedValue({ id: 'notif-new' });

      await createRequestStatusNotification(
        'client-001',
        'request-001',
        'RAD-20250101-0001',
        'resolved',
      );

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.metadata).toEqual({
        requestId: 'request-001',
        radicationNumber: 'RAD-20250101-0001',
        newStatus: 'resolved',
      });
    });
  });
});
