import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

// ── Document (AttachedFile) Repository ──────────────────────────────────────

export async function findById(id: string) {
  return prisma.attachedFile.findUnique({
    where: { id },
  });
}

export async function findByClient(clientId: string) {
  return prisma.attachedFile.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findByRequest(requestId: string) {
  return prisma.attachedFile.findMany({
    where: { requestId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function create(data: Prisma.AttachedFileCreateInput) {
  return prisma.attachedFile.create({ data });
}

export async function update(id: string, data: Prisma.AttachedFileUpdateInput) {
  return prisma.attachedFile.update({
    where: { id },
    data,
  });
}

export async function remove(id: string) {
  return prisma.attachedFile.delete({
    where: { id },
  });
}
