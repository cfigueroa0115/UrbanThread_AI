'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Users, ShoppingBag, ClipboardList, Shield, MessageCircle,
  BarChart3, TrendingUp, Globe, ArrowRight, Leaf, FileText,
  Radio, Clock, MapPin, Zap, Recycle, TreePine, Wind, Building2,
} from 'lucide-react';
import {
  ExecutiveFunnelChart,
  ExecutiveHighlightCards,
  ExecutiveSustainabilityBlock,
  ExecutiveSmartCityBlock,
  ExecutiveTrendChart,
  ExecutiveDonutChart,
  ExecutiveBarChart,
} from '@/components/insights';

interface InsightsData {
  summary: Record<string, number | string>;
  funnel: Array<{ stage: string; count: number; percentage: number }>;
  charts: { monthlyTrend: Array<{ month: string; visits: number; conversions: number; orders: number }>; channelDistribution: Array<{ channel: string; value: number }>; requestTypes: Array<{ type: string; count: number }> };
  sustainability: Record<string, number>;
  smartCity: { readinessIndex: number; pillars: Array<{ name: string; score: number; description: string }> };
  highlights: Array<{ key: string; title: string; description: string; icon: string }>;
}

// ── KPI Card Component (inline, premium glassmorphism) ────────────────────────

interface KPICardProps {
  title: string;
  value: string | number;
  suffix?: string;
  trend?: number;
  description: string;
  source: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  delay?: number;
}

function KPICard({ title, value, suffix = '', trend, description, source, icon, color, glowColor, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="relative p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group overflow-hidden"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 70%)` }} />

      <div className="relative flex items-start justify-between mb-3">
        <motion.div
          className={`p-2.5 rounded-xl bg-gradient-to-br ${color} shadow-md`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay }}
        >
          {icon}
        </motion.div>
        {trend !== undefined && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <p className="relative text-2xl sm:text-3xl font-extrabold text-stone-900 leading-none">
        {value}<span className="text-base text-stone-400 ml-0.5">{suffix}</span>
      </p>
      <p className="relative text-sm font-semibold text-stone-700 mt-1.5">{title}</p>
      <p className="relative text-[11px] text-stone-400 mt-1 leading-snug">{description}</p>
      <p className="relative text-[9px] text-stone-300 mt-2 uppercase tracking-wider font-medium">{source}</p>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [mode, setMode] = useState<'live' | 'demo'>('live');
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    fetch('/api/v1/public/insights')
      .then(r => r.json())
      .then(res => {
        setData(res.data);
        setMode(res.mode);
        setLastUpdate(new Date(res.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-10 h-10 border-[3px] border-[#C4956A] border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-sm text-stone-400 font-medium">Loading intelligence...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const s = data.summary;
  // Correct conversion rate: orders / visits * 100
  const realConversionRate = Number(s.totalVisits) > 0
    ? Math.round((Number(s.totalOrders) / Number(s.totalVisits)) * 1000) / 10
    : Number(s.conversionRate);

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#FAFAF9]">
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{ zIndex: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, #C4956A 0.5px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* ═══ COMPACT HERO ═══ */}
      <section className="relative pt-8 pb-4 lg:pt-10 lg:pb-6">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                UrbanThread <span className="bg-gradient-to-r from-[#C4956A] to-[#8B6F5E] bg-clip-text text-transparent">Executive Insights</span>
              </h1>
              <p className="mt-1 text-sm text-stone-400 max-w-xl">
                Operational intelligence in action — AI, automation and traceability powering Smart Commerce decisions for intelligent cities.
              </p>
            </div>
            <a href="/insights/demo" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-[#C4956A] transition-colors">
              Pitch Mode <ArrowRight className="h-3 w-3" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ CONTROL BAR ═══ */}
      <section className="sticky top-[80px] z-30 py-3 bg-white/80 backdrop-blur-md border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Period selector */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-stone-100/80">
              {[
                { key: 'today', label: 'Hoy' },
                { key: '7d', label: '7 días' },
                { key: '30d', label: '30 días' },
                { key: 'month', label: 'Mes' },
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                    period === p.key
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <MapPin className="h-3 w-3" />
                <span className="font-medium">Colombia</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <Clock className="h-3 w-3" />
                <span>{lastUpdate || '--:--'}</span>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                mode === 'live' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#C4956A]/10 text-[#8B6F5E] border border-[#C4956A]/20'
              }`}>
                <motion.div
                  className={`w-1.5 h-1.5 rounded-full ${mode === 'live' ? 'bg-emerald-500' : 'bg-[#C4956A]'}`}
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <Radio className="h-3 w-3" />
                {mode === 'live' ? 'Live Data' : 'Demo'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ KPI GRID — Funnel order ═══ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Visitas"
              value={Number(s.totalVisits).toLocaleString()}
              trend={Number(s.growthVsPrevious)}
              description="Tráfico total a la plataforma"
              source="Analytics · Último periodo"
              icon={<Eye className="h-4 w-4 text-white" />}
              color="from-blue-500 to-indigo-600"
              glowColor="rgba(99,102,241,0.08)"
              delay={0}
            />
            <KPICard
              title="Interacciones Zyla"
              value={Number(s.zylaInteractions).toLocaleString()}
              trend={34.7}
              description="Conversaciones con el agente IA"
              source="Chatbot Gemini 2.0 · Acumulado"
              icon={<MessageCircle className="h-4 w-4 text-white" />}
              color="from-violet-500 to-purple-600"
              glowColor="rgba(139,92,246,0.08)"
              delay={0.05}
            />
            <KPICard
              title="Solicitudes"
              value={Number(s.totalRequests).toLocaleString()}
              trend={8.3}
              description="Radicaciones digitales procesadas"
              source="Radicación · Paperless"
              icon={<ClipboardList className="h-4 w-4 text-white" />}
              color="from-cyan-500 to-teal-600"
              glowColor="rgba(20,184,166,0.08)"
              delay={0.1}
            />
            <KPICard
              title="OTP Exitosos"
              value={Number(s.otpSuccessCount).toLocaleString()}
              trend={15.2}
              description="Autenticaciones seguras completadas"
              source="Identity · OTP Email"
              icon={<Shield className="h-4 w-4 text-white" />}
              color="from-rose-500 to-pink-600"
              glowColor="rgba(244,63,94,0.08)"
              delay={0.15}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <KPICard
              title="Pedidos"
              value={Number(s.totalOrders).toLocaleString()}
              trend={12.5}
              description="Órdenes completadas en plataforma"
              source="Commerce · Checkout"
              icon={<ShoppingBag className="h-4 w-4 text-white" />}
              color="from-[#C4956A] to-[#8B6F5E]"
              glowColor="rgba(196,149,106,0.08)"
              delay={0.2}
            />
            <KPICard
              title="Tasa de Conversión"
              value={realConversionRate}
              suffix="%"
              trend={2.1}
              description="Pedidos / Visitas totales"
              source="Funnel · Ratio real"
              icon={<TrendingUp className="h-4 w-4 text-white" />}
              color="from-amber-500 to-orange-600"
              glowColor="rgba(245,158,11,0.08)"
              delay={0.25}
            />
            <KPICard
              title="Clientes Activos"
              value={Number(s.activeClients)}
              trend={5.8}
              description="Clientes registrados y verificados"
              source="Base de datos · Neon"
              icon={<Users className="h-4 w-4 text-white" />}
              color="from-emerald-500 to-green-600"
              glowColor="rgba(16,185,129,0.08)"
              delay={0.3}
            />
            <KPICard
              title="Impacto Sostenible"
              value={Number(s.automatedFlows).toLocaleString()}
              suffix=" ops"
              trend={42.0}
              description="Flujos automatizados sin papel"
              source="Sustainability · Green Ops"
              icon={<Leaf className="h-4 w-4 text-white" />}
              color="from-green-500 to-emerald-600"
              glowColor="rgba(34,197,94,0.08)"
              delay={0.35}
            />
          </div>
        </div>
      </section>

      {/* ═══ CHARTS: FUNNEL + TREND ═══ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funnel */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-stone-900">Commercial Funnel</h3>
                <span className="text-[10px] text-stone-400 font-medium">Visitas → Pedidos</span>
              </div>
              <p className="text-xs text-stone-400 mb-5">From visits to validated customer journeys</p>
              <ExecutiveFunnelChart data={data.funnel} />
            </motion.div>

            {/* Zyla Trend */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-stone-900">Growth Trajectory</h3>
                <span className="text-[10px] text-stone-400 font-medium">Últimos 6 meses</span>
              </div>
              <p className="text-xs text-stone-400 mb-5">Monthly visits & conversions acceleration</p>
              <ExecutiveTrendChart data={data.charts.monthlyTrend} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CHANNEL + REQUESTS ═══ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <h3 className="text-base font-bold text-stone-900 mb-1">Omnichannel Distribution</h3>
              <p className="text-xs text-stone-400 mb-5">Customer interaction channels</p>
              <ExecutiveDonutChart data={data.charts.channelDistribution} title="Channels" />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <h3 className="text-base font-bold text-stone-900 mb-1">Digital Radication</h3>
              <p className="text-xs text-stone-400 mb-5">Request categories — 100% paperless</p>
              <ExecutiveBarChart data={data.charts.requestTypes} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SMART CITIES METRICS ═══ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-5 w-5 text-[#C4956A]" />
              <h2 className="text-xl font-bold text-stone-900">Smart City <span className="text-[#C4956A]">Metrics</span></h2>
            </div>
            <p className="text-xs text-stone-400">Sustainability, zero paper, CO₂ reduction and digital traceability</p>
          </motion.div>

          {/* Smart City quick metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {[
              { icon: FileText, label: 'Cero Papel', value: '100%', desc: 'Operación digital', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: Wind, label: 'CO₂ Evitado', value: '1,240 kg', desc: 'Estimado anual', color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { icon: BarChart3, label: 'Trazabilidad', value: '100%', desc: 'Digital completa', color: 'text-violet-500', bg: 'bg-violet-50' },
              { icon: Zap, label: 'Automatización IA', value: '12', desc: 'Procesos activos', color: 'text-amber-500', bg: 'bg-amber-50' },
              { icon: Recycle, label: 'Empaques', value: '98%', desc: 'Reciclables', color: 'text-teal-500', bg: 'bg-teal-50' },
              { icon: Globe, label: 'Smart City Score', value: '92/100', desc: 'Readiness Index', color: 'text-[#C4956A]', bg: 'bg-[#C4956A]/10' },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-xl ${m.bg} border border-white/50 text-center`}
              >
                <m.icon className={`h-5 w-5 ${m.color} mx-auto mb-2`} />
                <p className="text-lg font-extrabold text-stone-900">{m.value}</p>
                <p className="text-[10px] font-semibold text-stone-600">{m.label}</p>
                <p className="text-[9px] text-stone-400">{m.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Full Smart City Block */}
          <ExecutiveSmartCityBlock readinessIndex={data.smartCity.readinessIndex} pillars={data.smartCity.pillars} />
        </div>
      </section>

      {/* ═══ SUSTAINABILITY DEEP DIVE ═══ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <TreePine className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-stone-900">Sustainability <span className="text-emerald-600">Impact</span></h2>
            </div>
            <p className="text-xs text-stone-400">Less paper, more traceability, better service — measurable environmental contribution</p>
          </motion.div>
          <ExecutiveSustainabilityBlock data={data.sustainability as never} />
        </div>
      </section>

      {/* ═══ PROJECT HIGHLIGHTS ═══ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-xl font-bold text-stone-900">Platform <span className="text-[#C4956A]">Capabilities</span></h2>
            <p className="mt-1 text-xs text-stone-400">Smart Commerce powered by AI, automation and traceability</p>
          </motion.div>
          <ExecutiveHighlightCards highlights={data.highlights} />
        </div>
      </section>

      {/* ═══ CLOSING ═══ */}
      <section className="py-12 bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <motion.div
              className="inline-flex p-3 rounded-xl bg-gradient-to-br from-[#C4956A] to-[#D4A76A] shadow-xl mb-5"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Globe className="h-6 w-6 text-white" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold">
              From retail experience to <span className="text-[#C4956A]">urban intelligence</span>
            </h2>
            <p className="mt-3 text-white/50 max-w-lg mx-auto text-sm">
              UrbanThread AI transforms customer interactions into operational intelligence — Smart Commerce for smarter, more sustainable cities.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold text-white/30">
              {['AI-Powered', 'Zero Paper', 'Full Traceability', 'Automated', 'Sustainable', 'Smart City Ready'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5">{tag}</span>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C4956A] text-white font-semibold text-sm hover:bg-[#D4A76A] transition-colors">
                Explore Platform <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href="/insights/demo" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white/70 font-semibold text-sm hover:bg-white/10 transition-colors">
                Pitch Demo <Eye className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
