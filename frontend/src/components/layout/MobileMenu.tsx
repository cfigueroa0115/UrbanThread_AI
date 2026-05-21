'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ShieldCheck, ShoppingBag, FileText, FolderOpen, Bell, ClipboardList } from 'lucide-react';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
  variant: 'public' | 'admin' | 'portal';
}

interface SubCategory {
  label: string;
  href: string;
  image: string;
  tag?: string;
}

interface Category {
  name: string;
  icon: 'woman' | 'man' | 'kids' | 'beauty' | 'accessories';
  /** Key that maps to FashionCollections tab */
  collectionKey: string;
  subcategories: SubCategory[];
}

const categories: Category[] = [
  {
    name: 'MUJER',
    icon: 'woman',
    collectionKey: 'mujer',
    subcategories: [
      { label: 'Ver Todo', href: '#colecciones', image: '/images/vestidos-2.jpg', tag: 'NEW' },
      { label: 'Vestidos', href: '#colecciones', image: '/images/vestidos-1.jpg' },
      { label: 'Blusas y Tops', href: '#colecciones', image: '/images/blusas-1.jpg' },
      { label: 'Jeans', href: '#colecciones', image: '/images/jeans-1.jpg' },
      { label: 'Faldas', href: '#colecciones', image: '/images/faldas-2.jpg' },
      { label: 'Chaquetas', href: '#colecciones', image: '/images/chaquetas-2.jpg' },
      { label: 'Zapatos', href: '#colecciones', image: '/images/zapatos-2.jpg' },
      { label: 'Accesorios', href: '#colecciones', image: '/images/accesorios-1.jpg' },
      { label: 'Lociones', href: '#colecciones', image: '/images/lociones-3.jpg' },
    ],
  },
  {
    name: 'HOMBRE',
    icon: 'man',
    collectionKey: 'hombre',
    subcategories: [
      { label: 'Ver Todo', href: '#colecciones', image: '/images/hombre-camisas-1.jpg', tag: 'NEW' },
      { label: 'Camisas & Camisetas', href: '#colecciones', image: '/images/hombre-camisas-2.jpg' },
      { label: 'Pantalones', href: '#colecciones', image: '/images/hombre-pantalones-1.jpg' },
      { label: 'Chaquetas', href: '#colecciones', image: '/images/hombre-chaquetas-2.jpg' },
      { label: 'Trajes', href: '#colecciones', image: '/images/hombre-trajes-1.jpg' },
      { label: 'Lociones', href: '#colecciones', image: '/images/hombre-lociones-1.jpg' },
      { label: 'Zapatos', href: '#colecciones', image: '/images/hombre-zapatos-1.jpg' },
      { label: 'Accesorios', href: '#colecciones', image: '/images/hombre-accesorios-1.jpg' },
    ],
  },
  {
    name: 'NIÑOS',
    icon: 'kids',
    collectionKey: 'ninos',
    subcategories: [
      { label: 'Niña 6-14 años', href: '#colecciones', image: '/images/nina-vestido-rojo.jpg' },
      { label: 'Niño 6-14 años', href: '#colecciones', image: '/images/nino-conjunto-naranja.jpg' },
      { label: 'Niña 1½-6 años', href: '#colecciones', image: '/images/nina-conjunto-rosa.jpg' },
      { label: 'Niño 1½-6 años', href: '#colecciones', image: '/images/nino-tracksuit-sport.jpg' },
      { label: 'Bebé 0-18 meses', href: '#colecciones', image: 'https://images.pexels.com/photos/265987/pexels-photo-265987.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1' },
      { label: 'Zapatos', href: '#colecciones', image: '/images/ninos-zapatos-1.jpg' },
      { label: 'Accesorios', href: '#colecciones', image: '/images/accesorios-cinturones-1.jpg' },
    ],
  },
  {
    name: 'BEAUTY',
    icon: 'beauty',
    collectionKey: 'beauty',
    subcategories: [
      { label: 'Ver Todo', href: '#colecciones', image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', tag: 'NEW' },
      { label: 'Fragancias Mujer', href: '#colecciones', image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1' },
      { label: 'Fragancias Hombre', href: '#colecciones', image: 'https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1' },
      { label: 'Cuidado Facial', href: '#colecciones', image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1' },
      { label: 'Cuidado Corporal', href: '#colecciones', image: 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1' },
      { label: 'Maquillaje', href: '#colecciones', image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1' },
      { label: 'Sets de Regalo', href: '#colecciones', image: 'https://images.pexels.com/photos/2587370/pexels-photo-2587370.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', tag: 'GIFT' },
    ],
  },
  {
    name: 'ACCESORIOS',
    icon: 'accessories',
    collectionKey: 'accesorios',
    subcategories: [
      { label: 'Ver Todo', href: '#colecciones', image: '/images/accesorios-cinturones-2.jpg' },
      { label: 'Bolsos', href: '#colecciones', image: '/images/accesorios-1.jpg' },
      { label: 'Gafas de Sol', href: '#colecciones', image: '/images/accesorios-gafas-1.jpg' },
      { label: 'Joyería', href: '#colecciones', image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1' },
      { label: 'Cinturones', href: '#colecciones', image: '/images/accesorios-cinturones-1.jpg' },
      { label: 'Sombreros', href: '#colecciones', image: '/images/accesorios-cinturones-2.jpg' },
      { label: 'Bufandas', href: '#colecciones', image: '/images/accesorios-gafas-2.jpg' },
    ],
  },
];

const adminPortalLinks = {
  admin: [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Clientes', href: '/admin/clientes' },
    { label: 'Pedidos', href: '/admin/pedidos' },
    { label: 'Solicitudes', href: '/admin/solicitudes' },
    { label: 'Analítica', href: '/admin/analitica' },
    { label: 'Métricas', href: '/admin/metricas' },
    { label: 'Configuración', href: '/admin/configuracion' },
  ],
  portal: [
    { label: 'Mi Perfil', href: '/portal/perfil' },
    { label: 'Pedidos', href: '/portal/pedidos' },
    { label: 'Solicitudes', href: '/portal/solicitudes' },
    { label: 'Radicación', href: '/portal/radicacion' },
    { label: 'Documentos', href: '/portal/documentos' },
    { label: 'Notificaciones', href: '/portal/notificaciones' },
  ],
};

function CategoryIcon({ type }: { type: Category['icon'] }) {
  const base = 'w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300';
  const configs = {
    woman: { bg: 'bg-gradient-to-br from-rose-50 to-pink-50', color: 'text-rose-400', path: <><circle cx="12" cy="7" r="4" /><path d="M5.5 21c0-4.5 2.9-8 6.5-8s6.5 3.5 6.5 8" /><path d="M12 11v4m-2 2h4" /></> },
    man: { bg: 'bg-gradient-to-br from-blue-50 to-indigo-50', color: 'text-blue-400', path: <><circle cx="12" cy="7" r="4" /><path d="M5.5 21c0-4.5 2.9-8 6.5-8s6.5 3.5 6.5 8" /><path d="M10 3l2 2 2-2" /></> },
    kids: { bg: 'bg-gradient-to-br from-amber-50 to-yellow-50', color: 'text-amber-400', path: <><circle cx="12" cy="8" r="4" /><path d="M6 21c0-3.9 2.7-7 6-7s6 3.1 6 7" /><circle cx="10.5" cy="7.5" r="0.5" fill="currentColor" /><circle cx="13.5" cy="7.5" r="0.5" fill="currentColor" /><path d="M10.5 9.5c.8.6 2.2.6 3 0" /></> },
    beauty: { bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50', color: 'text-purple-400', path: <><path d="M12 3c-1.5 2-4 3.5-4 6.5a4 4 0 008 0c0-3-2.5-4.5-4-6.5z" /><path d="M12 15.5v5.5" /><path d="M9 18h6" /></> },
    accessories: { bg: 'bg-gradient-to-br from-teal-50 to-emerald-50', color: 'text-teal-400', path: <><path d="M20 12a8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8" /><path d="M16 4l2 2-2 2" /><path d="M12 8v4l3 3" /></> },
  };
  const c = configs[type];
  return (
    <div className={`${base} ${c.bg}`}>
      <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${c.color}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{c.path}</svg>
    </div>
  );
}

export function MobileMenu({ isOpen, onClose, links, variant }: MobileMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setActiveCategory(null);
  }, [isOpen]);

  const activeCat = categories.find((c) => c.name === activeCategory);
  const isExpanded = !!activeCat;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: 50 }}
            onClick={onClose}
          />

          {/* Panel — animates width when subcategories open */}
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0, width: isExpanded ? 680 : 300 }}
            exit={{ x: '-100%' }}
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              width: { type: 'spring', stiffness: 400, damping: 35 },
            }}
            className="fixed top-0 left-0 bottom-0 bg-white shadow-2xl overflow-hidden flex flex-col max-w-full"
            style={{ zIndex: 51 }}
            aria-label="Menu de navegacion"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <img src="/images/logo.png" alt="UrbanThread AI" className="h-14 w-auto" />
              <button
                onClick={onClose}
                className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                aria-label="Cerrar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {variant === 'public' ? (
                <div className="flex h-full">
                  {/* LEFT: Categories */}
                  <div className={`${isExpanded ? 'w-[220px]' : 'w-full'} border-r border-stone-100 overflow-y-auto flex-shrink-0 transition-all duration-300`}>
                    <div className="py-4 px-4">
                      {categories.map((cat, i) => (
                        <motion.button
                          key={cat.name}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                          onClick={() => setActiveCategory(cat.name === activeCategory ? null : cat.name)}
                          className={`group w-full text-left py-3 px-3 rounded-xl flex items-center gap-3 transition-all duration-300 mb-0.5 ${
                            activeCategory === cat.name
                              ? 'bg-[#FAF8F5] border-l-[3px] border-[#C4956A]'
                              : 'hover:bg-stone-50'
                          }`}
                        >
                          <CategoryIcon type={cat.icon} />
                          <span className={`text-sm font-semibold tracking-wide uppercase transition-colors duration-300 ${
                            activeCategory === cat.name ? 'text-[#C4956A]' : 'text-stone-700 group-hover:text-[#C4956A]'
                          }`}>
                            {cat.name}
                          </span>
                        </motion.button>
                      ))}

                      <div className="my-4 border-t border-stone-100" />
                      {[
                        { label: 'SOSTENIBILIDAD', href: '/sostenibilidad' },
                        { label: 'INSIGHTS', href: '/insights' },
                        { label: 'QUIÉNES SOMOS', href: '/quienes-somos' },
                        { label: 'CONTACTO', href: '/contacto' },
                      ].map((link) => (
                        <button
                          key={link.href}
                          onClick={() => { onClose(); router.push(link.href); }}
                          className="group w-full text-left py-3 px-3 rounded-xl flex items-center gap-3 transition-all duration-300 mb-0.5 hover:bg-stone-50"
                        >
                          <span className="text-sm font-semibold tracking-wide uppercase text-stone-700 group-hover:text-[#C4956A] transition-colors duration-300">
                            {link.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT: Subcategories — only renders when a category is active */}
                  <AnimatePresence>
                    {activeCat && (
                      <motion.div
                        key={activeCat.name}
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 460, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                        className="overflow-hidden flex-shrink-0 bg-[#FAFAF9] border-l border-stone-50"
                      >
                        <motion.div
                          initial={{ x: 30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.25 }}
                          className="w-[460px] h-full overflow-y-auto py-4 px-5"
                        >
                          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                            {activeCat.name}
                          </p>

                          <div className="space-y-0.5">
                            {activeCat.subcategories.map((sub, i) => (
                              <motion.div
                                key={sub.label}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.08 + i * 0.04, duration: 0.25, ease: 'easeOut' }}
                              >
                                <a
                                  href="#colecciones"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const collectionKey = activeCat.collectionKey;
                                    // Close menu first and restore body scroll
                                    onClose();
                                    document.body.style.overflow = '';
                                    
                                    // Navigate to home if not already there, then switch tab and scroll
                                    const isHome = window.location.pathname === '/';
                                    if (!isHome) {
                                      router.push('/#colecciones');
                                      // Dispatch event after navigation
                                      setTimeout(() => {
                                        window.dispatchEvent(
                                          new CustomEvent('switchCollectionTab', { detail: collectionKey })
                                        );
                                      }, 800);
                                    } else {
                                      // Already on home, just switch tab and scroll
                                      setTimeout(() => {
                                        window.dispatchEvent(
                                          new CustomEvent('switchCollectionTab', { detail: collectionKey })
                                        );
                                        const el = document.getElementById('colecciones');
                                        if (el) {
                                          el.scrollIntoView({ behavior: 'smooth' });
                                        }
                                      }, 350);
                                    }
                                  }}
                                  className="group flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300"
                                >
                                  <div className="w-11 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 shadow-sm">
                                    <img
                                      src={sub.image}
                                      alt={sub.label}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      loading="lazy"
                                    />
                                  </div>

                                  <span className="flex-1 text-sm font-medium text-stone-700 group-hover:text-[#C4956A] transition-colors truncate">
                                    {sub.label}
                                  </span>

                                  {sub.tag && (
                                    <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
                                      sub.tag === 'NEW' ? 'bg-[#C4956A]/10 text-[#C4956A]' :
                                      sub.tag === 'ECO' ? 'bg-green-50 text-green-600' :
                                      'bg-amber-50 text-amber-600'
                                    }`}>
                                      {sub.tag}
                                    </span>
                                  )}
                                </a>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="py-4 px-6 overflow-y-auto h-full">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
                    {variant === 'admin' ? 'Administración' : 'Portal Cliente'}
                  </p>
                  {variant === 'admin' ? (
                    adminPortalLinks.admin.map((link) => (
                      <Link key={link.href} href={link.href} onClick={onClose}
                        className="block py-2.5 text-sm font-medium text-stone-700 hover:text-[#C4956A] transition-colors">
                        {link.label}
                      </Link>
                    ))
                  ) : (
                    <div className="space-y-1">
                      {[
                        { label: 'Mi Perfil', href: '/portal/perfil', icon: <User className="h-5 w-5" /> },
                        { label: 'Pedidos', href: '/portal/pedidos', icon: <ShoppingBag className="h-5 w-5" /> },
                        { label: 'Solicitudes', href: '/portal/solicitudes', icon: <ClipboardList className="h-5 w-5" /> },
                        { label: 'Radicación', href: '/portal/radicacion', icon: <FileText className="h-5 w-5" /> },
                        { label: 'Documentos', href: '/portal/documentos', icon: <FolderOpen className="h-5 w-5" /> },
                        { label: 'Notificaciones', href: '/portal/notificaciones', icon: <Bell className="h-5 w-5" /> },
                      ].map((link) => (
                        <Link key={link.href} href={link.href} onClick={onClose}
                          className="flex items-center gap-3 py-3 px-3 rounded-xl text-sm font-medium text-stone-700 hover:text-[#C4956A] hover:bg-[#C4956A]/5 transition-all">
                          <span className="text-stone-400">{link.icon}</span>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {variant === 'public' && (
              <div className="border-t border-stone-100 px-6 py-4 bg-stone-50/50">
                <div className="flex gap-2">
                  <Link href="/cliente/login" onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:border-[#C4956A] hover:text-[#C4956A] transition-colors">
                    <User className="h-4 w-4" /> Mi Cuenta
                  </Link>
                  <Link href="/admin/login" onClick={onClose}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1A1A1A] text-white text-sm font-medium hover:bg-[#C4956A] transition-colors">
                    <ShieldCheck className="h-4 w-4" /> Admin
                  </Link>
                </div>
              </div>
            )}
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
