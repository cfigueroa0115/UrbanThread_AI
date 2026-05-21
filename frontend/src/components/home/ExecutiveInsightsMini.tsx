'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Eye, ShoppingBag, MessageCircle, Leaf, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface MiniData {
  totalVisits: number;
  totalOrders: number;
  zylaInteractions: number;
  activeClients: number;
}

export function ExecutiveInsightsMini() {
  const [data, setData] = useState<MiniData | null>(null);
  const [mode, setMode] = useState<'live' | 'demo'>('demo');

  useEffect(() => {
    fetch('/api/v1/public/insights')
      .then(r => r.json())
      .then(res => {
        setData(res.data.summary);
        setMode(res.mode);
      })
      .catch(() => {});
  }, []);

  const stats = data ? [
    { label: 'Visits', value: data.totalVisits.toLocaleString(), icon: Eye, color: 'from-blue-500 to-indigo-500' },
    { label: 'Orders', value: data.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'from-[#C4956A] to-[#8B6F5E]' },
    { label: 'AI Chats', value: data.zylaInteractions.toLocaleString(), icon: MessageCircle, color: 'from-violet-500 to-purple-500' },
    { label: 'Clients', value: String(data.activeClients), icon: Building2, color: 'from-emerald-500 to-teal-500' },
  ] : [];

  if (!data) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-stone-50 via-white to-[#C4956A]/[0.03]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-4">
            <BarChart3 className="h-4 w-4 text-[#C4956A]" />
            <span className="text-sm font-semibold text-[#8B6F5E]">Executive Insights</span>
            {mode === 'live' && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Operational Intelligence <span className="text-[#C4956A]">in Action</span>
          </h2>
          <p className="mt-2 text-sm text-stone-500 max-w-lg mx-auto">
            Public executive insights for Smart Commerce performance — AI, automation and traceability powering retail decisions.
          </p>
        </motion.div>

        {/* Mini KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-white border border-stone-100 shadow-sm text-center"
            >
              <motion.div
                className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.color} shadow-md mb-2`}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              >
                <stat.icon className="h-4 w-4 text-white" />
              </motion.div>
              <p className="text-xl font-extrabold text-stone-900">{stat.value}</p>
              <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Mini sustainability + Smart City badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {[
            { icon: Leaf, label: '100% Digital Operations', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { icon: Building2, label: 'Smart City Ready', color: 'text-[#C4956A] bg-[#C4956A]/10 border-[#C4956A]/20' },
          ].map((badge) => (
            <div key={badge.label} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${badge.color}`}>
              <badge.icon className="h-3.5 w-3.5" />
              {badge.label}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] text-white font-semibold text-sm hover:bg-[#C4956A] transition-colors shadow-md"
          >
            View Executive Insights <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
