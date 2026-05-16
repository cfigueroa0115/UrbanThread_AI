'use client';

import React from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface DeviceData {
  device: string;
  sessions: number;
  percentage: number;
}

interface DeviceBreakdownProps {
  title: string;
  data: DeviceData[];
}

const deviceIcons: Record<string, React.ReactNode> = {
  desktop: <Monitor className="h-5 w-5" />,
  mobile: <Smartphone className="h-5 w-5" />,
  tablet: <Tablet className="h-5 w-5" />,
};

const deviceLabels: Record<string, string> = {
  desktop: 'Escritorio',
  mobile: 'Móvil',
  tablet: 'Tablet',
};

export function DeviceBreakdown({ title, data }: DeviceBreakdownProps) {
  return (
    <Card>
      <h3 className="text-h5 font-semibold text-ut-text mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-ut-surface text-ut-accent flex-shrink-0" aria-hidden="true">
              {deviceIcons[item.device] ?? <Monitor className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-body font-medium text-ut-text">
                  {deviceLabels[item.device] ?? item.device}
                </span>
                <span className="text-small text-ut-text-muted">
                  {item.sessions.toLocaleString('es-CO')} ({item.percentage}%)
                </span>
              </div>
              <div className="h-2 bg-ut-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-ut-accent rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default DeviceBreakdown;
