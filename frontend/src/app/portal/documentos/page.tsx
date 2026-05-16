'use client';

import React, { useState, useRef } from 'react';
import { FolderOpen, Upload, Download, FileText, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable, type ColumnDef } from '@/components/ui/DataTable';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/auth.store';
import { apiClient } from '@/lib/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UploadDocumentSchema } from '@shared/schemas';
import { validateForm, type FieldErrors } from '@/lib/form-validation';
import { trackFormSubmit } from '@/lib/analytics';
import {
  ALLOWED_FILE_EXTENSIONS,
  MAX_FILE_SIZE_MB,
} from '@shared/constants';

interface ClientDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  description?: string;
  createdAt: string;
}

export default function DocumentosPage() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showUpload, setShowUpload] = useState(false);
  const [docType, setDocType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [formErrors, setFormErrors] = useState<FieldErrors>({});

  const { data: docsRes, isLoading } = useQuery({
    queryKey: ['documents', user?.id],
    queryFn: () => apiClient.get<ClientDocument[]>('/documents', { clientId: user?.id ?? '' }),
    enabled: !!user?.id,
  });

  const documents = (docsRes?.data ?? []) as ClientDocument[];

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiClient.upload<ClientDocument>('/documents/upload', formData);
    },
    onSuccess: () => {
      trackFormSubmit('upload-document', true);
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setShowUpload(false);
      setDocType('');
      setDescription('');
      setSelectedFile(null);
      setUploadError('');
      setFormErrors({});
    },
    onError: (err) => {
      trackFormSubmit('upload-document', false);
      setUploadError(err instanceof Error ? err.message : 'Error al cargar el documento.');
    },
  });

  const handleUpload = () => {
    if (!selectedFile || !user?.id) return;
    setUploadError('');
    setFormErrors({});

    // Validate metadata with Zod
    const validation = validateForm(UploadDocumentSchema, {
      clientId: user.id,
      documentType: docType,
      description: description || undefined,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      mimeType: selectedFile.type,
    });

    if (!validation.success) {
      setFormErrors(validation.errors);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('clientId', user.id);
    formData.append('documentType', docType);
    if (description) formData.append('description', description);

    uploadMutation.mutate(formData);
  };

  const handleDownload = async (docId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/v1/documents/${docId}/download`, {
        headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
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
      // Silently handle download errors
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const columns: ColumnDef<ClientDocument & Record<string, unknown>>[] = [
    {
      key: 'fileName',
      header: 'Archivo',
      render: (row) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-ut-text-muted flex-shrink-0" />
          <span className="text-body">{row.fileName}</span>
        </div>
      ),
    },
    { key: 'documentType', header: 'Tipo' },
    {
      key: 'fileSize',
      header: 'Tamaño',
      render: (row) => formatFileSize(row.fileSize as number),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      render: (row) => new Date(row.createdAt as string).toLocaleDateString('es-CO'),
    },
    {
      key: 'actions',
      header: 'Acciones',
      sortable: false,
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          icon={<Download className="h-4 w-4" />}
          onClick={(e) => {
            e.stopPropagation();
            handleDownload(row.id as string, row.fileName as string);
          }}
        >
          Descargar
        </Button>
      ),
    },
  ];

  const docTypeOptions = [
    { value: 'cedula', label: 'Cédula' },
    { value: 'rut', label: 'RUT' },
    { value: 'contrato', label: 'Contrato' },
    { value: 'factura', label: 'Factura' },
    { value: 'otro', label: 'Otro' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] shadow-lg">
            <FolderOpen className="h-6 w-6 text-[#C4956A]" />
          </div>
          <div>
            <h1 className="text-h3 font-bold text-ut-text">Mis Documentos</h1>
            <p className="text-small text-ut-text-muted">Gestión de documentos personales</p>
          </div>
        </div>
        <Button
          onClick={() => setShowUpload(!showUpload)}
          icon={<Upload className="h-4 w-4" />}
        >
          Cargar documento
        </Button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <Card variant="elevated">
          <h2 className="text-h5 font-semibold text-ut-text mb-4">Cargar nuevo documento</h2>
          <div className="space-y-4 max-w-lg">
            <Select
              label="Tipo de documento"
              options={docTypeOptions}
              value={docType}
              onChange={setDocType}
              required
              error={formErrors['documentType']}
            />
            <Input
              label="Descripción (opcional)"
              value={description}
              onChange={setDescription}
              placeholder="Breve descripción del documento"
              error={formErrors['description']}
            />
            <div className="space-y-1.5">
              <label className="text-small font-medium text-ut-text">
                Archivo <span className="text-ut-danger" aria-hidden="true">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_FILE_EXTENSIONS.map((ext: string) => `.${ext}`).join(',')}
                onChange={(e) => {
                  setSelectedFile(e.target.files?.[0] ?? null);
                  setUploadError('');
                }}
                className="block w-full text-small text-ut-text file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-small file:font-medium file:bg-ut-accent/10 file:text-ut-accent hover:file:bg-ut-accent/20 cursor-pointer"
              />
              <p className="text-small text-ut-text-muted">
                Formatos: {ALLOWED_FILE_EXTENSIONS.join(', ')} — Máx: {MAX_FILE_SIZE_MB} MB
              </p>
            </div>

            {(uploadError || formErrors['fileSize'] || formErrors['mimeType']) && (
              <p className="text-small text-ut-danger" role="alert">
                {uploadError || formErrors['fileSize'] || formErrors['mimeType']}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleUpload}
                loading={uploadMutation.isPending}
                disabled={!selectedFile || !docType}
                icon={<Upload className="h-4 w-4" />}
              >
                Cargar
              </Button>
              <Button variant="ghost" onClick={() => setShowUpload(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Documents table */}
      <Card>
        <DataTable
          columns={columns}
          data={documents as (ClientDocument & Record<string, unknown>)[]}
          loading={isLoading}
          pageSize={10}
        />
      </Card>
    </div>
  );
}
