'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Database, Brain, Workflow, Server } from 'lucide-react';

const technologies = [
  {
    icon: Code2,
    name: 'Next.js 14',
    description: 'Frontend moderno con App Router, SSR, RSC y rendimiento optimizado.',
    category: 'Frontend',
  },
  {
    icon: Server,
    name: 'Express.js',
    description: 'API REST robusta, versionada y documentada con middleware de seguridad.',
    category: 'Backend',
  },
  {
    icon: Database,
    name: 'PostgreSQL',
    description: 'Base de datos relacional con 30+ tablas, Prisma ORM y migraciones.',
    category: 'Base de datos',
  },
  {
    icon: Brain,
    name: 'OpenAI',
    description: 'Chatbot IA con respuestas contextuales, clasificación de intenciones y escalamiento.',
    category: 'Inteligencia artificial',
  },
  {
    icon: Workflow,
    name: 'n8n',
    description: 'Automatización de flujos de trabajo con webhooks e integración de sistemas.',
    category: 'Automatización',
  },
];

export function TechIntegration() {
  return (
    <section className="py-20 bg-ut-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-h2">
            Integración <span className="text-ut-accent">tecnológica</span>
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Stack moderno y probado para maxima escalabilidad, rendimiento y mantenibilidad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-5 gap-6">
          {technologies.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ut-accent/20 mb-4">
                <tech.icon className="h-7 w-7 text-ut-accent" />
              </div>
              <p className="text-small text-ut-accent font-medium mb-1">{tech.category}</p>
              <h3 className="text-h4 mb-2">{tech.name}</h3>
              <p className="text-small text-white/60">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TechIntegration;
