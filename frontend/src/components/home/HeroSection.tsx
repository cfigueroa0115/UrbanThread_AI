'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, User } from 'lucide-react';

/* ── Collage images — 3 rows scrolling in different directions ── */
const row1 = [
  'https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'https://images.pexels.com/photos/1187957/pexels-photo-1187957.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
];

const row2 = [
  'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'https://images.pexels.com/photos/2752045/pexels-photo-2752045.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
];

const row3 = [
  'https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'https://images.pexels.com/photos/1036620/pexels-photo-1036620.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'https://images.pexels.com/photos/3622614/pexels-photo-3622614.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
];

/* ── Infinite scrolling row ── */
function ScrollingRow({
  images,
  direction,
  duration,
}: {
  images: string[];
  direction: 'left' | 'right';
  duration: number;
}) {
  /* Duplicate for seamless loop */
  const doubled = [...images, ...images];

  return (
    <div className="relative overflow-hidden w-full">
      <motion.div
        className="flex gap-2"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          x: {
            duration,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        {doubled.map((src, i) => (
          <div
            key={`${direction}-${i}`}
            className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[380px] h-[180px] sm:h-[220px] lg:h-[260px] rounded-xl overflow-hidden"
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

/* ── 3D Letter with auto-glow ── */
function Letter3D({
  char,
  index,
  variant,
}: {
  char: string;
  index: number;
  variant: 'urban' | 'thread' | 'ai';
}) {
  const dur = 3.5 + (index % 5) * 0.6;
  const delay = index * 0.12;
  const yAmp = variant === 'ai' ? 16 : 10;
  const rxAmp = variant === 'ai' ? 18 : 12;
  const ryAmp = variant === 'ai' ? 14 : 8 + (index % 3) * 3;
  const rzAmp = 3 + (index % 4);

  /* Glow cycle — each letter lights up on its own schedule */
  const glowDelay = index * 0.3;
  const glowDur = 3 + (index % 4) * 0.5;

  /* Shadow keyframes: dim → bright glow → dim */
  const shadowDim =
    variant === 'ai'
      ? '1px 1px 0 #A07850, 2px 2px 0 #8B6F5E, 3px 3px 0 #7A6050, 4px 4px 0 #6A5040, 5px 5px 0 #5A4030, 6px 6px 15px rgba(0,0,0,0.5), 0 0 20px rgba(196,149,106,0.2)'
      : variant === 'thread'
      ? '1px 1px 0 #d4d4d4, 2px 2px 0 #b0b0b0, 3px 3px 0 #909090, 4px 4px 0 #707070, 5px 5px 12px rgba(0,0,0,0.6), 0 0 10px rgba(255,255,255,0.1)'
      : '1px 1px 0 rgba(196,149,106,0.5), 2px 2px 0 rgba(196,149,106,0.35), 3px 3px 0 rgba(196,149,106,0.2), 4px 4px 10px rgba(0,0,0,0.5), 0 0 10px rgba(196,149,106,0.1)';

  const shadowBright =
    variant === 'ai'
      ? '1px 1px 0 #D4A76A, 2px 2px 0 #C4956A, 3px 3px 0 #A07850, 4px 4px 0 #8B6F5E, 5px 5px 0 #7A6050, 6px 6px 15px rgba(0,0,0,0.5), 0 0 80px rgba(196,149,106,0.7), 0 0 120px rgba(212,167,106,0.4)'
      : variant === 'thread'
      ? '1px 1px 0 #ffffff, 2px 2px 0 #e0e0e0, 3px 3px 0 #c0c0c0, 4px 4px 0 #a0a0a0, 5px 5px 12px rgba(0,0,0,0.6), 0 0 50px rgba(255,255,255,0.35), 0 0 80px rgba(196,149,106,0.25)'
      : '1px 1px 0 rgba(212,167,106,0.8), 2px 2px 0 rgba(196,149,106,0.6), 3px 3px 0 rgba(196,149,106,0.4), 4px 4px 10px rgba(0,0,0,0.5), 0 0 60px rgba(196,149,106,0.5), 0 0 90px rgba(196,149,106,0.3)';

  const colorDim = variant === 'ai' ? '#C4956A' : variant === 'urban' ? 'transparent' : '#ffffff';
  const colorBright = variant === 'ai' ? '#D4A76A' : variant === 'urban' ? 'transparent' : '#ffffff';
  const stroke = variant === 'urban' ? '2.5px rgba(196,149,106,0.8)' : undefined;
  const strokeBright = variant === 'urban' ? '2.5px rgba(212,167,106,1)' : undefined;

  return (
    <motion.span
      className="inline-block cursor-default select-none"
      style={{
        WebkitTextStroke: stroke,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, rotateX: 90, rotateY: -40, y: 60, scale: 0.5 }}
      animate={{
        opacity: 1,
        y: [0, -yAmp, 0, yAmp * 0.6, 0],
        rotateX: [0, rxAmp, 0, -rxAmp * 0.7, 0],
        rotateY: [0, -ryAmp, 0, ryAmp * 0.8, 0],
        rotateZ: [0, rzAmp, 0, -rzAmp, 0],
        scale: [1, 1.06, 1, 0.97, 1],
        color: [colorDim, colorBright, colorDim],
        textShadow: [shadowDim, shadowBright, shadowDim],
        WebkitTextStroke: stroke ? [stroke, strokeBright!, stroke] : undefined,
      }}
      transition={{
        opacity: { duration: 0.6, delay: delay + 0.5 },
        rotateX: { duration: dur, repeat: Infinity, ease: 'easeInOut', delay: delay + 1.2 },
        rotateY: { duration: dur + 0.8, repeat: Infinity, ease: 'easeInOut', delay: delay + 1.2 },
        rotateZ: { duration: dur + 1.5, repeat: Infinity, ease: 'easeInOut', delay: delay + 1.2 },
        y: { duration: dur + 0.3, repeat: Infinity, ease: 'easeInOut', delay: delay + 1.2 },
        scale: { duration: dur + 0.5, repeat: Infinity, ease: 'easeInOut', delay: delay + 1.2 },
        color: { duration: glowDur, repeat: Infinity, ease: 'easeInOut', delay: glowDelay + 1.5 },
        textShadow: { duration: glowDur, repeat: Infinity, ease: 'easeInOut', delay: glowDelay + 1.5 },
        WebkitTextStroke: stroke ? { duration: glowDur, repeat: Infinity, ease: 'easeInOut', delay: glowDelay + 1.5 } : undefined,
      }}
      whileHover={{
        scale: 1.3,
        rotateY: 25,
        rotateX: -15,
        y: -20,
        transition: { duration: 0.3 },
      }}
    >
      {char}
    </motion.span>
  );
}

export function HeroSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  const urbanLetters = 'Urban'.split('');
  const threadLetters = 'Thread'.split('');
  const aiLetters = 'AI'.split('');

  return (
    <section className="relative h-screen min-h-[750px] max-h-[1100px] overflow-hidden bg-[#0a0a0a]">
      {/* ── Collage background — 3 rows scrolling ── */}
      <div className="absolute inset-0 flex flex-col justify-center gap-2 opacity-80">
        <ScrollingRow images={row1} direction="left" duration={35} />
        <ScrollingRow images={row2} direction="right" duration={40} />
        <ScrollingRow images={row3} direction="left" duration={45} />
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl space-y-6"
        >
          {/* ── Badge — glowing borders that pulse intensely ── */}
          <motion.div variants={childVariants} className="flex justify-center">
            <motion.div
              className="relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full overflow-hidden"
              animate={{
                boxShadow: [
                  '0 0 5px rgba(196,149,106,0.1), inset 0 0 5px rgba(196,149,106,0)',
                  '0 0 50px rgba(196,149,106,0.6), 0 0 100px rgba(212,167,106,0.3), inset 0 0 25px rgba(196,149,106,0.15)',
                  '0 0 5px rgba(196,149,106,0.1), inset 0 0 5px rgba(196,149,106,0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Animated border — rotating gradient, thicker and brighter */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, #C4956A 15%, #D4A76A 25%, #fff 30%, #D4A76A 35%, #C4956A 45%, transparent 60%, #C4956A 75%, #D4A76A 85%, transparent 100%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: '2px',
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              {/* Second rotating border — opposite direction for shimmer */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 180deg, transparent 0%, rgba(255,255,255,0.6) 10%, transparent 20%, transparent 50%, rgba(196,149,106,0.8) 60%, transparent 70%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: '2px',
                }}
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              />
              {/* Inner bg */}
              <div className="absolute inset-[2px] rounded-full bg-black/70 backdrop-blur-xl" />
              {/* Content */}
              <motion.div
                className="relative z-10"
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="h-5 w-5 text-[#D4A76A]" />
              </motion.div>
              <motion.span
                className="relative z-10 text-base font-semibold tracking-wide"
                animate={{
                  color: ['rgba(255,255,255,0.85)', 'rgba(212,167,106,1)', 'rgba(255,255,255,0.85)'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                Smart Commerce Platform
              </motion.span>
            </motion.div>
          </motion.div>

          {/* ── 3D Title ── */}
          <motion.div variants={childVariants} style={{ perspective: '1200px' }}>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tight">
              <span className="inline-flex" style={{ perspective: '1000px' }}>
                {urbanLetters.map((c, i) => (
                  <Letter3D key={`u-${i}`} char={c} index={i} variant="urban" />
                ))}
              </span>
              <span className="inline-flex" style={{ perspective: '1000px' }}>
                {threadLetters.map((c, i) => (
                  <Letter3D key={`t-${i}`} char={c} index={i + 5} variant="thread" />
                ))}
              </span>
              <span className="inline-flex ml-[0.15em]" style={{ perspective: '1000px' }}>
                {aiLetters.map((c, i) => (
                  <Letter3D key={`a-${i}`} char={c} index={i + 11} variant="ai" />
                ))}
              </span>
            </h1>
            <motion.div
              className="mx-auto mt-2 h-[3px] bg-gradient-to-r from-transparent via-[#C4956A] to-transparent rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '60%', opacity: 1 }}
              transition={{ duration: 1.5, delay: 2, ease: 'easeOut' }}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={childVariants}
            className="text-xl sm:text-2xl text-white/70 font-light tracking-wide"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            Tejiendo experiencias inteligentes
          </motion.p>

          {/* ── Description — darker, bolder, more visible ── */}
          <motion.p
            variants={childVariants}
            className="text-base sm:text-lg text-white font-medium max-w-xl mx-auto leading-relaxed"
            style={{
              textShadow: '0 2px 15px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.6)',
            }}
          >
            Moda sostenible, tecnología inteligente. Colecciones que combinan
            estilo premium con innovación digital.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={childVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4"
          >
            {/* Primary CTA — Explorar Colecciones */}
            <a href="#colecciones">
              <motion.button
                onMouseEnter={() => setHovered('collections')}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group relative h-[52px] px-8 rounded-2xl font-semibold text-[15px] overflow-hidden"
              >
                {/* Animated gradient border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'conic-gradient(from 0deg, #C4956A, #D4A76A, #ffffff, #D4A76A, #C4956A, #8B6F5E, #C4956A)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '2px',
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                {/* Solid fill */}
                <div className="absolute inset-[2px] rounded-[14px] bg-gradient-to-r from-[#C4956A] via-[#D4A76A] to-[#C4956A] group-hover:from-[#D4A76A] group-hover:via-[#E8C496] group-hover:to-[#D4A76A] transition-all duration-300" />
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-[2px] rounded-[14px] bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
                />
                {/* Glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{ boxShadow: ['0 4px 20px rgba(196,149,106,0.3)', '0 4px 35px rgba(212,167,106,0.5)', '0 4px 20px rgba(196,149,106,0.3)'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Content */}
                <span className="relative z-10 flex items-center gap-2.5 text-white font-semibold">
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                    <ArrowRight className="h-[18px] w-[18px]" />
                  </motion.span>
                  Explorar Colecciones
                </span>
              </motion.button>
            </a>

            {/* Portal Cliente */}
            <Link href="/cliente/login">
              <motion.button
                onMouseEnter={() => setHovered('portal')}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group relative h-[52px] px-8 rounded-2xl font-semibold text-[15px] overflow-hidden"
              >
                {/* Animated gradient border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'conic-gradient(from 120deg, transparent 20%, rgba(255,255,255,0.8) 30%, transparent 40%, transparent 70%, rgba(196,149,106,0.9) 80%, transparent 90%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '1.5px',
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
                {/* Glass fill */}
                <div className="absolute inset-[1.5px] rounded-[14px] bg-white/[0.08] backdrop-blur-md group-hover:bg-white/[0.15] transition-all duration-300" />
                {/* Glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={hovered === 'portal' ? { boxShadow: ['0 0 0px rgba(196,149,106,0)', '0 4px 30px rgba(196,149,106,0.35)', '0 0 0px rgba(196,149,106,0)'] } : { boxShadow: '0 0 0px transparent' }}
                  transition={{ duration: 1.8, repeat: hovered === 'portal' ? Infinity : 0 }}
                />
                {/* Content */}
                <span className="relative z-10 flex items-center gap-2.5 text-white/90 group-hover:text-white font-semibold transition-colors duration-300">
                  <User className="h-[18px] w-[18px]" />
                  Portal Cliente
                </span>
              </motion.button>
            </Link>

            {/* Admin */}
            <Link href="/admin/login">
              <motion.button
                onMouseEnter={() => setHovered('admin')}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group relative h-[52px] px-8 rounded-2xl font-semibold text-[15px] overflow-hidden"
              >
                {/* Animated gradient border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'conic-gradient(from 240deg, transparent 30%, rgba(255,255,255,0.5) 38%, transparent 46%, transparent 75%, rgba(196,149,106,0.6) 83%, transparent 91%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '1.5px',
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                />
                {/* Glass fill */}
                <div className="absolute inset-[1.5px] rounded-[14px] bg-white/[0.05] backdrop-blur-md group-hover:bg-white/[0.12] transition-all duration-300" />
                {/* Glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={hovered === 'admin' ? { boxShadow: ['0 0 0px rgba(196,149,106,0)', '0 4px 25px rgba(196,149,106,0.3)', '0 0 0px rgba(196,149,106,0)'] } : { boxShadow: '0 0 0px transparent' }}
                  transition={{ duration: 1.8, repeat: hovered === 'admin' ? Infinity : 0 }}
                />
                {/* Content */}
                <span className="relative z-10 flex items-center gap-2.5 text-white/70 group-hover:text-white font-semibold transition-colors duration-300">
                  <ShieldCheck className="h-[18px] w-[18px]" />
                  Admin
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
