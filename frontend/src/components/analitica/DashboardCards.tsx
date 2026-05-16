'use client';

import React from 'react';
import { TrendingUp, Users, ShoppingBag, ClipboardList, DollarSign } from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import type { DashboardData } from '@/hooks/useAnalytics';

interface DashboardCardsProps {
  data: DashboardData;
}

function fmt(n: number | undefined | null): string {
  return (n ?? 0).toLocaleString('es-CO');
}

function fmtCurrency(n: number | undefined | null): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n ?? 0);
}

export function DashboardCards({ data }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatsCard
        title="Visitas"
        value={fmt(data.totalVisits)}
        change={12}
        trend="up"
        icon={<TrendingUp className="h-6 w-6" />}
      />
      <StatsCard
        title="Sesiones unicas"
        value={fmt(data.uniqueSessions)}
        change={8}
        trend="up"
        icon={<Users className="h-6 w-6" />}
      />
      <StatsCard
        title="Tasa conversion"
        value={`${(data.conversionRate ?? 0).toFixed(1)}%`}
        change={1.2}
        trend="up"
        icon={<TrendingUp className="h-6 w-6" />}
      />
      <StatsCard
        title="Pedidos"
        value={fmt(data.totalOrders)}
        change={5}
        trend="up"
        icon={<ShoppingBag className="h-6 w-6" />}
      />
      <StatsCard
        title="Ingresos"
        value={fmtCurrency(data.totalRevenue)}
        trend="up"
        icon={<DollarSign className="h-6 w-6" />}
      />
    </div>
  );
}

export default DashboardCards;
