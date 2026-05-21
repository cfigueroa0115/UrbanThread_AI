'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Menu, LogOut, User, Settings, Home, Sparkles, Leaf, Wrench, Star, MessageCircle, BarChart3, type LucideIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown, type DropdownItem } from '@/components/ui/Dropdown';
import { MobileMenu } from './MobileMenu';
import { CartHeaderButton } from '@/components/cart/CartHeaderButton';

export interface HeaderProps {
  variant: 'public' | 'admin' | 'portal';
  user?: { name: string; email: string; avatar?: string } | null;
  notifications?: number;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

const publicLinks: Array<{ label: string; href: string; icon?: LucideIcon }> = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'UrbanThread', href: '/quienes-somos', icon: Sparkles },
  { label: 'Sostenibilidad', href: '/sostenibilidad', icon: Leaf },
  { label: 'Servicios', href: '/servicios', icon: Wrench },
  { label: 'Insights', href: '/insights', icon: BarChart3 },
  { label: 'Testimonios', href: '/testimonios', icon: Star },
  { label: 'Contacto', href: '/contacto', icon: MessageCircle },
];

const adminLinks: Array<{ label: string; href: string; icon?: LucideIcon }> = [
  { label: 'Dashboard', href: '/admin' },
];

const portalLinks: Array<{ label: string; href: string; icon?: LucideIcon }> = [
  { label: 'Mi Perfil', href: '/portal/perfil' },
  { label: 'Pedidos', href: '/portal/pedidos' },
  { label: 'Solicitudes', href: '/portal/solicitudes' },
  { label: 'Radicación', href: '/portal/radicacion' },
  { label: 'Documentos', href: '/portal/documentos' },
  { label: 'Notificaciones', href: '/portal/notificaciones' },
];

/* Full navigation for the hamburger menu */
const fullMenuLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'UrbanThread', href: '/quienes-somos' },
  { label: 'Sostenibilidad', href: '/sostenibilidad' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Insights', href: '/insights' },
  { label: 'Testimonios', href: '/testimonios' },
  { label: 'Contacto', href: '/contacto' },
  { label: 'Portal Cliente', href: '/cliente/login' },
  { label: 'Panel Admin', href: '/admin/login' },
];

export function Header({ variant, user, notifications = 0, onLogout, onToggleSidebar }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = variant === 'admin' ? adminLinks : variant === 'portal' ? portalLinks : publicLinks;

  const userMenuItems: DropdownItem[] = [
    { key: 'profile', label: 'Mi Perfil', icon: <User className="h-4 w-4" />, onClick: () => {} },
    { key: 'settings', label: 'Configuracion', icon: <Settings className="h-4 w-4" />, onClick: () => {} },
    { key: 'logout', label: 'Cerrar Sesion', icon: <LogOut className="h-4 w-4" />, danger: true, onClick: onLogout },
  ];

  return (
    <>
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-ut-surface-dark" style={{ zIndex: 45 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-5">
              {/* Hamburger - always visible */}
              <button
                onClick={() => {
                  if (variant !== 'public' && onToggleSidebar) {
                    // On admin/portal in desktop, toggle sidebar
                    onToggleSidebar();
                  }
                  // Always open the slide-out menu
                  setMenuOpen(true);
                }}
                className="p-2.5 rounded-xl bg-ut-primary/5 text-ut-primary hover:bg-ut-primary/10 transition-colors"
                aria-label="Abrir menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              <Link href="/" className="flex items-center">
                <img src="/images/logo.png" alt="UrbanThread AI" className="h-20 w-auto object-contain" />
              </Link>
            </div>

            {/* Center: Navigation (desktop only) */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Navegacion principal">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                const isSostenibilidad = link.href === '/sostenibilidad';
                const activeColor = isSostenibilidad ? 'text-emerald-600' : 'text-[#C4956A]';
                const activeBg = isSostenibilidad ? 'bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-[#C4956A]/10 shadow-[0_0_12px_rgba(196,149,106,0.3)]';
                const activeBar = isSostenibilidad ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-gradient-to-r from-[#C4956A] to-[#D4A76A] shadow-[0_0_8px_rgba(196,149,106,0.6)]';
                const hoverColor = isSostenibilidad ? 'hover:text-emerald-600 hover:bg-emerald-500/5' : 'hover:text-[#C4956A] hover:bg-[#C4956A]/5';

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? `${activeColor} ${activeBg}`
                        : `text-ut-text-muted ${hoverColor}`
                    }`}
                  >
                    {link.icon && <link.icon className="h-3.5 w-3.5" strokeWidth={2} />}
                    {link.label}
                    {isActive && (
                      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full ${activeBar}`} />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {variant === 'public' && (
                <>
                  <CartHeaderButton />
                  <Link
                    href="/cliente/login"
                    className="hidden md:inline-flex px-4 py-2 text-sm font-semibold text-ut-accent hover:bg-ut-accent/10 rounded-lg transition-colors"
                  >
                    Portal Cliente
                  </Link>
                  <Link
                    href="/admin/login"
                    className="hidden md:inline-flex px-4 py-2 text-sm font-semibold bg-ut-accent text-white rounded-lg hover:bg-ut-accent-hover transition-colors"
                  >
                    Admin
                  </Link>
                </>
              )}

              {user && (
                <>
                  <button
                    className="relative p-2 rounded-lg text-ut-text-muted hover:bg-ut-primary/5 hover:text-ut-text transition-colors"
                    aria-label={`Notificaciones${notifications > 0 ? ` (${notifications} sin leer)` : ''}`}
                  >
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-ut-danger text-white text-[10px] font-bold">
                        {notifications > 99 ? '99+' : notifications}
                      </span>
                    )}
                  </button>

                  {/* Connected user info + logout */}
                  <div className="flex items-center gap-2 pl-2 border-l border-ut-surface-dark">
                    <div className="relative flex-shrink-0">
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white z-10" />
                      <Avatar name={user.name} src={user.avatar} size="sm" />
                    </div>
                    <div className="hidden md:flex flex-col leading-none">
                      <span className="text-xs font-semibold text-ut-text truncate max-w-[130px]">{user.name}</span>
                      <span className="text-[10px] text-ut-text-muted truncate max-w-[130px]">{user.email}</span>
                    </div>
                    <button
                      onClick={onLogout}
                      className="p-2 rounded-lg text-ut-text-muted hover:bg-red-50 hover:text-ut-danger transition-colors"
                      aria-label="Cerrar sesion"
                      title="Cerrar sesion"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out menu with all options */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={variant === 'public' ? fullMenuLinks : navLinks}
        variant={variant}
      />
    </>
  );
}

export default Header;
