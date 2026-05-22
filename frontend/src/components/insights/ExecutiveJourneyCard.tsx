'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye, MessageCircle, FileText, Shield, ShoppingBag, Layers, Leaf,
  CheckCircle2, Zap, XCircle,
} from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface JourneyProps {
  visits: number;
  zylaInteractions: number;
  requests: number;
  orders: number;
  traceabilityRate: number;
  co2Avoided: number;
  docsAvoided: number;
  aiEnabled: boolean;
  paperlessEnabled: boolean;
  ecoPackaging: boolean;
}

interface StageData {
  icon: React.ElementType;
  title: string;
  signal: string;
  metric: string | number;
  suffix?: string;
  status: 'completed' | 'active' | 'verified' | 'measured' | 'disabled';
  color: string;
  glowColor: string;
}

const statusConfig = {
  completed: { label: 'Completed', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  active: { label: 'Active', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', dot: 'bg-violet-500' },
  verified: { label: 'Verified', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
  measured: { label: 'Measured', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  disabled: { label: 'Disabled', bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-400', dot: 'bg-stone-300' },
};

export function ExecutiveJourneyCard(props: JourneyProps) {
  const { visits, zylaInteractions, requests, orders, traceabilityRate, co2Avoided, docsAvoided, aiEnabled, paperlessEnabled, ecoPackaging } = props;

  const stages: StageData[] = [
    { icon: Eye, title: 'Visita captada', signal: 'Sessions tracked', metric: visits, status: 'completed', color: 'from-blue-500 to-indigo-600', glowColor: 'rgba(99,102,241,0.4)' },
    { icon: MessageCircle, title: 'Zyla asesora', signal: aiEnabled ? 'Guided by AI' : 'AI inactive', metric: zylaInteractions, status: aiEnabled ? 'active' : 'disabled', color: 'from-violet-500 to-purple-600', glowColor: 'rgba(139,92,246,0.4)' },
    { icon: FileText, title: 'Solicitud digital', signal: paperlessEnabled ? 'Paperless flow' : 'Standard flow', metric: requests, status: 'completed', color: 'from-cyan-500 to-teal-600', glowColor: 'rgba(20,184,166,0.4)' },
    { icon: Shield, title: 'OTP verificado', signal: 'Securely validated', metric: 'Identity', suffix: ' ✓', status: 'verified', color: 'from-rose-500 to-pink-600', glowColor: 'rgba(244,63,94,0.4)' },
    { icon: ShoppingBag, title: 'Pedido generado', signal: 'Orders activated', metric: orders, status: 'completed', color: 'from-[#C4956A] to-[#8B6F5E]', glowColor: 'rgba(196,149,106,0.4)' },
    { icon: Layers, title: 'Trazabilidad', signal: 'End-to-end traceability', metric: traceabilityRate, suffix: '%', status: traceabilityRate === 100 ? 'verified' : 'active', color: 'from-amber-500 to-orange-600', glowColor: 'rgba(245,158,11,0.4)' },
    { icon: Leaf, title: 'Impacto medido', signal: ecoPackaging ? 'Sustainability measured' : 'Partial impact', metric: co2Avoided, suffix: ' kg CO₂', status: 'measured', color: 'from-emerald-500 to-green-600', glowColor: 'rgba(16,185,129,0.4)' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-white via-white to-stone-50/50 border border-stone-100/60 shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <motion.div className="p-1.5 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 shadow-sm"
            animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <Zap className="h-3.5 w-3.5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Live Journey Intelligence</h3>
            <p className="text-[9px] text-stone-400">Smart Commerce journey in motion</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          Active
        </div>
      </div>

      {/* Journey Steps */}
      <div className="space-y-1">
        {stages.map((stage, i) => {
          const cfg = statusConfig[stage.status];
          const isDisabled = stage.status === 'disabled';

          return (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: isDisabled ? 0.5 : 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              className="relative"
            >
              {/* Connector line */}
              {i < stages.length - 1 && (
                <div className={`absolute left-[18px] top-[36px] w-[2px] h-[12px] rounded-full ${isDisabled ? 'bg-stone-200' : 'bg-gradient-to-b ' + stage.color.replace('from-', 'from-').split(' ')[0] + '/20 to-transparent'}`} />
              )}

              <div className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${isDisabled ? 'bg-stone-50/50' : 'hover:bg-stone-50/80'}`}>
                {/* Icon with glow */}
                <motion.div
                  className={`relative flex-shrink-0 p-2 rounded-lg bg-gradient-to-br ${stage.color} shadow-sm`}
                  animate={isDisabled ? {} : { boxShadow: [`0 0 0px transparent`, `0 0 10px ${stage.glowColor}`, `0 0 0px transparent`] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                >
                  <stage.icon className="h-3.5 w-3.5 text-white" />
                  {/* Status indicator */}
                  {!isDisabled && (
                    <motion.div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                      style={{ backgroundColor: cfg.dot.replace('bg-', '') }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}>
                      <span className={`block w-full h-full rounded-full ${cfg.dot}`} />
                    </motion.div>
                  )}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-stone-800">{stage.title}</span>
                    <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.border} ${cfg.text} border`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-[9px] text-stone-400 mt-0.5">{stage.signal}</p>
                </div>

                {/* Metric */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-extrabold text-stone-900">
                    {typeof stage.metric === 'number' ? (
                      <AnimatedCounter value={stage.metric} />
                    ) : stage.metric}
                    <span className="text-[9px] text-stone-400 font-medium">{stage.suffix || ''}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer signals */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
        {[
          { label: 'AI Guided', active: aiEnabled, icon: MessageCircle },
          { label: 'Paperless', active: paperlessEnabled, icon: FileText },
          { label: 'Eco Pack', active: ecoPackaging, icon: Leaf },
        ].map((signal) => (
          <span key={signal.label} className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-1 rounded-full border ${
            signal.active
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-stone-50 text-stone-400 border-stone-200'
          }`}>
            {signal.active ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
            {signal.label}
          </span>
        ))}
      </div>
    </div>
  );
}
