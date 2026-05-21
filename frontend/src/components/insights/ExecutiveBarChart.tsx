'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  type: string;
  count: number;
}

interface Props {
  data: DataPoint[];
}

const BAR_COLORS = [
  'from-[#C4956A] to-[#D4A76A]',
  'from-emerald-500 to-teal-500',
  'from-blue-500 to-indigo-500',
  'from-violet-500 to-purple-500',
  'from-rose-500 to-pink-500',
];

export function ExecutiveBarChart({ data }: Props) {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="space-y-3">
      {data.map((item, i) => {
        const width = Math.max((item.count / maxCount) * 100, 5);
        return (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-stone-600">{item.type}</span>
              <span className="text-xs font-bold text-stone-900">{item.count}</span>
            </div>
            <div className="h-5 bg-stone-50 rounded-md overflow-hidden">
              <motion.div
                className={`h-full rounded-md bg-gradient-to-r ${BAR_COLORS[i % BAR_COLORS.length]} relative overflow-hidden`}
                initial={{ width: 0 }}
                whileInView={{ width: `${width}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 + i * 0.5 }}
                />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
