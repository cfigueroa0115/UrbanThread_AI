'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Users, ShoppingBag, ClipboardList, Shield, MessageCircle,
  BarChart3, TrendingUp, Globe, ArrowRight,
} from 'lucide-react';
import {
  ExecutiveInsightStatCard,
  ExecutiveFunnelChart,
  ExecutiveHighlightCards,
  ExecutiveSustainabilityBlock,
  ExecutiveSmartCityBlock,
  ExecutiveModeBadge,
  ExecutiveTrendChart,
} from '@/components/insights';

interface InsightsData {
  summary: Record<string, number | string>;
  funnel: Array<{ stage: string; count: number; percentage: number }>;
  charts: { monthlyTrend: Array<{ month: string; visits: number; conversions: number; orders: number }>; channelDistribution: Array<{ channel: string; value: number }>; requestTypes: Array<{ type: string; count: number }> };
  sustainability: Record<string, number>;
  smartCity: { readinessIndex: number; pillars: Array<{ name: string; score: number; description: string }> };
  highlights: Array<{ key: string; title: string; description: string; icon: string }>;
}

export default function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [mode, setMode] = useState<'live' | 'demo'>('live');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/public/insights')
      .then(r => r.json())
      .then(res => {
        setData(res.data);
        setMode(res.mode);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-3 border-[#C4956A] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) return null;

  const s = data.summary;

  return (
    <main className="relative overflow-hidden min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{ zIndex: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, #C4956A 1px, transparent 0)', backgroundSize: '50px 50px' }} />

      {/* ═══ HERO ═══ */}
      <section className="relative py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C4956A]/[0.03] via-transparent to-emerald-500/[0.02]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20">
                <BarChart3 className="h-4 w-4 text-[#C4956A]" />
                <span className="text-sm font-semibold text-[#8B6F5E]">Executive Insights</span>
              </div>
              <ExecutiveModeBadge mode={mode} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 leading-tight">
              UrbanThread <span className="bg-gradient-to-r from-[#C4956A] to-[#8B6F5E] bg-clip-text text-transparent">Executive Insights</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-500 max-w-2xl mx-auto">
              Operational intelligence in action — AI, automation and traceability powering Smart Commerce decisions for intelligent cities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ KPI SUMMARY ═══ */}
      <section className="py-12 bg-gradient-to-b from-white to-stone-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ExecutiveInsightStatCard title="Visitas" value={Number(s.totalVisits).toLocaleString()} icon={<Eye className="h-5 w-5 text-white" />} trend={Number(s.growthVsPrevious)} color="from-blue-500 to-indigo-500" delay={0} />
            <ExecutiveInsightStatCard title="Conversiones" value={Number(s.totalConversions).toLocaleString()} suffix="" icon={<TrendingUp className="h-5 w-5 text-white" />} trend={18.2} color="from-emerald-500 to-teal-500" delay={0.1} />
            <ExecutiveInsightStatCard title="Pedidos" value={Number(s.totalOrders).toLocaleString()} icon={<ShoppingBag className="h-5 w-5 text-white" />} trend={12.5} color="from-[#C4956A] to-[#8B6F5E]" delay={0.2} />
            <ExecutiveInsightStatCard title="Solicitudes" value={Number(s.totalRequests).toLocaleString()} icon={<ClipboardList className="h-5 w-5 text-white" />} trend={8.3} color="from-violet-500 to-purple-500" delay={0.3} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <ExecutiveInsightStatCard title="OTP Exitosos" value={Number(s.otpSuccessCount).toLocaleString()} icon={<Shield className="h-5 w-5 text-white" />} color="from-rose-500 to-pink-500" delay={0.4} />
            <ExecutiveInsightStatCard title="Interacciones Zyla" value={Number(s.zylaInteractions).toLocaleString()} icon={<MessageCircle className="h-5 w-5 text-white" />} color="from-cyan-500 to-blue-500" delay={0.5} />
            <ExecutiveInsightStatCard title="Tasa Conversión" value={Number(s.conversionRate)} suffix="%" icon={<BarChart3 className="h-5 w-5 text-white" />} color="from-amber-500 to-orange-500" delay={0.6} />
            <ExecutiveInsightStatCard title="Clientes Activos" value={Number(s.activeClients)} icon={<Users className="h-5 w-5 text-white" />} color="from-green-500 to-emerald-500" delay={0.7} />
          </div>
        </div>
      </section>

      {/* ═══ TREND + FUNNEL ═══ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trend Chart */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-6 rounded-2xl bg-white border border-stone-100 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900 mb-1">Growth Trend</h3>
              <p className="text-xs text-stone-400 mb-6">Monthly visits & conversions performance</p>
              <ExecutiveTrendChart data={data.charts.monthlyTrend} />
            </motion.div>

            {/* Funnel */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-6 rounded-2xl bg-white border border-stone-100 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900 mb-1">Customer Journey Funnel</h3>
              <p className="text-xs text-stone-400 mb-6">From visits to validated customer journeys</p>
              <ExecutiveFunnelChart data={data.funnel} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ PROJECT HIGHLIGHTS ═══ */}
      <section className="py-12 bg-stone-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Project <span className="text-[#C4956A]">Highlights</span></h2>
            <p className="mt-2 text-sm text-stone-500">Smart Commerce powered by AI, automation and traceability</p>
          </motion.div>
          <ExecutiveHighlightCards highlights={data.highlights} />
        </div>
      </section>

      {/* ═══ SUSTAINABILITY ═══ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Sustainability <span className="text-emerald-600">Impact</span></h2>
            <p className="mt-2 text-sm text-stone-500">Less paper, more traceability, better service</p>
          </motion.div>
          <ExecutiveSustainabilityBlock data={data.sustainability as never} />
        </div>
      </section>

      {/* ═══ SMART CITY ═══ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white sm:text-stone-900">Urban <span className="text-[#C4956A]">Impact</span></h2>
            <p className="mt-2 text-sm text-stone-500">Smart Cities need intelligent, efficient and sustainable commerce</p>
          </motion.div>
          <ExecutiveSmartCityBlock readinessIndex={data.smartCity.readinessIndex} pillars={data.smartCity.pillars} />
        </div>
      </section>

      {/* ═══ CLOSING CTA ═══ */}
      <section className="py-16 bg-gradient-to-r from-[#C4956A]/5 via-transparent to-emerald-500/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Globe className="h-10 w-10 text-[#C4956A] mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              From retail experience to urban intelligence
            </h2>
            <p className="mt-3 text-stone-500 max-w-xl mx-auto text-sm">
              UrbanThread AI transforms customer interactions into operational intelligence — Smart Commerce powered by AI, automation and traceability for smarter cities.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] text-white font-semibold text-sm hover:bg-[#C4956A] transition-colors">
                Explore Platform <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/insights/demo" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#C4956A] text-[#8B6F5E] font-semibold text-sm hover:bg-[#C4956A] hover:text-white transition-colors">
                View Pitch Demo <Eye className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
