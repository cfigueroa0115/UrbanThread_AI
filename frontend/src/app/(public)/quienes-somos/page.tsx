'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Users,
  ShieldCheck,
  Leaf,
  BarChart3,
  Target,
  Rocket,
  TrendingUp,
  Globe,
  X,
} from 'lucide-react';

const values = [
  {
    icon: Cpu,
    title: 'Inteligencia Artificial',
    description: 'Chatbot IA con respuestas contextuales y clasificación de intenciones en tiempo real.',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59,130,246,0.4)',
    help: 'Nuestra IA procesa lenguaje natural para entender lo que necesitas. Zyla, nuestro chatbot, clasifica tu intención en milisegundos y te ofrece respuestas precisas de una base de conocimiento de más de 500 entradas. Aprende de cada interacción para mejorar continuamente.',
  },
  {
    icon: Users,
    title: 'Experiencia del Cliente',
    description: 'Portal personalizado con autenticación OTP, trazabilidad y comunicación omnicanal.',
    gradient: 'from-[#C4956A] to-[#8B6F5E]',
    glow: 'rgba(196,149,106,0.4)',
    help: 'Tu experiencia es nuestra prioridad. Accede a tu portal con autenticación segura OTP, gestiona pedidos, solicitudes y documentos desde cualquier dispositivo. Toda la comunicación queda trazada sin importar el canal: chatbot, WhatsApp o correo.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad',
    description: 'RBAC, auditoría completa, cifrado de datos y cumplimiento normativo.',
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'rgba(99,102,241,0.4)',
    help: 'Implementamos control de acceso basado en roles (RBAC), cifrado de datos en tránsito y reposo, logs de auditoría para cada acción y cumplimiento con la Ley 1581 de 2012 de protección de datos personales. Tu información está siempre protegida.',
  },
  {
    icon: Leaf,
    title: 'Sostenibilidad',
    description: 'Reducción de huella ambiental mediante digitalización y procesos sin papel.',
    gradient: 'from-emerald-500 to-green-600',
    glow: 'rgba(16,185,129,0.4)',
    help: 'Cada proceso digital reemplaza uno físico. Cero papel en radicaciones, empaques biodegradables, energía renovable en nuestros servidores y compensación de carbono. Nuestro objetivo es ser carbono neutro para 2027.',
  },
  {
    icon: BarChart3,
    title: 'Analítica',
    description: 'Dashboards en tiempo real, KPIs operativos y métricas de negocio.',
    gradient: 'from-rose-500 to-pink-600',
    glow: 'rgba(244,63,94,0.4)',
    help: 'Capturamos cada interacción para generar insights accionables. Dashboards interactivos muestran tasa de conversión, productos más vendidos, tiempos de respuesta, satisfacción del cliente y tendencias de moda en tiempo real.',
  },
  {
    icon: Target,
    title: 'Automatización',
    description: 'Flujos n8n, webhooks y procesos automatizados para máxima eficiencia.',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.4)',
    help: 'Cada evento importante dispara flujos automáticos: confirmaciones por correo, notificaciones de estado, tickets de soporte y sincronización con sistemas externos. Todo sin intervención manual gracias a nuestra integración con n8n.',
  },
];

const timeline = [
  {
    year: '2024',
    title: 'Lanzamiento',
    description: 'Plataforma MVP con portal, admin, chatbot IA y radicación digital.',
    icon: Rocket,
    gradient: 'from-[#C4956A] to-[#8B6F5E]',
  },
  {
    year: '2025',
    title: 'Expansión',
    description: 'Integración WhatsApp Business, analítica avanzada y automatización completa.',
    icon: TrendingUp,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    year: '2027',
    title: 'Consolidación',
    description: 'Ecosistema completo Smart Commerce con IA predictiva y carbono neutro.',
    icon: Globe,
    gradient: 'from-emerald-500 to-green-600',
  },
];

export default function QuienesSomosPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <main className="relative overflow-hidden min-h-screen">
      {/* Hero Banner */}
      <section className="relative py-20 overflow-hidden">
        {/* Transparent banner - just a subtle glass effect that lets background show through */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
        {/* Decorative lines top and bottom */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C4956A]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C4956A]/30 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900">
              Quiénes <span className="text-[#C4956A]">Somos</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-stone-500 max-w-3xl mx-auto">
              Somos UrbanThread AI, una plataforma Smart Commerce que transforma el retail de moda
              en una experiencia inteligente, fluida y sostenible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Value Cards Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900">
              Nuestros <span className="text-[#C4956A]">Pilares</span>
            </h2>
            <p className="mt-3 text-base text-stone-500 max-w-xl mx-auto">
              Los fundamentos que impulsan cada decisión en UrbanThread AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((item, i) => (
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
                      `0 4px 20px ${item.glow}`,
                      '0 0 0px transparent',
                    ],
                  }}
                  transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                />
                {/* Rotating border — always visible */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `conic-gradient(from 0deg, transparent 30%, ${item.glow.replace('0.4', '0.8')} 45%, white 50%, ${item.glow.replace('0.4', '0.8')} 55%, transparent 70%)`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '2px',
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
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

      {/* Nuestra Visión - Timeline */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900">
              Nuestra <span className="text-[#C4956A]">Visión</span>
            </h2>
            <p className="mt-3 text-base text-stone-500 max-w-xl mx-auto">
              Ser la plataforma líder en Smart Commerce para el retail de moda en Latinoamérica.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#C4956A]/20 via-[#C4956A]/40 to-[#C4956A]/20 hidden lg:block" />

            <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative group cursor-pointer"
                >
                  {/* Glow pulse */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{ boxShadow: ['0 0 0px transparent', '0 4px 20px rgba(196,149,106,0.3)', '0 0 0px transparent'] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                  />
                  {/* Rotating border — always visible */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 25%, rgba(196,149,106,0.9) 40%, white 50%, rgba(196,149,106,0.9) 60%, transparent 75%)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      padding: '2px',
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="relative h-full bg-white rounded-2xl border border-stone-100 group-hover:border-transparent p-6 group-hover:shadow-2xl transition-all duration-500">
                    <motion.div
                      className={`inline-flex p-3.5 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}
                      animate={{ boxShadow: ['0 0 0px transparent', `0 0 15px rgba(196,149,106,0.4)`, '0 0 0px transparent'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                    >
                      <item.icon className="h-6 w-6 text-white" strokeWidth={2} />
                    </motion.div>
                    <p className="text-2xl font-extrabold text-[#C4956A] mt-4">{item.year}</p>
                    <h3 className="text-lg font-bold text-stone-900 mt-1">{item.title}</h3>
                    <p className="text-sm text-stone-500 mt-2 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
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
                  style={{ background: `linear-gradient(135deg, ${values[selectedIdx].glow.replace('0.4', '0.15')}, white)` }}
                >
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${values[selectedIdx].gradient} flex items-center justify-center shadow-lg`}>
                    {React.createElement(values[selectedIdx].icon, { className: 'h-7 w-7 text-white', strokeWidth: 2 })}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-stone-900">{values[selectedIdx].title}</h3>
                    <p className="text-sm text-stone-500">{values[selectedIdx].description}</p>
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
                    {values[selectedIdx].help}
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
