'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

interface Props {
  data: FunnelStage[];
}

export function ExecutiveFunnelChart({ data }: Props) {
  const maxCount = data[0]?.count || 1;

  return (
    <div className="space-y-3">
      {data.map((stage, i) => {
        const width = Math.max((stage.count / maxCount) * 100, 8);
        const colors = [
          'from-[#C4956A] to-[#D4A76A]',
          'from-emerald-500 to-teal-500',
          'from-blue-500 to-indigo-500',
          'from-violet-500 to-purple-500',
          'from-rose-500 to-pink-500',
        ];
        return (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-stone-700">{stage.stage}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stone-900">{stage.count.toLocaleString()}</span>
                <span className="text-xs text-stone-400">({stage.percentage}%)</span>
              </div>
            </div>
            <div className="h-8 bg-stone-50 rounded-lg overflow-hidden relative">
              <motion.div
                className={`h-full rounded-lg bg-gradient-to-r ${colors[i % colors.length]} relative overflow-hidden`}
                initial={{ width: 0 }}
                whileInView={{ width: `${width}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 + i * 0.5 }}
                />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
