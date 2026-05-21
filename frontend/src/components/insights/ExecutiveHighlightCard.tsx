'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Search, Leaf, FileText, BarChart3, Building2 } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain className="h-5 w-5 text-white" />,
  zap: <Zap className="h-5 w-5 text-white" />,
  shield: <Shield className="h-5 w-5 text-white" />,
  search: <Search className="h-5 w-5 text-white" />,
  leaf: <Leaf className="h-5 w-5 text-white" />,
  file: <FileText className="h-5 w-5 text-white" />,
  chart: <BarChart3 className="h-5 w-5 text-white" />,
  building: <Building2 className="h-5 w-5 text-white" />,
};

const gradients = [
  'from-[#C4956A] to-[#8B6F5E]',
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-green-500 to-emerald-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
];

interface Highlight {
  key: string;
  title: string;
  description: string;
  icon: string;
}

interface Props {
  highlights: Highlight[];
}

export function ExecutiveHighlightCards({ highlights }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {highlights.map((h, i) => (
        <motion.div
          key={h.key}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -4, scale: 1.03 }}
          className="relative p-4 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 text-center group"
        >
          <motion.div
            className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]} shadow-md mx-auto mb-3`}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          >
            {iconMap[h.icon] || <Brain className="h-5 w-5 text-white" />}
          </motion.div>
          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">{h.title}</h4>
          <p className="mt-1 text-[10px] text-stone-400 leading-tight">{h.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
