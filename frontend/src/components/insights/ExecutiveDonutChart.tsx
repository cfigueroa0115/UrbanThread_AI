'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  channel: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  title?: string;
}

const COLORS = ['#C4956A', '#10B981', '#6366F1', '#F59E0B', '#EC4899', '#06B6D4'];

export function ExecutiveDonutChart({ data, title }: Props) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativePercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* SVG Donut */}
      <div className="relative w-40 h-40 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((item, i) => {
            const percent = (item.value / total) * 100;
            const dashArray = `${percent * 2.51327} ${251.327}`;
            const dashOffset = -(cumulativePercent * 2.51327);
            cumulativePercent += percent;

            return (
              <motion.circle
                key={item.channel}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={COLORS[i % COLORS.length]}
                strokeWidth="12"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              />
            );
          })}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-stone-900">{total}%</span>
          <span className="text-[9px] text-stone-400 uppercase tracking-wider">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-2">
        {title && <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">{title}</p>}
        {data.map((item, i) => (
          <div key={item.channel} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="flex-1 text-sm text-stone-600">{item.channel}</span>
            <span className="text-sm font-bold text-stone-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
