'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, ShoppingBag, MessageCircle, Globe, ArrowRight, Leaf,
  FileText, Zap, Wind, Recycle, Shield, Users, Building2,
  Brain, Sparkles, CheckCircle2, BarChart3, TrendingUp,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/insights/AnimatedCounter';

// ── Simulation Logic ──────────────────────────────────────────────────────────

function calculateResults(visits: number, aiChats: number, campaign: string, aiActive: boolean, zeroPaper: boolean, ecoPackaging: boolean) {
  const campaignMultiplier = { normal: 1, alta: 1.4, lanzamiento: 1.8, temporada: 2.2 }[campaign] || 1;
  const aiBoost = aiActive ? 1.35 : 1;

  const conversionBase = 0.009 * campaignMultiplier * aiBoost;
  const orders = Math.round(visits * conversionBase);
  const conversionRate = Math.round(conversionBase * 1000) / 10;
  const co2Avoided = zeroPaper ? Math.round(visits * 0.12) : Math.round(visits * 0.04);
  const docsAvoided = zeroPaper ? Math.round(orders * 15) : 0;
  const traceability = aiActive ? 100 : 78;
  const smartCityScore = Math.min(100, Math.round(
    (zeroPaper ? 25 : 10) + (aiActive ? 25 : 12) + (ecoPackaging ? 20 : 8) + (traceability * 0.15) + (conversionRate * 2)
  ));

  return { orders, conversionRate, co2Avoided, docsAvoided, traceability, smartCityScore };
}

// ── Timeline Step ─────────────────────────────────────────────────────────────

function TimelineStep({ step, title, desc, icon: Icon, color, active }: {
  step: number; title: string; desc: string; icon: React.ElementType; color: string; active: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: active ? 1 : 0.4, x: 0 }}
      transition={{ delay: step * 0.1 }}
      className={`flex items-start gap-3 ${active ? '' : 'opacity-40'}`}
    >
      <div className="flex flex-col items-center">
        <motion.div className={`p-2 rounded-lg ${color} shadow-sm`}
          animate={active ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: step * 0.2 }}>
          <Icon className="h-3.5 w-3.5 text-white" />
        </motion.div>
        {step < 6 && <div className={`w-0.5 h-6 mt-1 rounded-full ${active ? 'bg-stone-200' : 'bg-stone-100'}`} />}
      </div>
      <div className="pt-0.5">
        <p className="text-xs font-bold text-stone-800">{title}</p>
        <p className="text-[10px] text-stone-400">{desc}</p>
      </div>
    </motion.div>
  );
}

// ── Main Demo Page ────────────────────────────────────────────────────────────

export default function InsightsDemoPage() {
  const [visits, setVisits] = useState(12000);
  const [aiChats, setAiChats] = useState(4200);
  const [campaign, setCampaign] = useState('normal');
  const [aiActive, setAiActive] = useState(true);
  const [zeroPaper, setZeroPaper] = useState(true);
  const [ecoPackaging, setEcoPackaging] = useState(true);

  const results = useMemo(() => calculateResults(visits, aiChats, campaign, aiActive, zeroPaper, ecoPackaging), [visits, aiChats, campaign, aiActive, zeroPaper, ecoPackaging]);

  const timelineSteps = [
    { title: 'Cliente visita tienda', desc: 'Acceso web/mobile', icon: Eye, color: 'bg-blue-500' },
    { title: 'Zyla asesora', desc: 'Chatbot IA 24/7', icon: MessageCircle, color: 'bg-violet-500' },
    { title: 'Solicitud validada', desc: 'Radicación digital', icon: FileText, color: 'bg-cyan-500' },
    { title: 'OTP confirmado', desc: 'Identidad verificada', icon: Shield, color: 'bg-rose-500' },
    { title: 'Pedido generado', desc: 'Checkout completo', icon: ShoppingBag, color: 'bg-[#C4956A]' },
    { title: 'Trazabilidad activada', desc: '100% rastreable', icon: Zap, color: 'bg-amber-500' },
    { title: 'Impacto registrado', desc: 'Sostenibilidad medida', icon: Leaf, color: 'bg-emerald-500' },
  ];

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#FAFAF9]">
      <div className="fixed inset-0 pointer-events-none opacity-[0.012]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C4956A 0.5px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-8 pb-6 lg:pt-10 lg:pb-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              <span className="text-xs font-semibold text-violet-700">Interactive Simulation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900">
              Smart Commerce <span className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">Operational Intelligence</span>
            </h1>
            <p className="mt-2 text-sm text-stone-500 max-w-2xl mx-auto">
              Simula cómo UrbanThread AI convierte interacciones digitales en trazabilidad, pedidos e impacto sostenible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ SIMULATION PANEL ═══ */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Controls */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-100/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
              <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> Panel de Simulación
              </h3>

              {/* Visits slider */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] text-stone-500 mb-1">
                  <span>Visitas</span><span className="font-bold text-stone-700">{visits.toLocaleString()}</span>
                </div>
                <input type="range" min="1000" max="100000" step="500" value={visits} onChange={(e) => setVisits(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-stone-200 accent-[#C4956A] cursor-pointer" />
              </div>

              {/* AI Chats slider */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] text-stone-500 mb-1">
                  <span>Interacciones Zyla</span><span className="font-bold text-stone-700">{aiChats.toLocaleString()}</span>
                </div>
                <input type="range" min="100" max="50000" step="100" value={aiChats} onChange={(e) => setAiChats(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-stone-200 accent-violet-500 cursor-pointer" />
              </div>

              {/* Campaign */}
              <div className="mb-4">
                <p className="text-[10px] text-stone-500 mb-1.5">Escenario</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[['normal', 'Normal'], ['alta', 'Alta demanda'], ['lanzamiento', 'Lanzamiento'], ['temporada', 'Temporada']].map(([key, label]) => (
                    <button key={key} onClick={() => setCampaign(key)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${campaign === key ? 'bg-[#C4956A] text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-3 border-t border-stone-100">
                {[
                  { label: 'Automatización IA activa', value: aiActive, set: setAiActive, color: 'bg-violet-500' },
                  { label: 'Operación cero papel', value: zeroPaper, set: setZeroPaper, color: 'bg-emerald-500' },
                  { label: 'Empaques reciclables', value: ecoPackaging, set: setEcoPackaging, color: 'bg-teal-500' },
                ].map((toggle) => (
                  <label key={toggle.label} className="flex items-center justify-between cursor-pointer">
                    <span className="text-[11px] text-stone-600">{toggle.label}</span>
                    <button onClick={() => toggle.set(!toggle.value)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${toggle.value ? toggle.color : 'bg-stone-200'}`}>
                      <motion.div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                        animate={{ left: toggle.value ? '18px' : '2px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                    </button>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Results */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-100/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
              <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-500" /> Resultados en Tiempo Real
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Pedidos Estimados', value: results.orders, icon: ShoppingBag, color: 'text-[#C4956A]', bg: 'bg-[#C4956A]/10' },
                  { label: 'Conversión', value: results.conversionRate, suffix: '%', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
                  { label: 'CO₂ Evitado', value: results.co2Avoided, suffix: ' kg', icon: Wind, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { label: 'Docs Evitados', value: results.docsAvoided, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { label: 'Trazabilidad', value: results.traceability, suffix: '%', icon: Shield, color: 'text-violet-500', bg: 'bg-violet-50' },
                  { label: 'Smart City Score', value: results.smartCityScore, suffix: '/100', icon: Globe, color: 'text-[#C4956A]', bg: 'bg-[#C4956A]/10' },
                ].map((r, i) => (
                  <motion.div key={r.label} className={`p-3 rounded-xl ${r.bg} text-center`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
                    <r.icon className={`h-4 w-4 ${r.color} mx-auto mb-1`} />
                    <p className="text-lg font-extrabold text-stone-900"><AnimatedCounter value={r.value} />{r.suffix || ''}</p>
                    <p className="text-[9px] text-stone-500 mt-0.5">{r.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-100/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
              <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-500" /> Timeline Operacional
              </h3>
              <div className="space-y-0">
                {timelineSteps.map((step, i) => (
                  <TimelineStep key={step.title} step={i} title={step.title} desc={step.desc} icon={step.icon} color={step.color} active={true} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ AI INSIGHT ═══ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="p-6 rounded-2xl bg-gradient-to-r from-violet-50/80 via-purple-50/50 to-indigo-50/30 border border-violet-100/50">
            <div className="flex items-start gap-3">
              <motion.div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md flex-shrink-0"
                animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                <Brain className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <p className="text-xs font-bold text-violet-800 mb-1">AI Executive Insight</p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  Con este escenario ({visits.toLocaleString()} visitas, {campaign === 'normal' ? 'operación normal' : campaign === 'alta' ? 'alta demanda' : campaign === 'lanzamiento' ? 'lanzamiento de colección' : 'temporada alta'}),
                  UrbanThread AI {aiActive ? 'maximiza la conversión mediante automatización IA' : 'opera con flujos manuales'},
                  {zeroPaper ? ' elimina completamente el uso de papel' : ' mantiene procesos mixtos'},
                  {ecoPackaging ? ' y garantiza empaques 100% reciclables' : ''}.
                  El resultado: <strong>{results.orders} pedidos estimados</strong>, <strong>{results.co2Avoided} kg de CO₂ evitados</strong> y un
                  <strong> Smart City Score de {results.smartCityScore}/100</strong> — fortaleciendo el indicador de sostenibilidad urbana.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CLOSING ═══ */}
      <section className="py-10 bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Building2 className="h-7 w-7 text-[#C4956A] mx-auto mb-3" />
            <h2 className="text-lg font-bold">UrbanThread AI transforms customer interactions into <span className="text-[#C4956A]">operational intelligence</span></h2>
            <p className="mt-2 text-white/50 text-xs max-w-md mx-auto">Smart Commerce powered by AI, automation and traceability — from retail experience to urban intelligence.</p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <a href="/insights" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#C4956A] text-white text-xs font-semibold hover:bg-[#D4A76A] transition-colors">
                View Live Dashboard <ArrowRight className="h-3 w-3" />
              </a>
              <a href="/" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-white/20 text-white/70 text-xs font-semibold hover:bg-white/10 transition-colors">
                Explore Platform
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
