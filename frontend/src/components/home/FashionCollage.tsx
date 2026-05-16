'use client';

import React from 'react';
import { motion } from 'framer-motion';

const images = [
  'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
  'https://images.pexels.com/photos/1187957/pexels-photo-1187957.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
];

/* Each letter of URBANTHREAD gets its own floating animation */
const brandLetters = 'URBANTHREAD'.split('');
const aiLetters = 'AI'.split('');

export function FashionCollage() {
  return (
    <section className="relative overflow-hidden bg-[#1A1A1A]">
      {/* Image grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 auto-rows-[140px] sm:auto-rows-[180px] lg:auto-rows-[220px]">
        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: i * 0.03 }}
            className="relative overflow-hidden group"
          >
            <img
              src={src}
              alt={`Fashion ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
          </motion.div>
        ))}
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      {/* Animated brand text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden">

        {/* URBANTHREAD — each letter floats independently */}
        <div className="flex items-baseline" aria-hidden="true">
          {brandLetters.map((letter, i) => {
            /* Alternate between outline and solid for visual rhythm */
            const isOutline = i < 5; /* URBAN = outline, THREAD = solid */
            return (
              <motion.span
                key={`brand-${i}`}
                className="text-[13vw] sm:text-[10vw] lg:text-[9vw] font-black leading-none tracking-tighter select-none"
                style={
                  isOutline
                    ? {
                        WebkitTextStroke: '2px rgba(196,149,106,0.7)',
                        color: 'transparent',
                        filter: 'drop-shadow(0 2px 20px rgba(0,0,0,0.3))',
                      }
                    : {
                        color: 'rgba(255,255,255,0.92)',
                        textShadow: '0 4px 40px rgba(0,0,0,0.6)',
                      }
                }
                animate={{
                  y: [0, -12 - (i % 3) * 6, 0, 8 + (i % 4) * 3, 0],
                  rotate: [0, (i % 2 === 0 ? 2 : -2), 0, (i % 2 === 0 ? -1.5 : 1.5), 0],
                  scale: [1, 1.03 + (i % 3) * 0.01, 1, 0.98, 1],
                }}
                transition={{
                  duration: 4 + (i % 4) * 0.7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.15,
                }}
              >
                {letter}
              </motion.span>
            );
          })}
        </div>

        {/* AI — big, golden, pulsing with glow */}
        <div className="flex items-baseline -mt-[3vw]" aria-hidden="true">
          {aiLetters.map((letter, i) => (
            <motion.span
              key={`ai-${i}`}
              className="text-[18vw] sm:text-[14vw] lg:text-[12vw] font-black leading-none tracking-tight select-none"
              style={{
                color: '#C4956A',
                textShadow: '0 0 80px rgba(196,149,106,0.5), 0 0 40px rgba(196,149,106,0.3), 0 4px 40px rgba(0,0,0,0.5)',
              }}
              animate={{
                y: [0, -18, 0, 10, 0],
                rotate: [0, (i === 0 ? -3 : 3), 0, (i === 0 ? 2 : -2), 0],
                scale: [1, 1.06, 1, 0.97, 1],
                textShadow: [
                  '0 0 40px rgba(196,149,106,0.3), 0 4px 40px rgba(0,0,0,0.5)',
                  '0 0 100px rgba(196,149,106,0.7), 0 0 60px rgba(212,167,106,0.5), 0 4px 40px rgba(0,0,0,0.5)',
                  '0 0 40px rgba(196,149,106,0.3), 0 4px 40px rgba(0,0,0,0.5)',
                ],
              }}
              transition={{
                duration: 5 + i * 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            >
              {letter}
            </motion.span>
          ))}

          {/* Ghost text "COLLECTION" drifting */}
          <motion.span
            className="text-[6vw] sm:text-[5vw] lg:text-[4vw] font-black leading-none tracking-widest select-none ml-[2vw] self-end mb-[1vw]"
            style={{
              WebkitTextStroke: '1px rgba(255,255,255,0.12)',
              color: 'transparent',
            }}
            animate={{
              x: [0, 20, 0, -15, 0],
              opacity: [0.15, 0.3, 0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            COLLECTION
          </motion.span>
        </div>

        {/* Floating accent line */}
        <motion.div
          className="h-[3px] bg-gradient-to-r from-transparent via-[#C4956A] to-transparent rounded-full mt-[1vw]"
          animate={{
            width: ['20vw', '45vw', '20vw'],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1A1A1A] to-transparent pointer-events-none" />
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#FAF8F5] to-transparent pointer-events-none" />
    </section>
  );
}

export default FashionCollage;
