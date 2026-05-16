'use client';

import React, { useState } from 'react';
import { MessageSquare, Eye, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable, type ColumnDef } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

interface ChatConversation {
  id: string;
  userId?: string;
  status: string;
  messageCount: number;
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

export default function ChatbotAdminPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const { data: conversationsRes, isLoading } = useQuery({
    queryKey: ['admin-chatbot-conversations'],
    queryFn: () => apiClient.get<ChatConversation[]>('/chatbot/conversations'),
  });

  const { data: messagesRes, isLoading: messagesLoading } = useQuery({
    queryKey: ['admin-chatbot-messages', selectedConversation],
    queryFn: () => apiClient.get<ChatMessage[]>(`/chatbot/conversations/${selectedConversation}/messages`),
    enabled: !!selectedConversation,
  });

  const conversations = (conversationsRes?.data ?? []) as ChatConversation[];
  const messages = (messagesRes?.data ?? []) as ChatMessage[];

  const statusVariant: Record<string, 'success' | 'warning' | 'default'> = {
    active: 'success',
    escalated: 'warning',
    closed: 'default',
  };

  const columns: ColumnDef<ChatConversation & Record<string, unknown>>[] = [
    { key: 'id', header: 'ID', render: (row) => <span className="font-mono text-small">{String(row.id).slice(0, 8)}...</span> },
    {
      key: 'status', header: 'Estado',
      render: (row) => <Badge variant={statusVariant[row.status as string] ?? 'default'}>{String(row.status)}</Badge>,
    },
    { key: 'messageCount', header: 'Mensajes' },
    { key: 'lastMessage', header: 'Último mensaje', render: (row) => <span className="line-clamp-1 text-small">{String(row.lastMessage ?? '—').slice(0, 60)}</span> },
    { key: 'createdAt', header: 'Fecha', render: (row) => new Date(row.createdAt as string).toLocaleString('es-CO') },
    {
      key: 'actions', header: 'Acciones', sortable: false,
      render: (row) => (
        <Button variant="ghost" size="sm" icon={<Eye className="h-4 w-4" />} onClick={(e) => { e.stopPropagation(); setSelectedConversation(row.id as string); }}>
          Ver
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ut-accent/10">
          <MessageSquare className="h-6 w-6 text-ut-accent" />
        </div>
        <div>
          <h1 className="text-h3 font-bold text-ut-text">Chatbot</h1>
          <p className="text-small text-ut-text-muted">Gestión de conversaciones del chatbot IA</p>
        </div>
      </div>

      <Card>
        <DataTable columns={columns} data={conversations as (ChatConversation & Record<string, unknown>)[]} loading={isLoading} pageSize={10} />
      </Card>

      {/* Conversation detail modal */}
      <Modal isOpen={!!selectedConversation} onClose={() => setSelectedConversation(null)} title="Detalle de conversación" size="lg">
        {messagesLoading ? (
          <div className="flex justify-center py-8"><Spinner size="lg" /></div>
        ) : messages.length === 0 ? (
          <p className="text-body text-ut-text-muted text-center py-8">Sin mensajes en esta conversación.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-lg text-small ${
                    msg.role === 'user'
                      ? 'bg-ut-accent text-white rounded-br-none'
                      : 'bg-ut-surface text-ut-text rounded-bl-none'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/70' : 'text-ut-text-muted'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString('es-CO')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
