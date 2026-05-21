'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, FileText, Recycle, TreePine, Wind, RefreshCw } from 'lucide-react';

interface SustainabilityData {
  digitalizedProcesses: number;
  paperlessRequests: number;
  estimatedPaperReduction: number;
  estimatedReworkReduction: number;
  sustainablePackagingRatio: number;
  lowCarbonScore: number;
  co2ReductionKg: number;
  digitalTransactionsRatio: number;
}

interface Props {
  data: SustainabilityData;
}

export function ExecutiveSustainabilityBlock({ data }: Props) {
  const metrics = [
    { icon: FileText, label: 'Procesos Digitalizados', value: data.digitalizedProcesses, suffix: '', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: TreePine, label: 'Hojas Ahorradas', value: data.estimatedPaperReduction.toLocaleString(), suffix: '/año', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Recycle, label: 'Empaques Reciclables', value: data.sustainablePackagingRatio, suffix: '%', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: Wind, label: 'Reducción CO₂', value: data.co2ReductionKg.toLocaleString(), suffix: ' kg', color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { icon: RefreshCw, label: 'Reprocesos Evitados', value: data.estimatedReworkReduction, suffix: '%', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { icon: Leaf, label: 'Operación Digital', value: data.digitalTransactionsRatio, suffix: '%', color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 border border-emerald-100/50 p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Leaf className="h-5 w-5 text-white" />
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-stone-900">Sustainable Smart Commerce</h3>
          <p className="text-xs text-stone-400">Paperless & Low-Carbon Operations</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-xl bg-white/80 border border-stone-100 hover:shadow-md transition-all duration-300"
          >
            <motion.div
              className={`inline-flex p-2 rounded-lg ${m.bg} mb-2`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            >
              <m.icon className={`h-4 w-4 ${m.color}`} />
            </motion.div>
            <p className="text-2xl font-extrabold text-stone-900">{m.value}<span className="text-sm text-stone-400">{m.suffix}</span></p>
            <p className="text-[11px] text-stone-500 mt-0.5">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Low Carbon Score Bar */}
      <div className="mt-6 p-4 rounded-xl bg-white/60 border border-emerald-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-stone-700">Low-Carbon Operations Score</span>
          <span className="text-sm font-bold text-emerald-600">{data.lowCarbonScore}/100</span>
        </div>
        <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500"
            initial={{ width: 0 }}
            whileInView={{ width: `${data.lowCarbonScore}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
