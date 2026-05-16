'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-ut-surface px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-lg"
      >
        <p className="text-8xl font-extrabold text-gradient">404</p>
        <h1 className="text-h2 text-ut-text">Página no encontrada</h1>
        <p className="text-lg text-ut-text-muted">
          Lo sentimos, la página que buscas no existe o ha sido movida.
          Vuelve al inicio para explorar UrbanThread AI.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/">
            <Button variant="primary" size="lg" icon={<Home className="h-5 w-5" />}>
              Ir al inicio
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            icon={<ArrowLeft className="h-5 w-5" />}
            onClick={() => window.history.back()}
          >
            Volver atrás
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
