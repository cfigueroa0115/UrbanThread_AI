import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

// ── User Repository ─────────────────────────────────────────────────────────

export async function findAll() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findWithRole(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { role: { include: { permissions: { include: { permission: true } } } } },
  });
}

export async function create(data: Prisma.UserCreateInput) {
  return prisma.user.create({ data });
}

export async function update(id: string, data: Prisma.UserUpdateInput) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function remove(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}
