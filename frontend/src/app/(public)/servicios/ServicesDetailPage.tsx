'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  Globe,
  Bot,
  Smartphone,
  Shield,
  Database,
  Users,
  Bell,
  X,
} from 'lucide-react';

const services = [
  {
    icon: ShoppingBag,
    title: 'Gestión de Pedidos',
    description: 'Administración completa del ciclo de vida de pedidos con seguimiento de estados, historial detallado y notificaciones automáticas.',
    features: ['Creación y seguimiento', 'Historial de estados', 'Notificaciones automáticas', 'Reportes de pedidos'],
    gradient: 'from-[#C4956A] to-[#8B6F5E]',
    glow: 'rgba(196,149,106,0.4)',
    help: 'Desde tu Portal Cliente puedes ver todos tus pedidos en tiempo real. Cada vez que el estado cambia (confirmado, en preparación, enviado, entregado), recibirás una notificación automática por correo. También puedes ver el historial completo de cada pedido y descargar tu factura electrónica.',
  },
  {
    icon: FileText,
    title: 'Radicación Digital',
    description: 'Flujo de 12 pasos con generación automática de número de radicación, adjuntos digitales y trazabilidad completa.',
    features: ['12 pasos guiados', 'Número automático', 'Adjuntos digitales', 'Trazabilidad completa'],
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.4)',
    help: 'La radicación es el proceso para crear solicitudes formales: nuevos pedidos, devoluciones, cambios o garantías. Sigue los 12 pasos guiados, selecciona tus productos con talla y color, y recibe un número único (RAD-2026-XXXXXX) para hacer seguimiento en cualquier momento desde "Mis Solicitudes".',
  },
  {
    icon: Bot,
    title: 'Chatbot IA — Zyla',
    description: 'Asistente inteligente disponible 24/7 con base de conocimiento de 500+ respuestas, clasificación de intenciones y escalamiento.',
    features: ['Disponible 24/7', 'Respuestas en <3s', '500+ respuestas', 'Escalamiento inteligente'],
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59,130,246,0.4)',
    help: 'Zyla es tu asistente virtual personal. Haz clic en el ícono flotante en la esquina inferior derecha para hablar con ella. Puede ayudarte a rastrear pedidos, resolver dudas sobre tallas, informarte sobre políticas de devolución, métodos de pago y mucho más. Si necesitas ayuda humana, Zyla puede escalar tu caso.',
  },
  {
    icon: Smartphone,
    title: 'WhatsApp Business',
    description: 'Comunicación directa con clientes para consultas, envío de documentos y actualizaciones de solicitudes en tiempo real.',
    features: ['WhatsApp Business API', 'Envío de documentos', 'Clasificación de intenciones', 'Trazabilidad'],
    gradient: 'from-green-500 to-emerald-600',
    glow: 'rgba(34,197,94,0.4)',
    help: 'Escríbenos al WhatsApp 300 509 1114 para atención personalizada. Puedes consultar el estado de tus pedidos, enviar documentos, solicitar asesoría de moda y recibir confirmaciones de tus radicaciones. Nuestro equipo está disponible de lunes a sábado de 7am a 9pm.',
  },
  {
    icon: Globe,
    title: 'Portal de Cliente',
    description: 'Acceso seguro con OTP para gestionar perfil, documentos, pedidos, solicitudes y notificaciones desde cualquier dispositivo.',
    features: ['Autenticación OTP', 'Gestión de perfil', 'Carga de documentos', 'Historial completo'],
    gradient: 'from-teal-500 to-cyan-600',
    glow: 'rgba(20,184,166,0.4)',
    help: 'Tu Portal Cliente es tu espacio personal seguro. Ingresa con tu tipo y número de documento, recibe un código OTP en tu correo y accede a: tu perfil, historial de pedidos, solicitudes con seguimiento, documentos descargables y notificaciones. Todo desde tu celular o computador.',
  },
  {
    icon: Shield,
    title: 'Panel Administrativo',
    description: 'Interfaz completa con RBAC, gestión de usuarios, clientes, pedidos, solicitudes, configuración y auditoría.',
    features: ['RBAC completo', 'Gestión de usuarios', 'Auditoría de acciones', 'Configuración'],
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'rgba(99,102,241,0.4)',
    help: 'El Panel Admin es exclusivo para el equipo de UrbanThread AI. Permite gestionar clientes, procesar pedidos, revisar solicitudes, configurar roles y permisos, ver logs de auditoría y monitorear la operación completa de la plataforma en tiempo real.',
  },
  {
    icon: BarChart3,
    title: 'Analítica Avanzada',
    description: 'Dashboards interactivos con métricas en tiempo real, KPIs operativos y reportes para decisiones estratégicas.',
    features: ['Dashboards real-time', 'KPIs operativos', 'Tracking de eventos', 'Reportes exportables'],
    gradient: 'from-rose-500 to-pink-600',
    glow: 'rgba(244,63,94,0.4)',
    help: 'Nuestro módulo de analítica captura cada interacción en la plataforma: visitas, clics, compras, interacciones con el chatbot y más. Los dashboards muestran métricas clave como tasa de conversión, productos más vendidos, tiempos de respuesta y satisfacción del cliente.',
  },
  {
    icon: Settings,
    title: 'Automatización n8n',
    description: 'Flujos de trabajo automatizados con webhooks, integración de sistemas externos y procesamiento inteligente.',
    features: ['Webhooks configurables', 'Flujos automatizados', 'Integración de sistemas', 'Procesamiento eventos'],
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.4)',
    help: 'Cada acción importante en la plataforma dispara automáticamente flujos de trabajo: al crear una radicación se envía un correo de confirmación, al cambiar el estado de un pedido se notifica al cliente, y al escalar un chat se crea un ticket de soporte. Todo sin intervención manual.',
  },
  {
    icon: MessageSquare,
    title: 'Comunicación Omnicanal',
    description: 'Sistema unificado que integra chatbot, WhatsApp, correo electrónico y notificaciones en una sola plataforma.',
    features: ['Chatbot IA', 'WhatsApp Business', 'Email automático', 'Notificaciones push'],
    gradient: 'from-sky-500 to-blue-600',
    glow: 'rgba(14,165,233,0.4)',
    help: 'No importa por dónde nos contactes — chatbot, WhatsApp, correo o portal — toda la comunicación queda registrada y trazable. Puedes iniciar una conversación por WhatsApp y continuarla en el portal, o viceversa. Tu historial siempre está disponible.',
  },
  {
    icon: Database,
    title: 'Base de Datos Robusta',
    description: 'PostgreSQL con 30+ tablas normalizadas, Prisma ORM, migraciones automáticas y trazabilidad completa.',
    features: ['30+ tablas', 'Prisma ORM', 'Migraciones automáticas', 'Índices optimizados'],
    gradient: 'from-slate-600 to-zinc-700',
    glow: 'rgba(100,116,139,0.4)',
    help: 'Toda tu información está almacenada de forma segura en una base de datos PostgreSQL con encriptación. Cada acción queda registrada en logs de auditoría. Tus datos personales están protegidos según la Ley 1581 de 2012 y puedes solicitar su eliminación en cualquier momento.',
  },
  {
    icon: Users,
    title: 'Gestión de Clientes',
    description: 'Administración completa con múltiples documentos, direcciones, correos, teléfonos y perfil detallado.',
    features: ['Múltiples documentos', 'Direcciones y contactos', 'Búsqueda avanzada', 'Perfil completo'],
    gradient: 'from-fuchsia-500 to-pink-600',
    glow: 'rgba(217,70,239,0.4)',
    help: 'Tu perfil de cliente almacena toda tu información: documento de identidad, direcciones de envío, correos electrónicos, teléfonos y preferencias. Puedes actualizar tus datos en cualquier momento desde el Portal Cliente. Guardamos múltiples direcciones para que el checkout sea más rápido.',
  },
  {
    icon: Bell,
    title: 'Notificaciones',
    description: 'Sistema en tiempo real con conteo de no leídas, marcado como leída y notificaciones por correo electrónico.',
    features: ['Tiempo real', 'Conteo no leídas', 'Email automático', 'Historial completo'],
    gradient: 'from-yellow-500 to-amber-600',
    glow: 'rgba(234,179,8,0.4)',
    help: 'Recibirás notificaciones automáticas por cada evento importante: confirmación de pedido, cambio de estado, respuesta a tu solicitud, promociones exclusivas y más. Puedes verlas en tu Portal Cliente (ícono de campana) y también llegan a tu correo electrónico.',
  },
];

export function ServicesDetailPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <main className="py-20 relative overflow-hidden min-h-screen">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900">
            Nuestros <span className="text-[#C4956A]">Servicios</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-stone-500 max-w-3xl mx-auto">
            Descubre todas las capacidades de UrbanThread AI para transformar tu operación de retail
            en una experiencia inteligente, eficiente y sostenible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => setSelectedIdx(i)}
              className="group relative rounded-2xl cursor-pointer"
            >
              {/* Default subtle glow pulse */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{
                  boxShadow: [
                    `0 0 0px transparent`,
                    `0 4px 20px ${service.glow}`,
                    `0 0 0px transparent`,
                  ],
                }}
                transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              />
              {/* Rotating border — always visible */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `conic-gradient(from 0deg, transparent 30%, ${service.glow.replace('0.4', '0.8')} 45%, white 50%, ${service.glow.replace('0.4', '0.8')} 55%, transparent 70%)`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: '2px',
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              {/* Card body */}
              <div
                className="relative h-full rounded-2xl border border-stone-100 group-hover:border-transparent p-6 transition-all duration-500 group-hover:shadow-2xl"
                style={{
                  background: hoveredIdx === i
                    ? `linear-gradient(135deg, ${service.glow.replace('0.4', '0.08')}, white, ${service.glow.replace('0.4', '0.05')})`
                    : 'white',
                }}
              >
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: `0 10px 40px ${service.glow}, inset 0 0 30px ${service.glow.replace('0.4', '0.05')}` }}
                />

                {/* Icon */}
                <motion.div
                  className={`relative inline-flex p-3.5 rounded-xl bg-gradient-to-br ${service.gradient} shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}
                  animate={{
                    boxShadow: ['0 0 0px transparent', `0 0 18px ${service.glow}`, '0 0 0px transparent'],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                >
                  <service.icon className="h-6 w-6 text-white" strokeWidth={2} />
                  {/* Icon glow */}
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: `0 0 20px ${service.glow}` }}
                  />
                </motion.div>

                {/* Title */}
                <h2 className="mt-4 text-lg font-bold text-stone-900 transition-colors duration-300">
                  {service.title}
                </h2>

                {/* Description */}
                <p className="mt-2 text-sm text-stone-500 leading-relaxed transition-colors duration-300">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="mt-4 pt-4 border-t border-stone-100 group-hover:border-stone-200 space-y-2 transition-colors duration-300">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-xs text-stone-500 group-hover:text-stone-700 transition-colors duration-300">
                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient} flex-shrink-0 group-hover:scale-150 transition-transform duration-300`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Popup Modal */}
        <AnimatePresence>
          {selectedIdx !== null && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedIdx(null)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-stone-200">
                  {/* Header */}
                  <div
                    className="px-6 py-5 flex items-center gap-4"
                    style={{ background: `linear-gradient(135deg, ${services[selectedIdx].glow.replace('0.4', '0.15')}, white)` }}
                  >
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${services[selectedIdx].gradient} flex items-center justify-center shadow-lg`}>
                      {React.createElement(services[selectedIdx].icon, { className: 'h-7 w-7 text-white', strokeWidth: 2 })}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-stone-900">{services[selectedIdx].title}</h3>
                      <p className="text-sm text-stone-500">{services[selectedIdx].description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedIdx(null)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {/* Body */}
                  <div className="px-6 py-5">
                    <p className="text-sm font-semibold text-[#C4956A] uppercase tracking-wider mb-2">¿Cómo te ayuda?</p>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {services[selectedIdx].help}
                    </p>
                  </div>
                  {/* Features */}
                  <div className="px-6 pb-5">
                    <div className="flex flex-wrap gap-2">
                      {services[selectedIdx].features.map((f) => (
                        <span key={f} className={`px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r ${services[selectedIdx].gradient} text-white`}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="px-6 pb-5">
                    <button
                      onClick={() => setSelectedIdx(null)}
                      className="w-full py-3 rounded-xl bg-[#1A1A1A] text-white font-semibold text-sm hover:bg-[#2D2D2D] transition-colors"
                    >
                      Entendido ✓
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default ServicesDetailPage;
