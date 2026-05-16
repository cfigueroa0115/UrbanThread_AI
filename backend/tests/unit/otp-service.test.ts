import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ERROR_CODES } from '@shared/constants/index.js';
import { AuthenticationError } from '../../src/utils/errors.js';

// ── Mock OTP repository ──────────────────────────────────────────────────────

const mockCreate = vi.fn();
const mockFindLatestByClient = vi.fn();
const mockMarkAsUsed = vi.fn();
const mockIncrementAttempts = vi.fn();
const mockFindActiveByClientAndCode = vi.fn();
const mockSetBlockedUntil = vi.fn();
const mockResetAttempts = vi.fn();

vi.mock('../../src/repositories/index.js', () => ({
  otpRepository: {
    create: (...args: unknown[]) => mockCreate(...args),
    findLatestByClient: (...args: unknown[]) => mockFindLatestByClient(...args),
    markAsUsed: (...args: unknown[]) => mockMarkAsUsed(...args),
    incrementAttempts: (...args: unknown[]) => mockIncrementAttempts(...args),
    findActiveByClientAndCode: (...args: unknown[]) => mockFindActiveByClientAndCode(...args),
    setBlockedUntil: (...args: unknown[]) => mockSetBlockedUntil(...args),
    resetAttempts: (...args: unknown[]) => mockResetAttempts(...args),
  },
}));

// ── Import after mocks ───────────────────────────────────────────────────────

const {
  generateOTP,
  sendOTP,
  verifyOTP,
  isBlocked,
  recordFailedAttempt,
  resetAttempts,
} = await import('../../src/services/otp.service.js');

// ── Test data ────────────────────────────────────────────────────────────────

const CLIENT_ID = 'client-001';
const EMAIL = 'client@example.com';
const OTP_CODE = '123456';

const now = new Date();

function makeOtpRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: 'otp-001',
    clientId: CLIENT_ID,
    code: OTP_CODE,
    email: EMAIL,
    attempts: 0,
    isUsed: false,
    expiresAt: new Date(Date.now() + 300_000), // 5 min from now
    blockedUntil: null,
    createdAt: now,
    ...overrides,
  };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('OTP Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── generateOTP ──────────────────────────────────────────────────────────

  describe('generateOTP', () => {
    it('creates an OTP record with a 6-digit code and 5-minute expiration', async () => {
      const createdRecord = makeOtpRecord();
      mockCreate.mockResolvedValue(createdRecord);

      const result = await generateOTP(CLIENT_ID, EMAIL);

      expect(mockCreate).toHaveBeenCalledTimes(1);
      const createArg = mockCreate.mock.calls[0][0];

      // Code should be a 6-digit string
      expect(createArg.code).toMatch(/^\d{6}$/);

      // Expiration should be ~5 minutes from now
      const expiresAt = createArg.expiresAt as Date;
      const diffMs = expiresAt.getTime() - Date.now();
      expect(diffMs).toBeGreaterThan(295_000); // at least ~295s
      expect(diffMs).toBeLessThanOrEqual(300_000); // at most 300s

      // Should connect to the client
      expect(createArg.client).toEqual({ connect: { id: CLIENT_ID } });

      // Should include the email
      expect(createArg.email).toBe(EMAIL);

      expect(result).toEqual(createdRecord);
    });

    it('generates different codes on successive calls', async () => {
      mockCreate.mockImplementation((data: Record<string, unknown>) =>
        makeOtpRecord({ code: data.code as string }),
      );

      const codes = new Set<string>();
      // Generate multiple OTPs and collect codes
      for (let i = 0; i < 10; i++) {
        await generateOTP(CLIENT_ID, EMAIL);
        const code = mockCreate.mock.calls[i][0].code as string;
        codes.add(code);
      }

      // With 10 random 6-digit codes, we expect at least 2 unique values
      // (probability of all 10 being identical is astronomically low)
      expect(codes.size).toBeGreaterThan(1);
    });
  });

  // ── sendOTP ──────────────────────────────────────────────────────────────

  describe('sendOTP', () => {
    it('returns an object with optional previewUrl', async () => {
      const result = await sendOTP(EMAIL, OTP_CODE);
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('logs the OTP send intent', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await sendOTP(EMAIL, OTP_CODE);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(OTP_CODE),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(EMAIL),
      );

      consoleSpy.mockRestore();
    });
  });

  // ── verifyOTP ────────────────────────────────────────────────────────────

  describe('verifyOTP', () => {
    it('returns true when the OTP code is valid', async () => {
      // Not blocked
      mockFindLatestByClient.mockResolvedValue(makeOtpRecord());
      // Active OTP found
      mockFindActiveByClientAndCode.mockResolvedValue(makeOtpRecord());
      mockMarkAsUsed.mockResolvedValue(makeOtpRecord({ isUsed: true }));
      mockResetAttempts.mockResolvedValue(makeOtpRecord({ attempts: 0 }));

      const result = await verifyOTP(CLIENT_ID, OTP_CODE);

      expect(result).toBe(true);
      expect(mockMarkAsUsed).toHaveBeenCalledWith('otp-001');
    });

    it('throws OTP_BLOCKED when client is blocked', async () => {
      mockFindLatestByClient.mockResolvedValue(
        makeOtpRecord({ blockedUntil: new Date(Date.now() + 900_000) }),
      );

      await expect(verifyOTP(CLIENT_ID, OTP_CODE)).rejects.toThrow(
        AuthenticationError,
      );
      await expect(verifyOTP(CLIENT_ID, OTP_CODE)).rejects.toMatchObject({
        code: ERROR_CODES.OTP_BLOCKED,
      });
    });

    it('throws OTP_INVALID when code does not match', async () => {
      // Not blocked
      mockFindLatestByClient.mockResolvedValue(makeOtpRecord());
      // No active OTP matching the code
      mockFindActiveByClientAndCode.mockResolvedValue(null);
      // recordFailedAttempt will call incrementAttempts
      mockIncrementAttempts.mockResolvedValue(makeOtpRecord({ attempts: 1 }));

      await expect(verifyOTP(CLIENT_ID, 'wrong!')).rejects.toThrow(
        AuthenticationError,
      );
      await expect(verifyOTP(CLIENT_ID, 'wrong!')).rejects.toMatchObject({
        code: ERROR_CODES.OTP_INVALID,
      });
    });

    it('throws OTP_EXPIRED when the latest OTP has expired', async () => {
      const expiredOtp = makeOtpRecord({
        expiresAt: new Date(Date.now() - 60_000), // expired 1 min ago
      });

      // Not blocked
      mockFindLatestByClient.mockResolvedValue(expiredOtp);
      // No active OTP (expired)
      mockFindActiveByClientAndCode.mockResolvedValue(null);
      // recordFailedAttempt
      mockIncrementAttempts.mockResolvedValue({ ...expiredOtp, attempts: 1 });

      await expect(verifyOTP(CLIENT_ID, OTP_CODE)).rejects.toThrow(
        AuthenticationError,
      );
      await expect(verifyOTP(CLIENT_ID, OTP_CODE)).rejects.toMatchObject({
        code: ERROR_CODES.OTP_EXPIRED,
      });
    });

    it('records a failed attempt when verification fails', async () => {
      // Not blocked
      mockFindLatestByClient.mockResolvedValue(makeOtpRecord());
      mockFindActiveByClientAndCode.mockResolvedValue(null);
      mockIncrementAttempts.mockResolvedValue(makeOtpRecord({ attempts: 1 }));

      await expect(verifyOTP(CLIENT_ID, 'wrong!')).rejects.toThrow();

      expect(mockIncrementAttempts).toHaveBeenCalled();
    });

    it('resets attempts after successful verification', async () => {
      const otpRecord = makeOtpRecord({ attempts: 2 });
      mockFindLatestByClient.mockResolvedValue(otpRecord);
      mockFindActiveByClientAndCode.mockResolvedValue(otpRecord);
      mockMarkAsUsed.mockResolvedValue({ ...otpRecord, isUsed: true });
      mockResetAttempts.mockResolvedValue({ ...otpRecord, attempts: 0 });

      await verifyOTP(CLIENT_ID, OTP_CODE);

      // resetAttempts calls findLatestByClient then otpRepository.resetAttempts
      expect(mockResetAttempts).toHaveBeenCalled();
    });
  });

  // ── isBlocked ────────────────────────────────────────────────────────────

  describe('isBlocked', () => {
    it('returns false when no OTP exists for the client', async () => {
      mockFindLatestByClient.mockResolvedValue(null);

      const result = await isBlocked(CLIENT_ID);

      expect(result).toBe(false);
    });

    it('returns false when blockedUntil is null', async () => {
      mockFindLatestByClient.mockResolvedValue(
        makeOtpRecord({ blockedUntil: null }),
      );

      const result = await isBlocked(CLIENT_ID);

      expect(result).toBe(false);
    });

    it('returns false when blockedUntil is in the past', async () => {
      mockFindLatestByClient.mockResolvedValue(
        makeOtpRecord({ blockedUntil: new Date(Date.now() - 60_000) }),
      );

      const result = await isBlocked(CLIENT_ID);

      expect(result).toBe(false);
    });

    it('returns true when blockedUntil is in the future', async () => {
      mockFindLatestByClient.mockResolvedValue(
        makeOtpRecord({ blockedUntil: new Date(Date.now() + 900_000) }),
      );

      const result = await isBlocked(CLIENT_ID);

      expect(result).toBe(true);
    });
  });

  // ── recordFailedAttempt ──────────────────────────────────────────────────

  describe('recordFailedAttempt', () => {
    it('returns 0 when no OTP exists for the client', async () => {
      mockFindLatestByClient.mockResolvedValue(null);

      const result = await recordFailedAttempt(CLIENT_ID);

      expect(result).toBe(0);
    });

    it('increments attempts on the latest OTP', async () => {
      mockFindLatestByClient.mockResolvedValue(makeOtpRecord());
      mockIncrementAttempts.mockResolvedValue(makeOtpRecord({ attempts: 1 }));

      const result = await recordFailedAttempt(CLIENT_ID);

      expect(result).toBe(1);
      expect(mockIncrementAttempts).toHaveBeenCalledWith('otp-001');
    });

    it('does not block when attempts < 3', async () => {
      mockFindLatestByClient.mockResolvedValue(makeOtpRecord());
      mockIncrementAttempts.mockResolvedValue(makeOtpRecord({ attempts: 2 }));

      await recordFailedAttempt(CLIENT_ID);

      expect(mockSetBlockedUntil).not.toHaveBeenCalled();
    });

    it('blocks the client when attempts reach 3', async () => {
      mockFindLatestByClient.mockResolvedValue(makeOtpRecord({ attempts: 2 }));
      mockIncrementAttempts.mockResolvedValue(makeOtpRecord({ attempts: 3 }));

      await recordFailedAttempt(CLIENT_ID);

      expect(mockSetBlockedUntil).toHaveBeenCalledWith(
        'otp-001',
        expect.any(Date),
      );

      // Verify the block duration is ~15 minutes
      const blockedUntil = mockSetBlockedUntil.mock.calls[0][1] as Date;
      const diffMs = blockedUntil.getTime() - Date.now();
      expect(diffMs).toBeGreaterThan(14 * 60 * 1000); // at least ~14 min
      expect(diffMs).toBeLessThanOrEqual(15 * 60 * 1000); // at most 15 min
    });

    it('blocks the client when attempts exceed 3', async () => {
      mockFindLatestByClient.mockResolvedValue(makeOtpRecord({ attempts: 3 }));
      mockIncrementAttempts.mockResolvedValue(makeOtpRecord({ attempts: 4 }));

      await recordFailedAttempt(CLIENT_ID);

      expect(mockSetBlockedUntil).toHaveBeenCalled();
    });
  });

  // ── resetAttempts ────────────────────────────────────────────────────────

  describe('resetAttempts', () => {
    it('does nothing when no OTP exists for the client', async () => {
      mockFindLatestByClient.mockResolvedValue(null);

      await expect(resetAttempts(CLIENT_ID)).resolves.toBeUndefined();
      expect(mockResetAttempts).not.toHaveBeenCalled();
    });

    it('resets attempts on the latest OTP', async () => {
      mockFindLatestByClient.mockResolvedValue(
        makeOtpRecord({ attempts: 2 }),
      );
      mockResetAttempts.mockResolvedValue(
        makeOtpRecord({ attempts: 0, blockedUntil: null }),
      );

      await resetAttempts(CLIENT_ID);

      expect(mockResetAttempts).toHaveBeenCalledWith('otp-001');
    });
  });
});
