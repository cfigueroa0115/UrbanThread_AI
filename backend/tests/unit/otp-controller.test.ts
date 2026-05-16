import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { OTP_EXPIRATION_SECONDS, SESSION_EXPIRATION_MINUTES } from '@shared/constants/index.js';

// ── Mock services ────────────────────────────────────────────────────────────

const mockGetByDocument = vi.fn();
const mockGetClientDetail = vi.fn();

vi.mock('../../src/services/client.service.js', () => ({
  getByDocument: (...args: unknown[]) => mockGetByDocument(...args),
  getClientDetail: (...args: unknown[]) => mockGetClientDetail(...args),
}));

const mockGenerateOTP = vi.fn();
const mockSendOTP = vi.fn();
const mockVerifyOTP = vi.fn();
const mockIsBlocked = vi.fn();

vi.mock('../../src/services/otp.service.js', () => ({
  generateOTP: (...args: unknown[]) => mockGenerateOTP(...args),
  sendOTP: (...args: unknown[]) => mockSendOTP(...args),
  verifyOTP: (...args: unknown[]) => mockVerifyOTP(...args),
  isBlocked: (...args: unknown[]) => mockIsBlocked(...args),
}));

const mockGenerateToken = vi.fn();

vi.mock('../../src/utils/jwt.js', () => ({
  generateToken: (...args: unknown[]) => mockGenerateToken(...args),
}));

// ── Import after mocks ───────────────────────────────────────────────────────

const { requestOTP, verifyOTP, resendOTP } = await import(
  '../../src/controllers/otp.controller.js'
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function createMockReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
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

// ── Test data ────────────────────────────────────────────────────────────────

const mockClient = {
  id: 'client-001',
  documentType: 'CC',
  documentNumber: '12345678',
  firstName: 'Juan',
  lastName: 'Pérez',
  isActive: true,
};

const mockClientDetail = {
  ...mockClient,
  emails: [
    { id: 'email-001', email: 'juan@example.com', isPrimary: true, isVerified: true },
  ],
  addresses: [],
  phones: [],
  documents: [],
  profile: null,
};

const mockOtpRecord = {
  id: 'otp-001',
  clientId: 'client-001',
  code: '123456',
  email: 'juan@example.com',
  expiresAt: new Date(Date.now() + 300000),
  attempts: 0,
  isUsed: false,
  blockedUntil: null,
  createdAt: new Date(),
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('OTP Controller', () => {
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    next = vi.fn();
  });

  // ── requestOTP ─────────────────────────────────────────────────────────

  describe('requestOTP', () => {
    it('returns 200 with masked email and expiration on success', async () => {
      mockGetByDocument.mockResolvedValue(mockClient);
      mockGetClientDetail.mockResolvedValue(mockClientDetail);
      mockGenerateOTP.mockResolvedValue(mockOtpRecord);
      mockSendOTP.mockResolvedValue({ previewUrl: undefined });

      const req = createMockReq({
        body: { documentType: 'CC', documentNumber: '12345678' },
      });
      const res = createMockRes();

      await requestOTP(req, res, next);

      expect(mockGetByDocument).toHaveBeenCalledWith('CC', '12345678');
      expect(mockGetClientDetail).toHaveBeenCalledWith('client-001');
      expect(mockGenerateOTP).toHaveBeenCalledWith('client-001', 'juan@example.com');
      expect(mockSendOTP).toHaveBeenCalledWith('juan@example.com', '123456');
      expect(res.status).toHaveBeenCalledWith(200);
      
      const responseBody = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(responseBody.status).toBe('success');
      expect(responseBody.data.expiresIn).toBe(OTP_EXPIRATION_SECONDS);
      expect(responseBody.data.maskedEmail).toBe('j***@example.com');
    });

    it('passes errors to next when client not found', async () => {
      const error = new Error('Client not found');
      mockGetByDocument.mockRejectedValue(error);

      const req = createMockReq({
        body: { documentType: 'CC', documentNumber: '99999999' },
      });
      const res = createMockRes();

      await requestOTP(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('passes errors to next when no primary email found', async () => {
      mockGetByDocument.mockResolvedValue(mockClient);
      mockGetClientDetail.mockResolvedValue({
        ...mockClientDetail,
        emails: [],
      });

      const req = createMockReq({
        body: { documentType: 'CC', documentNumber: '12345678' },
      });
      const res = createMockRes();

      await requestOTP(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // ── verifyOTP ──────────────────────────────────────────────────────────

  describe('verifyOTP', () => {
    it('returns 200 with token and client profile on success', async () => {
      mockGetByDocument.mockResolvedValue(mockClient);
      mockVerifyOTP.mockResolvedValue(true);
      mockGenerateToken.mockReturnValue('client-jwt-token');
      mockGetClientDetail.mockResolvedValue(mockClientDetail);

      const req = createMockReq({
        body: { documentType: 'CC', documentNumber: '12345678', code: '123456' },
      });
      const res = createMockRes();

      await verifyOTP(req, res, next);

      expect(mockGetByDocument).toHaveBeenCalledWith('CC', '12345678');
      expect(mockVerifyOTP).toHaveBeenCalledWith('client-001', '123456');
      expect(mockGenerateToken).toHaveBeenCalledWith({
        userId: 'client-001',
        email: 'CC-12345678',
        roleId: 'client',
        roleName: 'client',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          token: 'client-jwt-token',
          expiresIn: SESSION_EXPIRATION_MINUTES * 60,
          client: mockClientDetail,
        },
      });
    });

    it('passes errors to next when OTP verification fails', async () => {
      mockGetByDocument.mockResolvedValue(mockClient);
      const error = new Error('Invalid OTP');
      mockVerifyOTP.mockRejectedValue(error);

      const req = createMockReq({
        body: { documentType: 'CC', documentNumber: '12345678', code: '000000' },
      });
      const res = createMockRes();

      await verifyOTP(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── resendOTP ──────────────────────────────────────────────────────────

  describe('resendOTP', () => {
    it('returns 200 with masked email and expiration on success', async () => {
      mockGetByDocument.mockResolvedValue(mockClient);
      mockIsBlocked.mockResolvedValue(false);
      mockGetClientDetail.mockResolvedValue(mockClientDetail);
      mockGenerateOTP.mockResolvedValue(mockOtpRecord);
      mockSendOTP.mockResolvedValue({ previewUrl: undefined });

      const req = createMockReq({
        body: { documentType: 'CC', documentNumber: '12345678' },
      });
      const res = createMockRes();

      await resendOTP(req, res, next);

      expect(mockIsBlocked).toHaveBeenCalledWith('client-001');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          message: 'Código OTP reenviado exitosamente',
          expiresIn: OTP_EXPIRATION_SECONDS,
          maskedEmail: 'j***@example.com',
        },
      });
    });

    it('passes error to next when client is blocked', async () => {
      mockGetByDocument.mockResolvedValue(mockClient);
      mockIsBlocked.mockResolvedValue(true);

      const req = createMockReq({
        body: { documentType: 'CC', documentNumber: '12345678' },
      });
      const res = createMockRes();

      await resendOTP(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(mockGenerateOTP).not.toHaveBeenCalled();
    });
  });
});
