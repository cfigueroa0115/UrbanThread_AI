'use client';

import React, { useState, useMemo } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { DashboardCards } from '@/components/analitica/DashboardCards';
import { DateFilter } from '@/components/analitica/DateFilter';
import { useDashboardData } from '@/hooks/useAnalytics';
import type { DashboardData } from '@/hooks/useAnalytics';

function fmt(n: number | undefined | null): string {
  return (n ?? 0).toLocaleString('es-CO');
}

function fmtCurrency(n: number | undefined | null): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n ?? 0);
}

// Fallback when API hasn't loaded
const EMPTY: DashboardData = {
  totalVisits: 0, uniqueSessions: 0, totalClients: 0, totalOrders: 0,
  totalRequests: 0, totalPurchases: 0, totalTestimonials: 0,
  ordersPending: 0, ordersProcessing: 0, ordersCompleted: 0, ordersCancelled: 0,
  conversionRate: 0, avgOrderValue: 0, totalRevenue: 0,
  formsSubmitted: 0, requestsFiled: 0, chatbotInteractions: 0, whatsappMessages: 0,
  avgChatbotResponseTimeMs: 0, otpTotal: 0, otpSuccessful: 0, otpSuccessRate: 0,
  newClientsLast30Days: 0, returningClients: 0, pageVisitsCount: 0, recentEvents: 0,
  topPages: [], trafficBySource: {}, deviceBreakdown: {},
  conversionFunnel: { visits: 0, interactions: 0, formsSubmitted: 0, ordersCreated: 0, ordersDelivered: 0 },
};

export default function AnaliticaPage() {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const params = useMemo(() => ({ startDate, endDate }), [startDate, endDate]);

  const { data: dashRes, isLoading, dataUpdatedAt } = useDashboardData(params);
  const d: DashboardData = { ...EMPTY, ...(dashRes?.data as Partial<DashboardData> | undefined) };

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString('es-CO') : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const trafficEntries = Object.entries(d.trafficBySource);
  const trafficTotal = trafficEntries.reduce((a, [, v]) => a + (v as number), 0);
  const deviceEntries = Object.entries(d.deviceBreakdown);
  const deviceTotal = deviceEntries.reduce((a, [, v]) => a + (v as number), 0);
  const deviceLabels: Record<string, string> = { mobile: 'Movil', desktop: 'Escritorio', tablet: 'Tablet' };

  const funnel = d.conversionFunnel;
  const funnelSteps = [
    { label: 'Visitas', value: funnel.visits },
    { label: 'Interacciones', value: funnel.interactions },
    { label: 'Formularios', value: funnel.formsSubmitted },
    { label: 'Pedidos creados', value: funnel.ordersCreated },
    { label: 'Pedidos entregados', value: funnel.ordersDelivered },
  ];
  const funnelMax = Math.max(...funnelSteps.map(s => s.value), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ut-accent/10">
            <BarChart3 className="h-6 w-6 text-ut-accent" />
          </div>
          <div>
            <h1 className="text-h3 font-bold text-ut-text">Analitica</h1>
            <p className="text-small text-ut-text-muted">
              Dashboard de metricas y rendimiento
              {lastUpdated && (
                <span className="ml-2">
                  <RefreshCw className="h-3 w-3 inline-block mr-1" />
                  {lastUpdated}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info">Auto-refresh: 60s</Badge>
          <DateFilter startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardCards data={d} />

      {/* Orders breakdown + Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders by status */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ut-text mb-4">Estado de pedidos</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-yellow-50">
              <p className="text-2xl font-bold text-yellow-600">{fmt(d.ordersPending)}</p>
              <p className="text-xs text-ut-text-muted">Pendientes</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50">
              <p className="text-2xl font-bold text-blue-600">{fmt(d.ordersProcessing)}</p>
              <p className="text-xs text-ut-text-muted">En proceso</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-50">
              <p className="text-2xl font-bold text-green-600">{fmt(d.ordersCompleted)}</p>
              <p className="text-xs text-ut-text-muted">Completados</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50">
              <p className="text-2xl font-bold text-red-600">{fmt(d.ordersCancelled)}</p>
              <p className="text-xs text-ut-text-muted">Cancelados</p>
            </div>
          </div>
        </Card>

        {/* Clients */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ut-text mb-4">Clientes</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-ut-text-muted">Total clientes</span>
              <span className="text-lg font-bold text-ut-text">{fmt(d.totalClients)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-ut-text-muted">Nuevos (30 dias)</span>
              <span className="text-lg font-bold text-ut-accent">{fmt(d.newClientsLast30Days)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-ut-text-muted">Recurrentes</span>
              <span className="text-lg font-bold text-ut-text">{fmt(d.returningClients)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-ut-text-muted">Valor promedio pedido</span>
              <span className="text-lg font-bold text-ut-text">{fmtCurrency(d.avgOrderValue)}</span>
            </div>
          </div>
        </Card>

        {/* Interactions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ut-text mb-4">Interacciones</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-ut-text-muted">Chatbot</span>
              <span className="text-lg font-bold text-ut-text">{fmt(d.chatbotInteractions)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-ut-text-muted">WhatsApp</span>
              <span className="text-lg font-bold text-ut-text">{fmt(d.whatsappMessages)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-ut-text-muted">Formularios</span>
              <span className="text-lg font-bold text-ut-text">{fmt(d.formsSubmitted)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-ut-text-muted">OTP enviados</span>
              <span className="text-lg font-bold text-ut-text">{fmt(d.otpTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-ut-text-muted">Tasa exito OTP</span>
              <span className="text-lg font-bold text-ut-text">{(d.otpSuccessRate ?? 0).toFixed(0)}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Funnel + Traffic + Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ut-text mb-4">Embudo de conversion</h2>
          <div className="space-y-3">
            {funnelSteps.map((step, i) => {
              const pct = funnelMax > 0 ? (step.value / funnelMax * 100) : 0;
              return (
                <div key={step.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ut-text-muted">{step.label}</span>
                    <span className="font-semibold text-ut-text">{fmt(step.value)}</span>
                  </div>
                  <div className="w-full bg-ut-surface-dark rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: `hsl(${160 - i * 20}, 70%, ${50 + i * 5}%)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Traffic by source */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ut-text mb-4">Trafico por fuente</h2>
          {trafficEntries.length > 0 ? (
            <div className="space-y-3">
              {trafficEntries.map(([source, count]) => {
                const pct = trafficTotal > 0 ? ((count as number) / trafficTotal * 100).toFixed(1) : '0';
                return (
                  <div key={source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-ut-text capitalize">{source}</span>
                      <span className="text-ut-text-muted">{count as number} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-ut-surface-dark rounded-full h-2.5">
                      <div className="bg-ut-accent rounded-full h-2.5 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-ut-text-muted text-center py-8">Sin datos</p>
          )}
        </Card>

        {/* Devices */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ut-text mb-4">Dispositivos</h2>
          {deviceEntries.length > 0 ? (
            <div className="space-y-4">
              {deviceEntries.map(([device, count]) => {
                const pct = deviceTotal > 0 ? ((count as number) / deviceTotal * 100).toFixed(1) : '0';
                return (
                  <div key={device} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-ut-text font-medium capitalize">{deviceLabels[device] ?? device}</span>
                        <span className="text-ut-text-muted">{pct}%</span>
                      </div>
                      <div className="w-full bg-ut-surface-dark rounded-full h-2.5">
                        <div className="bg-ut-electric rounded-full h-2.5 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-ut-text w-10 text-right">{count as number}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-ut-text-muted text-center py-8">Sin datos</p>
          )}
        </Card>
      </div>

      {/* Top Pages */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-ut-text mb-4">Paginas mas visitadas</h2>
        {d.topPages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {d.topPages.map((p, i) => (
              <div key={p.page} className="flex items-center gap-3 p-3 rounded-lg bg-ut-surface">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-ut-accent/10 text-ut-accent flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-ut-text truncate font-mono">{p.page}</span>
                <span className="text-sm font-bold text-ut-accent">{p.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ut-text-muted text-center py-8">Sin datos de paginas</p>
        )}
      </Card>
    </div>
  );
}
