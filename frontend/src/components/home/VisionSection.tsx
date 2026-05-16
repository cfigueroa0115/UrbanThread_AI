'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Globe, Award, TrendingUp } from 'lucide-react';

const milestones = [
  { year: '2024', title: 'Lanzamiento', description: 'Plataforma MVP con portal, admin, chatbot IA y radicación digital.', icon: Rocket, gradient: 'from-cyan-400 to-teal-500', glow: 'shadow-cyan-300/50' },
  { year: '2025', title: 'Expansión', description: 'Integración WhatsApp Business, analítica avanzada y automatización n8n.', icon: TrendingUp, gradient: 'from-violet-500 to-purple-600', glow: 'shadow-violet-300/50' },
  { year: '2027', title: 'Consolidación', description: 'Ecosistema completo Smart Commerce con IA predictiva y personalización.', icon: Globe, gradient: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-300/50' },
  { year: '2030', title: 'Liderazgo', description: 'Referente en Smart Commerce sostenible para retail de moda en Latinoamerica.', icon: Award, gradient: 'from-amber-400 to-orange-500', glow: 'shadow-amber-300/50' },
];

export function VisionSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-ut-primary via-ut-primary-light to-ut-electric text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Nuestra <span className="text-ut-accent">Visión</span>
          </h2>
          <p className="mt-4 text-base text-white/70 max-w-2xl mx-auto">
            Ser la plataforma lider en Smart Commerce para el retail de moda en Latinoamerica.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2" aria-hidden="true" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="relative text-center group"
              >
                <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-ut-accent border-4 border-ut-primary z-10" aria-hidden="true" />

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 group-hover:bg-white/20 group-hover:border-ut-accent/40 group-hover:shadow-[0_8px_30px_rgba(0,212,170,0.2)] transition-all duration-300 h-full flex flex-col items-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${m.gradient} shadow-lg ${m.glow} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <m.icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-ut-accent font-bold text-lg mb-1">{m.year}</p>
                  <h3 className="text-lg font-bold mb-2">{m.title}</h3>
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{m.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VisionSection;
