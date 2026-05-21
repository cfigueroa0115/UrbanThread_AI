'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Eye, ShoppingBag, MessageCircle, Users, ArrowRight, Leaf, Radio } from 'lucide-react';
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

  if (!data) return null;

  const stats = [
    { label: 'Visits', value: data.totalVisits.toLocaleString(), icon: Eye, color: 'from-blue-500 to-indigo-600' },
    { label: 'AI Chats', value: data.zylaInteractions.toLocaleString(), icon: MessageCircle, color: 'from-violet-500 to-purple-600' },
    { label: 'Orders', value: data.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'from-[#C4956A] to-[#8B6F5E]' },
    { label: 'Clients', value: String(data.activeClients), icon: Users, color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <section className="py-14 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-50/80 via-white to-[#C4956A]/[0.02]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-6 sm:p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-stone-100 shadow-[0_8px_40px_rgba(0,0,0,0.04)]"
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2.5 rounded-xl bg-gradient-to-br from-[#C4956A] to-[#8B6F5E] shadow-md"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <BarChart3 className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">Executive Insights</h3>
                <p className="text-xs text-stone-400">Smart Commerce Intelligence</p>
              </div>
              {mode === 'live' && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <Radio className="h-2.5 w-2.5 text-emerald-600" />
                  <span className="text-[9px] font-bold text-emerald-700">LIVE</span>
                </div>
              )}
            </div>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-[#C4956A] transition-colors shadow-md"
            >
              Executive Insights Live <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mini KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-4 rounded-xl bg-white/80 border border-stone-100 text-center hover:shadow-md transition-all duration-300"
              >
                <motion.div
                  className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.color} shadow-sm mb-2`}
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                >
                  <stat.icon className="h-3.5 w-3.5 text-white" />
                </motion.div>
                <p className="text-xl font-extrabold text-stone-900">{stat.value}</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5 pt-5 border-t border-stone-100">
            {[
              { icon: Leaf, label: '100% Digital Ops' },
              { icon: BarChart3, label: 'Full Traceability' },
            ].map((badge) => (
              <span key={badge.label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-100 text-[10px] font-semibold text-stone-500">
                <badge.icon className="h-3 w-3" />
                {badge.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
