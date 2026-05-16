'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';

/* Small sparkle SVG used for decorative particles */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z" />
    </svg>
  );
}

export function CartHeaderButton() {
  const { items, toggleCart } = useCartStore();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <motion.button
      onClick={toggleCart}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      className="relative p-3 rounded-2xl transition-colors"
      aria-label={`Carrito${count > 0 ? ` (${count} productos)` : ''}`}
    >
      {/* Outer ring pulse — always visible */}
      <motion.div
        className="absolute inset-[-4px] rounded-2xl pointer-events-none border-2 border-[#C4956A]/30"
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Glow pulse behind icon — always visible */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 0px rgba(196,149,106,0), 0 0 0px rgba(212,167,106,0)',
            '0 0 20px rgba(196,149,106,0.45), 0 0 40px rgba(212,167,106,0.2)',
            '0 0 0px rgba(196,149,106,0), 0 0 0px rgba(212,167,106,0)',
          ],
          backgroundColor: [
            'rgba(196,149,106,0)',
            'rgba(196,149,106,0.12)',
            'rgba(196,149,106,0)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Shine sweep across icon — always visible */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
      >
        <motion.div
          className="absolute top-0 w-full h-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
          }}
          animate={{ left: ['-100%', '200%'] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Icon with color shift and wiggle — always animates */}
      <motion.div
        animate={{
          rotate: [0, -10, 10, -6, 6, 0],
          color: ['#8B6F5E', '#C4956A', '#E8B87A', '#C4956A', '#8B6F5E'],
        }}
        transition={{
          rotate: { duration: 0.6, repeat: Infinity, repeatDelay: 3 },
          color: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <ShoppingCart className="h-5 w-5" />
      </motion.div>

      {/* Badge with pulse */}
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute -top-1 -right-1 flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full text-white text-[10px] font-bold"
          style={{
            background: 'linear-gradient(135deg, #C4956A, #E8B87A)',
            boxShadow: '0 2px 10px rgba(196,149,106,0.5)',
          }}
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}

      {/* Sparkle particles — always visible */}
      {/* Top-right sparkle */}
      <motion.div
        className="absolute -top-1 -right-2 pointer-events-none text-[#E8B87A]"
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.3, 1, 0.8, 0.3],
          y: [0, -4, -2, 0],
          x: [0, 2, 0, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
      >
        <Sparkle className="w-2.5 h-2.5" />
      </motion.div>

      {/* Top-left sparkle */}
      <motion.div
        className="absolute -top-1.5 left-0 pointer-events-none text-[#C4956A]"
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.2, 0.8, 0.6, 0.2],
          y: [0, -3, -1, 0],
          x: [0, -2, 0, 0],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <Sparkle className="w-2 h-2" />
      </motion.div>

      {/* Bottom-right sparkle */}
      <motion.div
        className="absolute bottom-0 -right-1 pointer-events-none text-[#D4A76A]"
        animate={{
          opacity: [0, 0.8, 0.8, 0],
          scale: [0.3, 1, 0.7, 0.3],
          y: [0, 2, 1, 0],
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
      >
        <Sparkle className="w-1.5 h-1.5" />
      </motion.div>

      {/* Floating dot — left */}
      <motion.span
        className="absolute top-1/2 -left-1.5 w-1 h-1 rounded-full bg-[#E8B87A] pointer-events-none"
        animate={{
          opacity: [0, 1, 0],
          scale: [0.5, 1.5, 0.5],
          y: [-2, -6, -2],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Floating dot — top */}
      <motion.span
        className="absolute -top-2 left-1/2 w-1 h-1 rounded-full bg-[#C4956A] pointer-events-none"
        animate={{
          opacity: [0, 1, 0],
          scale: [0.5, 1.2, 0.5],
          y: [0, -4, 0],
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
      />
    </motion.button>
  );
}
