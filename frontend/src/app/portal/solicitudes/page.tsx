'use client';

import React, { useState } from 'react';
import { ClipboardList, ArrowLeft, Clock, Search, ShoppingCart, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DataTable, type ColumnDef } from '@/components/ui/DataTable';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import {
  useRequests,
  useRequest,
  useRequestByRadication,
  type RequestRecord,
  type RequestDetail,
} from '@/hooks/useRequests';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  registered: 'info',
  paid: 'success',
  in_preparation: 'warning',
  shipped: 'info',
  delivered: 'success',
  received: 'success',
  in_review: 'warning',
  in_progress: 'info',
  pending_info: 'warning',
  resolved: 'success',
  closed: 'default',
  cancelled: 'danger',
};

const statusLabel: Record<string, string> = {
  registered: 'Registrada',
  paid: 'Pagada',
  in_preparation: 'En preparación',
  shipped: 'Enviada',
  delivered: 'Entregada',
  received: 'Recibida',
  in_review: 'En revisión',
  in_progress: 'En progreso',
  pending_info: 'Pendiente info',
  resolved: 'Resuelta',
  closed: 'Cerrada',
  cancelled: 'Cancelada',
};

export default function SolicitudesPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [radicationSearch, setRadicationSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: requestsRes, isLoading } = useRequests({ clientId: user?.id });
  const { data: detailRes, isLoading: detailLoading } = useRequest(selectedId ?? '');
  const { data: radicationRes, isLoading: radicationLoading } = useRequestByRadication(searchTerm);

  const requests = (requestsRes?.data ?? []) as RequestRecord[];
  const detail = detailRes?.data as RequestDetail | undefined;
  const radicationResult = radicationRes?.data as RequestDetail | undefined;

  const columns: ColumnDef<RequestRecord & Record<string, unknown>>[] = [
    {
      key: 'radicationNumber',
      header: 'N° Radicación',
      render: (row) => <span className="font-mono font-medium">{String(row.radicationNumber ?? '—')}</span>,
    },
    { key: 'type', header: 'Tipo' },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => (
        <Badge variant={statusVariant[row.status as string] ?? 'default'}>
          {statusLabel[row.status as string] ?? row.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      render: (row) => new Date(row.createdAt as string).toLocaleDateString('es-CO'),
    },
  ];

  const handleRadicationSearch = () => {
    if (radicationSearch.trim()) {
      setSearchTerm(radicationSearch.trim());
      setSelectedId(null);
    }
  };

  if (selectedId) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedId(null)}
          className="inline-flex items-center gap-1.5 text-small text-ut-text-muted hover:text-ut-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a solicitudes
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
              <Badge variant={statusVariant[detail.status] ?? 'default'}>
                {statusLabel[detail.status] ?? detail.status}
              </Badge>
            </div>

            <Card>
              <h2 className="text-h5 font-semibold text-ut-text mb-3">Detalles</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body">
                <div>
                  <dt className="text-small text-ut-text-muted">Tipo</dt>
                  <dd className="font-medium text-ut-text">{detail.type}</dd>
                </div>
                <div>
                  <dt className="text-small text-ut-text-muted">Fecha de creación</dt>
                  <dd className="font-medium text-ut-text">{new Date(detail.createdAt).toLocaleString('es-CO')}</dd>
                </div>
                <div>
                  <dt className="text-small text-ut-text-muted">Prioridad</dt>
                  <dd className="font-medium text-ut-text capitalize">{String((detail as any).priority ?? 'medium')}</dd>
                </div>
                <div>
                  <dt className="text-small text-ut-text-muted">Estado</dt>
                  <dd className="font-medium text-ut-text">{statusLabel[detail.status] ?? detail.status}</dd>
                </div>
              </dl>

              {/* Descripción completa del pedido */}
              {detail.description && (
                <div className="mt-4 pt-4 border-t border-ut-surface-dark">
                  <dt className="text-small text-ut-text-muted mb-3 font-semibold">Descripción del pedido</dt>
                  <div className="bg-[#FAF8F5] rounded-xl p-5 space-y-4">
                    {/* Parse and display products */}
                    {(() => {
                      const desc = String(detail.description);
                      const parts = desc.split(' | ');
                      const generalInfo: Array<{label: string; value: string}> = [];
                      const products: Array<{name: string; price: string; size: string; color: string; image: string}> = [];
                      let currentProduct: Record<string, string> = {};

                      for (const part of parts) {
                        const colonIdx = part.indexOf(': ');
                        if (colonIdx === -1) continue;
                        const key = part.substring(0, colonIdx).trim();
                        const val = part.substring(colonIdx + 2).trim();

                        if (key.startsWith('Producto')) {
                          if (currentProduct.name) products.push({ name: currentProduct.name, price: currentProduct.price || '', size: currentProduct.size || '', color: currentProduct.color || '', image: currentProduct.image || '' });
                          currentProduct = { name: val };
                        } else if (key === 'Precio' && currentProduct.name) {
                          currentProduct.price = val;
                        } else if (key === 'Talla' && currentProduct.name) {
                          currentProduct.size = val;
                        } else if (key === 'Color' && currentProduct.name) {
                          currentProduct.color = val;
                        } else if (key === 'Imagen' && currentProduct.name) {
                          currentProduct.image = val;
                        } else if (key !== 'Imagen') {
                          generalInfo.push({ label: key, value: val });
                        }
                      }
                      if (currentProduct.name) products.push({ name: currentProduct.name, price: currentProduct.price || '', size: currentProduct.size || '', color: currentProduct.color || '', image: currentProduct.image || '' });

                      return (
                        <>
                          {/* General info */}
                          <div className="space-y-1.5">
                            {generalInfo.map((item, i) => (
                              <div key={i} className="flex items-baseline gap-2">
                                <span className="text-xs font-semibold text-[#C4956A] whitespace-nowrap">{item.label}:</span>
                                <span className="text-xs text-stone-700">{item.value}</span>
                              </div>
                            ))}
                          </div>

                          {/* Products list */}
                          {products.length > 0 && (
                            <div className="pt-3 border-t border-stone-200 space-y-2">
                              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Productos ({products.length})</p>
                              {products.map((prod, i) => (
                                <div key={i} className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-stone-100 shadow-sm">
                                  {prod.image && (
                                    <img src={prod.image} alt={prod.name} className="w-12 h-14 object-cover rounded-lg flex-shrink-0 border border-stone-200" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-stone-800">{prod.name}</p>
                                    <p className="text-[10px] text-stone-500">
                                      {[prod.size && `Talla: ${prod.size}`, prod.color && `Color: ${prod.color}`, prod.price].filter(Boolean).join(' · ')}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </Card>

            {/* Pay button — only for nuevo_pedido type with products */}
            {detail.type === 'nuevo_pedido' && (detail.status === 'registered' || detail.status === 'paid') && (
              <Card className="bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] border-none">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#C4956A]/20">
                      <CreditCard className="h-6 w-6 text-[#C4956A]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{detail.status === 'paid' ? 'Pago realizado' : 'Proceder al pago'}</p>
                      <p className="text-xs text-stone-400">{detail.status === 'paid' ? 'Tu pago fue procesado exitosamente' : 'Completa tu pedido y realiza el pago seguro'}</p>
                    </div>
                  </div>
                  {detail.status === 'registered' && (
                    onClick={() => {
                      // Parse products from description and add to cart
                      const desc = detail.description ?? '';
                      const parts = desc.split(' | ');
                      const products: Array<{name: string; price: number; image: string; size: string; color: string}> = [];
                      let current: Record<string, string> = {};

                      for (const part of parts) {
                        const colonIdx = part.indexOf(': ');
                        if (colonIdx === -1) continue;
                        const key = part.substring(0, colonIdx).trim();
                        const val = part.substring(colonIdx + 2).trim();

                        if (key.startsWith('Producto')) {
                          if (current.name) products.push({ name: current.name, price: parseInt(current.price?.replace(/\D/g, '') || '0'), image: current.image || '', size: current.size || '', color: current.color || '' });
                          current = { name: val };
                        } else if (key === 'Precio' && current.name) current.price = val;
                        else if (key === 'Talla' && current.name) current.size = val;
                        else if (key === 'Color' && current.name) current.color = val;
                        else if (key === 'Imagen' && current.name) current.image = val;
                      }
                      if (current.name) products.push({ name: current.name, price: parseInt(current.price?.replace(/\D/g, '') || '0'), image: current.image || '', size: current.size || '', color: current.color || '' });

                      // Clear cart and add all products from this request
                      clearCart();
                      products.forEach((prod, idx) => {
                        addToCart({
                          id: `rad-${detail.id}-${idx}`,
                          name: prod.name,
                          price: prod.price,
                          image: prod.image,
                          size: prod.size,
                          color: prod.color,
                        });
                      });

                      // Open the cart panel (which has the full checkout flow)
                      useCartStore.getState().openCart();
                    }}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C4956A] to-[#D4A76A] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Ir a pagar
                    </span>
                  </button>
                  )}
                </div>
              </Card>
            )}

            {/* Status history */}
            <Card>
              <h2 className="text-h5 font-semibold text-ut-text mb-4">Historial de estados</h2>
              <div className="space-y-3">
                {((detail.statusHistory ?? []) as Array<Record<string, unknown>>).length === 0 ? (
                  <p className="text-body text-ut-text-muted">Sin historial de estados.</p>
                ) : (
                  ((detail.statusHistory ?? []) as Array<Record<string, unknown>>).map((entry, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-ut-text-muted mt-0.5 flex-shrink-0" />
                      <div>
                        <Badge variant={statusVariant[String(entry.status)] ?? 'default'}>
                          {statusLabel[String(entry.status)] ?? String(entry.status)}
                        </Badge>
                        <p className="text-small text-ut-text-muted mt-1">
                          {entry.createdAt ? new Date(String(entry.createdAt)).toLocaleString('es-CO') : ''}
                        </p>
                        {!!entry.comment && <p className="text-small text-ut-text mt-0.5">{String(entry.comment)}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Attached files */}
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
          </div>
        ) : (
          <p className="text-body text-ut-text-muted">Solicitud no encontrada.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] shadow-lg">
          <ClipboardList className="h-6 w-6 text-[#C4956A]" />
        </div>
        <div>
          <h1 className="text-h3 font-bold text-ut-text">Mis Solicitudes</h1>
          <p className="text-small text-ut-text-muted">Historial y seguimiento de solicitudes</p>
        </div>
      </div>

      {/* Radication search */}
      <Card>
        <h2 className="text-h5 font-semibold text-ut-text mb-3">Buscar por número de radicación</h2>
        <div className="flex gap-3 items-end">
          <div className="flex-1 max-w-sm">
            <Input
              label="Número de radicación"
              value={radicationSearch}
              onChange={setRadicationSearch}
              placeholder="Ej: RAD-2024-000001"
            />
          </div>
          <Button
            onClick={handleRadicationSearch}
            loading={radicationLoading}
            icon={<Search className="h-4 w-4" />}
          >
            Buscar
          </Button>
        </div>
        {searchTerm && !radicationLoading && (
          <div className="mt-4">
            {radicationResult ? (
              <Card variant="elevated" padding="sm" className="cursor-pointer" onClick={() => { setSelectedId(radicationResult.id); setSearchTerm(''); }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono font-medium text-ut-text">{radicationResult.radicationNumber}</p>
                    <p className="text-small text-ut-text-muted">{radicationResult.type}</p>
                  </div>
                  <Badge variant={statusVariant[radicationResult.status] ?? 'default'}>
                    {statusLabel[radicationResult.status] ?? radicationResult.status}
                  </Badge>
                </div>
              </Card>
            ) : (
              <p className="text-small text-ut-text-muted">No se encontró solicitud con ese número de radicación.</p>
            )}
          </div>
        )}
      </Card>

      {/* Requests table */}
      <Card>
        <DataTable
          columns={columns}
          data={requests as (RequestRecord & Record<string, unknown>)[]}
          loading={isLoading}
          onRowClick={(row) => setSelectedId(row.id as string)}
          pageSize={10}
        />
      </Card>
    </div>
  );
}
