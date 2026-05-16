'use client';

import React from 'react';
import { Users, ShoppingBag, ClipboardList, TrendingUp, DollarSign, Eye, UserPlus, BarChart3 } from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useDashboardData } from '@/hooks/useAnalytics';

// Default fallback values when API hasn't loaded yet
const DEFAULTS = {
  totalVisits: 0,
  uniqueSessions: 0,
  totalClients: 0,
  totalOrders: 0,
  totalRequests: 0,
  totalPurchases: 0,
  totalTestimonials: 0,
  ordersPending: 0,
  ordersProcessing: 0,
  ordersCompleted: 0,
  ordersCancelled: 0,
  conversionRate: 0,
  avgOrderValue: 0,
  totalRevenue: 0,
  formsSubmitted: 0,
  requestsFiled: 0,
  chatbotInteractions: 0,
  whatsappMessages: 0,
  newClientsLast30Days: 0,
  returningClients: 0,
  topPages: [] as Array<{ page: string; count: number }>,
  trafficBySource: {} as Record<string, number>,
  deviceBreakdown: {} as Record<string, number>,
};

function fmt(n: number | undefined | null): string {
  return (n ?? 0).toLocaleString('es-CO');
}

function fmtCurrency(n: number | undefined | null): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n ?? 0);
}

export default function AdminDashboardPage() {
  const { data: dashRes, isLoading } = useDashboardData();
  const raw = dashRes?.data;
  const stats = { ...DEFAULTS, ...raw };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h3 font-bold text-ut-text">Dashboard</h1>
        <p className="text-small text-ut-text-muted">Resumen general de la plataforma</p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Visitas totales"
          value={fmt(stats.totalVisits)}
          change={12}
          trend="up"
          icon={<Eye className="h-6 w-6" />}
        />
        <StatsCard
          title="Sesiones unicas"
          value={fmt(stats.uniqueSessions)}
          change={8}
          trend="up"
          icon={<Users className="h-6 w-6" />}
        />
        <StatsCard
          title="Pedidos"
          value={fmt(stats.totalOrders)}
          change={5}
          trend="up"
          icon={<ShoppingBag className="h-6 w-6" />}
        />
        <StatsCard
          title="Solicitudes"
          value={fmt(stats.totalRequests)}
          change={-2}
          trend="down"
          icon={<ClipboardList className="h-6 w-6" />}
        />
      </div>

      {/* Revenue & Conversion */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Ingresos totales"
          value={fmtCurrency(stats.totalRevenue)}
          trend="up"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatsCard
          title="Tasa de conversion"
          value={`${(stats.conversionRate ?? 0).toFixed(1)}%`}
          trend="up"
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatsCard
          title="Clientes nuevos (30d)"
          value={fmt(stats.newClientsLast30Days)}
          trend="up"
          icon={<UserPlus className="h-6 w-6" />}
        />
        <StatsCard
          title="Total clientes"
          value={fmt(stats.totalClients)}
          trend="neutral"
          icon={<BarChart3 className="h-6 w-6" />}
        />
      </div>

      {/* Orders breakdown + Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ut-text mb-4">Estado de pedidos</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-ut-warning/10">
              <p className="text-h3 font-bold text-ut-warning">{fmt(stats.ordersPending)}</p>
              <p className="text-small text-ut-text-muted">Pendientes</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-ut-info/10">
              <p className="text-h3 font-bold text-ut-info">{fmt(stats.ordersProcessing)}</p>
              <p className="text-small text-ut-text-muted">En proceso</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-ut-success/10">
              <p className="text-h3 font-bold text-ut-success">{fmt(stats.ordersCompleted)}</p>
              <p className="text-small text-ut-text-muted">Completados</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-ut-danger/10">
              <p className="text-h3 font-bold text-ut-danger">{fmt(stats.ordersCancelled)}</p>
              <p className="text-small text-ut-text-muted">Cancelados</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ut-text mb-4">Interacciones</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-small text-ut-text-muted">Chatbot</span>
              <span className="text-body font-semibold text-ut-text">{fmt(stats.chatbotInteractions)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-small text-ut-text-muted">WhatsApp</span>
              <span className="text-body font-semibold text-ut-text">{fmt(stats.whatsappMessages)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-small text-ut-text-muted">Formularios enviados</span>
              <span className="text-body font-semibold text-ut-text">{fmt(stats.formsSubmitted)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-small text-ut-text-muted">Compras realizadas</span>
              <span className="text-body font-semibold text-ut-text">{fmt(stats.totalPurchases)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-small text-ut-text-muted">Testimonios</span>
              <span className="text-body font-semibold text-ut-text">{fmt(stats.totalTestimonials)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Pages & Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ut-text mb-4">Paginas mas visitadas</h2>
          {stats.topPages.length > 0 ? (
            <div className="space-y-3">
              {stats.topPages.slice(0, 8).map((p: { page: string; count: number }, i: number) => (
                <div key={p.page} className="flex items-center gap-3">
                  <span className="text-small font-mono text-ut-text-muted w-6 text-right">{i + 1}.</span>
                  <span className="flex-1 text-small text-ut-text truncate">{p.page}</span>
                  <span className="text-small font-semibold text-ut-accent">{p.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-small text-ut-text-muted text-center py-4">Sin datos disponibles</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ut-text mb-4">Trafico por fuente</h2>
          {Object.keys(stats.trafficBySource).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.trafficBySource).map(([source, count]) => {
                const total = Object.values(stats.trafficBySource).reduce((a, b) => a + (b as number), 0) as number;
                const pct = total > 0 ? ((count as number) / total * 100).toFixed(1) : '0';
                return (
                  <div key={source} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-small text-ut-text capitalize">{source}</span>
                      <span className="text-small text-ut-text-muted">{count as number} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-ut-surface-dark rounded-full h-2">
                      <div
                        className="bg-ut-accent rounded-full h-2 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-small text-ut-text-muted text-center py-4">Sin datos disponibles</p>
          )}
        </Card>
      </div>

      {/* Device breakdown */}
      {Object.keys(stats.deviceBreakdown).length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ut-text mb-4">Dispositivos</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(stats.deviceBreakdown).map(([device, count]) => {
              const total = Object.values(stats.deviceBreakdown).reduce((a, b) => a + (b as number), 0) as number;
              const pct = total > 0 ? ((count as number) / total * 100).toFixed(1) : '0';
              const labels: Record<string, string> = { mobile: 'Movil', desktop: 'Escritorio', tablet: 'Tablet' };
              return (
                <div key={device} className="text-center p-4 rounded-lg bg-ut-surface">
                  <p className="text-h3 font-bold text-ut-text">{pct}%</p>
                  <p className="text-small text-ut-text-muted capitalize">{labels[device] ?? device}</p>
                  <p className="text-[11px] text-ut-text-muted">{count as number} visitas</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
