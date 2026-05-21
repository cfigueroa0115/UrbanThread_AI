'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, Users, ShoppingBag, ClipboardList, Shield, MessageCircle,
  BarChart3, TrendingUp, Globe, ArrowRight, Leaf, FileText,
  Radio, Clock, MapPin, Zap, Recycle, TreePine, Wind, Building2,
  Brain, Sparkles, Activity, Target, Layers,
} from 'lucide-react';
import {
  ExecutiveFunnelChart,
  ExecutiveSmartCityBlock,
  ExecutiveTrendChart,
  ExecutiveDonutChart,
} from '@/components/insights';
import { AnimatedCounter } from '@/components/insights/AnimatedCounter';
import { periodData, funnelByPeriod, aiRecommendations, channelDistribution, trendData, type PeriodData } from '@/components/insights/insightsData';

// ── Command Center KPI Card ───────────────────────────────────────────────────

function CommandKPI({ title, value, suffix, trend, desc, source, icon: Icon, gradient, delay }: {
  title: string; value: number; suffix?: string; trend?: number; desc: string; source: string;
  icon: React.ElementType; gradient: string; delay: number;
}) {
  // Extract glow color from gradient
  const glowMap: Record<string, string> = {
    'from-blue-500 to-indigo-600': 'rgba(99,102,241,0.4)',
    'from-violet-500 to-purple-600': 'rgba(139,92,246,0.4)',
    'from-cyan-500 to-teal-600': 'rgba(20,184,166,0.4)',
    'from-rose-500 to-pink-600': 'rgba(244,63,94,0.4)',
    'from-[#C4956A] to-[#8B6F5E]': 'rgba(196,149,106,0.4)',
    'from-amber-500 to-orange-600': 'rgba(245,158,11,0.4)',
    'from-emerald-500 to-green-600': 'rgba(16,185,129,0.4)',
    'from-indigo-500 to-blue-600': 'rgba(99,102,241,0.4)',
    'from-green-500 to-emerald-600': 'rgba(34,197,94,0.4)',
  };
  const glow = glowMap[gradient] || 'rgba(196,149,106,0.3)';

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: [0, -4, 0] }}
      transition={{ opacity: { delay, duration: 0.35 }, y: { duration: 4 + delay * 2, repeat: Infinity, ease: 'easeInOut', delay: delay * 3 } }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="relative p-5 rounded-2xl bg-white border border-stone-100/60 shadow-[0_1px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300 group overflow-hidden">
      {/* Animated top glow line */}
      <motion.div className={`absolute top-0 left-4 right-4 h-[2.5px] rounded-full bg-gradient-to-r ${gradient}`}
        animate={{ opacity: [0.5, 1, 0.5], scaleX: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: delay * 2 }} />
      {/* Permanent rotating border glow */}
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `conic-gradient(from 0deg, transparent 60%, ${glow} 75%, transparent 90%)`, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '1.5px' }}
        animate={{ rotate: [0, 360], opacity: [0.3, 0.6, 0.3] }}
        transition={{ rotate: { duration: 6 + delay, repeat: Infinity, ease: 'linear' }, opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }} />
      {/* Background glow pulse */}
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 20%, ${glow.replace('0.4', '0.06')}, transparent 60%)` }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay }} />
      {/* Shimmer sweep */}
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
        <motion.div className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)' }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 + delay * 2 }} />
      </motion.div>
      <div className="relative flex items-start justify-between mb-3">
        <motion.div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}
          animate={{ scale: [1, 1.1, 1], boxShadow: [`0 2px 8px ${glow.replace('0.4', '0.2')}`, `0 4px 16px ${glow}`, `0 2px 8px ${glow.replace('0.4', '0.2')}`] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}>
          <Icon className="h-4 w-4 text-white" />
        </motion.div>
        {trend !== undefined && (
          <motion.span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? 'text-emerald-700 bg-emerald-50/80' : 'text-red-600 bg-red-50/80'}`}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.5 }}>
            {trend >= 0 ? '↑' : '↓'}{Math.abs(trend)}%
          </motion.span>
        )}
      </div>
      <p className="relative text-[26px] font-extrabold text-stone-900 leading-none tracking-tight">
        <AnimatedCounter value={value} /><span className="text-sm text-stone-400 ml-0.5 font-semibold">{suffix}</span>
      </p>
      <p className="relative text-[11px] font-bold text-stone-700 mt-2">{title}</p>
      <p className="relative text-[9px] text-stone-400 mt-0.5 leading-snug">{desc}</p>
      <p className="relative text-[8px] text-stone-300 mt-2 uppercase tracking-widest font-medium">{source}</p>
    </motion.div>
  );
}

// ── Smart City Impact Card ────────────────────────────────────────────────────

function SmartCityCard({ icon: Icon, label, value, suffix, desc, color, delay }: {
  icon: React.ElementType; label: string; value: number; suffix?: string; desc: string; color: string; delay: number;
}) {
  const bgMap: Record<string, string> = {
    'text-blue-500': 'bg-blue-500/[0.06] border-blue-100/60',
    'text-emerald-500': 'bg-emerald-500/[0.06] border-emerald-100/60',
    'text-violet-500': 'bg-violet-500/[0.06] border-violet-100/60',
    'text-amber-500': 'bg-amber-500/[0.06] border-amber-100/60',
    'text-teal-500': 'bg-teal-500/[0.06] border-teal-100/60',
    'text-[#C4956A]': 'bg-[#C4956A]/[0.06] border-[#C4956A]/20',
  };
  const glowMap: Record<string, string> = {
    'text-blue-500': 'rgba(59,130,246,0.4)',
    'text-emerald-500': 'rgba(16,185,129,0.4)',
    'text-violet-500': 'rgba(139,92,246,0.4)',
    'text-amber-500': 'rgba(245,158,11,0.4)',
    'text-teal-500': 'rgba(20,184,166,0.4)',
    'text-[#C4956A]': 'rgba(196,149,106,0.4)',
  };
  const glow = glowMap[color] || 'rgba(196,149,106,0.3)';

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
      transition={{ opacity: { delay, duration: 0.35 }, scale: { delay, duration: 0.35 }, y: { duration: 4.5 + delay * 3, repeat: Infinity, ease: 'easeInOut', delay: delay * 4 } }}
      whileHover={{ y: -6, scale: 1.04 }}
      className={`relative p-5 rounded-2xl border ${bgMap[color] || 'bg-stone-50 border-stone-100'} text-center group cursor-default overflow-hidden`}>
      {/* Permanent rotating border */}
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `conic-gradient(from 0deg, transparent 50%, ${glow} 70%, transparent 90%)`, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '1.5px' }}
        animate={{ rotate: [0, 360], opacity: [0.2, 0.5, 0.2] }}
        transition={{ rotate: { duration: 5 + delay * 2, repeat: Infinity, ease: 'linear' }, opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }} />
      {/* Permanent shimmer */}
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
        <motion.div className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.5) 50%, transparent 65%)' }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 + delay * 3 }} />
      </motion.div>
      {/* Background glow */}
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 30%, ${glow.replace('0.4', '0.08')}, transparent 60%)` }}
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.95, 1.02, 0.95] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay }} />
      {/* Icon with breathing + glow */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], filter: [`drop-shadow(0 0 0px ${glow})`, `drop-shadow(0 0 8px ${glow})`, `drop-shadow(0 0 0px ${glow})`] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}>
        <Icon className={`relative h-7 w-7 ${color} mx-auto mb-2.5`} />
      </motion.div>
      <p className="relative text-2xl font-extrabold text-stone-900"><AnimatedCounter value={value} />{suffix}</p>
      <p className="relative text-[11px] font-bold text-stone-700 mt-1.5">{label}</p>
      <p className="relative text-[9px] text-stone-400 mt-0.5">{desc}</p>
    </motion.div>
  );
}

// ── AI Recommendation Card ────────────────────────────────────────────────────

function AIInsightCard({ title, description, delay }: { title: string; description: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
      transition={{ delay }} whileHover={{ x: 2 }}
      className="flex gap-3.5 p-4 rounded-xl bg-gradient-to-r from-violet-50/60 to-indigo-50/30 border border-violet-100/40 hover:border-violet-200/60 transition-all duration-300">
      <motion.div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-sm"
        animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay }}>
        <Brain className="h-3.5 w-3.5 text-white" />
      </motion.div>
      <div>
        <p className="text-[11px] font-bold text-stone-800">{title}</p>
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
  const periodLabels: Record<string, string> = { today: 'Hoy', '7d': '7 días', '30d': '30 días', month: 'Mes' };

  return (
    <main className="relative overflow-hidden min-h-screen bg-gradient-to-b from-[#FAFAF9] via-white to-[#FAFAF9]">
      {/* Subtle grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.018]" style={{ backgroundImage: 'linear-gradient(rgba(196,149,106,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(196,149,106,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* ═══ COMMAND CENTER HERO ═══ */}
      <section className="relative pt-6 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <motion.div className="p-2 rounded-xl bg-gradient-to-br from-[#C4956A] to-[#8B6F5E] shadow-md"
                  animate={{ boxShadow: ['0 4px 12px rgba(196,149,106,0.2)', '0 6px 20px rgba(196,149,106,0.4)', '0 4px 12px rgba(196,149,106,0.2)'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  <Activity className="h-4 w-4 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">
                    UrbanThread <span className="bg-gradient-to-r from-[#C4956A] to-[#8B6F5E] bg-clip-text text-transparent">Executive Insights</span>
                  </h1>
                  <p className="text-[11px] text-stone-400 mt-0.5">Operational intelligence for Smart Commerce · From retail activity to urban intelligence</p>
                </div>
              </div>
            </div>
            <a href="/insights/demo" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#C4956A]/30 text-[#8B6F5E] text-[11px] font-semibold hover:bg-[#C4956A]/5 transition-colors">
              <Target className="h-3 w-3" /> Pitch Mode
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ CONTROL BAR ═══ */}
      <section className="sticky top-[80px] z-30 py-2 bg-white/85 backdrop-blur-lg border-y border-stone-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-stone-100/70">
              {Object.entries(periodLabels).map(([key, label]) => (
                <button key={key} onClick={() => handlePeriod(key)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-200 ${period === key ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[10px] text-stone-400">
              <span className="hidden sm:flex items-center gap-1"><MapPin className="h-3 w-3" />Bogotá, CO</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/80 text-emerald-700 font-bold border border-emerald-200/60">
                <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                <Radio className="h-2.5 w-2.5" /> Live
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SMART CITY IMPACT — PRIMARY SECTION ═══ */}
      <section className="py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-[#C4956A]" />
            <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wide">Smart City Impact</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#C4956A]/20 to-transparent ml-2" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={period + '-sc'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <SmartCityCard icon={FileText} label="Operación Cero Papel" value={data.ceroPapel} suffix="%" desc="100% digital" color="text-blue-500" delay={0} />
              <SmartCityCard icon={Wind} label="CO₂ Evitado" value={data.co2} suffix=" kg" desc="Periodo actual" color="text-emerald-500" delay={0.04} />
              <SmartCityCard icon={Layers} label="Trazabilidad Digital" value={data.trazabilidad} suffix="%" desc="Transacciones rastreables" color="text-violet-500" delay={0.08} />
              <SmartCityCard icon={Zap} label="Automatización IA" value={data.automatizacion} suffix=" procesos" desc="Flujos activos" color="text-amber-500" delay={0.12} />
              <SmartCityCard icon={Recycle} label="Empaques Reciclables" value={data.empaques} suffix="%" desc="Cadena sostenible" color="text-teal-500" delay={0.16} />
              <SmartCityCard icon={Building2} label="Smart City Score" value={data.smartCityScore} suffix="/100" desc="Readiness Index" color="text-[#C4956A]" delay={0.2} />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ OPERATIONAL INTELLIGENCE KPIs ═══ */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wide">Operational Intelligence</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/20 to-transparent ml-2" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={period + '-kpi'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <CommandKPI title="Visitas" value={data.visitas} trend={data.growthVisits} desc="Tráfico total plataforma" source="Analytics" icon={Eye} gradient="from-blue-500 to-indigo-600" delay={0} />
              <CommandKPI title="Interacciones Zyla" value={data.aiChats} trend={data.growthAI} desc="Conversaciones agente IA" source="Gemini 2.0 Flash" icon={MessageCircle} gradient="from-violet-500 to-purple-600" delay={0.04} />
              <CommandKPI title="Solicitudes" value={data.solicitudes} trend={8.3} desc="Radicaciones paperless" source="Radicación Digital" icon={ClipboardList} gradient="from-cyan-500 to-teal-600" delay={0.08} />
              <CommandKPI title="OTP Exitosos" value={data.otpExitosos} trend={15.2} desc="Autenticaciones seguras" source="Identity Layer" icon={Shield} gradient="from-rose-500 to-pink-600" delay={0.12} />
              <CommandKPI title="Pedidos" value={data.orders} trend={data.growthOrders} desc="Órdenes completadas" source="Commerce Engine" icon={ShoppingBag} gradient="from-[#C4956A] to-[#8B6F5E]" delay={0.16} />
              <CommandKPI title="Conversión" value={data.conversionRate} suffix="%" desc="Pedidos / Visitas" source="Funnel Ratio" icon={TrendingUp} gradient="from-amber-500 to-orange-600" delay={0.2} />
              <CommandKPI title="Clientes Activos" value={data.clients} trend={5.8} desc="Verificados en plataforma" source="Neon PostgreSQL" icon={Users} gradient="from-emerald-500 to-green-600" delay={0.24} />
              <CommandKPI title="Flujos Automatizados" value={data.automatizacion} desc="Procesos sin intervención" source="n8n + IA" icon={Sparkles} gradient="from-indigo-500 to-blue-600" delay={0.28} />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ CHARTS: FUNNEL + TREND ═══ */}
      <section className="py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white border border-stone-100/60 shadow-[0_1px_12px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-3.5 w-3.5 text-[#C4956A]" />
                <h3 className="text-sm font-bold text-stone-900">Customer Journey Funnel</h3>
              </div>
              <p className="text-[9px] text-stone-400 mb-5">Visitas → Zyla → Solicitudes → Pedidos · {periodLabels[period]}</p>
              <ExecutiveFunnelChart data={funnel} />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white border border-stone-100/60 shadow-[0_1px_12px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <h3 className="text-sm font-bold text-stone-900">Growth Trajectory</h3>
              </div>
              <p className="text-[9px] text-stone-400 mb-5">Monthly acceleration · Visits & Conversions</p>
              <ExecutiveTrendChart data={trendData} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SUSTAINABILITY & PAPERLESS + CHANNELS ═══ */}
      <section className="py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wide">Sustainability & Paperless Operations</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/20 to-transparent ml-2" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Sustainability metrics */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/20 border border-emerald-100/40">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: TreePine, label: 'Hojas Ahorradas', value: `${(data.solicitudes * 15).toLocaleString()}`, color: 'text-emerald-600' },
                  { icon: Wind, label: 'CO₂ Evitado', value: `${data.co2.toLocaleString()} kg`, color: 'text-teal-600' },
                  { icon: FileText, label: 'Procesos Digitales', value: `${data.automatizacion}`, color: 'text-blue-600' },
                  { icon: Recycle, label: 'Empaques Eco', value: `${data.empaques}%`, color: 'text-amber-600' },
                ].map((m, i) => (
                  <div key={m.label} className="p-3 rounded-xl bg-white/80 border border-stone-100/50">
                    <m.icon className={`h-4 w-4 ${m.color} mb-1.5`} />
                    <p className="text-lg font-extrabold text-stone-900">{m.value}</p>
                    <p className="text-[9px] text-stone-500">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold text-stone-600">Low-Carbon Operations Score</span>
                  <span className="text-[10px] font-bold text-emerald-600">{Math.round(data.smartCityScore * 0.92)}/100</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                    initial={{ width: 0 }} whileInView={{ width: `${data.smartCityScore * 0.92}%` }} viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }} />
                </div>
              </div>
            </motion.div>
            {/* Channel distribution */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white border border-stone-100/60 shadow-[0_1px_12px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-1">
                <Layers className="h-3.5 w-3.5 text-violet-500" />
                <h3 className="text-sm font-bold text-stone-900">Omnichannel Distribution</h3>
              </div>
              <p className="text-[9px] text-stone-400 mb-5">Interaction channels breakdown</p>
              <ExecutiveDonutChart data={channelDistribution} title="Channels" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ AI EXECUTIVE RECOMMENDATIONS ═══ */}
      <section className="py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-4 w-4 text-violet-500" />
            <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wide">AI Executive Recommendations</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-500/20 to-transparent ml-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {aiRecommendations.map((rec, i) => (
              <AIInsightCard key={rec.title} title={rec.title} description={rec.description} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SMART CITY DEEP DIVE ═══ */}
      <section className="py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-4 w-4 text-[#C4956A]" />
            <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wide">Smart City Contribution</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#C4956A]/20 to-transparent ml-2" />
          </div>
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

      {/* ═══ EXECUTIVE HIGHLIGHTS ═══ */}
      <section className="py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wide">Executive Highlights</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-500/20 to-transparent ml-2" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Brain, title: 'Smart Commerce', desc: 'Data → Decisions', color: 'from-[#C4956A] to-[#8B6F5E]' },
              { icon: Zap, title: 'AI + Automation', desc: 'Gemini · n8n · OTP', color: 'from-violet-500 to-indigo-600' },
              { icon: Shield, title: 'Digital Identity', desc: 'Secure verification', color: 'from-blue-500 to-cyan-600' },
              { icon: Eye, title: 'Full Traceability', desc: '100% documented', color: 'from-teal-500 to-emerald-600' },
              { icon: Leaf, title: 'Sustainability', desc: 'Zero paper · Green ops', color: 'from-emerald-500 to-green-600' },
              { icon: FileText, title: 'Paperless Ops', desc: 'Digital-first always', color: 'from-amber-500 to-orange-600' },
              { icon: BarChart3, title: 'Intelligence', desc: 'Real-time metrics', color: 'from-rose-500 to-pink-600' },
              { icon: Globe, title: 'Smart Cities', desc: 'Urban service layer', color: 'from-indigo-500 to-blue-600' },
            ].map((h, i) => (
              <motion.div key={h.title} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.04 }} whileHover={{ y: -2 }}
                className="p-4 rounded-xl bg-white border border-stone-100/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)] text-center hover:shadow-md transition-all duration-300">
                <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${h.color} shadow-sm mb-2`}>
                  <h.icon className="h-4 w-4 text-white" />
                </div>
                <p className="text-[11px] font-bold text-stone-800">{h.title}</p>
                <p className="text-[9px] text-stone-400 mt-0.5">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CLOSING ═══ */}
      <section className="py-10 bg-gradient-to-br from-[#1A1A1A] via-[#222] to-[#1A1A1A] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <motion.div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-[#C4956A] to-[#D4A76A] shadow-xl mb-4"
              animate={{ boxShadow: ['0 8px 25px rgba(196,149,106,0.3)', '0 12px 40px rgba(196,149,106,0.5)', '0 8px 25px rgba(196,149,106,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              <Globe className="h-6 w-6 text-white" />
            </motion.div>
            <h2 className="text-base sm:text-lg font-bold">From retail experience to <span className="text-[#C4956A]">urban intelligence</span></h2>
            <p className="mt-2 text-white/40 text-xs max-w-md mx-auto">UrbanThread AI transforms customer interactions into operational intelligence — Smart Commerce for smarter cities.</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-[8px] font-semibold text-white/25">
              {['AI-Powered', 'Zero Paper', 'Traceability', 'Automated', 'Sustainable', 'Smart City'].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-full border border-white/10">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
