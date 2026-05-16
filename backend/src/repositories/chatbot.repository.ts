import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

// ── Pagination helper ───────────────────────────────────────────────────────

interface PaginationParams {
  page: number;
  pageSize: number;
}

// ── Chatbot Repository ──────────────────────────────────────────────────────

export async function createConversation(data: Prisma.ChatbotConversationCreateInput) {
  return prisma.chatbotConversation.create({ data });
}

export async function findConversationById(id: string) {
  return prisma.chatbotConversation.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
}

export async function findConversations({ page, pageSize }: PaginationParams) {
  const [data, total] = await Promise.all([
    prisma.chatbotConversation.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { updatedAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
    }),
    prisma.chatbotConversation.count(),
  ]);

  return { data, total };
}

export async function createMessage(data: Prisma.ChatbotMessageCreateInput) {
  return prisma.chatbotMessage.create({ data });
}

export async function updateConversationStatus(
  id: string,
  status: string,
  extra: { escalatedAt?: Date; ticketId?: string } = {},
) {
  return prisma.chatbotConversation.update({
    where: { id },
    data: { status, ...extra },
  });
}
