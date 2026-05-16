'use client';

import React from 'react';
import { motion } from 'framer-motion';

const commitments = [
  {
    title: 'Cero Papel',
    description: 'Digitalizacion completa de documentos, formularios y procesos de radicacion.',
    gradient: 'from-cyan-400 to-teal-500',
    hoverBg: 'hover:from-cyan-400 hover:to-teal-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    title: 'Procesos Eficientes',
    description: 'Automatizacion que elimina reprocesos y reduce el consumo de recursos.',
    gradient: 'from-emerald-400 to-green-500',
    hoverBg: 'hover:from-emerald-400 hover:to-green-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
      </svg>
    ),
  },
  {
    title: 'Huella Reducida',
    description: 'Procesos digitales que minimizan el impacto ambiental.',
    gradient: 'from-sky-400 to-blue-500',
    hoverBg: 'hover:from-sky-400 hover:to-blue-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    title: 'Compromiso Verde',
    description: 'Alineados con desarrollo sostenible y Smart Cities.',
    gradient: 'from-lime-400 to-emerald-500',
    hoverBg: 'hover:from-lime-400 hover:to-emerald-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export function SustainabilitySection() {
  return (
    <section className="py-12 bg-gradient-to-br from-emerald-50/70 to-teal-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-3">
            <img src="/images/sustainability-icon.svg" alt="" className="h-14 w-14 drop-shadow-lg" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-ut-text">
            Compromiso con la <span className="text-ut-success">Sostenibilidad</span>
          </h2>
          <p className="mt-2 text-sm text-ut-text-muted max-w-lg mx-auto">
            La tecnologia como aliada del medio ambiente. Cada proceso digital es un paso hacia un futuro mas sostenible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {commitments.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-card hover:bg-gradient-to-br ${item.hoverBg} hover:border-transparent hover:shadow-xl transition-all duration-300 text-center cursor-pointer`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-ut-text group-hover:text-white mb-1.5 transition-colors duration-300">{item.title}</h3>
              <p className="text-xs text-ut-text-muted group-hover:text-white/80 leading-relaxed transition-colors duration-300">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SustainabilitySection;
