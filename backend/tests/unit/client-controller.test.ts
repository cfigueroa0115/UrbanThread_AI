import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

// ── Mock dependencies ────────────────────────────────────────────────────────

const mockGetAll = vi.fn();
const mockGetById = vi.fn();
const mockGetByDocument = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockRemove = vi.fn();

vi.mock('../../src/services/client.service.js', () => ({
  getAll: (...args: unknown[]) => mockGetAll(...args),
  getById: (...args: unknown[]) => mockGetById(...args),
  getByDocument: (...args: unknown[]) => mockGetByDocument(...args),
  create: (...args: unknown[]) => mockCreate(...args),
  update: (...args: unknown[]) => mockUpdate(...args),
  remove: (...args: unknown[]) => mockRemove(...args),
}));

const mockClientAddressFindMany = vi.fn();
const mockClientAddressCreate = vi.fn();
const mockClientDocumentFindMany = vi.fn();
const mockOrderFindMany = vi.fn();
const mockRequestFindMany = vi.fn();

vi.mock('../../src/lib/prisma.js', () => ({
  prisma: {
    clientAddress: {
      findMany: (...args: unknown[]) => mockClientAddressFindMany(...args),
      create: (...args: unknown[]) => mockClientAddressCreate(...args),
    },
    clientDocument: {
      findMany: (...args: unknown[]) => mockClientDocumentFindMany(...args),
    },
    order: {
      findMany: (...args: unknown[]) => mockOrderFindMany(...args),
    },
    request: {
      findMany: (...args: unknown[]) => mockRequestFindMany(...args),
    },
  },
}));

// ── Import after mocks ───────────────────────────────────────────────────────

const {
  getAll,
  getById,
  getByDocument,
  create,
  update,
  remove,
  getAddresses,
  createAddress,
  getDocuments,
  getOrders,
  getRequests,
} = await import('../../src/controllers/client.controller.js');

// ── Helpers ──────────────────────────────────────────────────────────────────

function createMockReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides,
  } as Request;
}

function createMockRes(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

const sampleClient = {
  id: 'client-001',
  documentType: 'CC',
  documentNumber: '12345678',
  firstName: 'Juan',
  lastName: 'Pérez',
  dateOfBirth: null,
  gender: null,
  email: 'juan@test.com',
  phone: '3001234567',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Client Controller', () => {
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    next = vi.fn();
  });

  // ── getAll ─────────────────────────────────────────────────────────────

  describe('getAll', () => {
    it('returns 200 with paginated clients list', async () => {
      mockGetAll.mockResolvedValue({ data: [sampleClient], total: 1 });

      const req = createMockReq({ query: { page: 1, pageSize: 10 } as any });
      const res = createMockRes();

      await getAll(req, res, next);

      expect(mockGetAll).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data).toHaveLength(1);
      expect(responseData.meta.total).toBe(1);
      expect(responseData.meta.page).toBe(1);
      expect(responseData.meta.pageSize).toBe(10);
    });

    it('passes errors to next', async () => {
      const error = new Error('DB error');
      mockGetAll.mockRejectedValue(error);

      const req = createMockReq({ query: { page: 1, pageSize: 10 } as any });
      const res = createMockRes();

      await getAll(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── getById ────────────────────────────────────────────────────────────

  describe('getById', () => {
    it('returns 200 with client data', async () => {
      mockGetById.mockResolvedValue(sampleClient);

      const req = createMockReq({ params: { id: 'client-001' } as Record<string, string> });
      const res = createMockRes();

      await getById(req, res, next);

      expect(mockGetById).toHaveBeenCalledWith('client-001');
      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data.id).toBe('client-001');
    });

    it('passes errors to next when client not found', async () => {
      const error = new Error('Not found');
      (error as any).statusCode = 404;
      mockGetById.mockRejectedValue(error);

      const req = createMockReq({ params: { id: 'nonexistent' } as Record<string, string> });
      const res = createMockRes();

      await getById(req, res, next);

      expect(next).toHaveBeenCalled();
      const passedError = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(passedError.statusCode).toBe(404);
    });
  });

  // ── getByDocument ──────────────────────────────────────────────────────

  describe('getByDocument', () => {
    it('returns 200 with client found by document', async () => {
      mockGetByDocument.mockResolvedValue(sampleClient);

      const req = createMockReq({
        params: { type: 'CC', number: '12345678' } as Record<string, string>,
      });
      const res = createMockRes();

      await getByDocument(req, res, next);

      expect(mockGetByDocument).toHaveBeenCalledWith('CC', '12345678');
      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data.documentNumber).toBe('12345678');
    });

    it('passes errors to next when document not found', async () => {
      const error = new Error('Not found');
      (error as any).statusCode = 404;
      mockGetByDocument.mockRejectedValue(error);

      const req = createMockReq({
        params: { type: 'CC', number: '99999999' } as Record<string, string>,
      });
      const res = createMockRes();

      await getByDocument(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  // ── create ─────────────────────────────────────────────────────────────

  describe('create', () => {
    it('returns 201 with created client', async () => {
      mockCreate.mockResolvedValue(sampleClient);

      const req = createMockReq({
        body: {
          documentType: 'CC',
          documentNumber: '12345678',
          firstName: 'Juan',
          lastName: 'Pérez',
        },
      });
      const res = createMockRes();

      await create(req, res, next);

      expect(mockCreate).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data.id).toBe('client-001');
    });

    it('passes ConflictError when duplicate document', async () => {
      const error = new Error('Conflict');
      (error as any).statusCode = 409;
      mockCreate.mockRejectedValue(error);

      const req = createMockReq({
        body: {
          documentType: 'CC',
          documentNumber: '12345678',
          firstName: 'Juan',
          lastName: 'Pérez',
        },
      });
      const res = createMockRes();

      await create(req, res, next);

      expect(next).toHaveBeenCalled();
      const passedError = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(passedError.statusCode).toBe(409);
    });
  });

  // ── update ─────────────────────────────────────────────────────────────

  describe('update', () => {
    it('returns 200 with updated client', async () => {
      mockUpdate.mockResolvedValue({ ...sampleClient, firstName: 'Carlos' });

      const req = createMockReq({
        params: { id: 'client-001' } as Record<string, string>,
        body: { firstName: 'Carlos' },
      });
      const res = createMockRes();

      await update(req, res, next);

      expect(mockUpdate).toHaveBeenCalledWith('client-001', { firstName: 'Carlos' });
      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.data.firstName).toBe('Carlos');
    });

    it('passes NotFoundError when client does not exist', async () => {
      const error = new Error('Not found');
      (error as any).statusCode = 404;
      mockUpdate.mockRejectedValue(error);

      const req = createMockReq({
        params: { id: 'nonexistent' } as Record<string, string>,
        body: { firstName: 'Carlos' },
      });
      const res = createMockRes();

      await update(req, res, next);

      expect(next).toHaveBeenCalled();
      const passedError = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(passedError.statusCode).toBe(404);
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('returns 200 with success message', async () => {
      mockRemove.mockResolvedValue(sampleClient);

      const req = createMockReq({ params: { id: 'client-001' } as Record<string, string> });
      const res = createMockRes();

      await remove(req, res, next);

      expect(mockRemove).toHaveBeenCalledWith('client-001');
      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.data.message).toBe('Cliente eliminado exitosamente');
    });

    it('passes NotFoundError when client does not exist', async () => {
      const error = new Error('Not found');
      (error as any).statusCode = 404;
      mockRemove.mockRejectedValue(error);

      const req = createMockReq({ params: { id: 'nonexistent' } as Record<string, string> });
      const res = createMockRes();

      await remove(req, res, next);

      expect(next).toHaveBeenCalled();
      const passedError = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(passedError.statusCode).toBe(404);
    });
  });

  // ── Sub-resource: getAddresses ─────────────────────────────────────────

  describe('getAddresses', () => {
    it('returns 200 with client addresses', async () => {
      mockGetById.mockResolvedValue(sampleClient);
      const addresses = [
        { id: 'addr-001', clientId: 'client-001', street: 'Calle 1', city: 'Bogotá', createdAt: new Date() },
      ];
      mockClientAddressFindMany.mockResolvedValue(addresses);

      const req = createMockReq({ params: { id: 'client-001' } as Record<string, string> });
      const res = createMockRes();

      await getAddresses(req, res, next);

      expect(mockGetById).toHaveBeenCalledWith('client-001');
      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data).toHaveLength(1);
    });

    it('passes error when client not found', async () => {
      const error = new Error('Not found');
      (error as any).statusCode = 404;
      mockGetById.mockRejectedValue(error);

      const req = createMockReq({ params: { id: 'nonexistent' } as Record<string, string> });
      const res = createMockRes();

      await getAddresses(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  // ── Sub-resource: createAddress ────────────────────────────────────────

  describe('createAddress', () => {
    it('returns 201 with created address', async () => {
      mockGetById.mockResolvedValue(sampleClient);
      const newAddress = {
        id: 'addr-002',
        clientId: 'client-001',
        street: 'Carrera 5',
        city: 'Medellín',
        createdAt: new Date(),
      };
      mockClientAddressCreate.mockResolvedValue(newAddress);

      const req = createMockReq({
        params: { id: 'client-001' } as Record<string, string>,
        body: { street: 'Carrera 5', city: 'Medellín' },
      });
      const res = createMockRes();

      await createAddress(req, res, next);

      expect(mockGetById).toHaveBeenCalledWith('client-001');
      expect(res.status).toHaveBeenCalledWith(201);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data.city).toBe('Medellín');
    });
  });

  // ── Sub-resource: getDocuments ─────────────────────────────────────────

  describe('getDocuments', () => {
    it('returns 200 with client documents', async () => {
      mockGetById.mockResolvedValue(sampleClient);
      const documents = [
        { id: 'doc-001', clientId: 'client-001', documentType: { name: 'Cédula' }, createdAt: new Date() },
      ];
      mockClientDocumentFindMany.mockResolvedValue(documents);

      const req = createMockReq({ params: { id: 'client-001' } as Record<string, string> });
      const res = createMockRes();

      await getDocuments(req, res, next);

      expect(mockGetById).toHaveBeenCalledWith('client-001');
      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data).toHaveLength(1);
    });
  });

  // ── Sub-resource: getOrders ────────────────────────────────────────────

  describe('getOrders', () => {
    it('returns 200 with client orders', async () => {
      mockGetById.mockResolvedValue(sampleClient);
      const orders = [
        { id: 'order-001', clientId: 'client-001', status: 'pending', items: [], createdAt: new Date() },
      ];
      mockOrderFindMany.mockResolvedValue(orders);

      const req = createMockReq({ params: { id: 'client-001' } as Record<string, string> });
      const res = createMockRes();

      await getOrders(req, res, next);

      expect(mockGetById).toHaveBeenCalledWith('client-001');
      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data).toHaveLength(1);
    });
  });

  // ── Sub-resource: getRequests ──────────────────────────────────────────

  describe('getRequests', () => {
    it('returns 200 with client requests', async () => {
      mockGetById.mockResolvedValue(sampleClient);
      const requests = [
        { id: 'req-001', clientId: 'client-001', type: 'PQR', status: 'registered', createdAt: new Date() },
      ];
      mockRequestFindMany.mockResolvedValue(requests);

      const req = createMockReq({ params: { id: 'client-001' } as Record<string, string> });
      const res = createMockRes();

      await getRequests(req, res, next);

      expect(mockGetById).toHaveBeenCalledWith('client-001');
      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseData.status).toBe('success');
      expect(responseData.data).toHaveLength(1);
    });

    it('passes error when client not found', async () => {
      const error = new Error('Not found');
      (error as any).statusCode = 404;
      mockGetById.mockRejectedValue(error);

      const req = createMockReq({ params: { id: 'nonexistent' } as Record<string, string> });
      const res = createMockRes();

      await getRequests(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
