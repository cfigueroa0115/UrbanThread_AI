'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserSearch,
  ShoppingBag,
  ClipboardList,
  FolderOpen,
  Star,
  BarChart3,
  MessageSquare,
  Plug,
  Shield,
  Settings,
  Activity,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Sidebar, type SidebarItem } from '@/components/layout/Sidebar';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/auth.store';
import { useUnreadCount } from '@/hooks/useNotifications';

const allAdminSidebarItems: SidebarItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, href: '/admin' },
  { label: 'Usuarios', icon: <Users className="h-5 w-5" />, href: '/admin/usuarios', requiredPermission: 'users:read' },
  { label: 'Clientes', icon: <UserSearch className="h-5 w-5" />, href: '/admin/clientes', requiredPermission: 'clients:read' },
  { label: 'Pedidos', icon: <ShoppingBag className="h-5 w-5" />, href: '/admin/pedidos', requiredPermission: 'orders:read' },
  { label: 'Solicitudes', icon: <ClipboardList className="h-5 w-5" />, href: '/admin/solicitudes', requiredPermission: 'requests:read' },
  { label: 'Documentos', icon: <FolderOpen className="h-5 w-5" />, href: '/admin/documentos', requiredPermission: 'documents:read' },
  { label: 'Testimonios', icon: <Star className="h-5 w-5" />, href: '/admin/testimonios', requiredPermission: 'testimonials:read' },
  { label: 'Analítica', icon: <BarChart3 className="h-5 w-5" />, href: '/admin/analitica', requiredPermission: 'analytics:read' },
  { label: 'Métricas', icon: <Activity className="h-5 w-5" />, href: '/admin/metricas', requiredPermission: 'analytics:read' },
  { label: 'Chatbot', icon: <MessageSquare className="h-5 w-5" />, href: '/admin/chatbot', requiredPermission: 'chatbot:read' },
  { label: 'Integraciones', icon: <Plug className="h-5 w-5" />, href: '/admin/integraciones', requiredPermission: 'integrations:read' },
  { label: 'Auditoría', icon: <Shield className="h-5 w-5" />, href: '/admin/auditoria', requiredPermission: 'audit:read' },
  { label: 'Configuración', icon: <Settings className="h-5 w-5" />, href: '/admin/configuracion', requiredPermission: 'settings:read' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, mode, user, logout } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useUnreadCount();

  // Wait for client-side hydration of Zustand persist store before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth guard — redirect to admin login if not authenticated as admin
  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated || mode !== 'admin') {
      router.replace('/admin/login');
    } else {
      setReady(true);
    }
  }, [mounted, isAuthenticated, mode, router]);

  const handleLogout = () => {
    logout();
    router.replace('/admin/login');
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

  const userPermissions = user?.permissions ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        variant="admin"
        user={user ? { name: user.name, email: user.email, avatar: user.avatar } : null}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden tablet:block">
          <Sidebar
            items={allAdminSidebarItems}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((prev) => !prev)}
            userPermissions={userPermissions}
          />
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
