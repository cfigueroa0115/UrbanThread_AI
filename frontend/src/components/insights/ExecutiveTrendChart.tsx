'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TrendPoint {
  month: string;
  visits: number;
  conversions: number;
  orders: number;
}

interface Props {
  data: TrendPoint[];
}

export function ExecutiveTrendChart({ data }: Props) {
  const maxVisits = Math.max(...data.map(d => d.visits));

  return (
    <div className="relative">
      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((point, i) => {
          const height = (point.visits / maxVisits) * 100;
          const convHeight = (point.conversions / maxVisits) * 100;
          return (
            <div key={point.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="relative w-full flex items-end justify-center gap-0.5 h-32">
                {/* Visits bar */}
                <motion.div
                  className="w-3 sm:w-4 rounded-t-md bg-gradient-to-t from-[#C4956A] to-[#D4A76A] relative overflow-hidden"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent)' }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  />
                </motion.div>
                {/* Conversions bar */}
                <motion.div
                  className="w-3 sm:w-4 rounded-t-md bg-gradient-to-t from-emerald-500 to-teal-400"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${convHeight}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.1 }}
                />
              </div>
              <span className="text-[10px] text-stone-400 font-medium">{point.month}</span>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-[#C4956A] to-[#D4A76A]" />
          <span className="text-[10px] text-stone-500">Visitas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-emerald-500 to-teal-400" />
          <span className="text-[10px] text-stone-500">Conversiones</span>
        </div>
      </div>
    </div>
  );
}
