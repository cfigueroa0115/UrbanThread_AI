'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, ShoppingCart, Heart, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { products, type Product } from '@/data/products';
import { allCategories } from '@/components/home/FashionCollections';

function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const badgeStyles: Record<string, string> = {
  Nuevo: 'bg-emerald-500 text-white',
  Popular: 'bg-[#C4956A] text-white',
  'Best Seller': 'bg-amber-500 text-white',
  Eco: 'bg-lime-500 text-white',
  Oferta: 'bg-rose-500 text-white',
};

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= Math.round(rating) ? 'text-[#C4956A] fill-[#C4956A]' : 'text-stone-200 fill-stone-200'}`}
          />
        ))}
      </div>
      <span className="text-xs text-stone-400">({reviews})</span>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // If product has sizes and none selected, select the first one
    const size = selectedSize || product.sizes?.[0];
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-[#C4956A]/30 hover:shadow-xl transition-all duration-500"
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-[#F5F0EB]"
        style={{ height: 340 }}
        onMouseEnter={() => { if (product.images.length > 1) setImgIdx(1); }}
        onMouseLeave={() => setImgIdx(0)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIdx}
            src={product.images[imgIdx] || product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${badgeStyles[product.badge] || 'bg-stone-800 text-white'}`}>
            {product.badge}
          </span>
        )}

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold bg-rose-500 text-white">
            -{discount}%
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${discount > 0 ? 'top-10' : ''} ${liked ? 'bg-rose-500 text-white' : 'bg-white/80 text-stone-500 hover:bg-rose-50 hover:text-rose-500 opacity-0 group-hover:opacity-100'}`}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
        </button>

        {/* Sizes on image — always visible */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedSize(size); }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold backdrop-blur-md transition-all ${
                  selectedSize === size
                    ? 'bg-[#1A1A1A] text-white shadow-lg'
                    : 'bg-white/90 text-stone-700 hover:bg-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Added to cart confirmation overlay */}
        <AnimatePresence>
          {addedToCart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="bg-white rounded-2xl p-4 text-center shadow-xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.4 }}
                >
                  <ShoppingCart className="h-8 w-8 text-green-500 mx-auto mb-2" />
                </motion.div>
                <p className="text-sm font-bold text-stone-900">¡Agregado!</p>
                {selectedSize && <p className="text-xs text-stone-500">Talla: {selectedSize}</p>}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-stone-900 line-clamp-1 mb-1.5">{product.name}</h3>
        <StarRating rating={product.rating} reviews={product.reviews} />

        {/* Selected size indicator */}
        {selectedSize && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[10px] text-stone-400">Talla:</span>
            <span className="px-2 py-0.5 rounded bg-[#1A1A1A] text-white text-[10px] font-bold">{selectedSize}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-stone-900">{formatCOP(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-stone-400 line-through">{formatCOP(product.originalPrice)}</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="p-2.5 rounded-full bg-[#1A1A1A] text-white hover:bg-[#C4956A] transition-colors"
            aria-label="Agregar al carrito"
          >
            <ShoppingCart className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showSort, setShowSort] = useState(false);

  // Find collection info
  const collectionInfo = useMemo(() => {
    for (const cat of allCategories) {
      const col = cat.collections.find((c) => c.slug === slug);
      if (col) return { ...col, category: cat.label, categoryKey: cat.key };
    }
    return null;
  }, [slug]);

  // Get products for this collection
  const collectionProducts = useMemo(() => {
    const filtered = products.filter((p) => p.collection === slug);
    switch (sortBy) {
      case 'price-asc': return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...filtered].sort((a, b) => b.price - a.price);
      case 'rating': return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'newest': return [...filtered].sort((a, b) => (b.badge === 'Nuevo' ? 1 : 0) - (a.badge === 'Nuevo' ? 1 : 0));
      default: return filtered;
    }
  }, [slug, sortBy]);

  // Related collections (same category, different slug)
  const relatedCollections = useMemo(() => {
    if (!collectionInfo) return [];
    const cat = allCategories.find((c) => c.key === collectionInfo.categoryKey);
    return cat?.collections.filter((c) => c.slug !== slug) ?? [];
  }, [collectionInfo, slug]);

  if (!collectionInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-stone-500">Colección no encontrada</p>
        <Link href="/" className="text-[#C4956A] hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  const sortLabels: Record<SortOption, string> = {
    relevance: 'Relevancia',
    'price-asc': 'Menor precio',
    'price-desc': 'Mayor precio',
    rating: 'Mejor valorados',
    newest: 'Más nuevos',
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src={collectionInfo.images[0]}
          alt={collectionInfo.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> {collectionInfo.category}
            </button>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{collectionInfo.name}</h1>
            <p className="text-white/60 text-sm mt-1">{collectionInfo.priceRange} · {collectionProducts.length} productos</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-stone-500">
            <span className="font-semibold text-stone-900">{collectionProducts.length}</span> productos encontrados
          </p>
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-sm text-stone-700 hover:border-stone-300 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {sortLabels[sortBy]}
              <ChevronDown className={`h-4 w-4 transition-transform ${showSort ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-stone-100 py-1 z-20 min-w-[180px]"
                >
                  {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${sortBy === opt ? 'bg-[#C4956A]/10 text-[#C4956A] font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                    >
                      {sortLabels[opt]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Product grid */}
        {collectionProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {collectionProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-stone-400">Próximamente nuevos productos</p>
          </div>
        )}

        {/* Related collections */}
        {relatedCollections.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">
              Otras colecciones de <span className="text-[#C4956A]">{collectionInfo.category}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedCollections.map((col) => (
                <Link
                  key={col.slug}
                  href={`/coleccion/${col.slug}`}
                  className="group relative rounded-2xl overflow-hidden h-48 block"
                >
                  <img src={col.images[0]} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-lg font-bold text-white">{col.name}</h3>
                    <p className="text-white/60 text-xs">{col.priceRange}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
