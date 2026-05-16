import { describe, it, expect, vi, beforeEach } from 'vitest';
import fc from 'fast-check';

/**
 * **Validates: Requirements 5.4**
 *
 * Propiedad 21: Persistencia de mensajes del chatbot
 *
 * Para cualquier mensaje enviado al chatbot, el sistema DEBE registrar la
 * conversación en `chatbot_conversations` y cada mensaje individual en
 * `chatbot_messages`, preservando el orden cronológico, el rol (user/assistant)
 * y el contenido completo.
 */

// ── Mock setup ──────────────────────────────────────────────────────────────

const mockCreateConversation = vi.fn();
const mockFindConversationById = vi.fn();
const mockFindConversations = vi.fn();
const mockCreateMessage = vi.fn();
const mockUpdateConversationStatus = vi.fn();

vi.mock('../../src/repositories/index.js', () => ({
  chatbotRepository: {
    createConversation: (...args: unknown[]) => mockCreateConversation(...args),
    findConversationById: (...args: unknown[]) => mockFindConversationById(...args),
    findConversations: (...args: unknown[]) => mockFindConversations(...args),
    createMessage: (...args: unknown[]) => mockCreateMessage(...args),
    updateConversationStatus: (...args: unknown[]) => mockUpdateConversationStatus(...args),
  },
}));

const mockChatCompletion = vi.fn();

vi.mock('../../src/integrations/openai.js', () => ({
  chatCompletion: (...args: unknown[]) => mockChatCompletion(...args),
}));

// ── Import service after mocks ──────────────────────────────────────────────

const { sendMessage, escalateToAgent } = await import(
  '../../src/services/chatbot.service.js'
);

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Track call order across mocks to verify chronological ordering. */
let callOrder: string[];

function trackCallOrder() {
  callOrder = [];
  mockCreateMessage.mockImplementation((data: Record<string, unknown>) => {
    const role = data.role as string;
    callOrder.push(`createMessage:${role}`);
    return Promise.resolve({
      id: `msg-${callOrder.length}`,
      conversationId: 'conv-1',
      role,
      content: (data.content as string) ?? '',
      createdAt: new Date(),
    });
  });
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('Propiedad 21: Persistencia de mensajes del chatbot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    callOrder = [];
  });

  // ── 1. Conversation creation for new messages ───────────────────────────

  it(
    'creates a new conversation when no conversationId is provided',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 200 }),
          async (messageContent) => {
            vi.clearAllMocks();

            const convId = 'conv-new';
            mockCreateConversation.mockResolvedValue({
              id: convId,
              sessionId: 'session-1',
              status: 'active',
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            mockCreateMessage.mockResolvedValue({
              id: 'msg-1',
              conversationId: convId,
              role: 'user',
              content: messageContent,
              createdAt: new Date(),
            });

            mockChatCompletion.mockResolvedValue({
              content: 'AI response',
              tokensUsed: 10,
              responseTimeMs: 100,
              isFallback: false,
            });

            const result = await sendMessage(messageContent);

            // A new conversation MUST be created
            expect(mockCreateConversation).toHaveBeenCalledTimes(1);
            expect(result.conversationId).toBe(convId);
          },
        ),
        { numRuns: 50 },
      );
    },
  );

  // ── 2. Both user and assistant messages are persisted ───────────────────

  it(
    'persists both user message and assistant response with correct roles',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 200 }),
          fc.string({ minLength: 1, maxLength: 500 }),
          async (userContent, aiContent) => {
            vi.clearAllMocks();

            const convId = 'conv-roles';
            mockCreateConversation.mockResolvedValue({
              id: convId,
              sessionId: 'session-1',
              status: 'active',
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            const createdMessages: Array<{ role: string; content: string }> = [];
            mockCreateMessage.mockImplementation(
              (data: Record<string, unknown>) => {
                const role = data.role as string;
                const content = data.content as string;
                createdMessages.push({ role, content });
                return Promise.resolve({
                  id: `msg-${createdMessages.length}`,
                  conversationId: convId,
                  role,
                  content,
                  createdAt: new Date(),
                });
              },
            );

            mockChatCompletion.mockResolvedValue({
              content: aiContent,
              tokensUsed: 10,
              responseTimeMs: 100,
              isFallback: false,
            });

            await sendMessage(userContent);

            // Both messages MUST be persisted
            expect(mockCreateMessage).toHaveBeenCalledTimes(2);

            // First call: user message with role 'user'
            const userMsg = createdMessages[0];
            expect(userMsg.role).toBe('user');

            // Second call: assistant message with role 'assistant'
            const assistantMsg = createdMessages[1];
            expect(assistantMsg.role).toBe('assistant');
          },
        ),
        { numRuns: 50 },
      );
    },
  );

  // ── 3. Chronological ordering: user before assistant ────────────────────

  it(
    'preserves chronological order: user message is created before assistant message',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 200 }),
          async (messageContent) => {
            vi.clearAllMocks();
            trackCallOrder();

            const convId = 'conv-order';
            mockCreateConversation.mockResolvedValue({
              id: convId,
              sessionId: 'session-1',
              status: 'active',
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            mockChatCompletion.mockResolvedValue({
              content: 'AI response',
              tokensUsed: 10,
              responseTimeMs: 100,
              isFallback: false,
            });

            await sendMessage(messageContent);

            // User message MUST be created before assistant message
            expect(callOrder.length).toBe(2);
            expect(callOrder[0]).toBe('createMessage:user');
            expect(callOrder[1]).toBe('createMessage:assistant');
          },
        ),
        { numRuns: 50 },
      );
    },
  );

  // ── 4. Content preservation ─────────────────────────────────────────────

  it(
    'preserves the exact content of user input and AI response',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 200 }),
          fc.string({ minLength: 1, maxLength: 500 }),
          async (userContent, aiContent) => {
            vi.clearAllMocks();

            const convId = 'conv-content';
            mockCreateConversation.mockResolvedValue({
              id: convId,
              sessionId: 'session-1',
              status: 'active',
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            const persistedContents: string[] = [];
            mockCreateMessage.mockImplementation(
              (data: Record<string, unknown>) => {
                persistedContents.push(data.content as string);
                return Promise.resolve({
                  id: `msg-${persistedContents.length}`,
                  conversationId: convId,
                  role: data.role,
                  content: data.content,
                  createdAt: new Date(),
                });
              },
            );

            mockChatCompletion.mockResolvedValue({
              content: aiContent,
              tokensUsed: 10,
              responseTimeMs: 100,
              isFallback: false,
            });

            await sendMessage(userContent);

            // User content MUST be preserved exactly
            expect(persistedContents[0]).toBe(userContent);
            // AI content MUST be preserved exactly
            expect(persistedContents[1]).toBe(aiContent);
          },
        ),
        { numRuns: 50 },
      );
    },
  );

  // ── 5. Conversation reuse with existing conversationId ──────────────────

  it(
    'reuses existing conversation when conversationId is provided',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 200 }),
          fc.uuid(),
          async (messageContent, existingConvId) => {
            vi.clearAllMocks();

            const existingConversation = {
              id: existingConvId,
              sessionId: 'session-existing',
              status: 'active',
              messages: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            mockFindConversationById.mockResolvedValue(existingConversation);

            mockCreateMessage.mockImplementation(
              (data: Record<string, unknown>) =>
                Promise.resolve({
                  id: `msg-reuse`,
                  conversationId: existingConvId,
                  role: data.role,
                  content: data.content,
                  createdAt: new Date(),
                }),
            );

            mockChatCompletion.mockResolvedValue({
              content: 'AI response',
              tokensUsed: 10,
              responseTimeMs: 100,
              isFallback: false,
            });

            const result = await sendMessage(
              messageContent,
              existingConvId,
            );

            // No new conversation should be created
            expect(mockCreateConversation).not.toHaveBeenCalled();
            // Existing conversation should be looked up
            expect(mockFindConversationById).toHaveBeenCalledWith(
              existingConvId,
            );
            // Result should reference the existing conversation
            expect(result.conversationId).toBe(existingConvId);
          },
        ),
        { numRuns: 50 },
      );
    },
  );

  // ── 6. Escalation persists a system message ─────────────────────────────

  it(
    'persists a system message when a conversation is escalated',
    async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), async (conversationId) => {
          vi.clearAllMocks();

          const existingConversation = {
            id: conversationId,
            sessionId: 'session-esc',
            status: 'active',
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          mockFindConversationById.mockResolvedValue(existingConversation);
          mockUpdateConversationStatus.mockResolvedValue({
            ...existingConversation,
            status: 'escalated',
          });

          let escalationMessageRole: string | undefined;
          let escalationMessageContent: string | undefined;
          mockCreateMessage.mockImplementation(
            (data: Record<string, unknown>) => {
              escalationMessageRole = data.role as string;
              escalationMessageContent = data.content as string;
              return Promise.resolve({
                id: 'msg-esc',
                conversationId,
                role: data.role,
                content: data.content,
                createdAt: new Date(),
              });
            },
          );

          await escalateToAgent(conversationId);

          // A system message MUST be persisted
          expect(mockCreateMessage).toHaveBeenCalledTimes(1);
          expect(escalationMessageRole).toBe('system');
          // The message content should mention escalation
          expect(escalationMessageContent).toContain('escalad');
        }),
        { numRuns: 50 },
      );
    },
  );
});
