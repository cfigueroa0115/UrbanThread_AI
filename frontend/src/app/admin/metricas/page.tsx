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
import { Card } from '@/components/ui/Card';

const kpis = [
  { icon: Gauge, label: 'Eficiencia operativa', value: '92%', description: 'Porcentaje de procesos completados sin intervención manual', gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  { icon: Bot, label: 'Nivel de automatización', value: '85%', description: 'Flujos automatizados con n8n y chatbot IA', gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-700' },
  { icon: RotateCcw, label: 'Reducción de reprocesos', value: '60%', description: 'Disminución de tareas repetidas gracias a validaciones inteligentes', gradient: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50', text: 'text-blue-700' },
  { icon: Leaf, label: 'Reducción huella ambiental', value: '75%', description: 'Menos papel y recursos gracias a la digitalización completa', gradient: 'from-lime-500 to-green-600', bg: 'bg-lime-50', text: 'text-green-700' },
  { icon: Database, label: 'Trazabilidad de datos', value: '100%', description: 'Registro completo de cada operación en la plataforma', gradient: 'from-sky-500 to-blue-600', bg: 'bg-sky-50', text: 'text-sky-700' },
  { icon: Clock, label: 'Tiempo de respuesta', value: '<3s', description: 'Respuesta promedio del chatbot y APIs de la plataforma', gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-700' },
  { icon: SmilePlus, label: 'Satisfacción del cliente', value: '96%', description: 'Calificación promedio de clientes en encuestas de servicio', gradient: 'from-pink-500 to-rose-600', bg: 'bg-pink-50', text: 'text-pink-700' },
  { icon: Monitor, label: 'Digitalización', value: '98%', description: 'Procesos migrados a formato digital en la plataforma', gradient: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50', text: 'text-teal-700' },
  { icon: ShoppingCart, label: 'Pedidos gestionados', value: '10K+', description: 'Total de pedidos procesados a través de la plataforma', gradient: 'from-indigo-500 to-violet-600', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  { icon: UserCheck, label: 'Clientes autenticados', value: '5K+', description: 'Usuarios registrados con acceso OTP verificado', gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
];

export default function AdminMetricasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h3 font-bold text-ut-text">Métricas y KPIs Operativos</h1>
        <p className="text-small text-ut-text-muted">
          Indicadores clave que demuestran el impacto real de la plataforma en la operación.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="p-5 h-full hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.gradient} shadow-md`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
                <p className={`text-3xl font-extrabold ${kpi.text}`}>{kpi.value}</p>
                <p className="text-sm font-semibold text-ut-text">{kpi.label}</p>
                <p className="text-xs text-ut-text-muted leading-relaxed">{kpi.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ut-text mb-4">Rendimiento Operativo</h2>
          <div className="space-y-4">
            {kpis.slice(0, 5).map((kpi) => (
              <div key={kpi.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ut-text">{kpi.label}</span>
                  <span className={`text-sm font-bold ${kpi.text}`}>{kpi.value}</span>
                </div>
                <div className="w-full bg-ut-surface-dark rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${kpi.gradient} rounded-full h-2 transition-all duration-700`}
                    style={{ width: kpi.value.replace(/[^0-9]/g, '') + '%' || '80%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ut-text mb-4">Experiencia del Cliente</h2>
          <div className="space-y-4">
            {kpis.slice(5).map((kpi) => (
              <div key={kpi.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ut-text">{kpi.label}</span>
                  <span className={`text-sm font-bold ${kpi.text}`}>{kpi.value}</span>
                </div>
                <div className="w-full bg-ut-surface-dark rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${kpi.gradient} rounded-full h-2 transition-all duration-700`}
                    style={{ width: kpi.value.replace(/[^0-9]/g, '') + '%' || '80%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
