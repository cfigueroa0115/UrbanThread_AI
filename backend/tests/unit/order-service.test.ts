import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundError } from '../../src/utils/errors.js';

// ── Mock repositories ────────────────────────────────────────────────────────

const mockFindAll = vi.fn();
const mockFindById = vi.fn();
const mockFindByClient = vi.fn();
const mockFindWithDetails = vi.fn();
const mockCreate = vi.fn();
const mockUpdateStatus = vi.fn();

vi.mock('../../src/repositories/index.js', () => ({
  orderRepository: {
    findAll: (...args: unknown[]) => mockFindAll(...args),
    findById: (...args: unknown[]) => mockFindById(...args),
    findByClient: (...args: unknown[]) => mockFindByClient(...args),
    findWithDetails: (...args: unknown[]) => mockFindWithDetails(...args),
    create: (...args: unknown[]) => mockCreate(...args),
    updateStatus: (...args: unknown[]) => mockUpdateStatus(...args),
  },
}));

// ── Import after mocks ───────────────────────────────────────────────────────

const {
  getAll,
  getById,
  getByClient,
  getOrderDetail,
  create,
  updateStatus,
  generateOrderNumber,
} = await import('../../src/services/order.service.js');

// ── Test data ────────────────────────────────────────────────────────────────

const now = new Date();

const mockOrder = {
  id: 'order-001',
  clientId: 'client-001',
  orderNumber: 'ORD-20250101-0001',
  status: 'pending',
  totalAmount: 150000,
  currency: 'COP',
  notes: null,
  createdAt: now,
  updatedAt: now,
};

const mockOrderDetail = {
  ...mockOrder,
  items: [
    {
      id: 'item-001',
      orderId: 'order-001',
      productName: 'Camiseta Premium',
      description: 'Talla M, Color Negro',
      quantity: 2,
      unitPrice: 50000,
      totalPrice: 100000,
      createdAt: now,
    },
    {
      id: 'item-002',
      orderId: 'order-001',
      productName: 'Pantalón Casual',
      description: null,
      quantity: 1,
      unitPrice: 50000,
      totalPrice: 50000,
      createdAt: now,
    },
  ],
  statusHistory: [
    {
      id: 'status-001',
      orderId: 'order-001',
      status: 'pending',
      comment: 'Order created',
      changedBy: null,
      createdAt: now,
    },
  ],
  client: {
    id: 'client-001',
    documentType: 'CC',
    documentNumber: '1234567890',
    firstName: 'Juan',
    lastName: 'Pérez',
  },
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Order Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── generateOrderNumber ────────────────────────────────────────────────

  describe('generateOrderNumber', () => {
    it('generates order number with ORD prefix', () => {
      const orderNumber = generateOrderNumber();
      expect(orderNumber).toMatch(/^ORD-/);
    });

    it('generates order number with date segment YYYYMMDD', () => {
      const orderNumber = generateOrderNumber();
      // Format: ORD-YYYYMMDD-XXXX
      const parts = orderNumber.split('-');
      expect(parts).toHaveLength(3);
      expect(parts[0]).toBe('ORD');
      expect(parts[1]).toMatch(/^\d{8}$/);
      expect(parts[2]).toMatch(/^\d{4}$/);
    });

    it('includes current date in the order number', () => {
      const orderNumber = generateOrderNumber();
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const expectedDate = `${year}${month}${day}`;

      expect(orderNumber).toContain(expectedDate);
    });
  });

  // ── getAll ─────────────────────────────────────────────────────────────

  describe('getAll', () => {
    it('returns paginated list of orders', async () => {
      const result = { data: [mockOrder], total: 1 };
      mockFindAll.mockResolvedValue(result);

      const response = await getAll(1, 20);

      expect(response).toEqual(result);
      expect(mockFindAll).toHaveBeenCalledWith({ page: 1, pageSize: 20 });
    });

    it('passes pagination parameters correctly', async () => {
      mockFindAll.mockResolvedValue({ data: [], total: 0 });

      await getAll(3, 10);

      expect(mockFindAll).toHaveBeenCalledWith({ page: 3, pageSize: 10 });
    });
  });

  // ── getById ────────────────────────────────────────────────────────────

  describe('getById', () => {
    it('returns order when found', async () => {
      mockFindById.mockResolvedValue(mockOrder);

      const result = await getById('order-001');

      expect(result).toEqual(mockOrder);
      expect(mockFindById).toHaveBeenCalledWith('order-001');
    });

    it('throws NotFoundError when order does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(getById('nonexistent')).rejects.toThrow(NotFoundError);
      await expect(getById('nonexistent')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  // ── getByClient ────────────────────────────────────────────────────────

  describe('getByClient', () => {
    it('returns orders for a client', async () => {
      const orders = [mockOrder];
      mockFindByClient.mockResolvedValue(orders);

      const result = await getByClient('client-001');

      expect(result).toEqual(orders);
      expect(mockFindByClient).toHaveBeenCalledWith('client-001');
    });

    it('returns empty array when client has no orders', async () => {
      mockFindByClient.mockResolvedValue([]);

      const result = await getByClient('client-no-orders');

      expect(result).toEqual([]);
    });
  });

  // ── getOrderDetail ─────────────────────────────────────────────────────

  describe('getOrderDetail', () => {
    it('returns full order detail with items, statusHistory and client', async () => {
      mockFindWithDetails.mockResolvedValue(mockOrderDetail);

      const result = await getOrderDetail('order-001');

      expect(result).toEqual(mockOrderDetail);
      expect(result.items).toHaveLength(2);
      expect(result.statusHistory).toHaveLength(1);
      expect(result.client).toBeDefined();
      expect(mockFindWithDetails).toHaveBeenCalledWith('order-001');
    });

    it('throws NotFoundError when order does not exist', async () => {
      mockFindWithDetails.mockResolvedValue(null);

      await expect(getOrderDetail('nonexistent')).rejects.toThrow(NotFoundError);
    });
  });

  // ── create ─────────────────────────────────────────────────────────────

  describe('create', () => {
    const createData = {
      clientId: 'client-001',
      items: [
        { productName: 'Camiseta Premium', quantity: 2, unitPrice: 50000 },
        { productName: 'Pantalón Casual', quantity: 1, unitPrice: 50000 },
      ],
    };

    it('creates an order with calculated totalAmount', async () => {
      mockCreate.mockImplementation((data: Record<string, unknown>) => ({
        id: 'order-new',
        ...data,
        createdAt: now,
        updatedAt: now,
      }));

      await create(createData);

      expect(mockCreate).toHaveBeenCalledTimes(1);
      const callArg = mockCreate.mock.calls[0][0];
      // totalAmount = (2 * 50000) + (1 * 50000) = 150000
      expect(callArg.totalAmount).toBe(150000);
    });

    it('generates a unique order number with ORD prefix', async () => {
      mockCreate.mockResolvedValue({ id: 'order-new' });

      await create(createData);

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.orderNumber).toMatch(/^ORD-\d{8}-\d{4}$/);
    });

    it('creates items with correct totalPrice per item', async () => {
      mockCreate.mockResolvedValue({ id: 'order-new' });

      await create(createData);

      const callArg = mockCreate.mock.calls[0][0];
      const items = callArg.items.create;
      expect(items[0].totalPrice).toBe(100000); // 2 * 50000
      expect(items[1].totalPrice).toBe(50000);  // 1 * 50000
    });

    it('creates initial status history entry with pending status', async () => {
      mockCreate.mockResolvedValue({ id: 'order-new' });

      await create(createData);

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.statusHistory.create.status).toBe('pending');
      expect(callArg.statusHistory.create.comment).toBe('Order created');
    });

    it('sets default currency to COP when not provided', async () => {
      mockCreate.mockResolvedValue({ id: 'order-new' });

      await create(createData);

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.currency).toBe('COP');
    });

    it('uses provided currency when specified', async () => {
      mockCreate.mockResolvedValue({ id: 'order-new' });

      await create({ ...createData, currency: 'USD' });

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.currency).toBe('USD');
    });

    it('connects to the correct client', async () => {
      mockCreate.mockResolvedValue({ id: 'order-new' });

      await create(createData);

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.client.connect.id).toBe('client-001');
    });
  });

  // ── updateStatus ───────────────────────────────────────────────────────

  describe('updateStatus', () => {
    it('updates order status when order exists', async () => {
      mockFindById.mockResolvedValue(mockOrder);
      const txResult = [
        { ...mockOrder, status: 'confirmed' },
        { id: 'status-002', orderId: 'order-001', status: 'confirmed', changedBy: 'admin-001', comment: 'Confirmed by admin' },
      ];
      mockUpdateStatus.mockResolvedValue(txResult);

      const result = await updateStatus('order-001', 'confirmed', 'admin-001', 'Confirmed by admin');

      expect(result).toEqual(txResult);
      expect(mockFindById).toHaveBeenCalledWith('order-001');
      expect(mockUpdateStatus).toHaveBeenCalledWith('order-001', 'confirmed', 'admin-001', 'Confirmed by admin');
    });

    it('throws NotFoundError when order does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(
        updateStatus('nonexistent', 'confirmed', 'admin-001', null),
      ).rejects.toThrow(NotFoundError);

      expect(mockUpdateStatus).not.toHaveBeenCalled();
    });

    it('passes null changedBy and comment correctly', async () => {
      mockFindById.mockResolvedValue(mockOrder);
      mockUpdateStatus.mockResolvedValue([]);

      await updateStatus('order-001', 'shipped', null, null);

      expect(mockUpdateStatus).toHaveBeenCalledWith('order-001', 'shipped', null, null);
    });
  });
});
