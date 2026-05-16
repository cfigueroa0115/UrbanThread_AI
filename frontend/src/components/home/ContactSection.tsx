'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ContactSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-ut-primary via-ut-primary-light to-ut-electric text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 laptop:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-h2">
              Tu próximo <span className="text-ut-accent">look</span> te espera
            </h2>
            <p className="text-lg text-white/70">
              ¿Tienes dudas sobre tallas, envíos o devoluciones? Escríbenos y te ayudamos
              a encontrar exactamente lo que buscas.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <Mail className="h-5 w-5 text-ut-accent" />
                </div>
                <span className="text-white/80">contacto@urbanthread.ai</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <Phone className="h-5 w-5 text-ut-accent" />
                </div>
                <span className="text-white/80">+57 300 509 1114</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <MapPin className="h-5 w-5 text-ut-accent" />
                </div>
                <span className="text-white/80">Bogotá, Colombia</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
          >
            <h3 className="text-h3 text-center">Compra con confianza</h3>
            <p className="text-white/60 text-center text-body">
              Explora nuestras colecciones o escríbenos para recibir asesoría personalizada de estilo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link href="/contacto" className="flex-1">
                <Button variant="primary" size="lg" className="w-full" icon={<ArrowRight className="h-5 w-5" />}>
                  Escríbenos
                </Button>
              </Link>
              <a href="#colecciones" className="flex-1">
                <Button variant="outline" size="lg" className="w-full border-white text-white hover:bg-white/10 hover:text-white">
                  Ver Colecciones
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
