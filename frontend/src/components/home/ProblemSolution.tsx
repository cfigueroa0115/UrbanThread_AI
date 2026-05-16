'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ArrowRight, FileX, Search, Radio, PieChart, UserX } from 'lucide-react';

const pairs = [
  {
    problem: { text: 'Procesos manuales y repetitivos', icon: FileX },
    solution: { text: 'Automatización inteligente con IA y flujos n8n', gradient: 'from-violet-500 to-purple-600', hoverBg: 'hover:from-violet-500 hover:to-purple-600' },
  },
  {
    problem: { text: 'Sin trazabilidad en solicitudes', icon: Search },
    solution: { text: 'Radicación digital con trazabilidad de 12 pasos', gradient: 'from-cyan-400 to-teal-500', hoverBg: 'hover:from-cyan-400 hover:to-teal-500' },
  },
  {
    problem: { text: 'Comunicación fragmentada', icon: Radio },
    solution: { text: 'Omnicanal: WhatsApp, chatbot, email', gradient: 'from-blue-500 to-indigo-600', hoverBg: 'hover:from-blue-500 hover:to-indigo-600' },
  },
  {
    problem: { text: 'Sin datos para decisiones', icon: PieChart },
    solution: { text: 'Analítica en tiempo real con dashboards y KPI´s', gradient: 'from-amber-400 to-orange-500', hoverBg: 'hover:from-amber-400 hover:to-orange-500' },
  },
  {
    problem: { text: 'Experiencia desconectada', icon: UserX },
    solution: { text: 'Portal de cliente con autenticación OTP segura', gradient: 'from-emerald-400 to-green-500', hoverBg: 'hover:from-emerald-400 hover:to-green-500' },
  },
];

const networkBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='700' viewBox='0 0 700 700'%3E%3Ccircle cx='50' cy='50' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='200' cy='30' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='350' cy='70' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='500' cy='40' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='650' cy='60' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Cline x1='50' y1='50' x2='200' y2='30' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='200' y1='30' x2='350' y2='70' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='350' y1='70' x2='500' y2='40' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='500' y1='40' x2='650' y2='60' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3C/svg%3E")`;

export function ProblemSolution() {
  return (
    <section
      className="py-20 bg-white/50 backdrop-blur-sm"
      style={{ backgroundImage: networkBg, backgroundSize: '700px 700px' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-ut-text">
            Del problema a la <span className="text-gradient">solución</span>
          </h2>
          <p className="mt-3 text-base text-ut-text-muted max-w-xl mx-auto">
            Transformamos cada desafio del retail tradicional en una oportunidad digital.
          </p>
        </motion.div>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 shadow-lg shadow-red-200">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-ut-danger">Desafío</h3>
          </div>
          <div className="w-10" />
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-200">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-ut-success">Solución UrbanThread AI</h3>
          </div>
        </div>

        {/* Pairs */}
        <div className="space-y-4">
          {pairs.map((pair, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-center"
            >
              {/* Problem card */}
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-red-50/80 border border-red-100 hover:bg-gradient-to-r hover:from-red-400 hover:to-rose-500 hover:border-transparent hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 shadow-md group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                  <pair.problem.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-medium text-ut-text group-hover:text-white transition-colors duration-300">{pair.problem.text}</p>
              </motion.div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-ut-accent to-ut-electric flex items-center justify-center shadow-lg"
                >
                  <ArrowRight className="h-5 w-5 text-white" />
                </motion.div>
              </div>

              {/* Solution card */}
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                className={`group flex items-center gap-4 p-4 rounded-2xl bg-white/80 border border-ut-surface-dark hover:bg-gradient-to-r ${pair.solution.hoverBg} hover:border-transparent hover:shadow-lg transition-all duration-300 cursor-pointer`}
              >
                <div className={`flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br ${pair.solution.gradient} shadow-md group-hover:scale-110 transition-all duration-300`}>
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-medium text-ut-text group-hover:text-white transition-colors duration-300">{pair.solution.text}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemSolution;
