'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';

interface Product {
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  badge?: string;
  rating: number;
  reviews: number;
}

const products: Product[] = [
  {
    name: 'Camiseta Premium UrbanThread',
    price: 89900,
    images: [
      'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
      'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
    ],
    badge: 'Nuevo',
    rating: 4.8,
    reviews: 124,
  },
  {
    name: 'Pantalón Slim Fit Eco',
    price: 159900,
    originalPrice: 199900,
    images: [
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
    ],
    badge: 'Oferta',
    rating: 4.6,
    reviews: 89,
  },
  {
    name: 'Chaqueta Smart Casual',
    price: 249900,
    images: [
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
      'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
    ],
    badge: 'Nuevo',
    rating: 4.9,
    reviews: 56,
  },
  {
    name: 'Vestido Elegance Sostenible',
    price: 199900,
    images: [
      'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
    ],
    badge: 'Popular',
    rating: 4.7,
    reviews: 203,
  },
  {
    name: 'Sneakers Urban Edition',
    price: 189900,
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
    ],
    badge: 'Trending',
    rating: 4.8,
    reviews: 167,
  },
  {
    name: 'Bolso Crossbody Premium',
    price: 129900,
    originalPrice: 169900,
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
    ],
    badge: 'Oferta',
    rating: 4.5,
    reviews: 78,
  },
  {
    name: 'Camisa Lino Natural',
    price: 119900,
    images: [
      'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
      'https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
    ],
    rating: 4.6,
    reviews: 92,
  },
  {
    name: 'Gafas de Sol Aviator',
    price: 79900,
    images: [
      'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
      'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1',
    ],
    badge: 'Popular',
    rating: 4.4,
    reviews: 145,
  },
];

function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const badgeStyles: Record<string, string> = {
  Nuevo: 'bg-[#1A1A1A] text-white',
  Popular: 'bg-[#C4956A] text-white',
  Oferta: 'bg-rose-500 text-white',
  Trending: 'bg-gradient-to-r from-[#C4956A] to-[#8B6F5E] text-white',
};

/* ── Product Card with rotating images ── */
function ProductCard({ product, index }: { product: Product; index: number }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (product.images.length <= 1) return;
    const timer = setInterval(() => {
      setImgIdx((p) => (p + 1) % product.images.length);
    }, 4000 + index * 600);
    return () => clearInterval(timer);
  }, [product.images.length, index]);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-[#C4956A]/30 hover:shadow-xl transition-all duration-500"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F5F0EB]" style={{ height: 320 }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIdx}
            src={product.images[imgIdx]}
            alt={product.name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>

        {/* Subtle zoom on the current image */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${badgeStyles[product.badge] || 'bg-stone-800 text-white'}`}>
            {product.badge}
          </span>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-[calc(3rem+0.75rem)] px-2 py-1 rounded-full text-[10px] font-bold bg-rose-500 text-white">
            -{discount}%
          </span>
        )}

        {/* Image dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {product.images.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === imgIdx ? 'w-5 bg-[#C4956A]' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Hover actions overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex justify-end gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setLiked(!liked)}
            className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-colors duration-300 ${
              liked ? 'bg-rose-500 text-white' : 'bg-white/90 text-stone-500 hover:text-rose-500'
            }`}
            aria-label="Agregar a favoritos"
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-500 hover:text-[#C4956A] shadow-lg transition-colors"
            aria-label="Vista rápida"
          >
            <Eye className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2.5">
        <h3 className="text-sm font-semibold text-stone-800 line-clamp-1 leading-snug group-hover:text-[#C4956A] transition-colors duration-300">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(product.rating)
                  ? 'text-[#C4956A] fill-[#C4956A]'
                  : 'text-stone-200 fill-stone-200'
              }`}
            />
          ))}
          <span className="text-[11px] text-stone-400 ml-1">({product.reviews})</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-stone-900">
              {formatCOP(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatCOP(product.originalPrice)}
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => addItem({
              id: product.name.replace(/\s/g, '-').toLowerCase(),
              name: product.name,
              price: product.price,
              image: product.images[0]!,
            })}
            className="p-2.5 rounded-xl bg-[#1A1A1A] text-white hover:bg-[#C4956A] shadow-md hover:shadow-lg transition-all duration-300"
            aria-label="Agregar al carrito"
          >
            <ShoppingCart className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900">
            Productos <span className="text-[#C4956A]">Destacados</span>
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto">
            Lo mejor de nuestra colección, seleccionado para ti
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
