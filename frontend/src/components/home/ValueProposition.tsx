'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, TrendingUp, Shield } from 'lucide-react';

const propositions = [
  {
    icon: Zap,
    title: 'Eficiencia Operativa',
    description: 'Automatiza procesos repetitivos y reduce tiempos de gestion hasta un 70% con flujos inteligentes.',
    stat: '70%',
    statLabel: 'mas eficiente',
    gradient: 'from-ut-accent to-emerald-400',
  },
  {
    icon: Clock,
    title: 'Respuesta Inmediata',
    description: 'Chatbot IA disponible 24/7 con respuestas en menos de 3 segundos para tus clientes.',
    stat: '<3s',
    statLabel: 'tiempo de respuesta',
    gradient: 'from-ut-electric to-violet-400',
  },
  {
    icon: TrendingUp,
    title: 'Decisiones con Datos',
    description: 'Dashboards en tiempo real y KPIs operativos para tomar decisiones estrategicas informadas.',
    stat: '100%',
    statLabel: 'trazabilidad',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Shield,
    title: 'Seguridad Total',
    description: 'Autenticacion OTP, RBAC, auditoria completa y cifrado de datos en toda la plataforma.',
    stat: '24/7',
    statLabel: 'proteccion',
    gradient: 'from-ut-primary to-ut-electric',
  },
];

export function ValueProposition() {
  return (
    <section className="py-20 bg-gradient-to-br from-violet-50/60 to-purple-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-h2 text-ut-text">
            Propuesta de <span className="text-gradient">Valor</span>
          </h2>
          <p className="mt-4 text-lg text-ut-text-muted max-w-2xl mx-auto">
            Resultados tangibles que transforman tu operacion desde el primer dia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 gap-6">
          {propositions.map((prop, i) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group text-center p-6 rounded-xl border border-ut-surface-dark bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-ut-primary hover:to-ut-electric hover:border-transparent hover:shadow-elevated transition-all duration-300 cursor-pointer"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${prop.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <prop.icon className="h-7 w-7 text-white" />
              </div>
              <p className="text-4xl font-extrabold text-gradient group-hover:text-white transition-colors duration-300">{prop.stat}</p>
              <p className="text-small text-ut-text-muted group-hover:text-white/70 mb-3 transition-colors duration-300">{prop.statLabel}</p>
              <h3 className="text-h4 text-ut-text group-hover:text-white mb-2 transition-colors duration-300">{prop.title}</h3>
              <p className="text-small text-ut-text-muted group-hover:text-white/80 transition-colors duration-300">{prop.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ValueProposition;
