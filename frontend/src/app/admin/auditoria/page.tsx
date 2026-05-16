'use client';

import React, { useState } from 'react';
import { Shield, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable, type ColumnDef } from '@/components/ui/DataTable';
import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

interface AuditLog {
  id: string;
  userId: string;
  userName?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ip: string;
  userAgent?: string;
  result: string;
  createdAt: string;
}

export default function AuditoriaPage() {
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const queryParams: Record<string, string> = {};
  if (actionFilter) queryParams.action = actionFilter;
  if (userFilter) queryParams.userId = userFilter;
  if (dateFrom) queryParams.startDate = dateFrom;
  if (dateTo) queryParams.endDate = dateTo;

  const { data: logsRes, isLoading } = useQuery({
    queryKey: ['audit-logs', queryParams],
    queryFn: () => apiClient.get<AuditLog[]>('/audit/logs', queryParams),
  });

  const logs = (logsRes?.data ?? []) as AuditLog[];

  const actionOptions = [
    { value: '', label: 'Todas las acciones' },
    { value: 'CREATE', label: 'Crear' },
    { value: 'UPDATE', label: 'Actualizar' },
    { value: 'DELETE', label: 'Eliminar' },
    { value: 'LOGIN', label: 'Inicio de sesión' },
    { value: 'LOGOUT', label: 'Cierre de sesión' },
  ];

  const resultVariant: Record<string, 'success' | 'danger' | 'default'> = {
    success: 'success',
    failure: 'danger',
    error: 'danger',
  };

  const columns: ColumnDef<AuditLog & Record<string, unknown>>[] = [
    {
      key: 'createdAt', header: 'Fecha',
      render: (row) => new Date(row.createdAt as string).toLocaleString('es-CO'),
    },
    { key: 'userName', header: 'Usuario', render: (row) => String(row.userName ?? row.userId ?? '—') },
    {
      key: 'action', header: 'Acción',
      render: (row) => <Badge variant="info">{String(row.action)}</Badge>,
    },
    { key: 'resource', header: 'Recurso' },
    { key: 'resourceId', header: 'ID Recurso', render: (row) => row.resourceId ? <span className="font-mono text-small">{String(row.resourceId).slice(0, 8)}...</span> : '—' },
    { key: 'ip', header: 'IP' },
    {
      key: 'result', header: 'Resultado',
      render: (row) => <Badge variant={resultVariant[String(row.result)] ?? 'default'}>{String(row.result)}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ut-accent/10">
          <Shield className="h-6 w-6 text-ut-accent" />
        </div>
        <div>
          <h1 className="text-h3 font-bold text-ut-text">Auditoría</h1>
          <p className="text-small text-ut-text-muted">Logs de auditoría y actividad del sistema</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-ut-text-muted" />
          <h2 className="text-h5 font-semibold text-ut-text">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select label="Acción" options={actionOptions} value={actionFilter} onChange={setActionFilter} />
          <Input label="ID de usuario" value={userFilter} onChange={setUserFilter} placeholder="UUID del usuario" />
          <div>
            <label className="text-small font-medium text-ut-text block mb-1.5">Desde</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-ut-surface-dark text-body focus:outline-none focus:ring-2 focus:ring-ut-accent focus:ring-offset-2"
            />
          </div>
          <div>
            <label className="text-small font-medium text-ut-text block mb-1.5">Hasta</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-ut-surface-dark text-body focus:outline-none focus:ring-2 focus:ring-ut-accent focus:ring-offset-2"
            />
          </div>
        </div>
      </Card>

      {/* Logs table */}
      <Card>
        <DataTable columns={columns} data={logs as (AuditLog & Record<string, unknown>)[]} loading={isLoading} pageSize={20} />
      </Card>
    </div>
  );
}
