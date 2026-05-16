'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  ShieldCheck,
  MessageCircle,
  Smartphone,
  FileCheck,
  BarChart3,
} from 'lucide-react';

const modules = [
  {
    icon: User,
    title: 'Portal cliente',
    description: 'Acceso seguro con OTP, perfil, pedidos, solicitudes, documentos y notificaciones.',
    gradient: 'from-cyan-400 to-cyan-600',
    hoverBg: 'hover:from-cyan-500 hover:to-cyan-700',
    iconBg: 'from-cyan-400 to-cyan-600',
  },
  {
    icon: ShieldCheck,
    title: 'Panel admin',
    description: 'Gestión completa de usuarios, clientes, pedidos, solicitudes, configuración y auditoría.',
    gradient: 'from-purple-400 to-purple-600',
    hoverBg: 'hover:from-purple-500 hover:to-purple-700',
    iconBg: 'from-purple-400 to-purple-600',
  },
  {
    icon: MessageCircle,
    title: 'Chatbot IA',
    description: 'Asistente inteligente con OpenAI disponible en todas las páginas de la plataforma.',
    gradient: 'from-blue-400 to-blue-600',
    hoverBg: 'hover:from-blue-500 hover:to-blue-700',
    iconBg: 'from-blue-400 to-blue-600',
  },
  {
    icon: Smartphone,
    title: 'WhatsApp',
    description: 'Integración con WhatsApp Business para comunicación directa y envío de documentos.',
    gradient: 'from-green-400 to-green-600',
    hoverBg: 'hover:from-green-500 hover:to-green-700',
    iconBg: 'from-green-400 to-green-600',
  },
  {
    icon: FileCheck,
    title: 'Radicación',
    description: 'Flujo digital de 12 pasos con número de radicación, adjuntos y trazabilidad completa.',
    gradient: 'from-amber-400 to-amber-600',
    hoverBg: 'hover:from-amber-500 hover:to-amber-700',
    iconBg: 'from-amber-400 to-amber-600',
  },
  {
    icon: BarChart3,
    title: 'Analítica',
    description: 'Dashboards, metricas en tiempo real, KPIs operativos y reportes de negocio.',
    gradient: 'from-rose-400 to-rose-600',
    hoverBg: 'hover:from-rose-500 hover:to-rose-700',
    iconBg: 'from-rose-400 to-rose-600',
  },
];

export function ModulesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-cyan-50/60 to-sky-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-h2 text-ut-text">
            Modulos de la <span className="text-gradient">Plataforma</span>
          </h2>
          <p className="mt-4 text-lg text-ut-text-muted max-w-2xl mx-auto">
            Un ecosistema completo de modulos integrados para cubrir cada aspecto de tu operación.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative overflow-hidden rounded-xl border border-ut-surface-dark bg-white/80 backdrop-blur-sm p-6 hover:bg-gradient-to-br ${mod.hoverBg} hover:border-transparent hover:shadow-elevated transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${mod.iconBg} shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  <mod.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-h4 text-ut-text group-hover:text-white mb-1 transition-colors duration-300">{mod.title}</h3>
                  <p className="text-small text-ut-text-muted group-hover:text-white/80 transition-colors duration-300">{mod.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ModulesSection;
