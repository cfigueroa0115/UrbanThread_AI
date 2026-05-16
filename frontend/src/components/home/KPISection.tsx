'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Gauge,
  Bot,
  RotateCcw,
  Leaf,
  Database,
  Clock,
  SmilePlus,
  Monitor,
  ShoppingCart,
  UserCheck,
} from 'lucide-react';

const kpis = [
  { icon: Gauge, label: 'Eficiencia operativa', value: '92%', color: 'text-ut-accent', iconGradient: 'from-ut-accent to-emerald-400', hoverBg: 'hover:from-[#00D4AA] hover:to-emerald-500' },
  { icon: Bot, label: 'Nivel de automatización', value: '85%', color: 'text-ut-electric', iconGradient: 'from-ut-electric to-violet-400', hoverBg: 'hover:from-[#6C5CE7] hover:to-violet-500' },
  { icon: RotateCcw, label: 'Reducción de reprocesos', value: '60%', color: 'text-ut-success', iconGradient: 'from-green-400 to-emerald-500', hoverBg: 'hover:from-green-500 hover:to-emerald-600' },
  { icon: Leaf, label: 'Reducción huella ambiental', value: '75%', color: 'text-green-500', iconGradient: 'from-lime-400 to-green-500', hoverBg: 'hover:from-lime-500 hover:to-green-600' },
  { icon: Database, label: 'Trazabilidad de datos', value: '100%', color: 'text-ut-info', iconGradient: 'from-blue-400 to-cyan-400', hoverBg: 'hover:from-blue-500 hover:to-cyan-500' },
  { icon: Clock, label: 'Tiempo de respuesta', value: '<3s', color: 'text-ut-gold', iconGradient: 'from-amber-400 to-orange-400', hoverBg: 'hover:from-amber-500 hover:to-orange-500' },
  { icon: SmilePlus, label: 'Satisfacción del cliente', value: '96%', color: 'text-pink-500', iconGradient: 'from-pink-400 to-rose-500', hoverBg: 'hover:from-pink-500 hover:to-rose-600' },
  { icon: Monitor, label: 'Digitalización', value: '98%', color: 'text-ut-accent', iconGradient: 'from-ut-accent to-teal-400', hoverBg: 'hover:from-[#00D4AA] hover:to-teal-500' },
  { icon: ShoppingCart, label: 'Pedidos gestionados', value: '10K+', color: 'text-ut-electric', iconGradient: 'from-ut-electric to-indigo-400', hoverBg: 'hover:from-[#6C5CE7] hover:to-indigo-500' },
  { icon: UserCheck, label: 'Clientes autenticados', value: '5K+', color: 'text-ut-success', iconGradient: 'from-emerald-400 to-green-500', hoverBg: 'hover:from-emerald-500 hover:to-green-600' },
];

export function KPISection() {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50/60 to-orange-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-h2 text-ut-text">
            Metricas y <span className="text-gradient">KPI´s operativos</span>
          </h2>
          <p className="mt-4 text-lg text-ut-text-muted max-w-2xl mx-auto">
            Indicadores clave que demuestran el impacto real de la plataforma en la operación.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-5 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group text-center p-5 rounded-xl bg-white/80 backdrop-blur-sm shadow-card hover:bg-gradient-to-br ${kpi.hoverBg} hover:shadow-elevated transition-all duration-300 cursor-pointer`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.iconGradient} shadow-lg mb-3 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                <kpi.icon className="h-6 w-6 text-white" />
              </div>
              <p className={`text-3xl font-extrabold ${kpi.color} group-hover:text-white transition-colors duration-300`}>{kpi.value}</p>
              <p className="text-small text-ut-text-muted group-hover:text-white/80 mt-1 transition-colors duration-300">{kpi.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default KPISection;
