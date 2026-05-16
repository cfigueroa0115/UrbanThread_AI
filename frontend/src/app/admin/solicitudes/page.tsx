'use client';

import React, { useState } from 'react';
import { ClipboardList, ArrowLeft, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { DataTable, type ColumnDef } from '@/components/ui/DataTable';
import { Spinner } from '@/components/ui/Spinner';
import { useRequests, useRequest, useUpdateRequestStatus, type RequestRecord, type RequestDetail } from '@/hooks/useRequests';
import { UpdateRequestStatusSchema } from '@shared/schemas';
import { validateForm, type FieldErrors } from '@/lib/form-validation';
import { trackFormSubmit } from '@/lib/analytics';

const REQUEST_STATUS_LIST = ['registered', 'in_review', 'in_progress', 'pending_info', 'resolved', 'closed', 'cancelled'] as const;

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  registered: 'info', in_review: 'warning', in_progress: 'info', pending_info: 'warning', resolved: 'success', closed: 'default', cancelled: 'danger',
};
const statusLabel: Record<string, string> = {
  registered: 'Registrada', in_review: 'En revisión', in_progress: 'En progreso', pending_info: 'Pendiente info', resolved: 'Resuelta', closed: 'Cerrada', cancelled: 'Cancelada',
};

export default function SolicitudesAdminPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [formErrors, setFormErrors] = useState<FieldErrors>({});

  const { data: requestsRes, isLoading } = useRequests({ status: statusFilter || undefined });
  const { data: detailRes, isLoading: detailLoading } = useRequest(selectedId ?? '');
  const updateStatus = useUpdateRequestStatus();

  const requests = (requestsRes?.data ?? []) as RequestRecord[];
  const detail = detailRes?.data as RequestDetail | undefined;

  const statusOptions = REQUEST_STATUS_LIST.map((s) => ({ value: s, label: statusLabel[s] ?? s }));

  const handleStatusUpdate = () => {
    if (!selectedId) return;
    setFormErrors({});

    const validation = validateForm(UpdateRequestStatusSchema, {
      status: newStatus,
      comment: statusComment || null,
    });
    if (!validation.success) {
      setFormErrors(validation.errors);
      return;
    }

    updateStatus.mutate(
      { id: selectedId, status: newStatus, comment: statusComment || undefined },
      {
        onSuccess: () => {
          trackFormSubmit('update-request-status', true);
          setStatusModal(false); setNewStatus(''); setStatusComment(''); setFormErrors({});
        },
        onError: () => { trackFormSubmit('update-request-status', false); },
      },
    );
  };

  const columns: ColumnDef<RequestRecord & Record<string, unknown>>[] = [
    { key: 'radicationNumber', header: 'N° Radicación', render: (row) => <span className="font-mono font-medium">{String(row.radicationNumber ?? '—')}</span> },
    { key: 'type', header: 'Tipo' },
    {
      key: 'status', header: 'Estado',
      render: (row) => <Badge variant={statusVariant[row.status as string] ?? 'default'}>{statusLabel[row.status as string] ?? row.status}</Badge>,
    },
    { key: 'createdAt', header: 'Fecha', render: (row) => new Date(row.createdAt as string).toLocaleDateString('es-CO') },
  ];

  if (selectedId) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedId(null)} className="inline-flex items-center gap-1.5 text-small text-ut-text-muted hover:text-ut-text transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a solicitudes
        </button>

        {detailLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : detail ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-h3 font-bold text-ut-text">Solicitud</h1>
                <p className="text-small text-ut-text-muted font-mono">{detail.radicationNumber}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={statusVariant[detail.status] ?? 'default'}>{statusLabel[detail.status] ?? detail.status}</Badge>
                <Button size="sm" onClick={() => setStatusModal(true)}>Cambiar estado</Button>
              </div>
            </div>

            <Card>
              <h2 className="text-h5 font-semibold text-ut-text mb-3">Detalles</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body">
                <div><dt className="text-small text-ut-text-muted">Tipo</dt><dd className="font-medium">{detail.type}</dd></div>
                <div><dt className="text-small text-ut-text-muted">Fecha</dt><dd className="font-medium">{new Date(detail.createdAt).toLocaleString('es-CO')}</dd></div>
              </dl>
            </Card>

            <Card>
              <h2 className="text-h5 font-semibold text-ut-text mb-4">Historial de estados</h2>
              <div className="space-y-3">
                {((detail.statusHistory ?? []) as Array<Record<string, unknown>>).map((entry, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-ut-text-muted mt-0.5 flex-shrink-0" />
                    <div>
                      <Badge variant={statusVariant[String(entry.status)] ?? 'default'}>{statusLabel[String(entry.status)] ?? String(entry.status)}</Badge>
                      <p className="text-small text-ut-text-muted mt-1">{entry.createdAt ? new Date(String(entry.createdAt)).toLocaleString('es-CO') : ''}</p>
                      {!!entry.comment && <p className="text-small text-ut-text mt-0.5">{String(entry.comment)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-h5 font-semibold text-ut-text mb-4">Archivos adjuntos</h2>
              {((detail.attachedFiles ?? []) as Array<Record<string, unknown>>).length === 0 ? (
                <p className="text-body text-ut-text-muted">Sin archivos adjuntos.</p>
              ) : (
                <ul className="space-y-2">
                  {((detail.attachedFiles ?? []) as Array<Record<string, unknown>>).map((file, i) => (
                    <li key={i} className="text-body text-ut-text">{String(file.fileName ?? file.name ?? 'Archivo')}</li>
                  ))}
                </ul>
              )}
            </Card>

            <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Cambiar estado de solicitud" size="md">
              <div className="space-y-4">
                <Select label="Nuevo estado" options={statusOptions} value={newStatus} onChange={setNewStatus} required error={formErrors['status']} />
                <Input label="Comentario (opcional)" value={statusComment} onChange={setStatusComment} placeholder="Motivo del cambio..." />
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setStatusModal(false)}>Cancelar</Button>
                  <Button onClick={handleStatusUpdate} loading={updateStatus.isPending} disabled={!newStatus}>Actualizar</Button>
                </div>
              </div>
            </Modal>
          </div>
        ) : (
          <p className="text-body text-ut-text-muted">Solicitud no encontrada.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ut-accent/10">
            <ClipboardList className="h-6 w-6 text-ut-accent" />
          </div>
          <div>
            <h1 className="text-h3 font-bold text-ut-text">Solicitudes</h1>
            <p className="text-small text-ut-text-muted">Gestión de solicitudes</p>
          </div>
        </div>
        <div className="w-48">
          <Select label="" options={[{ value: '', label: 'Todos los estados' }, ...statusOptions]} value={statusFilter} onChange={setStatusFilter} />
        </div>
      </div>

      <Card>
        <DataTable columns={columns} data={requests as (RequestRecord & Record<string, unknown>)[]} loading={isLoading} onRowClick={(row) => setSelectedId(row.id as string)} pageSize={10} />
      </Card>
    </div>
  );
}
