'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, Recycle, Wind, Factory, Sun, RefreshCw, X,
  CloudOff, Monitor, TreePine, Zap, Globe, Users, Building2,
  Smartphone, FileText, TrendingDown, ArrowRight, Shield,
  BarChart3, Wifi, Heart,
} from 'lucide-react';

/* ── Animated Counter ── */
function AnimatedCounter({ value, suffix, prefix = '' }: { value: number; suffix: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) { setCount(value); clearInterval(timer); }
        else { setCount(Math.floor(current)); }
      }, duration / steps);
      return () => clearInterval(timer);
    }, 300);
    return () => clearTimeout(timeout);
  }, [value]);
  return <span>{prefix}{count}{suffix}</span>;
}

/* ── Data ── */
const impactMetrics = [
  { value: 100, suffix: '%', label: 'Procesos digitales', sublabel: 'Cero papel en operaciones', icon: Monitor, color: 'from-blue-500 to-cyan-500', glow: 'rgba(59,130,246,0.4)' },
  { value: 75, suffix: '%', label: 'Reducción huella CO₂', sublabel: 'Vs. comercio tradicional', icon: CloudOff, color: 'from-emerald-500 to-green-600', glow: 'rgba(16,185,129,0.4)' },
  { value: 98, suffix: '%', label: 'Empaques reciclables', sublabel: 'Biodegradables en 90 días', icon: Recycle, color: 'from-amber-500 to-orange-500', glow: 'rgba(245,158,11,0.4)' },
  { value: 0, suffix: '', label: 'Papel utilizado', sublabel: 'Digitalización total', icon: TreePine, color: 'from-[#C4956A] to-[#8B6F5E]', glow: 'rgba(196,149,106,0.4)' },
];

const ejesEstrategicos = [
  { icon: FileText, title: 'Reducción de Papel', description: 'Eliminación total del papel en trámites, facturas, radicaciones y comunicaciones. Todo es digital, trazable y seguro.', metric: '0 hojas', metricLabel: 'consumo mensual', gradient: 'from-emerald-500 to-green-600' },
  { icon: Smartphone, title: 'Digitalización de Trámites', description: 'Portal Cliente con OTP, radicaciones digitales, documentos en la nube y seguimiento en tiempo real sin desplazamientos.', metric: '100%', metricLabel: 'trámites online', gradient: 'from-blue-500 to-indigo-600' },
  { icon: TrendingDown, title: 'Baja Huella Ambiental', description: 'Servidores con energía renovable, código optimizado, CDN global y procesos serverless que minimizan el consumo energético.', metric: '-75%', metricLabel: 'emisiones CO₂', gradient: 'from-teal-500 to-cyan-600' },
  { icon: Zap, title: 'Eficiencia Operativa', description: 'Automatización con IA y n8n, chatbot 24/7, OTP instantáneo y flujos inteligentes que eliminan la fricción operativa.', metric: '3x', metricLabel: 'más eficiente', gradient: 'from-violet-500 to-purple-600' },
  { icon: RefreshCw, title: 'Economía Circular', description: 'Programa "Segunda Vida" para reciclaje de prendas, materiales reutilizados y empaques compostables en toda la cadena.', metric: '98%', metricLabel: 'reciclable', gradient: 'from-rose-500 to-pink-600' },
  { icon: Shield, title: 'Transparencia Total', description: 'Trazabilidad completa de cada producto, auditorías públicas, cadena de suministro ética y reportes de impacto verificables.', metric: '100%', metricLabel: 'trazable', gradient: 'from-amber-500 to-orange-600' },
];

const smartCityPillars = [
  { icon: Globe, title: 'Comercio Conectado', description: 'Plataforma integrada que conecta ciudadanos con moda sostenible mediante tecnología de punta, eliminando barreras geográficas y temporales.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Users, title: 'Experiencia Ciudadana', description: 'Interfaz accesible, chatbot IA 24/7, autenticación segura con OTP y procesos sin fricción que respetan el tiempo del ciudadano.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Building2, title: 'Eficiencia Urbana', description: 'Reducción de desplazamientos, logística optimizada, entregas inteligentes y operaciones que descongestionen la ciudad.', color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { icon: Leaf, title: 'Sostenibilidad', description: 'Cero papel, empaques biodegradables, energía renovable y economía circular como pilares de una ciudad más verde.', color: 'text-green-500', bg: 'bg-green-500/10' },
  { icon: Wifi, title: 'Inclusión Digital', description: 'Acceso desde cualquier dispositivo, diseño responsive, asistente por voz y procesos simplificados para todos los ciudadanos.', color: 'text-[#C4956A]', bg: 'bg-[#C4956A]/10' },
  { icon: Heart, title: 'Impacto Social', description: 'Programa de donación de prendas, empleo digno en toda la cadena, apoyo a comunidades vulnerables y comercio justo certificado.', color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

const dashboardCards = [
  { icon: FileText, label: 'Menos papel', value: '0', unit: 'hojas/mes', description: 'Facturas, radicaciones y comunicaciones 100% digitales', trend: '-100%', trendColor: 'text-emerald-500' },
  { icon: TrendingDown, label: 'Menos fricción', value: '2', unit: 'min promedio', description: 'Tiempo de trámite vs. 45 min presencial', trend: '-95%', trendColor: 'text-blue-500' },
  { icon: BarChart3, label: 'Más trazabilidad', value: '100', unit: '%', description: 'Cada pedido, solicitud y documento es rastreable', trend: '+100%', trendColor: 'text-violet-500' },
  { icon: Monitor, label: 'Más digitalización', value: '12', unit: 'procesos', description: 'Automatizados con IA, n8n y flujos inteligentes', trend: '+300%', trendColor: 'text-[#C4956A]' },
];

export default function SostenibilidadPage() {
  const [selectedEje, setSelectedEje] = useState<number | null>(null);

  return (
    <main className="relative overflow-hidden min-h-screen">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ zIndex: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, #16a34a 1px, transparent 0)', backgroundSize: '50px 50px' }} />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO - Enfoque ejecutivo */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-[#C4956A]/[0.03]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Leaf className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Smart Commerce Sostenible</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-tight">
              Tecnología al servicio de la<br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">sostenibilidad urbana</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-stone-500 max-w-3xl mx-auto leading-relaxed">
              UrbanThread AI transforma el comercio de moda con procesos 100% digitales, cero papel,
              automatización inteligente y economía circular. Cada transacción es un paso hacia ciudades más sostenibles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MÉTRICAS DE IMPACTO - Dashboard visual */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-b from-white to-stone-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">Impacto <span className="text-emerald-600">Medible</span></h2>
            <p className="mt-3 text-stone-500 max-w-xl mx-auto">Resultados concretos de nuestra operación digital sostenible</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {impactMetrics.map((stat, i) => (
              <motion.div key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -6, 0] }}
                transition={{ y: { duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }, opacity: { duration: 0.5, delay: i * 0.1 } }}
                whileHover={{ scale: 1.08 }}
                className="relative text-center p-6 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden cursor-pointer">
                {/* Permanent rotating glow border */}
                <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: `conic-gradient(from 0deg, transparent 30%, ${stat.glow.replace('0.4', '0.6')} 45%, white 50%, ${stat.glow.replace('0.4', '0.6')} 55%, transparent 70%)`, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '2px' }}
                  animate={{ rotate: [0, 360], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ rotate: { duration: 4 + i * 0.5, repeat: Infinity, ease: 'linear' }, opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 } }} />
                {/* Permanent background glow pulse */}
                <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${stat.glow.replace('0.4', '0.08')}, transparent 70%)` }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }} />
                {/* Icon with permanent pulse */}
                <motion.div className={`relative inline-flex p-3.5 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg mb-4`}
                  animate={{ boxShadow: [`0 4px 15px ${stat.glow}`, `0 8px 30px ${stat.glow.replace('0.4', '0.7')}`, `0 4px 15px ${stat.glow}`], scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}>
                  <stat.icon className="h-6 w-6 text-white" />
                </motion.div>
                <p className="relative text-4xl font-extrabold text-stone-900 group-hover:text-emerald-600 transition-colors duration-300"><AnimatedCounter value={stat.value} suffix={stat.suffix} /></p>
                <p className="relative text-sm font-semibold text-stone-700 mt-2">{stat.label}</p>
                <p className="relative text-xs text-stone-400 mt-1">{stat.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EJES ESTRATÉGICOS - Enfoque ejecutivo */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">Ejes <span className="text-emerald-600">Estratégicos</span></h2>
            <p className="mt-3 text-stone-500 max-w-2xl mx-auto">Pilares que guían nuestra operación hacia un comercio más eficiente, digital y responsable con el medio ambiente</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ejesEstrategicos.map((eje, i) => {
              const glowColor = eje.gradient.includes('emerald') ? 'rgba(16,185,129,0.6)' : eje.gradient.includes('blue') ? 'rgba(59,130,246,0.6)' : eje.gradient.includes('teal') ? 'rgba(20,184,166,0.6)' : eje.gradient.includes('violet') ? 'rgba(139,92,246,0.6)' : eje.gradient.includes('rose') ? 'rgba(244,63,94,0.6)' : 'rgba(245,158,11,0.6)';
              return (
              <motion.div key={eje.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -8, 0], rotate: [0, 0.5, -0.5, 0] }}
                transition={{ y: { duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }, rotate: { duration: 6 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }, opacity: { duration: 0.5, delay: i * 0.08 } }}
                whileHover={{ scale: 1.05 }} onClick={() => setSelectedEje(i)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer">
                {/* Permanent animated rotating border */}
                <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: `conic-gradient(from 0deg, transparent 20%, ${glowColor} 40%, white 50%, ${glowColor} 60%, transparent 80%)`, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '2px' }}
                  animate={{ rotate: [0, 360], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ rotate: { duration: 5 + i * 0.5, repeat: Infinity, ease: 'linear' }, opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 } }} />
                {/* Permanent glow pulse */}
                <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{ boxShadow: [`0 4px 20px ${glowColor.replace('0.6', '0.1')}`, `0 8px 40px ${glowColor.replace('0.6', '0.3')}`, `0 4px 20px ${glowColor.replace('0.6', '0.1')}`] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }} />
                {/* Card body */}
                <div className="relative h-full rounded-2xl border border-stone-100 group-hover:border-transparent bg-white group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-stone-50 p-6 transition-all duration-500 group-hover:shadow-2xl">
                  {/* Permanent shimmer sweep */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <motion.div className="absolute inset-0"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 + i * 0.3 }} />
                  </div>
                  {/* Icon with permanent breathing animation */}
                  <motion.div className={`relative inline-flex p-3.5 rounded-xl bg-gradient-to-br ${eje.gradient} shadow-lg`}
                    animate={{ scale: [1, 1.12, 1], boxShadow: [`0 4px 15px ${glowColor.replace('0.6', '0.3')}`, `0 8px 30px ${glowColor}`, `0 4px 15px ${glowColor.replace('0.6', '0.3')}`], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}>
                    <eje.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <h3 className="relative mt-4 text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors duration-300">{eje.title}</h3>
                  <p className="relative mt-2 text-sm text-stone-500 leading-relaxed">{eje.description}</p>
                  <div className="relative mt-4 pt-4 border-t border-stone-100 group-hover:border-emerald-100 flex items-center justify-between transition-colors duration-300">
                    <div>
                      <motion.p className="text-2xl font-extrabold text-emerald-600 inline-block"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}>
                        {eje.metric}
                      </motion.p>
                      <p className="text-xs text-stone-400">{eje.metricLabel}</p>
                    </div>
                    <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}>
                      <ArrowRight className="h-4 w-4 text-emerald-400" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* WHY IT MATTERS FOR SMART CITIES */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <Building2 className="h-4 w-4 text-[#C4956A]" />
              <span className="text-sm font-semibold text-[#C4956A]">Pertinencia Urbana</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Why it matters for <span className="text-[#C4956A]">Smart Cities</span></h2>
            <p className="mt-4 text-white/60 max-w-2xl mx-auto">UrbanThread AI no es solo una tienda — es infraestructura digital para ciudades inteligentes que priorizan la experiencia ciudadana y la sostenibilidad</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {smartCityPillars.map((pillar, i) => {
              const pillarGlow = pillar.color.includes('blue') ? 'rgba(59,130,246,0.4)' : pillar.color.includes('emerald') ? 'rgba(16,185,129,0.4)' : pillar.color.includes('violet') ? 'rgba(139,92,246,0.4)' : pillar.color.includes('green') ? 'rgba(34,197,94,0.4)' : pillar.color.includes('rose') ? 'rgba(244,63,94,0.4)' : 'rgba(196,149,106,0.4)';
              return (
              <motion.div key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -6, 0], rotate: [0, 0.3, -0.3, 0] }}
                transition={{ y: { duration: 4.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }, rotate: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }, opacity: { duration: 0.5, delay: i * 0.1 } }}
                whileHover={{ scale: 1.05 }}
                className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C4956A]/50 hover:bg-white/[0.1] transition-all duration-500 group overflow-hidden cursor-pointer">
                {/* Permanent shine sweep */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                  <motion.div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(196,149,106,0.12) 45%, rgba(255,255,255,0.08) 50%, rgba(196,149,106,0.12) 55%, transparent 60%)' }}
                    animate={{ x: ['-100%', '200%'] }} transition={{ duration: 3.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 + i * 0.4 }} />
                </div>
                {/* Permanent border glow */}
                <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{ boxShadow: [`inset 0 0 15px ${pillarGlow.replace('0.4', '0.05')}`, `inset 0 0 30px ${pillarGlow.replace('0.4', '0.15')}`, `inset 0 0 15px ${pillarGlow.replace('0.4', '0.05')}`] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }} />
                {/* Icon with permanent breathing */}
                <motion.div className={`relative inline-flex p-3 rounded-xl ${pillar.bg} mb-4`}
                  animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}>
                  <pillar.icon className={`h-6 w-6 ${pillar.color}`} />
                </motion.div>
                <h3 className="relative text-lg font-bold text-white group-hover:text-[#C4956A] transition-colors duration-300">{pillar.title}</h3>
                <p className="relative mt-2 text-sm text-white/50 group-hover:text-white/70 leading-relaxed transition-colors duration-300">{pillar.description}</p>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DASHBOARD AMBIENTAL - Visualización de impacto */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">Dashboard de <span className="text-emerald-600">Impacto Ambiental</span></h2>
            <p className="mt-3 text-stone-500 max-w-xl mx-auto">Métricas en tiempo real de nuestra contribución a un comercio más sostenible</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {dashboardCards.map((card, i) => (
              <motion.div key={card.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={{ y: [0, -5, 0] }}
                transition={{ y: { duration: 3.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }, opacity: { duration: 0.5, delay: i * 0.1 }, scale: { duration: 0.5, delay: i * 0.1 } }}
                whileHover={{ scale: 1.05 }}
                className="relative p-5 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Permanent subtle shimmer */}
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.04), transparent)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }} />
                {/* Permanent border glow */}
                <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{ boxShadow: ['0 0 0px transparent', `0 4px 20px ${card.trendColor.includes('emerald') ? 'rgba(16,185,129,0.15)' : card.trendColor.includes('blue') ? 'rgba(59,130,246,0.15)' : card.trendColor.includes('violet') ? 'rgba(139,92,246,0.15)' : 'rgba(196,149,106,0.15)'}`, '0 0 0px transparent'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }} />
                <div className="relative flex items-center justify-between mb-3">
                  <motion.div className="p-2 rounded-lg bg-stone-50"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}>
                    <card.icon className="h-5 w-5 text-stone-600" />
                  </motion.div>
                  <motion.span className={`text-xs font-bold ${card.trendColor}`}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}>
                    {card.trend}
                  </motion.span>
                </div>
                <p className="relative text-3xl font-extrabold text-stone-900">{card.value}<span className="text-lg text-stone-400 ml-1">{card.unit}</span></p>
                <p className="relative text-sm font-semibold text-stone-700 mt-1">{card.label}</p>
                <p className="relative text-xs text-stone-400 mt-1">{card.description}</p>
                {/* Animated progress bar */}
                <div className="relative mt-3 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                    initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }} />
                  {/* Shimmer on progress bar */}
                  <motion.div className="absolute inset-0 rounded-full"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3, delay: 2 + i * 0.3 }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CTA Final */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-r from-emerald-500/5 via-transparent to-[#C4956A]/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Cada compra es un voto por el planeta</h2>
            <p className="mt-3 text-stone-500 max-w-xl mx-auto">Al elegir UrbanThread AI, contribuyes a un modelo de comercio más justo, digital y sostenible para las ciudades del futuro.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/" className="px-8 py-3.5 rounded-xl bg-[#1A1A1A] text-white font-bold text-sm hover:bg-[#C4956A] transition-colors">
                Explorar colecciones
              </a>
              <a href="/contacto" className="px-8 py-3.5 rounded-xl border-2 border-emerald-500 text-emerald-700 font-bold text-sm hover:bg-emerald-500 hover:text-white transition-colors">
                Conocer más
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal Eje Estratégico */}
      <AnimatePresence>
        {selectedEje !== null && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEje(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">
                <div className={`px-6 py-5 bg-gradient-to-r ${ejesEstrategicos[selectedEje].gradient} text-white`}>
                  <div className="flex items-center gap-3">
                    {React.createElement(ejesEstrategicos[selectedEje].icon, { className: 'h-8 w-8' })}
                    <div>
                      <h3 className="text-xl font-bold">{ejesEstrategicos[selectedEje].title}</h3>
                      <p className="text-white/70 text-sm">{ejesEstrategicos[selectedEje].metricLabel}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedEje(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"><X className="h-4 w-4" /></button>
                </div>
                <div className="p-6">
                  <p className="text-sm text-stone-600 leading-relaxed">{ejesEstrategicos[selectedEje].description}</p>
                  <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <p className="text-3xl font-extrabold text-emerald-600">{ejesEstrategicos[selectedEje].metric}</p>
                    <p className="text-xs text-emerald-700 mt-1">{ejesEstrategicos[selectedEje].metricLabel}</p>
                  </div>
                  <button onClick={() => setSelectedEje(null)} className="mt-4 w-full py-3 rounded-xl bg-[#1A1A1A] text-white font-semibold text-sm hover:bg-[#2D2D2D] transition-colors">Entendido ✓</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
