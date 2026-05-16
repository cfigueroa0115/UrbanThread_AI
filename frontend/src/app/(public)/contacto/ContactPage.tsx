'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { ContactFormSchema, type ContactFormInput } from '@shared/schemas';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { trackFormSubmit } from '@/lib/analytics';

export function ContactPage() {
  const [form, setForm] = useState<ContactFormInput>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormInput, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateField(field: keyof ContactFormInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = ContactFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormInput, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactFormInput;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      // In production this would POST to the API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      trackFormSubmit('contact', true);
      setSubmitted(true);
    } catch {
      trackFormSubmit('contact', false);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-ut-success" />
            </div>
            <h1 className="text-h2 text-ut-text">¡Mensaje enviado!</h1>
            <p className="text-lg text-ut-text-muted">
              Gracias por contactarnos. Nuestro equipo te responderá en las próximas 24 horas.
            </p>
            <Button variant="primary" onClick={() => setSubmitted(false)}>
              Enviar otro mensaje
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-h1 text-ut-text">
            <span className="text-gradient">Contáctanos</span>
          </h1>
          <p className="mt-4 text-lg text-ut-text-muted max-w-2xl mx-auto">
            ¿Tienes preguntas sobre UrbanThread AI? Envíanos un mensaje y te responderemos pronto.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 laptop:grid-cols-3 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-h3 text-ut-text mb-6">Información de contacto</h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-ut-accent/10">
                    <Mail className="h-5 w-5 text-ut-accent" />
                  </div>
                  <div>
                    <p className="text-small font-medium text-ut-text">Correo electrónico</p>
                    <p className="text-body text-ut-text-muted">contacto@urbanthread.ai</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-ut-accent/10">
                    <Phone className="h-5 w-5 text-ut-accent" />
                  </div>
                  <div>
                    <p className="text-small font-medium text-ut-text">Teléfono</p>
                    <p className="text-body text-ut-text-muted">+57 300 509 1114</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-ut-accent/10">
                    <MapPin className="h-5 w-5 text-ut-accent" />
                  </div>
                  <div>
                    <p className="text-small font-medium text-ut-text">Ubicación</p>
                    <p className="text-body text-ut-text-muted">Bogotá, Colombia</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="laptop:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-xl border border-ut-surface-dark bg-white shadow-card" noValidate>
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-5">
                <Input
                  label="Nombre"
                  required
                  value={form.name}
                  onChange={(v) => updateField('name', v)}
                  error={errors.name}
                  placeholder="Tu nombre completo"
                />
                <Input
                  label="Correo electrónico"
                  type="email"
                  required
                  value={form.email}
                  onChange={(v) => updateField('email', v)}
                  error={errors.email}
                  placeholder="tu@correo.com"
                />
              </div>
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-5">
                <Input
                  label="Teléfono"
                  type="tel"
                  value={form.phone ?? ''}
                  onChange={(v) => updateField('phone', v)}
                  error={errors.phone}
                  placeholder="+57 300 000 0000"
                />
                <Input
                  label="Asunto"
                  required
                  value={form.subject}
                  onChange={(v) => updateField('subject', v)}
                  error={errors.subject}
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <Textarea
                label="Mensaje"
                required
                value={form.message}
                onChange={(v) => updateField('message', v)}
                error={errors.message}
                maxLength={2000}
                placeholder="Cuéntanos sobre tu proyecto o consulta..."
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={<Send className="h-5 w-5" />}
                className="w-full tablet:w-auto"
              >
                Enviar mensaje
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default ContactPage;
