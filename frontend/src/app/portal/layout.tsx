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
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 tablet:pb-6 lg:p-8 lg:pb-8 relative bg-white">
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

      {/* Mobile bottom navigation — visible only below tablet breakpoint */}
      <MobileBottomNav unreadCount={unreadCount} />
    </div>
  );
}


// ── Mobile Bottom Navigation ─────────────────────────────────────────────────

interface MobileBottomNavProps {
  unreadCount: number;
}

const bottomNavItems = [
  { label: 'Perfil', icon: User, href: '/portal/perfil' },
  { label: 'Pedidos', icon: ShoppingBag, href: '/portal/pedidos' },
  { label: 'Radicar', icon: FileText, href: '/portal/radicacion' },
  { label: 'Solicitudes', icon: ClipboardList, href: '/portal/solicitudes' },
  { label: 'Docs', icon: FolderOpen, href: '/portal/documentos' },
  { label: 'Alertas', icon: Bell, href: '/portal/notificaciones' },
];

function MobileBottomNav({ unreadCount }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="tablet:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 safe-area-bottom"
      style={{ zIndex: 40 }}
      aria-label="Navegación del portal"
    >
      <div className="flex items-center justify-around px-1 py-2">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          const isRadicacion = item.href === '/portal/radicacion';
          const isNotifications = item.href === '/portal/notificaciones';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl min-w-[52px] transition-all duration-200 ${
                isActive
                  ? isRadicacion
                    ? 'text-[#C4956A] bg-[#C4956A]/10'
                    : 'text-[#C4956A] bg-[#C4956A]/5'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="relative">
                <Icon className={`h-5 w-5 ${isRadicacion && isActive ? 'scale-110' : ''} transition-transform`} strokeWidth={isActive ? 2.2 : 1.8} />
                {isNotifications && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 flex items-center justify-center h-3.5 min-w-[14px] px-0.5 rounded-full bg-red-500 text-white text-[8px] font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-medium leading-tight ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-[#C4956A]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
