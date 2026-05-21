'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  suffix?: string;
  trend?: number;
  icon: React.ReactNode;
  color?: string;
  delay?: number;
}

export function ExecutiveInsightStatCard({ title, value, suffix = '', trend, icon, color = 'from-[#C4956A] to-[#8B6F5E]', delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative p-6 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
    >
      {/* Subtle animated gradient border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `conic-gradient(from 0deg, transparent 40%, rgba(196,149,106,0.4) 50%, transparent 60%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1.5px',
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-3xl font-extrabold text-stone-900">
            {value}<span className="text-lg text-stone-400 ml-0.5">{suffix}</span>
          </p>
          {trend !== undefined && (
            <div className={`mt-2 inline-flex items-center gap-1 text-xs font-bold ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend >= 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        <motion.div
          className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
}
