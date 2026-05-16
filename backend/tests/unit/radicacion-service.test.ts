import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundError } from '../../src/utils/errors.js';

// ── Mock repositories ────────────────────────────────────────────────────────

const mockClientFindByDocument = vi.fn();

const mockRequestFindByRadicationNumber = vi.fn();
const mockRequestFindWithDetails = vi.fn();
const mockRequestCreate = vi.fn();

vi.mock('../../src/repositories/index.js', () => ({
  clientRepository: {
    findByDocument: (...args: unknown[]) => mockClientFindByDocument(...args),
  },
  requestRepository: {
    findByRadicationNumber: (...args: unknown[]) => mockRequestFindByRadicationNumber(...args),
    findWithDetails: (...args: unknown[]) => mockRequestFindWithDetails(...args),
    create: (...args: unknown[]) => mockRequestCreate(...args),
  },
}));

// ── Import after mocks ───────────────────────────────────────────────────────

const {
  lookupClient,
  generateRadicationNumber,
  createRequest,
  sendConfirmationEmail,
  triggerN8nWorkflow,
  getRequestStatus,
  _resetSequenceCounter,
} = await import('../../src/services/radicacion.service.js');

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

const mockRequest = {
  id: 'request-001',
  clientId: 'client-001',
  radicationNumber: 'RAD-2025-000001',
  type: 'complaint',
  description: 'Producto defectuoso',
  priority: 'medium',
  status: 'registered',
  assignedTo: null,
  createdAt: now,
  updatedAt: now,
};

const mockStatusHistory = [
  {
    id: 'status-001',
    requestId: 'request-001',
    status: 'registered',
    comment: 'Solicitud radicada',
    changedBy: null,
    createdAt: now,
  },
];

const mockRequestDetail = {
  ...mockRequest,
  statusHistory: mockStatusHistory,
  attachedFiles: [],
  client: mockClient,
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Radicacion Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _resetSequenceCounter(0);
  });

  // ── lookupClient ─────────────────────────────────────────────────────

  describe('lookupClient', () => {
    it('returns client when found by document', async () => {
      mockClientFindByDocument.mockResolvedValue(mockClient);

      const result = await lookupClient('CC', '1234567890');

      expect(result).toEqual(mockClient);
      expect(mockClientFindByDocument).toHaveBeenCalledWith('CC', '1234567890');
    });

    it('returns null when client is not found (no error thrown)', async () => {
      mockClientFindByDocument.mockResolvedValue(null);

      const result = await lookupClient('CC', '9999999999');

      expect(result).toBeNull();
      expect(mockClientFindByDocument).toHaveBeenCalledWith('CC', '9999999999');
    });

    it('returns null when repository returns undefined', async () => {
      mockClientFindByDocument.mockResolvedValue(undefined);

      const result = await lookupClient('CE', '5555555555');

      expect(result).toBeNull();
    });
  });

  // ── generateRadicationNumber ─────────────────────────────────────────

  describe('generateRadicationNumber', () => {
    it('generates radication number with RAD prefix', () => {
      const number = generateRadicationNumber();
      expect(number).toMatch(/^RAD-/);
    });

    it('generates radication number with current year', () => {
      const number = generateRadicationNumber();
      const year = new Date().getFullYear();
      expect(number).toContain(String(year));
    });

    it('generates radication number with format RAD-YYYY-NNNNNN', () => {
      const number = generateRadicationNumber();
      expect(number).toMatch(/^RAD-\d{4}-\d{6}$/);
    });

    it('generates sequential numbers', () => {
      const first = generateRadicationNumber();
      const second = generateRadicationNumber();
      const third = generateRadicationNumber();

      expect(first).toMatch(/-000001$/);
      expect(second).toMatch(/-000002$/);
      expect(third).toMatch(/-000003$/);
    });

    it('pads sequence number to 6 digits', () => {
      const number = generateRadicationNumber();
      const parts = number.split('-');
      expect(parts[2]).toHaveLength(6);
    });
  });

  // ── createRequest ────────────────────────────────────────────────────

  describe('createRequest', () => {
    const createData = {
      clientId: 'client-001',
      type: 'complaint',
      description: 'Producto defectuoso',
    };

    it('creates a request with generated radication number', async () => {
      mockRequestCreate.mockResolvedValue(mockRequest);

      await createRequest(createData);

      expect(mockRequestCreate).toHaveBeenCalledTimes(1);
      const callArg = mockRequestCreate.mock.calls[0][0];
      expect(callArg.radicationNumber).toMatch(/^RAD-\d{4}-\d{6}$/);
    });

    it('creates request with initial status "registered"', async () => {
      mockRequestCreate.mockResolvedValue(mockRequest);

      await createRequest(createData);

      const callArg = mockRequestCreate.mock.calls[0][0];
      expect(callArg.status).toBe('registered');
    });

    it('creates initial status history entry', async () => {
      mockRequestCreate.mockResolvedValue(mockRequest);

      await createRequest(createData);

      const callArg = mockRequestCreate.mock.calls[0][0];
      expect(callArg.statusHistory.create.status).toBe('registered');
      expect(callArg.statusHistory.create.comment).toBe('Solicitud radicada');
    });

    it('connects to the correct client', async () => {
      mockRequestCreate.mockResolvedValue(mockRequest);

      await createRequest(createData);

      const callArg = mockRequestCreate.mock.calls[0][0];
      expect(callArg.client.connect.id).toBe('client-001');
    });

    it('uses default priority "medium" when not provided', async () => {
      mockRequestCreate.mockResolvedValue(mockRequest);

      await createRequest(createData);

      const callArg = mockRequestCreate.mock.calls[0][0];
      expect(callArg.priority).toBe('medium');
    });

    it('uses provided priority when specified', async () => {
      mockRequestCreate.mockResolvedValue(mockRequest);

      await createRequest({ ...createData, priority: 'urgent' });

      const callArg = mockRequestCreate.mock.calls[0][0];
      expect(callArg.priority).toBe('urgent');
    });

    it('passes type and description correctly', async () => {
      mockRequestCreate.mockResolvedValue(mockRequest);

      await createRequest(createData);

      const callArg = mockRequestCreate.mock.calls[0][0];
      expect(callArg.type).toBe('complaint');
      expect(callArg.description).toBe('Producto defectuoso');
    });
  });

  // ── sendConfirmationEmail ────────────────────────────────────────────

  describe('sendConfirmationEmail', () => {
    it('does not throw (placeholder implementation)', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        sendConfirmationEmail({
          radicationNumber: 'RAD-2025-000001',
          clientId: 'client-001',
          type: 'complaint',
          description: 'Producto defectuoso',
        }),
      ).resolves.toBeUndefined();

      consoleSpy.mockRestore();
    });

    it('logs the radication number', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await sendConfirmationEmail({
        radicationNumber: 'RAD-2025-000042',
        clientId: 'client-001',
        type: 'inquiry',
        description: 'Consulta general',
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('RAD-2025-000042'),
      );

      consoleSpy.mockRestore();
    });
  });

  // ── triggerN8nWorkflow ───────────────────────────────────────────────

  describe('triggerN8nWorkflow', () => {
    it('does not throw (placeholder implementation)', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        triggerN8nWorkflow({
          id: 'request-001',
          radicationNumber: 'RAD-2025-000001',
          clientId: 'client-001',
          type: 'complaint',
          description: 'Producto defectuoso',
          priority: 'medium',
          status: 'registered',
        }),
      ).resolves.toBeUndefined();

      consoleSpy.mockRestore();
    });

    it('logs the radication number and event type', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await triggerN8nWorkflow({
        id: 'request-001',
        radicationNumber: 'RAD-2025-000010',
        clientId: 'client-001',
        type: 'complaint',
        description: 'Test',
        priority: 'high',
        status: 'registered',
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('RAD-2025-000010'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('request.created'),
      );

      consoleSpy.mockRestore();
    });
  });

  // ── getRequestStatus ─────────────────────────────────────────────────

  describe('getRequestStatus', () => {
    it('returns status history for a valid radication number', async () => {
      mockRequestFindByRadicationNumber.mockResolvedValue(mockRequest);
      mockRequestFindWithDetails.mockResolvedValue(mockRequestDetail);

      const result = await getRequestStatus('RAD-2025-000001');

      expect(result).toEqual(mockStatusHistory);
      expect(mockRequestFindByRadicationNumber).toHaveBeenCalledWith('RAD-2025-000001');
      expect(mockRequestFindWithDetails).toHaveBeenCalledWith('request-001');
    });

    it('throws NotFoundError when radication number does not exist', async () => {
      mockRequestFindByRadicationNumber.mockResolvedValue(null);

      await expect(getRequestStatus('RAD-9999-999999')).rejects.toThrow(NotFoundError);
      await expect(getRequestStatus('RAD-9999-999999')).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('throws NotFoundError when detail lookup fails', async () => {
      mockRequestFindByRadicationNumber.mockResolvedValue(mockRequest);
      mockRequestFindWithDetails.mockResolvedValue(null);

      await expect(getRequestStatus('RAD-2025-000001')).rejects.toThrow(NotFoundError);
    });
  });
});
