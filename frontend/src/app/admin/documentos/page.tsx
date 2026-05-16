'use client';

import React from 'react';
import { FolderOpen, FileText, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable, type ColumnDef } from '@/components/ui/DataTable';
import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';

interface Document {
  id: string;
  clientId: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  description?: string;
  createdAt: string;
  client?: { firstName: string; lastName: string; documentNumber: string };
}

export default function DocumentosAdminPage() {
  const { data: docsRes, isLoading } = useQuery({
    queryKey: ['admin-documents'],
    queryFn: () => apiClient.get<Document[]>('/documents'),
  });

  const documents = (docsRes?.data ?? []) as Document[];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = async (docId: string, fileName: string) => {
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch(`/api/v1/documents/${docId}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Error al descargar');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Silently handle
    }
  };

  const columns: ColumnDef<Document & Record<string, unknown>>[] = [
    {
      key: 'fileName', header: 'Archivo',
      render: (row) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-ut-text-muted flex-shrink-0" />
          <span className="text-body">{row.fileName}</span>
        </div>
      ),
    },
    { key: 'documentType', header: 'Tipo' },
    {
      key: 'client', header: 'Cliente',
      render: (row) => {
        const client = row.client as Record<string, unknown> | undefined;
        return client ? `${client.firstName} ${client.lastName}` : '—';
      },
    },
    { key: 'fileSize', header: 'Tamaño', render: (row) => formatFileSize(row.fileSize as number) },
    { key: 'createdAt', header: 'Fecha', render: (row) => new Date(row.createdAt as string).toLocaleDateString('es-CO') },
    {
      key: 'actions', header: 'Acciones', sortable: false,
      render: (row) => (
        <Button variant="ghost" size="sm" icon={<Download className="h-4 w-4" />} onClick={(e) => { e.stopPropagation(); handleDownload(row.id as string, row.fileName as string); }}>
          Descargar
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ut-accent/10">
          <FolderOpen className="h-6 w-6 text-ut-accent" />
        </div>
        <div>
          <h1 className="text-h3 font-bold text-ut-text">Documentos</h1>
          <p className="text-small text-ut-text-muted">Gestión de documentos de clientes</p>
        </div>
      </div>

      <Card>
        <DataTable columns={columns} data={documents as (Document & Record<string, unknown>)[]} loading={isLoading} pageSize={10} />
      </Card>
    </div>
  );
}
