'use client';

import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Clock, Package } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { DataTable, type ColumnDef } from '@/components/ui/DataTable';
import { Spinner } from '@/components/ui/Spinner';
import { useOrders, useOrder, useUpdateOrderStatus, type Order, type OrderDetail } from '@/hooks/useOrders';
import { UpdateOrderStatusSchema } from '@shared/schemas';
import { validateForm, type FieldErrors } from '@/lib/form-validation';
import { trackFormSubmit } from '@/lib/analytics';

const ORDER_STATUS_LIST = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'warning', confirmed: 'info', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger',
};
const statusLabel: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmado', processing: 'En proceso', shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado',
};

export default function PedidosAdminPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [formErrors, setFormErrors] = useState<FieldErrors>({});

  const { data: ordersRes, isLoading } = useOrders({ status: statusFilter || undefined });
  const { data: detailRes, isLoading: detailLoading } = useOrder(selectedId ?? '');
  const updateStatus = useUpdateOrderStatus();

  const orders = (ordersRes?.data ?? []) as Order[];
  const detail = detailRes?.data as OrderDetail | undefined;

  const statusOptions = ORDER_STATUS_LIST.map((s) => ({ value: s, label: statusLabel[s] ?? s }));

  const handleStatusUpdate = () => {
    if (!selectedId) return;
    setFormErrors({});

    const validation = validateForm(UpdateOrderStatusSchema, {
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
          trackFormSubmit('update-order-status', true);
          setStatusModal(false); setNewStatus(''); setStatusComment(''); setFormErrors({});
        },
        onError: () => { trackFormSubmit('update-order-status', false); },
      },
    );
  };

  const columns: ColumnDef<Order & Record<string, unknown>>[] = [
    { key: 'id', header: 'ID', render: (row) => <span className="font-mono text-small">{String(row.id).slice(0, 8)}...</span> },
    {
      key: 'status', header: 'Estado',
      render: (row) => <Badge variant={statusVariant[row.status as string] ?? 'default'}>{statusLabel[row.status as string] ?? row.status}</Badge>,
    },
    { key: 'total', header: 'Total', render: (row) => <span className="font-medium">${Number(row.total).toLocaleString('es-CO')}</span> },
    { key: 'createdAt', header: 'Fecha', render: (row) => new Date(row.createdAt as string).toLocaleDateString('es-CO') },
  ];

  if (selectedId) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedId(null)} className="inline-flex items-center gap-1.5 text-small text-ut-text-muted hover:text-ut-text transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a pedidos
        </button>

        {detailLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : detail ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-h3 font-bold text-ut-text">Pedido #{String(detail.id).slice(0, 8)}</h1>
              <div className="flex items-center gap-3">
                <Badge variant={statusVariant[detail.status] ?? 'default'}>{statusLabel[detail.status] ?? detail.status}</Badge>
                <Button size="sm" onClick={() => setStatusModal(true)}>Cambiar estado</Button>
              </div>
            </div>

            <Card>
              <h2 className="text-h5 font-semibold text-ut-text mb-4">Artículos</h2>
              <div className="space-y-3">
                {((detail.items ?? []) as Array<Record<string, unknown>>).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-ut-surface-dark last:border-0">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-ut-text-muted" />
                      <div>
                        <p className="text-body font-medium">{String(item.productName ?? 'Producto')}</p>
                        <p className="text-small text-ut-text-muted">Cantidad: {String(item.quantity ?? 1)}</p>
                      </div>
                    </div>
                    <span className="text-body font-medium">${Number(item.unitPrice ?? 0).toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-ut-surface-dark flex justify-between">
                <span className="text-body font-semibold">Total</span>
                <span className="text-body font-bold text-ut-accent">${Number(detail.total).toLocaleString('es-CO')}</span>
              </div>
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

            <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Cambiar estado del pedido" size="md">
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
          <p className="text-body text-ut-text-muted">Pedido no encontrado.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ut-accent/10">
            <ShoppingBag className="h-6 w-6 text-ut-accent" />
          </div>
          <div>
            <h1 className="text-h3 font-bold text-ut-text">Pedidos</h1>
            <p className="text-small text-ut-text-muted">Gestión de pedidos</p>
          </div>
        </div>
        <div className="w-48">
          <Select label="" options={[{ value: '', label: 'Todos los estados' }, ...statusOptions]} value={statusFilter} onChange={setStatusFilter} />
        </div>
      </div>

      <Card>
        <DataTable columns={columns} data={orders as (Order & Record<string, unknown>)[]} loading={isLoading} onRowClick={(row) => setSelectedId(row.id as string)} pageSize={10} />
      </Card>
    </div>
  );
}
