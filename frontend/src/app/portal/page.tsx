'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  ClipboardList,
  FolderOpen,
  Bell,
  FileText,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos dias';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

/* Animated icon wrapper */
function AnimatedIcon({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.08, 1],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        duration: 3 + index * 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.3,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function PortalDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const client = useAuthStore((s) => s.client);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const displayName = user?.name
    ?? (client ? `${client.firstName} ${client.lastName}` : null)
    ?? 'Cliente';

  const greeting = getGreeting();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
          {greeting}, <span className="text-[#C4956A]">{displayName.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-stone-500 mt-1">
          Bienvenido a tu portal. Aquí puedes gestionar tus pedidos, solicitudes y documentos.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pedidos', icon: ShoppingBag, href: '/portal/pedidos' },
          { label: 'Solicitudes', icon: ClipboardList, href: '/portal/solicitudes' },
          { label: 'Documentos', icon: FolderOpen, href: '/portal/documentos' },
          { label: 'Notificaciones', icon: Bell, href: '/portal/notificaciones', value: unreadCount },
        ].map((stat, i) => (
          <Link key={stat.href} href={stat.href}>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card hover className="p-4 group cursor-pointer border border-stone-100 hover:border-[#C4956A]/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] group-hover:from-[#C4956A] group-hover:to-[#8B6F5E] flex items-center justify-center shadow-md transition-all duration-500"
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(196,149,106,0)',
                        '0 0 15px rgba(196,149,106,0.25)',
                        '0 0 0px rgba(196,149,106,0)',
                      ],
                    }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                  >
                    <AnimatedIcon index={i}>
                      <stat.icon className="h-5 w-5 text-[#C4956A] group-hover:text-white transition-colors duration-500" />
                    </AnimatedIcon>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-stone-400">{stat.label}</p>
                    <p className="text-xl font-bold text-stone-900">{stat.value ?? '--'}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-stone-300 group-hover:text-[#C4956A] transition-colors duration-300" />
                </div>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Quick actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 border border-stone-100">
          <h2 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <TrendingUp className="h-5 w-5 text-[#C4956A]" />
            </motion.div>
            Acciones rápidas
          </h2>
          <div className="space-y-1">
            {[
              { label: 'Nueva radicación', desc: 'Radicar una nueva solicitud o pedido', icon: FileText, href: '/portal/radicacion' },
              { label: 'Ver mis pedidos', desc: 'Consultar el estado de tus pedidos', icon: ShoppingBag, href: '/portal/pedidos' },
              { label: 'Mis solicitudes', desc: 'Seguimiento de solicitudes radicadas', icon: ClipboardList, href: '/portal/solicitudes' },
              { label: 'Cargar documento', desc: 'Subir un nuevo documento a tu perfil', icon: FolderOpen, href: '/portal/documentos' },
            ].map((action, i) => (
              <Link key={action.href} href={action.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[#C4956A]/5 transition-colors cursor-pointer"
                >
                  <motion.div
                    className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] group-hover:from-[#C4956A] group-hover:to-[#8B6F5E] flex items-center justify-center shadow-sm transition-all duration-500"
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(196,149,106,0)',
                        '0 0 12px rgba(196,149,106,0.2)',
                        '0 0 0px rgba(196,149,106,0)',
                      ],
                    }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
                  >
                    <AnimatedIcon index={i}>
                      <action.icon className="h-4 w-4 text-[#C4956A] group-hover:text-white transition-colors duration-500" />
                    </AnimatedIcon>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 text-sm group-hover:text-[#C4956A] transition-colors duration-300">{action.label}</p>
                    <p className="text-xs text-stone-400">{action.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-stone-300 opacity-0 group-hover:opacity-100 group-hover:text-[#C4956A] transition-all duration-300" />
                </motion.div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5 border border-stone-100">
          <h2 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Clock className="h-5 w-5 text-[#8B6F5E]" />
            </motion.div>
            Actividad reciente
          </h2>
          {unreadCount > 0 ? (
            <Link href="/portal/notificaciones">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#C4956A]/5 border border-[#C4956A]/20 hover:bg-[#C4956A]/10 transition-colors cursor-pointer">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Bell className="h-5 w-5 text-[#C4956A]" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-800">
                    Tienes {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
                  </p>
                  <p className="text-xs text-stone-400">Haz clic para verlas</p>
                </div>
                <Badge variant="info">{unreadCount}</Badge>
              </div>
            </Link>
          ) : (
            <div className="text-center py-10 text-stone-400">
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              >
                <Clock className="h-10 w-10 mx-auto mb-2 text-stone-200" />
              </motion.div>
              <p className="text-sm">No hay actividad reciente</p>
              <p className="text-xs mt-1 text-stone-300">Tu actividad aparecerá aquí</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
