'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, ShoppingBag, MessageCircle, Globe, ArrowRight, Leaf,
  FileText, Zap, Wind, Recycle, Shield, Building2,
  Brain, Sparkles, CheckCircle2, BarChart3, TrendingUp,
  Target, Activity, Layers,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/insights/AnimatedCounter';
import { ExecutiveFunnelChart } from '@/components/insights';
import { ExecutiveJourneyCard } from '@/components/insights/ExecutiveJourneyCard';
import { funnelByPeriod } from '@/components/insights/insightsData';

// ── Simulation Logic ──────────────────────────────────────────────────────────

function simulate(visits: number, campaign: string, ai: boolean, paper: boolean, eco: boolean) {
  const mult = { normal: 1, alta: 1.4, lanzamiento: 1.8, temporada: 2.2 }[campaign] || 1;
  const boost = ai ? 1.35 : 1;
  const rate = 0.009 * mult * boost;
  const orders = Math.round(visits * rate);
  return {
    orders,
    rate: Math.round(rate * 1000) / 10,
    co2: paper ? Math.round(visits * 0.12) : Math.round(visits * 0.04),
    docs: paper ? Math.round(orders * 15) : 0,
    trace: ai ? 100 : 78,
    score: Math.min(100, Math.round((paper ? 25 : 10) + (ai ? 25 : 12) + (eco ? 20 : 8) + (ai ? 15 : 8) + (rate * 200))),
  };
}

// ── Main Pitch Mode Page ──────────────────────────────────────────────────────

export default function InsightsDemoPage() {
  const [visits, setVisits] = useState(12000);
  const [campaign, setCampaign] = useState('normal');
  const [ai, setAi] = useState(true);
  const [paper, setPaper] = useState(true);
  const [eco, setEco] = useState(true);

  const r = useMemo(() => simulate(visits, campaign, ai, paper, eco), [visits, campaign, ai, paper, eco]);

  return (
    <main className="relative overflow-hidden min-h-screen bg-gradient-to-b from-[#FAFAF9] to-white">
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.2) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* ═══ PITCH HERO ═══ */}
      <section className="relative pt-8 pb-4 lg:pt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50/80 border border-violet-200/60 mb-4">
              <Target className="h-3 w-3 text-violet-500" />
              <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider">Pitch Mode</span>
              <span className="w-px h-3 bg-violet-200" />
              <span className="text-[10px] text-violet-500">Interactive Demo</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 leading-tight">
              Smart Commerce<br />
              <span className="bg-gradient-to-r from-[#C4956A] via-violet-500 to-emerald-500 bg-clip-text text-transparent">Operational Intelligence</span>
            </h1>
            <p className="mt-3 text-sm text-stone-500 max-w-xl mx-auto">
              Simula cómo UrbanThread AI convierte interacciones digitales en trazabilidad, pedidos e impacto sostenible para Smart Cities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ SIMULATION PANEL ═══ */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* Controls — 4 cols */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="lg:col-span-4 p-6 rounded-2xl bg-white border border-stone-100/60 shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-[#C4956A]" /> Simulation Controls
              </h3>
              {/* Visits */}
              <div className="mb-5">
                <div className="flex justify-between text-[10px] mb-1"><span className="text-stone-500">Visitas</span><span className="font-bold text-stone-800">{visits.toLocaleString()}</span></div>
                <input type="range" min="1000" max="100000" step="500" value={visits} onChange={(e) => setVisits(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-stone-200 accent-[#C4956A] cursor-pointer" />
              </div>
              {/* Campaign */}
              <div className="mb-5">
                <p className="text-[10px] text-stone-500 mb-2">Escenario</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[['normal', 'Normal'], ['alta', 'Alta demanda'], ['lanzamiento', 'Lanzamiento'], ['temporada', 'Temporada']].map(([k, l]) => (
                    <button key={k} onClick={() => setCampaign(k)}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${campaign === k ? 'bg-[#C4956A] text-white shadow-sm' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              {/* Toggles */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                {[
                  { label: 'Automatización IA', val: ai, set: setAi, c: 'bg-violet-500' },
                  { label: 'Operación Cero Papel', val: paper, set: setPaper, c: 'bg-emerald-500' },
                  { label: 'Empaques Reciclables', val: eco, set: setEco, c: 'bg-teal-500' },
                ].map((t) => (
                  <label key={t.label} className="flex items-center justify-between cursor-pointer">
                    <span className="text-[11px] text-stone-600 font-medium">{t.label}</span>
                    <button onClick={() => t.set(!t.val)} className={`relative w-9 h-5 rounded-full transition-colors ${t.val ? t.c : 'bg-stone-200'}`}>
                      <motion.div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" animate={{ left: t.val ? '18px' : '2px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                    </button>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Results — 5 cols */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className="lg:col-span-5 p-6 rounded-2xl bg-white border border-stone-100/60 shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5 text-emerald-500" /> Real-Time Results
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: ShoppingBag, label: 'Pedidos', value: r.orders, color: 'text-[#C4956A]', bg: 'bg-[#C4956A]/[0.06]' },
                  { icon: TrendingUp, label: 'Conversión', value: r.rate, suffix: '%', color: 'text-amber-500', bg: 'bg-amber-50/80' },
                  { icon: Wind, label: 'CO₂ Evitado', value: r.co2, suffix: ' kg', color: 'text-emerald-500', bg: 'bg-emerald-50/80' },
                  { icon: FileText, label: 'Docs Evitados', value: r.docs, color: 'text-blue-500', bg: 'bg-blue-50/80' },
                  { icon: Shield, label: 'Trazabilidad', value: r.trace, suffix: '%', color: 'text-violet-500', bg: 'bg-violet-50/80' },
                  { icon: Globe, label: 'Smart City', value: r.score, suffix: '/100', color: 'text-[#C4956A]', bg: 'bg-[#C4956A]/[0.06]' },
                ].map((m) => (
                  <div key={m.label} className={`p-3.5 rounded-xl ${m.bg} text-center`}>
                    <m.icon className={`h-4 w-4 ${m.color} mx-auto mb-1.5`} />
                    <p className="text-xl font-extrabold text-stone-900"><AnimatedCounter value={m.value} />{m.suffix || ''}</p>
                    <p className="text-[9px] text-stone-500 mt-0.5 font-medium">{m.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Journey Intelligence — 3 cols */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="lg:col-span-3">
              <ExecutiveJourneyCard
                visits={visits}
                zylaInteractions={Math.round(visits * 0.35)}
                requests={Math.round(r.orders * 0.52)}
                orders={r.orders}
                traceabilityRate={r.trace}
                co2Avoided={r.co2}
                docsAvoided={r.docs}
                aiEnabled={ai}
                paperlessEnabled={paper}
                ecoPackaging={eco}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ AI INSIGHT ═══ */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="p-5 rounded-2xl bg-gradient-to-r from-violet-50/60 via-indigo-50/30 to-purple-50/20 border border-violet-100/40">
            <div className="flex items-start gap-3">
              <motion.div className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md"
                animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                <Brain className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <p className="text-[11px] font-bold text-violet-800 uppercase tracking-wider mb-1">AI Executive Insight</p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  Con <strong>{visits.toLocaleString()} visitas</strong> en escenario {campaign === 'normal' ? 'normal' : campaign === 'alta' ? 'de alta demanda' : campaign === 'lanzamiento' ? 'de lanzamiento' : 'de temporada'},
                  UrbanThread AI genera <strong>{r.orders} pedidos</strong> ({r.rate}% conversión),
                  evita <strong>{r.co2.toLocaleString()} kg de CO₂</strong>{paper ? ' con operación 100% paperless' : ''},
                  y alcanza un <strong>Smart City Score de {r.score}/100</strong>.
                  {ai ? ' La automatización IA maximiza eficiencia operativa sin intervención humana.' : ''}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FUNNEL ═══ */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="p-6 rounded-2xl bg-white border border-stone-100/60 shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-[#C4956A]" />
              <h3 className="text-sm font-bold text-stone-900">Customer Journey Funnel</h3>
            </div>
            <ExecutiveFunnelChart data={funnelByPeriod['7d']} />
          </motion.div>
        </div>
      </section>

      {/* ═══ PITCH CLOSING ═══ */}
      <section className="py-12 bg-gradient-to-br from-[#1A1A1A] via-[#222] to-[#1A1A1A] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <motion.div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-[#C4956A] to-[#D4A76A] shadow-2xl mb-5"
              animate={{ boxShadow: ['0 8px 30px rgba(196,149,106,0.3)', '0 15px 50px rgba(196,149,106,0.5)', '0 8px 30px rgba(196,149,106,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              <Globe className="h-7 w-7 text-white" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight">
              UrbanThread AI transforms customer interactions<br />
              into <span className="text-[#C4956A]">operational intelligence</span>
            </h2>
            <p className="mt-3 text-white/50 text-sm max-w-lg mx-auto">
              Less paper, more traceability, smarter cities — Smart Commerce powered by AI, automation and sustainability.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-wider">
              {['AI-Powered', 'Zero Paper', 'Full Traceability', 'Automated Flows', 'Sustainable', 'Smart City Ready'].map((t) => (
                <span key={t} className="px-3 py-1 rounded-full border border-white/10 bg-white/5">{t}</span>
              ))}
            </div>
            <div className="mt-6">
              <a href="/insights" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C4956A] text-white font-semibold text-sm hover:bg-[#D4A76A] transition-colors shadow-lg">
                View Live Dashboard <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
