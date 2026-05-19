'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/* ── Collection data by category ── */

export interface CollectionItem {
  name: string;
  slug: string;
  images: string[]; /* multiple images that rotate */
  priceRange: string;
  tag?: string;
}

export interface CategoryData {
  key: string;
  label: string;
  collections: CollectionItem[];
}

export const allCategories: CategoryData[] = [
  {
    key: 'mujer',
    label: 'Mujer',
    collections: [
      {
        name: 'Vestidos',
        slug: 'vestidos',
        images: [
          '/images/vestidos-1.jpg',
          '/images/vestidos-2.jpg',
          '/images/vestidos-3.jpg',
        ],
        priceRange: '$149.900 - $299.900',
        tag: 'Popular',
      },
      {
        name: 'Blusas & Tops',
        slug: 'blusas-tops',
        images: [
          '/images/blusas-1.jpg',
          '/images/blusas-2.jpg',
        ],
        priceRange: '$59.900 - $129.900',
        tag: 'Nuevo',
      },
      {
        name: 'Jeans',
        slug: 'jeans',
        images: [
          '/images/jeans-1.jpg',
          '/images/jeans-2.jpg',
        ],
        priceRange: '$99.900 - $189.900',
      },
      {
        name: 'Faldas',
        slug: 'faldas',
        images: [
          '/images/faldas-1.jpg',
          '/images/faldas-2.jpg',
          '/images/faldas-3.jpg',
          '/images/faldas-4.jpg',
        ],
        priceRange: '$89.900 - $179.900',
      },
      {
        name: 'Chaquetas',
        slug: 'chaquetas',
        images: [
          '/images/chaquetas-1.jpg',
          '/images/chaquetas-2.jpg',
          '/images/chaquetas-3.jpg',
          '/images/chaquetas-4.jpg',
        ],
        priceRange: '$199.900 - $349.900',
      },
      {
        name: 'Zapatos',
        slug: 'zapatos',
        images: [
          '/images/zapatos-1.jpg',
          '/images/zapatos-2.jpg',
          '/images/zapatos-3.jpg',
          '/images/zapatos-4.jpg',
        ],
        priceRange: '$129.900 - $249.900',
      },
      {
        name: 'Accesorios',
        slug: 'accesorios',
        images: [
          '/images/accesorios-1.jpg',
          '/images/accesorios-2.jpg',
          '/images/accesorios-3.jpg',
        ],
        priceRange: '$49.900 - $199.900',
      },
      {
        name: 'Lociones',
        slug: 'lociones',
        images: [
          '/images/lociones-1.jpg',
          '/images/lociones-2.jpg',
          '/images/lociones-3.jpg',
        ],
        priceRange: '$89.900 - $349.900',
        tag: 'Premium',
      },
    ],
  },
  {
    key: 'hombre',
    label: 'Hombre',
    collections: [
      {
        name: 'Camisas & Camisetas',
        slug: 'camisas-camisetas',
        images: [
          '/images/hombre-camisas-1.jpg',
          '/images/hombre-camisas-2.jpg',
          '/images/hombre-camisas-3.jpg',
        ],
        priceRange: '$59.900 - $169.900',
        tag: 'Best Seller',
      },
      {
        name: 'Pantalones',
        slug: 'pantalones',
        images: [
          '/images/hombre-pantalones-1.jpg',
          '/images/hombre-pantalones-2.jpg',
          '/images/hombre-pantalones-3.jpg',
          '/images/hombre-pantalones-4.jpg',
        ],
        priceRange: '$99.900 - $199.900',
      },
      {
        name: 'Chaquetas',
        slug: 'chaquetas-hombre',
        images: [
          '/images/hombre-chaquetas-1.jpg',
          '/images/hombre-chaquetas-2.jpg',
          '/images/hombre-chaquetas-3.jpg',
          '/images/hombre-chaquetas-4.jpg',
        ],
        priceRange: '$179.900 - $399.900',
      },
      {
        name: 'Trajes',
        slug: 'trajes',
        images: [
          '/images/hombre-trajes-1.jpg',
          '/images/hombre-trajes-2.jpg',
          '/images/hombre-trajes-3.jpg',
        ],
        priceRange: '$299.900 - $599.900',
        tag: 'Premium',
      },
      {
        name: 'Lociones',
        slug: 'lociones-hombre',
        images: [
          '/images/hombre-lociones-1.jpg',
          '/images/hombre-lociones-2.jpg',
          '/images/hombre-lociones-3.jpg',
        ],
        priceRange: '$89.900 - $349.900',
      },
      {
        name: 'Zapatos',
        slug: 'zapatos-hombre',
        images: [
          '/images/hombre-zapatos-1.jpg',
          '/images/hombre-zapatos-2.jpg',
          '/images/hombre-zapatos-3.jpg',
          '/images/hombre-zapatos-4.jpg',
        ],
        priceRange: '$129.900 - $289.900',
      },
      {
        name: 'Accesorios',
        slug: 'accesorios-hombre',
        images: [
          '/images/hombre-accesorios-1.jpg',
          '/images/hombre-accesorios-2.jpg',
          '/images/hombre-accesorios-3.jpg',
        ],
        priceRange: '$49.900 - $199.900',
        tag: 'Nuevo',
      },
    ],
  },
  {
    key: 'ninos',
    label: 'Niños',
    collections: [
      {
        name: 'Niña 6-14 años',
        slug: 'nina-6-14',
        images: [
          '/images/nina-vestido-rojo.jpg',
          '/images/nina-outfit-urbano.jpg',
          '/images/nina-conjunto-rosa.jpg',
        ],
        priceRange: '$39.900 - $99.900',
        tag: 'Nuevo',
      },
      {
        name: 'Niño 6-14 años',
        slug: 'nino-6-14',
        images: [
          '/images/nino-conjunto-naranja.jpg',
          '/images/nino-tracksuit-sport.jpg',
          '/images/nino-camisas-formales.jpg',
          '/images/nino-conjunto-cuadros.jpg',
          '/images/nino-traje-azul.jpg',
        ],
        priceRange: '$39.900 - $99.900',
      },
      {
        name: 'Bebé 0-18 meses',
        slug: 'bebe-0-18',
        images: [
          'https://images.pexels.com/photos/265987/pexels-photo-265987.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
          'https://images.pexels.com/photos/789786/pexels-photo-789786.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
        ],
        priceRange: '$29.900 - $69.900',
      },
      {
        name: 'Zapatos Infantiles',
        slug: 'zapatos-infantiles',
        images: [
          '/images/ninos-zapatos-1.jpg',
          '/images/ninos-zapatos-2.jpg',
        ],
        priceRange: '$49.900 - $119.900',
      },
    ],
  },
  {
    key: 'beauty',
    label: 'Beauty',
    collections: [
      {
        name: 'Fragancias Mujer',
        slug: 'fragancias-mujer',
        images: [
          'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
          'https://images.pexels.com/photos/2587370/pexels-photo-2587370.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
        ],
        priceRange: '$89.900 - $249.900',
        tag: 'Popular',
      },
      {
        name: 'Fragancias Hombre',
        slug: 'fragancias-hombre',
        images: [
          'https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
          'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
        ],
        priceRange: '$79.900 - $229.900',
      },
      {
        name: 'Cuidado Facial',
        slug: 'cuidado-facial',
        images: [
          'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
          'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
        ],
        priceRange: '$49.900 - $149.900',
        tag: 'Eco',
      },
      {
        name: 'Sets de Regalo',
        slug: 'sets-regalo',
        images: [
          'https://images.pexels.com/photos/2587370/pexels-photo-2587370.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
          'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
        ],
        priceRange: '$129.900 - $349.900',
        tag: 'Gift',
      },
    ],
  },
  {
    key: 'accesorios',
    label: 'Accesorios',
    collections: [
      {
        name: 'Bolsos',
        slug: 'bolsos',
        images: [
          'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
          'https://images.pexels.com/photos/1204464/pexels-photo-1204464.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
        ],
        priceRange: '$79.900 - $249.900',
        tag: 'Popular',
      },
      {
        name: 'Gafas de Sol',
        slug: 'gafas-sol',
        images: [
          '/images/accesorios-gafas-1.jpg',
          '/images/accesorios-gafas-2.jpg',
        ],
        priceRange: '$59.900 - $179.900',
      },
      {
        name: 'Zapatos',
        slug: 'zapatos',
        images: [
          'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
          'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
          'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
        ],
        priceRange: '$129.900 - $289.900',
        tag: 'Nuevo',
      },
      {
        name: 'Joyería',
        slug: 'joyeria',
        images: [
          'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
          'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
        ],
        priceRange: '$39.900 - $149.900',
      },
    ],
  },
];

/* ── Rotating image card ── */
function RotatingCard({ item, index }: { item: CollectionItem; index: number }) {
  const [imgIndex, setImgIndex] = useState(0);

  React.useEffect(() => {
    if (item.images.length <= 1) return;
    const interval = setInterval(() => {
      setImgIndex((p) => (p + 1) % item.images.length);
    }, 3000 + index * 500); /* stagger timing per card */
    return () => clearInterval(interval);
  }, [item.images.length, index]);

  const tagColors: Record<string, string> = {
    Nuevo: 'from-emerald-400 to-teal-500',
    Popular: 'from-[#C4956A] to-[#8B6F5E]',
    'Best Seller': 'from-amber-400 to-orange-500',
    Eco: 'from-lime-400 to-green-500',
    Gift: 'from-rose-400 to-pink-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
      style={{ minHeight: 400 }}
    >
      {/* Rotating images */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIndex}
            src={item.images[imgIndex]}
            alt={item.name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        {/* Subtle Ken Burns on current image */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.06] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Tag */}
      {item.tag && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${tagColors[item.tag] || 'from-stone-500 to-stone-600'} shadow-lg`}
        >
          {item.tag}
        </motion.span>
      )}

      {/* Image dots indicator */}
      {item.images.length > 1 && (
        <div className="absolute top-4 right-4 flex gap-1">
          {item.images.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === imgIndex ? 'bg-white w-4' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6">
        <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
        <p className="text-white/60 text-sm mb-3">{item.priceRange}</p>
        <Link
          href={`/coleccion/${item.slug}`}
          className="inline-flex items-center gap-2 text-[#C4956A] font-semibold text-sm group-hover:text-white transition-colors duration-300"
        >
          Ver colección
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowRight className="h-4 w-4" />
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
}

export function FashionCollections() {
  const [activeTab, setActiveTab] = useState('mujer');
  const activeCat = allCategories.find((c) => c.key === activeTab)!;

  // Listen for tab switch events from the mobile menu
  useEffect(() => {
    const handleSwitchTab = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const key = customEvent.detail;
      if (allCategories.some((c) => c.key === key)) {
        setActiveTab(key);
        // Also scroll into view when tab is switched via event
        setTimeout(() => {
          const el = document.getElementById('colecciones');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    };
    window.addEventListener('switchCollectionTab', handleSwitchTab);
    return () => window.removeEventListener('switchCollectionTab', handleSwitchTab);
  }, []);

  return (
    <section id="colecciones" className="py-20 bg-gradient-to-b from-[#FAF8F5] to-[#F5EDE4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900">
            Nuestras <span className="text-[#C4956A]">Colecciones</span>
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto">
            Moda sostenible y premium para cada estilo
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex gap-1 p-1 rounded-full bg-white shadow-md border border-stone-100">
            {allCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`relative px-5 sm:px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === cat.key
                    ? 'text-white'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {activeTab === cat.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Collection grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {activeCat.collections.map((col, i) => (
              <RotatingCard key={col.name} item={col} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default FashionCollections;
