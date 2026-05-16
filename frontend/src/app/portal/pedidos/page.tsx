'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, Package, Clock, User, MapPin, Mail, Phone, Star, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { apiClient } from '@/lib/api-client';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'warning', confirmed: 'info', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger',
};
const statusLabel: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmado', processing: 'En proceso', shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado',
};
const tierLabels: Record<string, string> = { standard: 'Estandar', silver: 'Silver', gold: 'Gold', platinum: 'Platinum' };
const tierColors: Record<string, string> = { standard: 'bg-gray-100 text-gray-700', silver: 'bg-slate-200 text-slate-700', gold: 'bg-amber-100 text-amber-700', platinum: 'bg-violet-100 text-violet-700' };

interface ClientData {
  id: string; firstName: string; lastName: string; documentType: string; documentNumber: string;
  emails: Array<{ email: string; isPrimary: boolean }>;
  phones: Array<{ phone: string; isPrimary: boolean }>;
  addresses: Array<{ city: string; street: string; state: string }>;
  documents: Array<{ id: string; fileName: string; mimeType: string; fileSize: number; status: string; createdAt: string }>;
  profile: { tier: string; loyaltyPoints: number } | null;
  orders: Array<{ id: string; orderNumber: string; status: string; totalAmount: string; currency: string; createdAt: string; items: Array<{ productName: string; quantity: number; unitPrice: string }> }>;
}

export default function PedidosPage() {
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get<ClientData>('/clients/me');
        if (res.data) setData(res.data);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!data) return <div className="p-6 text-center text-ut-text-muted">No se pudo cargar la informacion</div>;

  const primaryEmail = data.emails?.find(e => e.isPrimary);
  const primaryPhone = data.phones?.find(p => p.isPrimary);
  const primaryAddr = data.addresses?.[0];
  const tier = data.profile?.tier ?? 'standard';
  const orders = data.orders ?? [];

  // Detail view
  const selOrder = selectedOrder ? orders.find(o => o.id === selectedOrder) : null;
  if (selOrder) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedOrder(null)} className="inline-flex items-center gap-1.5 text-sm text-ut-text-muted hover:text-ut-text"><ArrowLeft className="h-4 w-4" /> Volver a pedidos</button>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-ut-text">Pedido {selOrder.orderNumber}</h1>
          <Badge variant={statusVariant[selOrder.status] ?? 'default'}>{statusLabel[selOrder.status] ?? selOrder.status}</Badge>
        </div>
        <Card className="p-5">
          <h2 className="text-base font-semibold mb-3">Articulos</h2>
          {(selOrder.items ?? []).map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3"><Package className="h-4 w-4 text-ut-text-muted" /><div><p className="text-sm font-medium">{item.productName}</p><p className="text-xs text-ut-text-muted">Cant: {item.quantity}</p></div></div>
              <span className="text-sm font-medium">${Number(item.unitPrice).toLocaleString('es-CO')}</span>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-ut-accent">${Number(selOrder.totalAmount).toLocaleString('es-CO')} {selOrder.currency}</span></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] shadow-lg"><ShoppingBag className="h-6 w-6 text-[#C4956A]" /></div>
        <div><h1 className="text-xl font-bold text-ut-text">Mis Pedidos</h1><p className="text-xs text-ut-text-muted">Historial y seguimiento de pedidos</p></div>
      </div>

      {/* CLIENT HEADER */}
      <Card className="p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-ut-primary via-ut-primary-light to-ut-electric p-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
              {data.firstName[0]}{data.lastName[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{data.firstName} {data.lastName}</h2>
              <p className="text-white/70 text-sm">{data.documentType} {data.documentNumber}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${tierColors[tier]}`}><Star className="h-3 w-3 inline mr-1" />{tierLabels[tier]}</span>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-50"><User className="h-4 w-4 text-blue-500" /></div><div><p className="text-[10px] text-ut-text-muted uppercase">Nombres</p><p className="text-sm font-semibold">{data.firstName} {data.lastName}</p></div></div>
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-50"><MapPin className="h-4 w-4 text-green-500" /></div><div><p className="text-[10px] text-ut-text-muted uppercase">Ciudad</p><p className="text-sm font-semibold">{primaryAddr?.city ?? 'Sin ciudad'}</p></div></div>
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-50"><Mail className="h-4 w-4 text-purple-500" /></div><div><p className="text-[10px] text-ut-text-muted uppercase">Correo</p><p className="text-sm font-semibold truncate max-w-[180px]">{primaryEmail?.email ?? 'Sin correo'}</p></div></div>
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-50"><Phone className="h-4 w-4 text-amber-500" /></div><div><p className="text-[10px] text-ut-text-muted uppercase">Telefono</p><p className="text-sm font-semibold">{primaryPhone?.phone ?? 'Sin telefono'}</p></div></div>
        </div>

        {/* Documents table */}
        {data.documents && data.documents.length > 0 && (
          <div className="px-5 pb-5">
            <h3 className="text-sm font-bold text-ut-text mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-ut-accent" /> Documentos</h3>
            <div className="overflow-x-auto rounded-xl border border-ut-surface-dark">
              <table className="w-full text-sm">
                <thead className="bg-ut-surface"><tr><th className="text-left px-3 py-2 text-xs font-semibold text-ut-text-muted">Archivo</th><th className="text-left px-3 py-2 text-xs font-semibold text-ut-text-muted">Tipo</th><th className="text-left px-3 py-2 text-xs font-semibold text-ut-text-muted">Estado</th><th className="text-left px-3 py-2 text-xs font-semibold text-ut-text-muted">Fecha</th></tr></thead>
                <tbody>{data.documents.map(doc => (
                  <tr key={doc.id} className="border-t border-ut-surface-dark hover:bg-ut-surface/50"><td className="px-3 py-2 font-medium">{doc.fileName}</td><td className="px-3 py-2 text-ut-text-muted">{doc.mimeType.split('/')[1]?.toUpperCase()}</td><td className="px-3 py-2"><Badge variant={doc.status === 'active' ? 'success' : 'default'}>{doc.status}</Badge></td><td className="px-3 py-2 text-ut-text-muted">{new Date(doc.createdAt).toLocaleDateString('es-CO')}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* ORDERS TABLE */}
      <Card className="p-5">
        <h2 className="text-base font-bold text-ut-text mb-4">Historial de pedidos ({orders.length})</h2>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-ut-text-muted"><ShoppingBag className="h-10 w-10 mx-auto mb-2 opacity-30" /><p className="text-sm">No hay pedidos registrados</p></div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-ut-surface-dark">
            <table className="w-full text-sm">
              <thead className="bg-ut-surface"><tr><th className="text-left px-4 py-3 text-xs font-bold text-ut-text-muted">Pedido</th><th className="text-left px-4 py-3 text-xs font-bold text-ut-text-muted">Estado</th><th className="text-left px-4 py-3 text-xs font-bold text-ut-text-muted">Total</th><th className="text-left px-4 py-3 text-xs font-bold text-ut-text-muted">Fecha</th></tr></thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} onClick={() => setSelectedOrder(order.id)} className="border-t border-ut-surface-dark hover:bg-ut-accent/5 cursor-pointer transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-ut-text">{order.orderNumber}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariant[order.status] ?? 'default'}>{statusLabel[order.status] ?? order.status}</Badge></td>
                    <td className="px-4 py-3 font-semibold">${Number(order.totalAmount).toLocaleString('es-CO')}</td>
                    <td className="px-4 py-3 text-ut-text-muted">{new Date(order.createdAt).toLocaleDateString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
