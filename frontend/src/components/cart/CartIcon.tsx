'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';

export function CartIcon() {
  const { items, toggleCart } = useCartStore();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <motion.button
      onClick={toggleCart}
      whileHover={{ scale: 1.12, y: -3 }}
      whileTap={{ scale: 0.92 }}
      animate={{
        y: [0, -6, 0],
      }}
      transition={{
        y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      }}
      className="fixed bottom-24 right-6 flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-white text-[#1A1A1A] border-2 border-[#C4956A] overflow-visible"
      style={{ zIndex: 55, boxShadow: '0 4px 25px rgba(196,149,106,0.3)' }}
    >
      {/* Rotating border glow */}
      <motion.div
        className="absolute inset-[-2px] rounded-full pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(196,149,106,0.6) 15%, rgba(255,255,255,0.9) 18%, rgba(196,149,106,0.6) 21%, transparent 35%, transparent 55%, rgba(212,167,106,0.5) 68%, rgba(255,255,255,0.8) 71%, rgba(212,167,106,0.5) 74%, transparent 90%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '2px',
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Pulsing glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 0px rgba(196,149,106,0)',
            '0 0 25px rgba(196,149,106,0.4)',
            '0 0 0px rgba(196,149,106,0)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Cart icon with wiggle */}
      <motion.div
        animate={{
          rotate: count > 0 ? [0, -12, 12, -8, 8, 0] : [0],
        }}
        transition={{ duration: 0.8, repeat: count > 0 ? Infinity : 0, repeatDelay: 3 }}
      >
        <ShoppingCart className="h-5 w-5 text-[#C4956A] relative z-10" />
      </motion.div>

      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-sm font-bold text-[#1A1A1A] relative z-10"
        >
          {count}
        </motion.span>
      )}

      {/* Badge */}
      {count > 0 && (
        <motion.span
          className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-[#C4956A] text-white text-[11px] font-bold shadow-lg"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {count}
        </motion.span>
      )}
    </motion.button>
  );
}
