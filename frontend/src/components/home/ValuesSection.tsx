'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Leaf, ShieldCheck, Award, Cpu, Heart } from 'lucide-react';

const values = [
  { icon: Lightbulb, title: 'Innovación', description: 'Adoptamos tecnologias emergentes como IA, automatizacion y análisis de datos para liderar la transformación digital.', gradient: 'from-amber-400 to-orange-500', glow: 'shadow-amber-200', hoverBg: 'hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50' },
  { icon: Leaf, title: 'Sostenibilidad', description: 'Reducimos la huella ambiental mediante digitalización de procesos, eliminacion de papel y operaciones eficientes.', gradient: 'from-emerald-400 to-green-500', glow: 'shadow-emerald-200', hoverBg: 'hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50' },
  { icon: ShieldCheck, title: 'Confianza', description: 'Garantizamos seguridad de datos, transparencia en operaciones y cumplimiento normativo con auditoria completa.', gradient: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-200', hoverBg: 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50' },
  { icon: Award, title: 'Calidad', description: 'Cada componente esta disenado con estandares premium de UX/UI, rendimiento y accesibilidad.', gradient: 'from-violet-500 to-purple-600', glow: 'shadow-violet-200', hoverBg: 'hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50' },
  { icon: Cpu, title: 'Tecnología', description: 'Stack moderno con Next.js, Express, PostgreSQL, OpenAI y n8n para máxima escalabilidad.', gradient: 'from-cyan-400 to-teal-500', glow: 'shadow-cyan-200', hoverBg: 'hover:bg-gradient-to-br hover:from-cyan-50 hover:to-teal-50' },
  { icon: Heart, title: 'Compromiso', description: 'Nos comprometemos con el éxito de cada cliente, ofreciendo soporte continuo y mejora constante.', gradient: 'from-rose-400 to-pink-500', glow: 'shadow-rose-200', hoverBg: 'hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50' },
];

const networkBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='700' viewBox='0 0 700 700'%3E%3Ccircle cx='50' cy='50' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='200' cy='30' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='350' cy='70' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='500' cy='40' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='650' cy='60' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='120' cy='180' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='280' cy='160' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='430' cy='190' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='580' cy='170' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Cline x1='50' y1='50' x2='200' y2='30' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='200' y1='30' x2='350' y2='70' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='350' y1='70' x2='500' y2='40' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='500' y1='40' x2='650' y2='60' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='50' y1='50' x2='120' y2='180' stroke='%23cfd8dc' stroke-width='1' opacity='0.5'/%3E%3Cline x1='200' y1='30' x2='280' y2='160' stroke='%23cfd8dc' stroke-width='1' opacity='0.5'/%3E%3Cline x1='120' y1='180' x2='280' y2='160' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='280' y1='160' x2='430' y2='190' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='430' y1='190' x2='580' y2='170' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3C/svg%3E")`;

export function ValuesSection() {
  return (
    <section className="py-20" style={{ backgroundImage: networkBg, backgroundSize: '700px 700px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-ut-text">
            Nuestros <span className="text-gradient">Valores</span>
          </h2>
          <p className="mt-3 text-base text-ut-text-muted max-w-xl mx-auto">
            Los principios que guian cada decisión y cada linea de código en UrbanThread AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-transparent hover:border-ut-accent/20 shadow-card hover:shadow-xl ${v.hoverBg} transition-all duration-300 group`}
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${v.gradient} shadow-lg ${v.glow} mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <v.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-ut-text mb-2">{v.title}</h3>
              <p className="text-sm text-ut-text-muted leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ValuesSection;
