'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Users, ShoppingBag, ClipboardList, Shield, MessageCircle,
  BarChart3, TrendingUp, Globe, Brain, Zap, Leaf, FileText,
  Building2, Search, ArrowRight,
} from 'lucide-react';
import {
  ExecutiveInsightStatCard,
  ExecutiveFunnelChart,
  ExecutiveSustainabilityBlock,
  ExecutiveSmartCityBlock,
  ExecutiveModeBadge,
  ExecutiveTrendChart,
} from '@/components/insights';

interface InsightsData {
  summary: Record<string, number | string>;
  funnel: Array<{ stage: string; count: number; percentage: number }>;
  charts: { monthlyTrend: Array<{ month: string; visits: number; conversions: number; orders: number }> };
  sustainability: Record<string, number>;
  smartCity: { readinessIndex: number; pillars: Array<{ name: string; score: number; description: string }> };
  highlights: Array<{ key: string; title: string; description: string; icon: string }>;
}

export default function InsightsDemoPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [mode, setMode] = useState<'live' | 'demo'>('demo');

  useEffect(() => {
    fetch('/api/v1/public/insights?mode=demo')
      .then(r => r.json())
      .then(res => { setData(res.data); setMode(res.mode); })
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-3 border-[#C4956A] border-t-transparent rounded-full" />
      </div>
    );
  }

  const s = data.summary;

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#FAFAF9]">
      {/* ═══ PITCH HERO — Large text for projection ═══ */}
      <section className="relative py-12 lg:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C4956A]/[0.04] via-transparent to-emerald-500/[0.03]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="UrbanThread AI" className="h-12 w-auto" />
              <div className="h-8 w-px bg-stone-200" />
              <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">Executive Insights</span>
            </div>
            <ExecutiveModeBadge mode={mode} />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-tight">
              Smart Commerce<br />
              <span className="bg-gradient-to-r from-[#C4956A] to-emerald-600 bg-clip-text text-transparent">Operational Intelligence</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-stone-500 max-w-3xl mx-auto font-medium">
              AI, automation and traceability powering retail decisions for smarter cities
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ KPIs — Large, readable from distance ═══ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <ExecutiveInsightStatCard title="Total Visits" value={Number(s.totalVisits).toLocaleString()} icon={<Eye className="h-6 w-6 text-white" />} trend={Number(s.growthVsPrevious)} color="from-blue-500 to-indigo-500" delay={0} />
            <ExecutiveInsightStatCard title="Conversions" value={Number(s.totalConversions).toLocaleString()} icon={<TrendingUp className="h-6 w-6 text-white" />} trend={18.2} color="from-emerald-500 to-teal-500" delay={0.1} />
            <ExecutiveInsightStatCard title="Orders" value={Number(s.totalOrders).toLocaleString()} icon={<ShoppingBag className="h-6 w-6 text-white" />} trend={12.5} color="from-[#C4956A] to-[#8B6F5E]" delay={0.2} />
            <ExecutiveInsightStatCard title="Zyla AI Chats" value={Number(s.zylaInteractions).toLocaleString()} icon={<MessageCircle className="h-6 w-6 text-white" />} trend={34.7} color="from-violet-500 to-purple-500" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ═══ FUNNEL + TREND — Side by side ═══ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="p-6 lg:p-8 rounded-2xl bg-white border border-stone-100 shadow-sm">
              <h3 className="text-xl font-bold text-stone-900 mb-1">Customer Journey</h3>
              <p className="text-sm text-stone-400 mb-6">From visits to validated customer journeys</p>
              <ExecutiveFunnelChart data={data.funnel} />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="p-6 lg:p-8 rounded-2xl bg-white border border-stone-100 shadow-sm">
              <h3 className="text-xl font-bold text-stone-900 mb-1">Growth Trajectory</h3>
              <p className="text-sm text-stone-400 mb-6">Monthly performance acceleration</p>
              <ExecutiveTrendChart data={data.charts.monthlyTrend} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ PROJECT HIGHLIGHTS — Visual grid ═══ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-2xl lg:text-3xl font-bold text-stone-900 text-center mb-8">
            Platform <span className="text-[#C4956A]">Capabilities</span>
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Brain, title: 'Smart Commerce', desc: 'Data-driven decisions', color: 'from-[#C4956A] to-[#8B6F5E]' },
              { icon: Zap, title: 'AI + Automation', desc: 'Gemini 2.0, n8n flows', color: 'from-violet-500 to-purple-600' },
              { icon: Shield, title: 'Digital Identity', desc: 'OTP + document validation', color: 'from-blue-500 to-indigo-600' },
              { icon: Search, title: 'Full Traceability', desc: 'Every interaction tracked', color: 'from-teal-500 to-cyan-600' },
              { icon: Leaf, title: 'Sustainability', desc: 'Zero paper, green ops', color: 'from-emerald-500 to-green-600' },
              { icon: FileText, title: 'Paperless', desc: '100% digital operations', color: 'from-amber-500 to-orange-600' },
              { icon: BarChart3, title: 'Intelligence', desc: 'Real-time metrics', color: 'from-rose-500 to-pink-600' },
              { icon: Building2, title: 'Smart Cities', desc: 'Urban service layer', color: 'from-cyan-500 to-blue-600' },
            ].map((h, i) => (
              <motion.div key={h.title} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-white border border-stone-100 shadow-sm text-center hover:shadow-lg transition-all duration-300">
                <motion.div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${h.color} shadow-md mx-auto mb-3`}
                  animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}>
                  <h.icon className="h-5 w-5 text-white" />
                </motion.div>
                <h4 className="text-sm font-bold text-stone-800">{h.title}</h4>
                <p className="text-[11px] text-stone-400 mt-1">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SUSTAINABILITY ═══ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ExecutiveSustainabilityBlock data={data.sustainability as never} />
        </div>
      </section>

      {/* ═══ SMART CITY ═══ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ExecutiveSmartCityBlock readinessIndex={data.smartCity.readinessIndex} pillars={data.smartCity.pillars} />
        </div>
      </section>

      {/* ═══ CLOSING — High impact for jury ═══ */}
      <section className="py-16 bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <motion.div
              className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#C4956A] to-[#D4A76A] shadow-2xl mb-6"
              animate={{ scale: [1, 1.05, 1], boxShadow: ['0 10px 40px rgba(196,149,106,0.3)', '0 20px 60px rgba(196,149,106,0.5)', '0 10px 40px rgba(196,149,106,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Globe className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
              UrbanThread AI transforms customer interactions<br />
              into <span className="text-[#C4956A]">operational intelligence</span>
            </h2>
            <p className="mt-4 text-white/60 max-w-2xl mx-auto text-base">
              Smart Commerce powered by AI, automation and traceability — from retail experience to urban intelligence for smarter, more sustainable cities.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-white/40">
              {['AI-Powered', 'Zero Paper', 'Full Traceability', 'Automated Flows', 'Sustainable', 'Smart City Ready'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5">{tag}</span>
              ))}
            </div>
            <div className="mt-8">
              <a href="/" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#C4956A] text-white font-bold text-sm hover:bg-[#D4A76A] transition-colors shadow-lg">
                Explore the Platform <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
