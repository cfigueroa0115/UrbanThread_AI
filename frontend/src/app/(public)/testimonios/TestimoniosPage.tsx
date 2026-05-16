'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Leaf, ShoppingBag, Heart } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

const testimonials = [
  {
    name: 'María García',
    role: 'Compradora frecuente',
    content: 'La experiencia de compra es increíble. Encontré vestidos sostenibles de alta calidad a precios justos. El envío fue rápido y el empaque 100% reciclable. ¡Volveré a comprar!',
    rating: 5,
    tag: 'Moda Sostenible',
    tagIcon: Leaf,
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Cliente desde 2024',
    content: 'Me encanta que cada prenda tiene información sobre su huella de carbono. Comprar en UrbanThread me hace sentir que contribuyo al planeta. La calidad es premium.',
    rating: 5,
    tag: 'Huella de Carbono',
    tagIcon: Leaf,
  },
  {
    name: 'Ana Martínez',
    role: 'Amante de la moda eco',
    content: 'Las colecciones son únicas y los materiales eco-friendly se sienten increíbles. El portal de cliente me permite rastrear mis pedidos en tiempo real. Servicio de primera.',
    rating: 5,
    tag: 'Experiencia Premium',
    tagIcon: Heart,
  },
  {
    name: 'Roberto Sánchez',
    role: 'Comprador online',
    content: 'Compré una chaqueta Smart Casual y quedé impresionado. La talla fue perfecta gracias a la guía inteligente. Además, saber que reduje mi huella ambiental con esta compra es genial.',
    rating: 5,
    tag: 'Compra Inteligente',
    tagIcon: ShoppingBag,
  },
  {
    name: 'Laura Pérez',
    role: 'Diseñadora de interiores',
    content: 'UrbanThread combina moda y tecnología como nadie. La sugerencia de vestimenta según el clima de mi ciudad es brillante. Siempre encuentro lo que necesito.',
    rating: 5,
    tag: 'Innovación',
    tagIcon: Star,
  },
  {
    name: 'Diego Torres',
    role: 'Empresario',
    content: 'Compré regalos para todo mi equipo. La sección de accesorios es espectacular y los sets de regalo vienen en empaques sostenibles. Reducimos 3kg de CO₂ con nuestra compra.',
    rating: 5,
    tag: 'Impacto Ambiental',
    tagIcon: Leaf,
  },
  {
    name: 'Valentina Ruiz',
    role: 'Influencer de moda sostenible',
    content: 'Cada colección de UrbanThread demuestra que la moda puede ser bella y responsable. Los materiales orgánicos y el proceso de producción ético marcan la diferencia.',
    rating: 5,
    tag: 'Moda Consciente',
    tagIcon: Leaf,
  },
  {
    name: 'Andrés López',
    role: 'Padre de familia',
    content: 'La sección de niños es fantástica. Ropa duradera, cómoda y sostenible para mis hijos. El proceso de compra es súper fácil y las devoluciones sin complicaciones.',
    rating: 4,
    tag: 'Familia',
    tagIcon: Heart,
  },
  {
    name: 'Camila Herrera',
    role: 'Ejecutiva de marketing',
    content: 'Desde que descubrí UrbanThread no compro en otro lugar. La calidad premium, los precios justos y saber que cada compra reduce la huella de carbono me tiene fidelizada.',
    rating: 5,
    tag: 'Cliente Fiel',
    tagIcon: ShoppingBag,
  },
];

/* Scrolling row for background */
function ScrollingRow({ images, duration, reverse }: { images: string[]; duration: number; reverse?: boolean }) {
  const doubled = [...images, ...images];
  return (
    <div className="flex gap-2 animate-scroll-row" style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}>
      {doubled.map((src, i) => (
        <div key={i} className="flex-shrink-0 w-[240px] h-[160px] rounded-xl overflow-hidden">
          <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      ))}
    </div>
  );
}

const row1 = [
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&dpr=1',
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&dpr=1',
  'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&dpr=1',
  'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&dpr=1',
  'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&dpr=1',
  'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&dpr=1',
];
const row2 = [
  'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&dpr=1',
  'https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&dpr=1',
  'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&dpr=1',
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&dpr=1',
  'https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&dpr=1',
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&dpr=1',
];

export function TestimoniosPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Carousel background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.08]" style={{ zIndex: 0 }}>
        <div className="flex flex-col justify-center h-full gap-2">
          <ScrollingRow images={row1} duration={40} />
          <ScrollingRow images={row2} duration={50} reverse />
          <ScrollingRow images={row1} duration={45} />
        </div>
      </div>

      <div className="relative py-16" style={{ zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900">
              Lo que dicen nuestros <span className="text-[#C4956A]">clientes</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-500 max-w-2xl mx-auto">
              Experiencias reales de personas que eligen moda sostenible y contribuyen a reducir la huella de carbono con cada compra.
            </p>
          </motion.div>

          {/* Testimonial grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative p-6 rounded-2xl bg-white border border-stone-100 hover:border-[#C4956A]/40 transition-all duration-500 cursor-default overflow-hidden"
              >
                {/* Rotating border glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, rgba(196,149,106,0.4) 12%, rgba(255,255,255,0.7) 15%, rgba(196,149,106,0.4) 18%, transparent 30%, transparent 55%, rgba(212,167,106,0.3) 65%, rgba(255,255,255,0.6) 68%, rgba(212,167,106,0.3) 71%, transparent 85%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '1.5px',
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: 'linear' }}
                />

                {/* Corner glows */}
                <motion.div className="absolute -top-3 -left-3 w-14 h-14 rounded-full pointer-events-none"
                  animate={{ background: ['radial-gradient(circle, rgba(196,149,106,0) 0%, transparent 70%)', 'radial-gradient(circle, rgba(196,149,106,0.2) 0%, transparent 70%)', 'radial-gradient(circle, rgba(196,149,106,0) 0%, transparent 70%)'] }}
                  transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                />
                <motion.div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full pointer-events-none"
                  animate={{ background: ['radial-gradient(circle, rgba(212,167,106,0) 0%, transparent 70%)', 'radial-gradient(circle, rgba(212,167,106,0.2) 0%, transparent 70%)', 'radial-gradient(circle, rgba(212,167,106,0) 0%, transparent 70%)'] }}
                  transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 + i * 0.1 }}
                />

                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{
                    boxShadow: ['0 0 0px rgba(196,149,106,0)', '0 0 12px rgba(196,149,106,0.1)', '0 0 0px rgba(196,149,106,0)'],
                  }}
                  transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Hover background change */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C4956A]/0 to-[#8B6F5E]/0 group-hover:from-[#1A1A1A] group-hover:to-[#2D2D2D] transition-all duration-500 pointer-events-none" />

                {/* Quote icon */}
                <Quote className="absolute top-4 right-4 h-7 w-7 text-stone-100 group-hover:text-[#C4956A]/30 transition-colors duration-500" aria-hidden="true" />

                {/* Tag */}
                <div className="relative mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4956A]/10 text-[#8B6F5E] text-[10px] font-bold uppercase tracking-wider group-hover:bg-[#C4956A]/20 group-hover:text-[#C4956A] transition-colors duration-500">
                    <t.tagIcon className="h-3 w-3" />
                    {t.tag}
                  </span>
                </div>

                {/* User info */}
                <div className="relative flex items-center gap-3 mb-4">
                  <Avatar name={t.name} size="md" />
                  <div>
                    <p className="text-sm font-bold text-stone-900 group-hover:text-white transition-colors duration-500">{t.name}</p>
                    <p className="text-xs text-stone-400 group-hover:text-white/60 transition-colors duration-500">{t.role}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="relative flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`h-3.5 w-3.5 transition-colors duration-500 ${
                        j < t.rating
                          ? 'fill-[#C4956A] text-[#C4956A] group-hover:fill-[#D4A76A] group-hover:text-[#D4A76A]'
                          : 'text-stone-200 group-hover:text-white/20'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="relative text-sm text-stone-600 leading-relaxed group-hover:text-white/80 transition-colors duration-500">
                  {t.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default TestimoniosPage;
