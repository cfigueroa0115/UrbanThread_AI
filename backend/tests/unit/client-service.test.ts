import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundError, ConflictError } from '../../src/utils/errors.js';

// ── Mock repositories ────────────────────────────────────────────────────────

const mockFindAll = vi.fn();
const mockFindById = vi.fn();
const mockFindByDocument = vi.fn();
const mockFindWithDetails = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockRemove = vi.fn();

vi.mock('../../src/repositories/index.js', () => ({
  clientRepository: {
    findAll: (...args: unknown[]) => mockFindAll(...args),
    findById: (...args: unknown[]) => mockFindById(...args),
    findByDocument: (...args: unknown[]) => mockFindByDocument(...args),
    findWithDetails: (...args: unknown[]) => mockFindWithDetails(...args),
    create: (...args: unknown[]) => mockCreate(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
    remove: (...args: unknown[]) => mockRemove(...args),
  },
}));

// ── Import after mocks ───────────────────────────────────────────────────────

const {
  getAll,
  getById,
  getByDocument,
  getClientDetail,
  create,
  update,
  remove,
} = await import('../../src/services/client.service.js');

// ── Test data ────────────────────────────────────────────────────────────────

const now = new Date();

const mockClient = {
  id: 'client-001',
  documentType: 'CC',
  documentNumber: '1234567890',
  firstName: 'Juan',
  lastName: 'Pérez',
  dateOfBirth: null,
  gender: null,
  isActive: true,
  createdAt: now,
  updatedAt: now,
};

const mockClientDetail = {
  ...mockClient,
  addresses: [
    {
      id: 'addr-001',
      clientId: 'client-001',
      type: 'home',
      street: 'Calle 123',
      city: 'Bogotá',
      state: 'Cundinamarca',
      postalCode: '110111',
      country: 'Colombia',
      isPrimary: true,
      createdAt: now,
      updatedAt: now,
    },
  ],
  emails: [
    {
      id: 'email-001',
      clientId: 'client-001',
      email: 'juan@example.com',
      isPrimary: true,
      isVerified: true,
      createdAt: now,
      updatedAt: now,
    },
  ],
  phones: [
    {
      id: 'phone-001',
      clientId: 'client-001',
      phone: '+573001234567',
      type: 'mobile',
      isPrimary: true,
      isWhatsapp: true,
      createdAt: now,
      updatedAt: now,
    },
  ],
  documents: [],
  profile: null,
  orders: [],
  requests: [],
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Client Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── getAll ─────────────────────────────────────────────────────────────

  describe('getAll', () => {
    it('returns paginated list of clients', async () => {
      const result = { data: [mockClient], total: 1 };
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
    it('returns client when found', async () => {
      mockFindById.mockResolvedValue(mockClient);

      const result = await getById('client-001');

      expect(result).toEqual(mockClient);
      expect(mockFindById).toHaveBeenCalledWith('client-001');
    });

    it('throws NotFoundError when client does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(getById('nonexistent')).rejects.toThrow(NotFoundError);
      await expect(getById('nonexistent')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  // ── getByDocument ──────────────────────────────────────────────────────

  describe('getByDocument', () => {
    it('returns client when document matches', async () => {
      mockFindByDocument.mockResolvedValue(mockClient);

      const result = await getByDocument('CC', '1234567890');

      expect(result).toEqual(mockClient);
      expect(mockFindByDocument).toHaveBeenCalledWith('CC', '1234567890');
    });

    it('throws NotFoundError when document does not match', async () => {
      mockFindByDocument.mockResolvedValue(null);

      await expect(getByDocument('CC', '0000000000')).rejects.toThrow(NotFoundError);
    });
  });

  // ── getClientDetail ────────────────────────────────────────────────────

  describe('getClientDetail', () => {
    it('returns full client detail with related data', async () => {
      mockFindWithDetails.mockResolvedValue(mockClientDetail);

      const result = await getClientDetail('client-001');

      expect(result).toEqual(mockClientDetail);
      expect(result.addresses).toHaveLength(1);
      expect(result.emails).toHaveLength(1);
      expect(result.phones).toHaveLength(1);
      expect(mockFindWithDetails).toHaveBeenCalledWith('client-001');
    });

    it('throws NotFoundError when client does not exist', async () => {
      mockFindWithDetails.mockResolvedValue(null);

      await expect(getClientDetail('nonexistent')).rejects.toThrow(NotFoundError);
    });
  });

  // ── create ─────────────────────────────────────────────────────────────

  describe('create', () => {
    const createData = {
      documentType: 'CC',
      documentNumber: '9876543210',
      firstName: 'María',
      lastName: 'García',
    };

    it('creates a new client when document does not exist', async () => {
      mockFindByDocument.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 'client-002', ...createData, createdAt: now, updatedAt: now });

      const result = await create(createData);

      expect(result.id).toBe('client-002');
      expect(mockFindByDocument).toHaveBeenCalledWith('CC', '9876543210');
      expect(mockCreate).toHaveBeenCalledWith(createData);
    });

    it('throws ConflictError when document already exists', async () => {
      mockFindByDocument.mockResolvedValue(mockClient);

      await expect(create({
        documentType: 'CC',
        documentNumber: '1234567890',
        firstName: 'Duplicate',
        lastName: 'Client',
      })).rejects.toThrow(ConflictError);

      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('ConflictError has status code 409', async () => {
      mockFindByDocument.mockResolvedValue(mockClient);

      await expect(create({
        documentType: 'CC',
        documentNumber: '1234567890',
        firstName: 'Dup',
        lastName: 'Client',
      })).rejects.toMatchObject({
        statusCode: 409,
      });
    });
  });

  // ── update ─────────────────────────────────────────────────────────────

  describe('update', () => {
    it('updates client when found', async () => {
      mockFindById.mockResolvedValue(mockClient);
      const updatedClient = { ...mockClient, firstName: 'Juan Carlos' };
      mockUpdate.mockResolvedValue(updatedClient);

      const result = await update('client-001', { firstName: 'Juan Carlos' });

      expect(result.firstName).toBe('Juan Carlos');
      expect(mockFindById).toHaveBeenCalledWith('client-001');
      expect(mockUpdate).toHaveBeenCalledWith('client-001', { firstName: 'Juan Carlos' });
    });

    it('throws NotFoundError when client does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(update('nonexistent', { firstName: 'Test' })).rejects.toThrow(NotFoundError);
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('removes client when found', async () => {
      mockFindById.mockResolvedValue(mockClient);
      mockRemove.mockResolvedValue(mockClient);

      const result = await remove('client-001');

      expect(result).toEqual(mockClient);
      expect(mockFindById).toHaveBeenCalledWith('client-001');
      expect(mockRemove).toHaveBeenCalledWith('client-001');
    });

    it('throws NotFoundError when client does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(remove('nonexistent')).rejects.toThrow(NotFoundError);
      expect(mockRemove).not.toHaveBeenCalled();
    });
  });
});
