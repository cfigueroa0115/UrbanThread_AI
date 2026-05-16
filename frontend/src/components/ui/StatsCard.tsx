'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from './Card';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const trendConfig = {
  up: { icon: TrendingUp, color: 'text-ut-success', bg: 'bg-green-50' },
  down: { icon: TrendingDown, color: 'text-ut-danger', bg: 'bg-red-50' },
  neutral: { icon: Minus, color: 'text-ut-text-muted', bg: 'bg-gray-50' },
};

export function StatsCard({ title, value, change, changeLabel, icon, trend = 'neutral', className = '' }: StatsCardProps) {
  const trendInfo = trendConfig[trend];
  const TrendIcon = trendInfo.icon;

  return (
    <Card variant="default" hover className={className}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-small text-ut-text-muted">{title}</p>
          <p className="text-h3 font-bold text-ut-text">{value}</p>
          {change != null && (
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-small ${trendInfo.bg} ${trendInfo.color}`}>
              <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {change > 0 ? '+' : ''}
                {change}%
              </span>
              {changeLabel && <span className="text-ut-text-muted ml-1">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-ut-surface text-ut-accent" aria-hidden="true">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default StatsCard;
