'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

interface SmartCityPillar {
  name: string;
  score: number;
  description: string;
}

interface Props {
  readinessIndex: number;
  pillars: SmartCityPillar[];
}

export function ExecutiveSmartCityBlock({ readinessIndex, pillars }: Props) {
  const pillarColors = [
    'from-blue-500 to-indigo-500',
    'from-violet-500 to-purple-500',
    'from-[#C4956A] to-[#8B6F5E]',
    'from-emerald-500 to-green-500',
    'from-teal-500 to-cyan-500',
    'from-rose-500 to-pink-500',
  ];

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A] border border-white/10 p-8 text-white">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-6">
        <motion.div
          className="p-2.5 rounded-xl bg-gradient-to-br from-[#C4956A] to-[#D4A76A] shadow-lg"
          animate={{ scale: [1, 1.08, 1], boxShadow: ['0 4px 15px rgba(196,149,106,0.3)', '0 8px 30px rgba(196,149,106,0.5)', '0 4px 15px rgba(196,149,106,0.3)'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Building2 className="h-5 w-5 text-white" />
        </motion.div>
        <div>
          <h3 className="text-lg font-bold">Smart City Contribution</h3>
          <p className="text-xs text-white/50">Why this matters for intelligent cities</p>
        </div>
        {/* Readiness Index */}
        <div className="ml-auto text-right">
          <motion.p
            className="text-3xl font-extrabold text-[#C4956A]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {readinessIndex}
          </motion.p>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Readiness Index</p>
        </div>
      </div>

      {/* Pillars */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#C4956A]/30 hover:bg-white/[0.08] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/80">{pillar.name}</span>
              <span className="text-xs font-bold text-[#C4956A]">{pillar.score}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${pillarColors[i % pillarColors.length]}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${pillar.score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
              />
            </div>
            <p className="text-[10px] text-white/40 leading-tight">{pillar.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Narrative */}
      <motion.p
        className="relative mt-6 text-center text-sm text-white/50 italic"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        &ldquo;UrbanThread AI transforms retail into a connected urban service — less paper, more traceability, smarter cities.&rdquo;
      </motion.p>
    </div>
  );
}
