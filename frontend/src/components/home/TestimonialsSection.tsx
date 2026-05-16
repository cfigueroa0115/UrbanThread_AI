'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

const testimonials = [
  {
    name: 'Maria Garcia',
    role: 'Gerente de Operaciones',
    content: 'UrbanThread AI transformo nuestra gestion de pedidos. La automatizacion nos ahorro horas de trabajo manual cada semana.',
    rating: 5,
  },
  {
    name: 'Carlos Rodriguez',
    role: 'Director Comercial',
    content: 'El chatbot IA atiende a nuestros clientes 24/7 con respuestas precisas. La satisfaccion del cliente aumento significativamente.',
    rating: 5,
  },
  {
    name: 'Ana Martinez',
    role: 'Coordinadora de Logistica',
    content: 'La radicacion digital elimino el papeleo. Ahora tenemos trazabilidad completa de cada solicitud en tiempo real.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-h2 text-ut-text">
            Lo que dicen nuestros <span className="text-gradient">clientes</span>
          </h2>
          <p className="mt-4 text-lg text-ut-text-muted max-w-2xl mx-auto">
            Experiencias reales de empresas que ya transformaron su operación con UrbanThread AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-6 rounded-xl border border-ut-surface-dark bg-white/80 backdrop-blur-sm hover:border-ut-accent/50 hover:shadow-[0_0_20px_rgba(0,212,170,0.15)] hover:bg-gradient-to-br hover:from-ut-accent/5 hover:to-ut-electric/5 transition-all duration-300 cursor-pointer"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-ut-surface-dark group-hover:text-ut-accent/30 transition-colors duration-300" aria-hidden="true" />
              <div className="flex items-center gap-3 mb-4">
                <div className="ring-2 ring-transparent group-hover:ring-ut-accent/40 rounded-full transition-all duration-300 group-hover:shadow-lg">
                  <Avatar name={testimonial.name} size="md" />
                </div>
                <div>
                  <p className="text-body font-semibold text-ut-text group-hover:text-ut-primary transition-colors duration-300">{testimonial.name}</p>
                  <p className="text-small text-ut-text-muted">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3" aria-label={`${testimonial.rating} de 5 estrellas`}>
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-ut-gold text-ut-gold group-hover:drop-shadow-[0_0_4px_rgba(245,158,11,0.6)] transition-all duration-300" />
                ))}
              </div>
              <p className="text-body text-ut-text-muted group-hover:text-ut-text transition-colors duration-300">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/testimonios">
            <Button variant="outline" size="md">
              Ver todos los testimonios
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
