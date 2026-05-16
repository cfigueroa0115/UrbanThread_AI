'use client';

import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '@/components/ui/Card';

interface BarChartProps {
  title: string;
  data: Array<Record<string, unknown>>;
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  secondaryDataKey?: string;
  secondaryColor?: string;
}

export function BarChart({
  title,
  data,
  dataKey,
  xAxisKey = 'name',
  color = 'var(--ut-accent)',
  secondaryDataKey,
  secondaryColor = 'var(--ut-primary)',
}: BarChartProps) {
  return (
    <Card>
      <h3 className="text-h5 font-semibold text-ut-text mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {secondaryDataKey && <Legend />}
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            {secondaryDataKey && <Bar dataKey={secondaryDataKey} fill={secondaryColor} radius={[4, 4, 0, 0]} />}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default BarChart;
