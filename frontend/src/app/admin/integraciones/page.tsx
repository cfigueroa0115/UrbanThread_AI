'use client';

import React, { useState } from 'react';
import { Plug, Zap, MessageCircle, Brain, Mail, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { apiClient } from '@/lib/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Integration {
  id: string;
  name: string;
  type: string;
  status: string;
  config: Record<string, unknown>;
  lastSync?: string;
  createdAt: string;
}

const integrationIcons: Record<string, React.ReactNode> = {
  n8n: <Zap className="h-6 w-6" />,
  whatsapp: <MessageCircle className="h-6 w-6" />,
  openai: <Brain className="h-6 w-6" />,
  smtp: <Mail className="h-6 w-6" />,
};

const integrationLabels: Record<string, string> = {
  n8n: 'n8n — Automatización',
  whatsapp: 'WhatsApp Business',
  openai: 'OpenAI — Chatbot IA',
  smtp: 'SMTP — Email',
};

export default function IntegracionesPage() {
  const queryClient = useQueryClient();
  const [editModal, setEditModal] = useState<Integration | null>(null);
  const [configFields, setConfigFields] = useState<Record<string, string>>({});

  const { data: integrationsRes, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: () => apiClient.get<Integration[]>('/integrations'),
  });

  const integrations = (integrationsRes?.data ?? []) as Integration[];

  const updateIntegration = useMutation({
    mutationFn: ({ id, config }: { id: string; config: Record<string, unknown> }) =>
      apiClient.put(`/integrations/${id}`, { config }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      setEditModal(null);
    },
  });

  const testIntegration = useMutation({
    mutationFn: (id: string) => apiClient.post(`/integrations/${id}/test`),
  });

  const openEdit = (integration: Integration) => {
    setEditModal(integration);
    const fields: Record<string, string> = {};
    Object.entries(integration.config).forEach(([key, val]) => {
      fields[key] = String(val ?? '');
    });
    setConfigFields(fields);
  };

  const handleSaveConfig = () => {
    if (!editModal) return;
    updateIntegration.mutate({ id: editModal.id, config: configFields });
  };

  // Default integrations if none from API
  const displayIntegrations = integrations.length > 0
    ? integrations
    : [
        { id: '1', name: 'n8n', type: 'n8n', status: 'active', config: { webhookUrl: '', apiKey: '' }, createdAt: new Date().toISOString() },
        { id: '2', name: 'whatsapp', type: 'whatsapp', status: 'inactive', config: { phoneNumberId: '', accessToken: '', verifyToken: '' }, createdAt: new Date().toISOString() },
        { id: '3', name: 'openai', type: 'openai', status: 'active', config: { apiKey: '', model: 'gpt-4o-mini' }, createdAt: new Date().toISOString() },
        { id: '4', name: 'smtp', type: 'smtp', status: 'active', config: { host: '', port: '587', user: '', password: '' }, createdAt: new Date().toISOString() },
      ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ut-accent/10">
          <Plug className="h-6 w-6 text-ut-accent" />
        </div>
        <div>
          <h1 className="text-h3 font-bold text-ut-text">Integraciones</h1>
          <p className="text-small text-ut-text-muted">Configuración de servicios externos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayIntegrations.map((integration) => (
          <Card key={integration.id} variant="elevated">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-ut-surface text-ut-accent">
                  {integrationIcons[integration.type] ?? <Plug className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-body font-semibold text-ut-text">
                    {integrationLabels[integration.type] ?? integration.name}
                  </h3>
                  <Badge variant={integration.status === 'active' ? 'success' : 'danger'}>
                    {integration.status === 'active' ? (
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Activo</span>
                    ) : (
                      <span className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Inactivo</span>
                    )}
                  </Badge>
                </div>
              </div>
            </div>

            {integration.lastSync && (
              <p className="text-small text-ut-text-muted mb-3">
                Última sincronización: {new Date(integration.lastSync).toLocaleString('es-CO')}
              </p>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openEdit(integration)}>
                Configurar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<RefreshCw className="h-4 w-4" />}
                loading={testIntegration.isPending}
                onClick={() => testIntegration.mutate(integration.id)}
              >
                Probar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit config modal */}
      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title={`Configurar ${editModal ? integrationLabels[editModal.type] ?? editModal.name : ''}`} size="lg">
        <div className="space-y-4">
          {Object.entries(configFields).map(([key, value]) => (
            <Input
              key={key}
              label={key}
              value={value}
              onChange={(val) => setConfigFields((prev) => ({ ...prev, [key]: val }))}
              type={key.toLowerCase().includes('password') || key.toLowerCase().includes('token') || key.toLowerCase().includes('secret') || key.toLowerCase().includes('apikey') ? 'password' : 'text'}
            />
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setEditModal(null)}>Cancelar</Button>
            <Button onClick={handleSaveConfig} loading={updateIntegration.isPending}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
