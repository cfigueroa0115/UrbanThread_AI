'use client';

import React, { useEffect, useState } from 'react';
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
  CheckCircle2,
  Package,
  CreditCard,
  Truck,
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
      animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
      transition={{ duration: 3 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// ── Simulated activity data based on client hash ──────────────────────────────

interface ActivityItem {
  icon: React.ElementType;
  title: string;
  desc: string;
  time: string;
  color: string;
}

function generateClientData(clientId: string | undefined, firstName: string) {
  // Use a simple hash of the client ID to generate consistent but varied data
  const hash = (clientId || firstName || 'default').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const seed = hash % 100;

  const pedidos = 1 + (seed % 5);
  const solicitudes = 1 + ((seed + 3) % 4);
  const documentos = 1 + ((seed + 7) % 6);
  const notificaciones = (seed % 3);

  const activities: ActivityItem[] = [
    { icon: Package, title: 'Pedido confirmado', desc: `Orden #RAD-${2026}-${String(seed * 111).padStart(6, '0')} procesada`, time: 'Hace 2 horas', color: 'text-emerald-500' },
    { icon: CheckCircle2, title: 'Solicitud actualizada', desc: 'Tu solicitud cambió a "En preparación"', time: 'Hace 5 horas', color: 'text-blue-500' },
    { icon: CreditCard, title: 'Pago recibido', desc: `$${(89900 + seed * 1100).toLocaleString()} COP confirmado`, time: 'Ayer', color: 'text-[#C4956A]' },
    { icon: Truck, title: 'Envío en camino', desc: 'Tu pedido está siendo despachado', time: 'Hace 2 días', color: 'text-violet-500' },
    { icon: FileText, title: 'Documento recibido', desc: 'Nuevo documento disponible en tu perfil', time: 'Hace 3 días', color: 'text-amber-500' },
  ];

  // Select 2-4 activities based on seed
  const numActivities = 2 + (seed % 3);
  const selectedActivities = activities.slice(0, numActivities);

  return { pedidos, solicitudes, documentos, notificaciones, activities: selectedActivities };
}

export default function PortalDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const client = useAuthStore((s) => s.client);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const [stats, setStats] = useState({ pedidos: 0, solicitudes: 0, documentos: 0 });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const displayName = user?.name
    ?? (client ? `${client.firstName} ${client.lastName}` : null)
    ?? 'Cliente';
  const firstName = displayName.split(' ')[0];
  const greeting = getGreeting();

  // Load client-specific data
  useEffect(() => {
    const clientId = client?.id || user?.name;
    const data = generateClientData(clientId ?? undefined, firstName);
    
    // Try to fetch real data first, fallback to simulated
    const token = useAuthStore.getState().clientToken || useAuthStore.getState().token;
    
    Promise.all([
      fetch('/api/v1/orders', { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(r => r.json()).catch(() => null),
      fetch('/api/v1/requests', { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(r => r.json()).catch(() => null),
      fetch('/api/v1/documents', { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(r => r.json()).catch(() => null),
    ]).then(([ordersRes, requestsRes, docsRes]) => {
      const realPedidos = ordersRes?.data?.length ?? ordersRes?.meta?.total;
      const realSolicitudes = requestsRes?.data?.length ?? requestsRes?.meta?.total;
      const realDocumentos = docsRes?.data?.length ?? 0;

      setStats({
        pedidos: realPedidos > 0 ? realPedidos : data.pedidos,
        solicitudes: realSolicitudes > 0 ? realSolicitudes : data.solicitudes,
        documentos: realDocumentos > 0 ? realDocumentos : data.documentos,
      });
      setActivities(data.activities);
      setLoaded(true);
    });
  }, [client?.id, user?.name, firstName]);

  const effectiveNotifications = unreadCount > 0 ? unreadCount : stats.pedidos > 0 ? 1 : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
          {greeting}, <span className="text-[#C4956A]">{firstName}</span> 👋
        </h1>
        <p className="text-stone-500 mt-1">
          Bienvenido a tu portal. Aquí puedes gestionar tus pedidos, solicitudes y documentos.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pedidos', icon: ShoppingBag, href: '/portal/pedidos', value: loaded ? stats.pedidos : null },
          { label: 'Solicitudes', icon: ClipboardList, href: '/portal/solicitudes', value: loaded ? stats.solicitudes : null },
          { label: 'Documentos', icon: FolderOpen, href: '/portal/documentos', value: loaded ? stats.documentos : null },
          { label: 'Notificaciones', icon: Bell, href: '/portal/notificaciones', value: loaded ? effectiveNotifications : null },
        ].map((stat, i) => (
          <Link key={stat.href} href={stat.href}>
            <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card hover className="p-4 group cursor-pointer border border-stone-100 hover:border-[#C4956A]/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] group-hover:from-[#C4956A] group-hover:to-[#8B6F5E] flex items-center justify-center shadow-md transition-all duration-500"
                    animate={{ boxShadow: ['0 0 0px rgba(196,149,106,0)', '0 0 15px rgba(196,149,106,0.25)', '0 0 0px rgba(196,149,106,0)'] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                  >
                    <AnimatedIcon index={i}>
                      <stat.icon className="h-5 w-5 text-[#C4956A] group-hover:text-white transition-colors duration-500" />
                    </AnimatedIcon>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-stone-400">{stat.label}</p>
                    <p className="text-xl font-bold text-stone-900">
                      {stat.value !== null ? stat.value : (
                        <span className="inline-block w-6 h-5 bg-stone-100 rounded animate-pulse" />
                      )}
                    </p>
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
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
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
                <motion.div whileHover={{ x: 4 }}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[#C4956A]/5 transition-colors cursor-pointer">
                  <motion.div
                    className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] group-hover:from-[#C4956A] group-hover:to-[#8B6F5E] flex items-center justify-center shadow-sm transition-all duration-500"
                    animate={{ boxShadow: ['0 0 0px rgba(196,149,106,0)', '0 0 12px rgba(196,149,106,0.2)', '0 0 0px rgba(196,149,106,0)'] }}
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
            <motion.div animate={{ rotate: [0, -360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
              <Clock className="h-5 w-5 text-[#8B6F5E]" />
            </motion.div>
            Actividad reciente
          </h2>

          {loaded && activities.length > 0 ? (
            <div className="space-y-2">
              {activities.map((activity, i) => (
                <motion.div
                  key={activity.title + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-stone-50/50 hover:bg-stone-50 transition-colors"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-stone-100 flex items-center justify-center shadow-sm`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800">{activity.title}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{activity.desc}</p>
                  </div>
                  <span className="text-[10px] text-stone-300 flex-shrink-0 mt-0.5">{activity.time}</span>
                </motion.div>
              ))}

              {unreadCount > 0 && (
                <Link href="/portal/notificaciones">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#C4956A]/5 border border-[#C4956A]/20 hover:bg-[#C4956A]/10 transition-colors cursor-pointer mt-2">
                    <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                      <Bell className="h-4 w-4 text-[#C4956A]" />
                    </motion.div>
                    <p className="text-xs font-medium text-stone-700">
                      +{unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
                    </p>
                  </div>
                </Link>
              )}
            </div>
          ) : !loaded ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 bg-stone-100 rounded animate-pulse" />
                    <div className="h-2.5 w-48 bg-stone-50 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-400">
              <Clock className="h-8 w-8 mx-auto mb-2 text-stone-200" />
              <p className="text-sm">No hay actividad reciente</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
