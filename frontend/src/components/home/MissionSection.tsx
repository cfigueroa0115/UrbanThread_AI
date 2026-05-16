'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Cpu, Users, ShieldCheck, Leaf, BarChart3 } from 'lucide-react';

const pillars = [
  {
    icon: Cpu,
    title: 'Inteligencia artificial',
    description: 'Chatbot IA, clasificación de intenciones y respuestas contextuales en tiempo real.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-200',
    hoverBg: 'hover:from-violet-500 hover:to-purple-600',
  },
  {
    icon: Users,
    title: 'Experiencia del cliente',
    description: 'Portal personalizado con autenticación OTP, trazabilidad y comunicación omnicanal.',
    gradient: 'from-cyan-400 to-teal-500',
    glow: 'shadow-cyan-200',
    hoverBg: 'hover:from-cyan-400 hover:to-teal-500',
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad y confianza',
    description: 'RBAC, auditoria completa, cifrado de datos y cumplimiento normativo.',
    gradient: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-200',
    hoverBg: 'hover:from-blue-500 hover:to-indigo-600',
  },
  {
    icon: Leaf,
    title: 'Sostenibilidad',
    description: 'Reducción de huella ambiental mediante digitalización y procesos sin papel.',
    gradient: 'from-emerald-400 to-green-500',
    glow: 'shadow-emerald-200',
    hoverBg: 'hover:from-emerald-400 hover:to-green-500',
  },
  {
    icon: BarChart3,
    title: 'Analitica de datos',
    description: 'Dashboards en tiempo real, KPIs operativos y métricas de negocio accionables.',
    gradient: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-200',
    hoverBg: 'hover:from-amber-400 hover:to-orange-500',
  },
  {
    icon: Target,
    title: 'Automatización',
    description: 'Flujos n8n, webhooks y procesos automatizados para máxima eficiencia operativa.',
    gradient: 'from-rose-400 to-pink-500',
    glow: 'shadow-rose-200',
    hoverBg: 'hover:from-rose-400 hover:to-pink-500',
  },
];

export function MissionSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50/60 to-indigo-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-ut-text">
            Nuestra <span className="text-gradient">Misión</span>
          </h2>
          <p className="mt-3 text-base text-ut-text-muted max-w-2xl mx-auto">
            Transformar el retail de moda mediante tecnología inteligente, creando experiencias
            excepcionales que conectan marcas con personas de forma sostenible y eficiente.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group flex flex-col items-center text-center p-7 rounded-2xl bg-white/80 backdrop-blur-sm border border-ut-surface-dark shadow-card hover:bg-gradient-to-br ${pillar.hoverBg} hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer`}
            >
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${pillar.gradient} shadow-lg ${pillar.glow} mb-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                <pillar.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-ut-text group-hover:text-white mb-2 transition-colors duration-300">{pillar.title}</h3>
              <p className="text-sm text-ut-text-muted group-hover:text-white/80 leading-relaxed transition-colors duration-300">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MissionSection;
