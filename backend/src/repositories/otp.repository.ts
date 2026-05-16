import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

// ── OTP Repository ──────────────────────────────────────────────────────────

export async function create(data: Prisma.OtpCodeCreateInput) {
  return prisma.otpCode.create({ data });
}

export async function findLatestByClient(clientId: string) {
  return prisma.otpCode.findFirst({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markAsUsed(id: string) {
  return prisma.otpCode.update({
    where: { id },
    data: { isUsed: true },
  });
}

export async function incrementAttempts(id: string) {
  return prisma.otpCode.update({
    where: { id },
    data: { attempts: { increment: 1 } },
  });
}

export async function findActiveByClientAndCode(clientId: string, code: string) {
  return prisma.otpCode.findFirst({
    where: {
      clientId,
      code,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function setBlockedUntil(id: string, blockedUntil: Date) {
  return prisma.otpCode.update({
    where: { id },
    data: { blockedUntil },
  });
}

export async function resetAttempts(id: string) {
  return prisma.otpCode.update({
    where: { id },
    data: { attempts: 0, blockedUntil: null },
  });
}
