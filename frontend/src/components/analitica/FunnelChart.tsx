'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

interface FunnelStep {
  step: string;
  count: number;
}

interface FunnelChartProps {
  title: string;
  data: FunnelStep[];
}

export function FunnelChart({ title, data }: FunnelChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card>
      <h3 className="text-h5 font-semibold text-ut-text mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((step, i) => {
          const widthPercent = (step.count / maxCount) * 100;
          const conversionRate = i > 0 ? ((step.count / data[i - 1].count) * 100).toFixed(1) : '100';
          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-small">
                <span className="text-ut-text font-medium">{step.step}</span>
                <span className="text-ut-text-muted">
                  {step.count.toLocaleString('es-CO')}
                  {i > 0 && <span className="ml-2 text-ut-accent">({conversionRate}%)</span>}
                </span>
              </div>
              <div className="h-6 bg-ut-surface rounded-md overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-ut-accent to-ut-electric rounded-md transition-all duration-500"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default FunnelChart;
