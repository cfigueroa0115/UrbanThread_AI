'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  Recycle,
  Wind,
  Factory,
  Sun,
  RefreshCw,
  X,
  CloudOff,
  Monitor,
  TreePine,
  Recycle as RecycleIcon,
} from 'lucide-react';

const stats = [
  { value: 75, suffix: '%', label: 'Reducción huella', gradient: 'from-emerald-500 to-green-600', glow: 'rgba(16,185,129,0.4)', icon: CloudOff },
  { value: 100, suffix: '%', label: 'Procesos digitales', gradient: 'from-blue-500 to-cyan-500', glow: 'rgba(59,130,246,0.4)', icon: Monitor },
  { value: 0, suffix: '', label: 'Papel utilizado', gradient: 'from-[#C4956A] to-[#8B6F5E]', glow: 'rgba(196,149,106,0.4)', icon: TreePine },
  { value: 98, suffix: '%', label: 'Empaques reciclables', gradient: 'from-amber-500 to-orange-600', glow: 'rgba(245,158,11,0.4)', icon: RecycleIcon },
];

const commitments = [
  {
    icon: Leaf,
    title: 'Materiales Orgánicos',
    description: 'Fibras naturales y materiales orgánicos certificados en todas nuestras colecciones.',
    gradient: 'from-emerald-500 to-green-600',
    glow: 'rgba(16,185,129,0.4)',
    help: 'Trabajamos exclusivamente con proveedores certificados GOTS (Global Organic Textile Standard). Nuestras prendas utilizan algodón orgánico, lino, cáñamo y fibras recicladas. Cada material es trazable desde su origen hasta el producto final, garantizando prácticas éticas en toda la cadena.',
  },
  {
    icon: Recycle,
    title: 'Empaques Biodegradables',
    description: 'Todos nuestros envíos utilizan empaques 100% biodegradables y compostables.',
    gradient: 'from-teal-500 to-cyan-600',
    glow: 'rgba(20,184,166,0.4)',
    help: 'Eliminamos el plástico de un solo uso. Nuestros empaques están hechos de almidón de maíz, papel kraft reciclado y tintas vegetales. Se descomponen en 90 días en condiciones de compostaje. Incluso la cinta adhesiva es de papel biodegradable.',
  },
  {
    icon: Wind,
    title: 'Carbono Neutro',
    description: 'Compensamos el 100% de nuestras emisiones de carbono con proyectos verificados.',
    gradient: 'from-sky-500 to-blue-600',
    glow: 'rgba(14,165,233,0.4)',
    help: 'Medimos nuestra huella de carbono anualmente y compensamos cada tonelada de CO₂ emitida. Invertimos en proyectos de reforestación en la Amazonía colombiana y en energías renovables. Nuestro objetivo es reducir emisiones directas un 50% para 2027.',
  },
  {
    icon: Factory,
    title: 'Producción Ética',
    description: 'Cadena de suministro transparente con condiciones laborales justas y dignas.',
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'rgba(99,102,241,0.4)',
    help: 'Auditamos a todos nuestros proveedores bajo estándares Fair Trade. Garantizamos salarios dignos, horarios justos, ambientes seguros y cero trabajo infantil. Publicamos un informe anual de transparencia con los resultados de nuestras auditorías.',
  },
  {
    icon: Sun,
    title: 'Energía Renovable',
    description: 'Nuestros servidores y oficinas operan con 100% energía renovable certificada.',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.4)',
    help: 'Toda nuestra infraestructura digital funciona con energía solar y eólica. Nuestros data centers tienen certificación de energía renovable y nuestras oficinas cuentan con paneles solares propios. Reducimos el consumo energético con código optimizado y servidores eficientes.',
  },
  {
    icon: RefreshCw,
    title: 'Economía Circular',
    description: 'Programa de reciclaje y reutilización de prendas para extender su ciclo de vida.',
    gradient: 'from-rose-500 to-pink-600',
    glow: 'rgba(244,63,94,0.4)',
    help: 'Nuestro programa "Segunda Vida" permite devolver prendas usadas para reciclaje o donación. Ofrecemos descuentos por cada prenda devuelta. Las fibras se reciclan en nuevos textiles y las prendas en buen estado se donan a comunidades vulnerables.',
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Small delay to ensure component is mounted and visible
    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }, 500);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <span>
      {count}{suffix}
    </span>
  );
}

export default function SostenibilidadPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <main className="relative overflow-hidden min-h-screen">
      {/* Green accent background for sustainability */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]" style={{ zIndex: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, #16a34a 1px, transparent 0)', backgroundSize: '50px 50px' }} />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-[0.06] rounded-full blur-3xl" style={{ zIndex: 0, background: 'radial-gradient(circle, rgba(22,163,74,0.5), transparent)' }} />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] pointer-events-none opacity-[0.05] rounded-full blur-3xl" style={{ zIndex: 0, background: 'radial-gradient(circle, rgba(16,185,129,0.4), transparent)' }} />
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Light green tint that lets the page background show through */}
        <div className="absolute inset-0 bg-emerald-500/[0.06]" />
        {/* Gradient borders top and bottom - bright green glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
        {/* Corner green accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-br-full" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-500/8 to-transparent rounded-tr-full" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-teal-500/8 to-transparent rounded-tl-full" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900">
              Nuestro Compromiso con la <span className="text-emerald-600">Sostenibilidad</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-stone-500 max-w-3xl mx-auto">
              La tecnología como aliada del medio ambiente. Cada proceso digital es un paso
              hacia un futuro más sostenible para la moda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="relative text-center p-8 rounded-2xl bg-white border border-stone-100 shadow-sm group cursor-pointer"
              >
                {/* Glow pulse */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{ boxShadow: ['0 0 0px transparent', `0 4px 20px ${stat.glow}`, '0 0 0px transparent'] }}
                  transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                />
                {/* Rotating border — always visible */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `conic-gradient(from 0deg, transparent 30%, ${stat.glow.replace('0.4', '0.8')} 45%, white 50%, ${stat.glow.replace('0.4', '0.8')} 55%, transparent 70%)`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '2px',
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className={`relative inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg mb-3`}
                  animate={{ scale: [1, 1.08, 1], boxShadow: ['0 0 0px transparent', `0 0 14px ${stat.glow}`, '0 0 0px transparent'] }}
                  transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                >
                  <stat.icon className="h-5 w-5 text-white" strokeWidth={2} />
                </motion.div>
                <p className="relative text-4xl sm:text-5xl font-extrabold text-emerald-600">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="relative text-base text-stone-600 mt-3 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Cards Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
              Nuestros <span className="text-emerald-600">Compromisos</span>
            </h2>
            <p className="mt-3 text-base text-stone-500 max-w-xl mx-auto">
              Cada decisión que tomamos está guiada por la sostenibilidad y el respeto al medio ambiente.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commitments.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setSelectedIdx(i)}
                className="group relative rounded-2xl cursor-pointer"
              >
                {/* Default subtle glow pulse */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{
                    boxShadow: [
                      '0 0 0px transparent',
                      `0 6px 25px ${item.glow}`,
                      '0 0 0px transparent',
                    ],
                  }}
                  transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                />
                {/* Rotating border — always visible */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `conic-gradient(from 0deg, transparent 25%, ${item.glow.replace('0.4', '0.9')} 40%, white 50%, ${item.glow.replace('0.4', '0.9')} 60%, transparent 75%)`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '2px',
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: 'linear' }}
                />

                {/* Card body */}
                <div
                  className="relative h-full rounded-2xl border border-stone-100 group-hover:border-transparent p-6 transition-all duration-500 group-hover:shadow-2xl"
                  style={{
                    background: hoveredIdx === i
                      ? `linear-gradient(135deg, ${item.glow.replace('0.4', '0.08')}, white, ${item.glow.replace('0.4', '0.05')})`
                      : 'white',
                  }}
                >
                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: `0 10px 40px ${item.glow}, inset 0 0 30px ${item.glow.replace('0.4', '0.05')}` }}
                  />

                  {/* Icon */}
                  <motion.div
                    className={`relative inline-flex p-3.5 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}
                    animate={{
                      boxShadow: ['0 0 0px transparent', `0 0 18px ${item.glow}`, '0 0 0px transparent'],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                  >
                    <item.icon className="h-6 w-6 text-white" strokeWidth={2} />
                    <motion.div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ boxShadow: `0 0 20px ${item.glow}` }}
                    />
                  </motion.div>

                  {/* Title */}
                  <h3 className="mt-4 text-lg font-bold text-stone-900">{item.title}</h3>

                  {/* Description */}
                  <p className="mt-2 text-sm text-stone-500 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIdx(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-stone-200">
                {/* Header */}
                <div
                  className="px-6 py-5 flex items-center gap-4"
                  style={{ background: `linear-gradient(135deg, ${commitments[selectedIdx].glow.replace('0.4', '0.15')}, white)` }}
                >
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${commitments[selectedIdx].gradient} flex items-center justify-center shadow-lg`}>
                    {React.createElement(commitments[selectedIdx].icon, { className: 'h-7 w-7 text-white', strokeWidth: 2 })}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-stone-900">{commitments[selectedIdx].title}</h3>
                    <p className="text-sm text-stone-500">{commitments[selectedIdx].description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedIdx(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {/* Body */}
                <div className="px-6 py-5">
                  <p className="text-sm font-semibold text-[#C4956A] uppercase tracking-wider mb-2">Más información</p>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {commitments[selectedIdx].help}
                  </p>
                </div>
                {/* Footer */}
                <div className="px-6 pb-5">
                  <button
                    onClick={() => setSelectedIdx(null)}
                    className="w-full py-3 rounded-xl bg-[#1A1A1A] text-white font-semibold text-sm hover:bg-[#2D2D2D] transition-colors"
                  >
                    Entendido ✓
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
