'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  Globe,
} from 'lucide-react';

const services = [
  {
    icon: ShoppingBag,
    title: 'Gestion de pedidos',
    description: 'Administración completa del ciclo de vida de pedidos con seguimiento de estados, historial y notificaciones automáticas.',
    iconGradient: 'from-ut-accent to-emerald-400',
    hoverBg: 'hover:from-[#00D4AA] hover:to-emerald-500',
  },
  {
    icon: FileText,
    title: 'Radicación digital',
    description: 'Flujo de radicación de 12 pasos con generación automática de número de radicación, adjuntos y trazabilidad completa.',
    iconGradient: 'from-ut-electric to-violet-400',
    hoverBg: 'hover:from-[#6C5CE7] hover:to-violet-500',
  },
  {
    icon: MessageSquare,
    title: 'Comunicacion omnicanal',
    description: 'Chatbot IA, WhatsApp Business, notificaciones por correo y portal de cliente para una experiencia conectada.',
    iconGradient: 'from-blue-400 to-cyan-400',
    hoverBg: 'hover:from-blue-500 hover:to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Analitica avanzada',
    description: 'Dashboards interactivos, metricas en tiempo real, KPIs operativos y reportes para decisiones estratégicas.',
    iconGradient: 'from-amber-400 to-orange-400',
    hoverBg: 'hover:from-amber-500 hover:to-orange-500',
  },
  {
    icon: Settings,
    title: 'Automatización n8n',
    description: 'Flujos de trabajo automatizados con webhooks, integración de sistemas y procesamiento inteligente de eventos.',
    iconGradient: 'from-rose-400 to-pink-500',
    hoverBg: 'hover:from-rose-500 hover:to-pink-600',
  },
  {
    icon: Globe,
    title: 'Portal de cliente',
    description: 'Acceso seguro con OTP para perfil, documentos, pedidos, solicitudes y notificaciones personalizadas.',
    iconGradient: 'from-teal-400 to-cyan-500',
    hoverBg: 'hover:from-teal-500 hover:to-cyan-600',
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 bg-white/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-ut-text">
            Servicios y <span className="text-gradient">Capacidades</span>
          </h2>
          <p className="mt-3 text-base text-ut-text-muted max-w-xl mx-auto">
            Todo lo que necesitas para transformar tu operacion de retail en una experiencia inteligente.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group p-6 rounded-2xl border border-ut-surface-dark bg-white/80 backdrop-blur-sm shadow-card hover:bg-gradient-to-br ${service.hoverBg} hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer`}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.iconGradient} shadow-lg mb-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                <service.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-ut-text group-hover:text-white mb-2 transition-colors duration-300">{service.title}</h3>
              <p className="text-sm text-ut-text-muted group-hover:text-white/80 leading-relaxed transition-colors duration-300">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
