'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export interface FooterProps {
  className?: string;
}

const quickLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Testimonios', href: '/testimonios' },
  { label: 'Contacto', href: '/contacto' },
];

const platformLinks = [
  { label: 'Portal cliente', href: '/cliente/login' },
  { label: 'Panel admin', href: '/admin/login' },
];

export function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-ut-primary text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img src="/images/logo.png" alt="UrbanThread AI" className="h-20 w-auto brightness-0 invert" />
            </Link>
            <p className="text-small text-gray-400">
              Plataforma Smart Commerce integral que conecta clientes, datos y operaciones mediante IA, automatización e identidad digital.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-small font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-small text-gray-300 hover:text-ut-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-small font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Plataforma
            </h3>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-small text-gray-300 hover:text-ut-accent transition-colors"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-small font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-small text-gray-300">
                <Mail className="h-4 w-4 text-ut-accent flex-shrink-0" aria-hidden="true" />
                <span>contacto@urbanthread.ai</span>
              </li>
              <li className="flex items-center gap-2 text-small text-gray-300">
                <Phone className="h-4 w-4 text-ut-accent flex-shrink-0" aria-hidden="true" />
                <span>+57 300 509 1114</span>
              </li>
              <li className="flex items-start gap-2 text-small text-gray-300">
                <MapPin className="h-4 w-4 text-ut-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Bogotá, Colombia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col tablet:flex-row items-center justify-between gap-4">
          <p className="text-small text-gray-400">
            © {currentYear} UrbanThread AI. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-small text-gray-400 hover:text-ut-accent transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="text-small text-gray-400 hover:text-ut-accent transition-colors">
              Términos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
