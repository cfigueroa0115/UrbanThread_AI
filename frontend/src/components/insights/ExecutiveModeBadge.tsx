'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Eye } from 'lucide-react';

interface Props {
  mode: 'live' | 'demo';
}

export function ExecutiveModeBadge({ mode }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
        mode === 'live'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-[#C4956A]/10 text-[#8B6F5E] border-[#C4956A]/30'
      }`}
    >
      {mode === 'live' ? (
        <>
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <Radio className="h-3 w-3" />
          Live Data
        </>
      ) : (
        <>
          <Eye className="h-3 w-3" />
          Executive Preview
        </>
      )}
    </motion.div>
  );
}
