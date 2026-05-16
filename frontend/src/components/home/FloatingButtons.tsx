'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Phone, ChevronUp, ChevronDown } from 'lucide-react';

const buttons = [
  {
    icon: Phone,
    label: 'WhatsApp',
    href: 'https://wa.me/573005091114?text=Hola%20UrbanThread%20AI%2C%20me%20interesa%20conocer%20sus%20colecciones%20y%20servicios.%20Me%20pueden%20asesorar%20por%20favor%3F',
    gradient: 'from-[#25D366] to-[#128C7E]',
    glow: 'rgba(37,211,102,0.5)',
    external: true,
  },
  {
    icon: ShieldCheck,
    label: 'Panel Admin',
    href: '/admin/login',
    gradient: 'from-[#8B5CF6] to-[#6D28D9]',
    glow: 'rgba(139,92,246,0.5)',
    external: false,
  },
  {
    icon: User,
    label: 'Portal Cliente',
    href: '/cliente/login',
    gradient: 'from-[#C4956A] to-[#8B6F5E]',
    glow: 'rgba(196,149,106,0.5)',
    external: false,
  },
];

export function FloatingButtons() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 flex flex-col-reverse items-start gap-3" style={{ zIndex: 40 }}>
      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setExpanded((prev) => !prev)}
        className="relative w-14 h-14 rounded-full text-white flex items-center justify-center focus:outline-none"
        aria-label={expanded ? 'Cerrar accesos rapidos' : 'Abrir accesos rapidos'}
      >
        {/* Pulsing outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.3, 1.3], opacity: [0.6, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          style={{ border: '2px solid #C4956A' }}
        />
        {/* Second pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.3, 1.3], opacity: [0.4, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          style={{ border: '2px solid #D4A76A' }}
        />
        {/* Rotating border */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #C4956A, #D4A76A, #ffffff, #D4A76A, #C4956A, transparent, #C4956A)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '2.5px',
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
        {/* Glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ boxShadow: ['0 0 10px rgba(196,149,106,0.3)', '0 0 30px rgba(212,167,106,0.6)', '0 0 10px rgba(196,149,106,0.3)'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Sparkle dots */}
        <motion.div
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D4A76A]"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ boxShadow: '0 0 6px rgba(212,167,106,0.8)' }}
        />
        <motion.div
          className="absolute -bottom-0.5 -left-0.5 w-2 h-2 rounded-full bg-[#C4956A]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          style={{ boxShadow: '0 0 5px rgba(196,149,106,0.7)' }}
        />
        {/* Inner bg */}
        <div className="absolute inset-[2.5px] rounded-full bg-[#1A1A1A]" />
        {/* Icon */}
        <motion.div
          className="relative z-10"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </motion.div>
      </motion.button>

      {/* Expandable buttons */}
      <AnimatePresence>
        {expanded && buttons.map((btn, i) => (
          <motion.div
            key={btn.label}
            initial={{ opacity: 0, y: 20, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.08 }}
          >
            {btn.external ? (
              <a
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-3 h-14 pl-4 pr-6 rounded-full text-white overflow-hidden"
                aria-label={btn.label}
              >
                {/* Rotating border */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from 0deg, transparent 20%, ${btn.glow} 35%, rgba(255,255,255,0.9) 40%, ${btn.glow} 45%, transparent 60%)`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '2px',
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                {/* Glow pulse */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ boxShadow: [`0 0 8px ${btn.glow}`, `0 0 30px ${btn.glow}`, `0 0 8px ${btn.glow}`] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Background */}
                <div className={`absolute inset-[2px] rounded-full bg-gradient-to-r ${btn.gradient}`} />
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-[2px] rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
                />
                {/* Sparkle */}
                <motion.div
                  className="absolute top-1 right-3 w-1.5 h-1.5 rounded-full bg-white"
                  animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                />
                {/* Icon with glowing circle */}
                <motion.div
                  className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/20 border border-white/40 backdrop-blur-sm"
                  animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 8px rgba(255,255,255,0.3)', '0 0 20px rgba(255,255,255,0.6)', '0 0 8px rgba(255,255,255,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <btn.icon className="h-[18px] w-[18px] drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" strokeWidth={2.5} />
                </motion.div>
                <span className="relative z-10 text-sm font-bold whitespace-nowrap drop-shadow-lg tracking-wide">{btn.label}</span>
              </a>
            ) : (
              <Link
                href={btn.href}
                className="group relative flex items-center gap-3 h-14 pl-4 pr-6 rounded-full text-white overflow-hidden"
                aria-label={btn.label}
              >
                {/* Rotating border */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from ${i * 120}deg, transparent 20%, ${btn.glow} 35%, rgba(255,255,255,0.9) 40%, ${btn.glow} 45%, transparent 60%)`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '2px',
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'linear' }}
                />
                {/* Glow pulse */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ boxShadow: [`0 0 8px ${btn.glow}`, `0 0 30px ${btn.glow}`, `0 0 8px ${btn.glow}`] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                />
                {/* Background */}
                <div className={`absolute inset-[2px] rounded-full bg-gradient-to-r ${btn.gradient}`} />
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-[2px] rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 + i * 0.5 }}
                />
                {/* Sparkle */}
                <motion.div
                  className="absolute top-1 right-3 w-1.5 h-1.5 rounded-full bg-white"
                  animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 + i * 0.4 }}
                />
                {/* Icon with glowing circle */}
                <motion.div
                  className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/20 border border-white/40 backdrop-blur-sm"
                  animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 8px rgba(255,255,255,0.3)', '0 0 20px rgba(255,255,255,0.6)', '0 0 8px rgba(255,255,255,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                >
                  <btn.icon className="h-[18px] w-[18px] drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" strokeWidth={2.5} />
                </motion.div>
                <span className="relative z-10 text-sm font-bold whitespace-nowrap drop-shadow-lg tracking-wide">{btn.label}</span>
              </Link>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default FloatingButtons;
