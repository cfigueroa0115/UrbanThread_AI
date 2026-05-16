'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

interface MetricRow {
  label: string;
  value: string | number;
  change?: number;
}

interface MetricsTableProps {
  title: string;
  metrics: MetricRow[];
}

export function MetricsTable({ title, metrics }: MetricsTableProps) {
  return (
    <Card>
      <h3 className="text-h5 font-semibold text-ut-text mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-small">
          <thead className="border-b border-ut-surface-dark">
            <tr>
              <th className="px-4 py-2 font-semibold text-ut-text">Métrica</th>
              <th className="px-4 py-2 font-semibold text-ut-text text-right">Valor</th>
              <th className="px-4 py-2 font-semibold text-ut-text text-right">Cambio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ut-surface-dark">
            {metrics.map((metric, i) => (
              <tr key={i} className="hover:bg-ut-surface transition-colors">
                <td className="px-4 py-2.5 text-ut-text">{metric.label}</td>
                <td className="px-4 py-2.5 text-ut-text font-medium text-right">{metric.value}</td>
                <td className="px-4 py-2.5 text-right">
                  {metric.change != null && (
                    <span className={metric.change >= 0 ? 'text-ut-success' : 'text-ut-danger'}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default MetricsTable;
