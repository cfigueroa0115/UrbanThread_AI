'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, Users, ShoppingBag, ClipboardList, Shield, MessageCircle,
  BarChart3, TrendingUp, Globe, ArrowRight, Leaf, FileText,
  Radio, Clock, MapPin, Zap, Recycle, TreePine, Wind, Building2,
  Brain, Sparkles,
} from 'lucide-react';
import {
  ExecutiveFunnelChart,
  ExecutiveSmartCityBlock,
  ExecutiveTrendChart,
  ExecutiveDonutChart,
} from '@/components/insights';
import { AnimatedCounter } from '@/components/insights/AnimatedCounter';
import { periodData, funnelByPeriod, aiRecommendations, channelDistribution, trendData, type PeriodData } from '@/components/insights/insightsData';

// ── Smart City Metric Card ────────────────────────────────────────────────────

function SmartCityMetricCard({ icon: Icon, label, value, suffix, desc, color, bg, delay }: {
  icon: React.ElementType; label: string; value: number; suffix?: string; desc: string; color: string; bg: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -3, scale: 1.02 }}
      className={`relative p-5 rounded-2xl ${bg} border border-white/60 text-center overflow-hidden group cursor-default`}
    >
      {/* Glow border */}
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `conic-gradient(from 0deg, transparent 40%, ${color.replace('text-', 'rgba(').replace('500', '0.3)')}, transparent 60%)`, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '1.5px' }}
        animate={{ rotate: [0, 360] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} />
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <Icon className={`h-6 w-6 ${color} mx-auto mb-2`} />
      </motion.div>
      <p className="text-2xl font-extrabold text-stone-900">
        <AnimatedCounter value={value} />{suffix}
      </p>
      <p className="text-[11px] font-bold text-stone-700 mt-1">{label}</p>
      <p className="text-[9px] text-stone-400 mt-0.5">{desc}</p>
    </motion.div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

function KPICard({ title, value, suffix, trend, description, source, icon: Icon, color, delay }: {
  title: string; value: number; suffix?: string; trend?: number; description: string; source: string; icon: React.ElementType; color: string; delay: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="relative p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-100/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group overflow-hidden"
    >
      <div className="relative flex items-start justify-between mb-2">
        <motion.div className={`p-2 rounded-xl bg-gradient-to-br ${color} shadow-sm`}
          animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}>
          <Icon className="h-4 w-4 text-white" />
        </motion.div>
        {trend !== undefined && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
            {trend >= 0 ? '↑' : '↓'}{Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-stone-900 leading-none">
        <AnimatedCounter value={value} /><span className="text-sm text-stone-400 ml-0.5">{suffix}</span>
      </p>
      <p className="text-xs font-semibold text-stone-700 mt-1.5">{title}</p>
      <p className="text-[10px] text-stone-400 mt-0.5 leading-snug">{description}</p>
      <p className="text-[8px] text-stone-300 mt-2 uppercase tracking-wider">{source}</p>
    </motion.div>
  );
}

// ── AI Recommendation Card ────────────────────────────────────────────────────

function AIRecommendationCard({ title, description, delay }: { title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-50/80 to-purple-50/50 border border-violet-100/50"
    >
      <motion.div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm"
        animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}>
        <Brain className="h-3.5 w-3.5 text-white" />
      </motion.div>
      <div>
        <p className="text-xs font-bold text-stone-800">{title}</p>
        <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const [period, setPeriod] = useState<string>('7d');
  const data: PeriodData = periodData[period];
  const funnel = funnelByPeriod[period];

  const handlePeriod = useCallback((p: string) => setPeriod(p), []);

  const periodLabels: Record<string, string> = { today: 'Hoy', '7d': '7 días', '30d': '30 días', month: 'Mes actual' };

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#FAFAF9]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.012]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C4956A 0.5px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* ═══ COMPACT HERO ═══ */}
      <section className="relative pt-6 pb-3 lg:pt-8 lg:pb-4">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                UrbanThread <span className="bg-gradient-to-r from-[#C4956A] to-[#8B6F5E] bg-clip-text text-transparent">Executive Insights</span>
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">Operational intelligence in action — AI, automation and traceability powering Smart Commerce for intelligent cities.</p>
            </div>
            <a href="/insights/demo" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-[#C4956A] transition-colors">
              <Sparkles className="h-3 w-3" /> Interactive Demo
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ CONTROL BAR ═══ */}
      <section className="sticky top-[80px] z-30 py-2.5 bg-white/80 backdrop-blur-md border-y border-stone-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-stone-100/80">
              {Object.entries(periodLabels).map(([key, label]) => (
                <button key={key} onClick={() => handlePeriod(key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${period === key ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-stone-400">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Bogotá</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <Radio className="h-3 w-3" /> Live
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SMART CITY METRICS — FIRST ═══ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="h-5 w-5 text-[#C4956A]" />
            <h2 className="text-lg font-bold text-stone-900">Smart City <span className="text-[#C4956A]">Impact</span></h2>
            <span className="text-[9px] text-stone-400 ml-2 uppercase tracking-wider">{periodLabels[period]}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={period + '-sc'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <SmartCityMetricCard icon={FileText} label="Cero Papel" value={data.ceroPapel} suffix="%" desc="Operación digital" color="text-blue-500" bg="bg-blue-50/80" delay={0} />
              <SmartCityMetricCard icon={Wind} label="CO₂ Evitado" value={data.co2} suffix=" kg" desc="Estimado periodo" color="text-emerald-500" bg="bg-emerald-50/80" delay={0.05} />
              <SmartCityMetricCard icon={BarChart3} label="Trazabilidad" value={data.trazabilidad} suffix="%" desc="Digital completa" color="text-violet-500" bg="bg-violet-50/80" delay={0.1} />
              <SmartCityMetricCard icon={Zap} label="Automatización IA" value={data.automatizacion} suffix="" desc="Procesos activos" color="text-amber-500" bg="bg-amber-50/80" delay={0.15} />
              <SmartCityMetricCard icon={Recycle} label="Empaques" value={data.empaques} suffix="%" desc="Reciclables" color="text-teal-500" bg="bg-teal-50/80" delay={0.2} />
              <SmartCityMetricCard icon={Globe} label="Smart City Score" value={data.smartCityScore} suffix="/100" desc="Readiness Index" color="text-[#C4956A]" bg="bg-[#C4956A]/[0.08]" delay={0.25} />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ OPERATIONAL KPIs ═══ */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-stone-900">Operational <span className="text-emerald-600">Intelligence</span></h2>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={period + '-kpi'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KPICard title="Visitas" value={data.visitas} trend={data.growthVisits} description="Tráfico total plataforma" source="Analytics · Periodo" icon={Eye} color="from-blue-500 to-indigo-600" delay={0} />
              <KPICard title="Interacciones Zyla" value={data.aiChats} trend={data.growthAI} description="Conversaciones con agente IA" source="Chatbot Gemini 2.0" icon={MessageCircle} color="from-violet-500 to-purple-600" delay={0.05} />
              <KPICard title="Solicitudes" value={data.solicitudes} trend={8.3} description="Radicaciones digitales" source="Radicación · Paperless" icon={ClipboardList} color="from-cyan-500 to-teal-600" delay={0.1} />
              <KPICard title="OTP Exitosos" value={data.otpExitosos} trend={15.2} description="Autenticaciones seguras" source="Identity · OTP" icon={Shield} color="from-rose-500 to-pink-600" delay={0.15} />
              <KPICard title="Pedidos" value={data.orders} trend={data.growthOrders} description="Órdenes completadas" source="Commerce · Checkout" icon={ShoppingBag} color="from-[#C4956A] to-[#8B6F5E]" delay={0.2} />
              <KPICard title="Tasa de Conversión" value={data.conversionRate} suffix="%" description="Pedidos / Visitas" source="Funnel · Ratio real" icon={TrendingUp} color="from-amber-500 to-orange-600" delay={0.25} />
              <KPICard title="Clientes Activos" value={data.clients} trend={5.8} description="Registrados y verificados" source="Base de datos · Neon" icon={Users} color="from-emerald-500 to-green-600" delay={0.3} />
              <KPICard title="Impacto Sostenible" value={data.co2} suffix=" kg CO₂" description="Emisiones evitadas" source="Sustainability · Green" icon={Leaf} color="from-green-500 to-emerald-600" delay={0.35} />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ CHARTS ═══ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-100/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
              <h3 className="text-sm font-bold text-stone-900 mb-0.5">Commercial Funnel</h3>
              <p className="text-[10px] text-stone-400 mb-4">Visitas → Zyla → Solicitudes → Pedidos · {periodLabels[period]}</p>
              <ExecutiveFunnelChart data={funnel} />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-100/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
              <h3 className="text-sm font-bold text-stone-900 mb-0.5">Growth Trajectory</h3>
              <p className="text-[10px] text-stone-400 mb-4">Monthly visits & conversions</p>
              <ExecutiveTrendChart data={trendData} />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-100/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
              <h3 className="text-sm font-bold text-stone-900 mb-0.5">Omnichannel Distribution</h3>
              <p className="text-[10px] text-stone-400 mb-4">Customer interaction channels</p>
              <ExecutiveDonutChart data={channelDistribution} title="Channels" />
            </motion.div>

            {/* AI Recommendations */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-100/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-4 w-4 text-violet-500" />
                <h3 className="text-sm font-bold text-stone-900">AI Executive Recommendations</h3>
              </div>
              <div className="space-y-2.5">
                {aiRecommendations.map((rec, i) => (
                  <AIRecommendationCard key={rec.title} title={rec.title} description={rec.description} delay={i * 0.08} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SMART CITY DEEP DIVE ═══ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ExecutiveSmartCityBlock readinessIndex={data.smartCityScore} pillars={[
            { name: 'Servicios Digitales', score: 95, description: 'Portal 100% digital, OTP, chatbot 24/7' },
            { name: 'Eficiencia Operativa', score: 88, description: 'Automatización n8n, flujos inteligentes' },
            { name: 'Experiencia Ciudadana', score: 91, description: 'UX premium, accesibilidad, omnicanal' },
            { name: 'Sostenibilidad', score: data.empaques, description: 'Cero papel, empaques reciclables' },
            { name: 'Trazabilidad', score: data.trazabilidad, description: 'Cada interacción documentada' },
            { name: 'Inclusión Digital', score: 87, description: 'Responsive, voz, múltiples canales' },
          ]} />
        </div>
      </section>

      {/* ═══ CLOSING ═══ */}
      <section className="py-10 bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Globe className="h-8 w-8 text-[#C4956A] mx-auto mb-3" />
            <h2 className="text-lg sm:text-xl font-bold">From retail experience to <span className="text-[#C4956A]">urban intelligence</span></h2>
            <p className="mt-2 text-white/50 max-w-lg mx-auto text-xs">Smart Commerce powered by AI, automation and traceability for smarter, more sustainable cities.</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[9px] font-semibold text-white/30">
              {['AI-Powered', 'Zero Paper', 'Full Traceability', 'Automated', 'Sustainable', 'Smart City Ready'].map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-full border border-white/10 bg-white/5">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
