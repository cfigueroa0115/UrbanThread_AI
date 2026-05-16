import { randomInt } from 'node:crypto';
import { otpRepository } from '../repositories/index.js';
import { sendOTPEmail } from '../utils/email.js';
import { AuthenticationError } from '../utils/errors.js';
import {
  ERROR_CODES,
  OTP_LENGTH,
  OTP_EXPIRATION_SECONDS,
  OTP_MAX_ATTEMPTS,
  OTP_BLOCK_DURATION_MINUTES,
} from '@shared/constants/index.js';

// ── OTP Service ──────────────────────────────────────────────────────────────

/**
 * Generate a random numeric OTP code of the configured length.
 * Uses crypto.randomInt for cryptographically secure random numbers.
 */
function generateCode(): string {
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH);
  return randomInt(min, max).toString();
}

/**
 * Generate a new OTP for a client and store it in the database.
 *
 * - Creates a random 6-digit code
 * - Sets expiration to now + OTP_EXPIRATION_SECONDS (5 minutes)
 * - Stores the OTP record linked to the client
 *
 * @returns The created OTP record
 */
export async function generateOTP(clientId: string, email: string) {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_SECONDS * 1000);

  const otpRecord = await otpRepository.create({
    client: { connect: { id: clientId } },
    code,
    email,
    expiresAt,
  });

  return otpRecord;
}

/**
 * Send the OTP code to the client's email address.
 *
 * Uses the Nodemailer-based sendOTPEmail utility which:
 * - Sends a branded HTML email when SMTP is configured
 * - Falls back to console logging in development (SMTP_HOST=localhost, no credentials)
 *
 * The OTP code is always logged to the backend console for development/testing.
 *
 * Validates: Requirements 8.2
 */
export async function sendOTP(email: string, code: string): Promise<{ previewUrl?: string }> {
  // Always log to console for development visibility
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║  📧 OTP Code for ${email}`);
  console.log(`║  🔑 Code: ${code}`);
  console.log(`║  ⏱  Expires in ${OTP_EXPIRATION_SECONDS / 60} minutes`);
  console.log(`╚══════════════════════════════════════════╝\n`);

  // Send the actual email (mock or real depending on SMTP config)
  const result = await sendOTPEmail(email, code, OTP_EXPIRATION_SECONDS / 60);
  return { previewUrl: result.previewUrl };
}

/**
 * Verify an OTP code submitted by a client.
 *
 * - Checks if the client is blocked
 * - Looks up an active (not used, not expired) OTP matching the code
 * - If valid: marks as used, resets attempts, returns true
 * - If invalid: records a failed attempt, throws AuthenticationError
 *
 * @throws {AuthenticationError} OTP_BLOCKED when client is blocked
 * @throws {AuthenticationError} OTP_INVALID when code doesn't match any active OTP
 * @throws {AuthenticationError} OTP_EXPIRED when no active OTP exists (may have expired)
 */
export async function verifyOTP(clientId: string, code: string): Promise<boolean> {
  const blocked = await isBlocked(clientId);
  if (blocked) {
    throw new AuthenticationError(
      'Acceso bloqueado temporalmente por demasiados intentos fallidos. Intente de nuevo más tarde.',
      ERROR_CODES.OTP_BLOCKED,
    );
  }

  const otpRecord = await otpRepository.findActiveByClientAndCode(clientId, code);

  if (!otpRecord) {
    // No matching active OTP — record the failed attempt
    await recordFailedAttempt(clientId);

    // Check if there's any OTP at all for this client to distinguish expired vs invalid
    const latestOtp = await otpRepository.findLatestByClient(clientId);
    if (latestOtp && latestOtp.expiresAt < new Date() && !latestOtp.isUsed) {
      throw new AuthenticationError(
        'El código OTP ha expirado. Solicite uno nuevo.',
        ERROR_CODES.OTP_EXPIRED,
      );
    }

    throw new AuthenticationError(
      'Código OTP inválido.',
      ERROR_CODES.OTP_INVALID,
    );
  }

  // Valid OTP — mark as used and reset attempts
  await otpRepository.markAsUsed(otpRecord.id);
  await resetAttempts(clientId);

  return true;
}

/**
 * Check if a client is currently blocked from OTP verification.
 *
 * A client is blocked when the latest OTP record has a `blockedUntil`
 * timestamp that is still in the future.
 */
export async function isBlocked(clientId: string): Promise<boolean> {
  const latestOtp = await otpRepository.findLatestByClient(clientId);

  if (!latestOtp || !latestOtp.blockedUntil) {
    return false;
  }

  return latestOtp.blockedUntil > new Date();
}

/**
 * Record a failed OTP verification attempt for a client.
 *
 * - Increments the attempt counter on the latest OTP
 * - If attempts reach OTP_MAX_ATTEMPTS (3), blocks the client for
 *   OTP_BLOCK_DURATION_MINUTES (15 minutes)
 *
 * @returns The updated attempt count
 */
export async function recordFailedAttempt(clientId: string): Promise<number> {
  const latestOtp = await otpRepository.findLatestByClient(clientId);

  if (!latestOtp) {
    return 0;
  }

  const updated = await otpRepository.incrementAttempts(latestOtp.id);
  const newAttempts = updated.attempts;

  if (newAttempts >= OTP_MAX_ATTEMPTS) {
    const blockedUntil = new Date(
      Date.now() + OTP_BLOCK_DURATION_MINUTES * 60 * 1000,
    );
    await otpRepository.setBlockedUntil(latestOtp.id, blockedUntil);
  }

  return newAttempts;
}

/**
 * Reset the attempt counter on the latest OTP for a client.
 * Called after a successful OTP verification.
 */
export async function resetAttempts(clientId: string): Promise<void> {
  const latestOtp = await otpRepository.findLatestByClient(clientId);

  if (!latestOtp) {
    return;
  }

  await otpRepository.resetAttempts(latestOtp.id);
}
