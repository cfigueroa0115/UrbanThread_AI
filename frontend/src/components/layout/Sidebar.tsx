'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  children?: SidebarItem[];
  requiredPermission?: string;
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle: () => void;
  userPermissions?: string[];
  className?: string;
}

function SidebarLink({
  item,
  collapsed,
  pathname,
  userPermissions,
}: {
  item: SidebarItem;
  collapsed: boolean;
  pathname: string;
  userPermissions: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

  // Permission check
  if (item.requiredPermission && !userPermissions.includes(item.requiredPermission)) {
    return null;
  }

  const hasChildren = item.children && item.children.length > 0;

  return (
    <li>
      {hasChildren ? (
        <>
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-small font-medium
              transition-colors
              ${isActive ? 'bg-[#C4956A]/20 text-[#C4956A] font-semibold' : 'text-ut-text-muted hover:bg-[#C4956A]/10 hover:text-[#C4956A]'}
            `}
            aria-expanded={expanded}
          >
            <span className="flex-shrink-0" aria-hidden="true">{item.icon}</span>
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge != null && item.badge > 0 && (
                  <Badge variant="info">{item.badge}</Badge>
                )}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </>
            )}
          </button>
          <AnimatePresence>
            {expanded && !collapsed && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-6 mt-1 space-y-1 overflow-hidden"
              >
                {item.children!.map((child) => (
                  <SidebarLink
                    key={child.href}
                    item={child}
                    collapsed={collapsed}
                    pathname={pathname}
                    userPermissions={userPermissions}
                  />
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link
          href={item.href}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg text-small font-medium
            transition-colors
            ${isActive ? 'bg-[#C4956A]/20 text-[#C4956A] font-semibold' : 'text-ut-text-muted hover:bg-[#C4956A]/10 hover:text-[#C4956A]'}
          `}
          aria-current={isActive ? 'page' : undefined}
        >
          <span className="flex-shrink-0" aria-hidden="true">{item.icon}</span>
          {!collapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <Badge variant="info">{item.badge}</Badge>
              )}
            </>
          )}
        </Link>
      )}
    </li>
  );
}

export function Sidebar({ items, collapsed = false, onToggle, userPermissions = [], className = '' }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        flex flex-col bg-white/80 backdrop-blur-sm border-r border-ut-surface-dark
        transition-all duration-300 h-full
        ${collapsed ? 'w-16' : 'w-64'}
        ${className}
      `}
      aria-label="Barra lateral"
    >
      {/* Collapse toggle */}
      <div className="flex items-center justify-end p-3 border-b border-ut-surface-dark">
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md text-ut-text-muted hover:bg-ut-surface-dark hover:text-ut-text transition-colors focus-ring"
          aria-label={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1" role="list">
          {items.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              pathname={pathname}
              userPermissions={userPermissions}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
