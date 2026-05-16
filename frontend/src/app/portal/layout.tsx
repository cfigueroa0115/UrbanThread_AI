'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  ShoppingBag,
  FileText,
  FolderOpen,
  Bell,
  ClipboardList,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Sidebar, type SidebarItem } from '@/components/layout/Sidebar';
import { CartPanel } from '@/components/cart/CartPanel';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';
import { useUnreadCount } from '@/hooks/useNotifications';
import { SESSION_EXPIRATION_MINUTES } from '@shared/constants';

const SESSION_TIMEOUT_MS = SESSION_EXPIRATION_MINUTES * 60 * 1000;

const portalSidebarItems: SidebarItem[] = [
  { label: 'Mi Perfil', icon: <User className="h-5 w-5" />, href: '/portal/perfil' },
  { label: 'Pedidos', icon: <ShoppingBag className="h-5 w-5" />, href: '/portal/pedidos' },
  { label: 'Solicitudes', icon: <ClipboardList className="h-5 w-5" />, href: '/portal/solicitudes' },
  { label: 'Radicación', icon: <FileText className="h-5 w-5" />, href: '/portal/radicacion' },
  { label: 'Documentos', icon: <FolderOpen className="h-5 w-5" />, href: '/portal/documentos' },
  { label: 'Notificaciones', icon: <Bell className="h-5 w-5" />, href: '/portal/notificaciones' },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, client, logout, logoutClient, mode } = useAuthStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch unread notification count
  useUnreadCount();

  // Wait for client-side hydration of Zustand persist store before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.replace('/cliente/login');
    } else {
      setReady(true);
    }
  }, [mounted, isAuthenticated, router]);

  // Session inactivity timeout
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      logout();
      router.replace('/cliente/login');
    }, SESSION_TIMEOUT_MS);
  }, [logout, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'] as const;
    const handler = () => resetTimer();

    events.forEach((evt) => window.addEventListener(evt, handler, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handler));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isAuthenticated, resetTimer]);

  const handleLogout = () => {
    if (mode === 'client') {
      logoutClient();
    } else {
      logout();
    }
    router.replace('/cliente/login');
  };

  // Always render the same loading UI on server and initial client render
  // to avoid hydration mismatch. Only diverge after mount.
  if (!mounted || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" suppressHydrationWarning>
        <Spinner size="lg" />
      </div>
    );
  }

  // Inject notification badge into sidebar items
  const sidebarItems = portalSidebarItems.map((item) =>
    item.href === '/portal/notificaciones' ? { ...item, badge: unreadCount } : item,
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        variant="portal"
        user={
          user
            ? { name: user.name, email: user.email, avatar: user.avatar }
            : client
              ? { name: `${client.firstName} ${client.lastName}`, email: client.email ?? '' }
              : null
        }
        notifications={unreadCount}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden tablet:block">
          <Sidebar
            items={sidebarItems}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((prev) => !prev)}
          />
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative bg-white">
          {/* Subtle fashion grid background */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.05]" style={{ zIndex: 0 }}>
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-1">
              {['1536619','1462637','2043590','1755428','985635','1021693','1187957','1036623','2220316','1043474','1681010','3760514'].map((id, i) => (
                <div key={i} className="overflow-hidden rounded-lg">
                  <img src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1`} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
          {/* Dot pattern */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{ zIndex: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, #C4956A 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="relative" style={{ zIndex: 1 }}>
            {children}
          </div>
        </main>
      </div>
      <CartPanel />
    </div>
  );
}
