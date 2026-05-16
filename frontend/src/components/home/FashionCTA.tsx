'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, ShieldCheck, Leaf, CreditCard, X } from 'lucide-react';

const perks = [
  {
    icon: Truck,
    title: 'Envío Gratis',
    description: 'En compras mayores a $150.000',
    detail: 'Tu estilo no debería tener barreras. En UrbanThread AI creemos que la moda debe llegar a ti sin obstáculos. Por eso, en compras superiores a $150.000 COP el envío es completamente gratis a cualquier ciudad de Colombia. Recibe tus prendas favoritas en 3 a 5 días hábiles, con seguimiento en tiempo real y seguro incluido. Porque mereces que la experiencia de vestir bien comience desde el momento en que haces clic.',
  },
  {
    icon: ShieldCheck,
    title: 'Compra Segura',
    description: 'Pagos protegidos y garantía de devolución',
    detail: 'Tu tranquilidad es nuestra prioridad. Cada transacción en UrbanThread AI está protegida con encriptación SSL de 256 bits y certificación PCI DSS. Además, cuentas con 30 días de garantía de satisfacción: si no estás 100% conforme, te devolvemos tu dinero sin preguntas. Compra con la confianza de saber que estás respaldado en cada paso del camino.',
  },
  {
    icon: Leaf,
    title: 'Moda Sostenible',
    description: 'Materiales eco-friendly y producción responsable',
    detail: 'Vestir bien y cuidar el planeta no son caminos separados. Nuestra colección Eco utiliza algodón orgánico certificado GOTS, tintes libres de tóxicos y empaques 100% biodegradables. Cada prenda que eliges contribuye a la reforestación de la Amazonía colombiana. Porque la verdadera elegancia está en dejar una huella positiva en el mundo que habitamos.',
  },
  {
    icon: CreditCard,
    title: 'Paga a Cuotas',
    description: 'Hasta 12 cuotas sin interés',
    detail: 'Tu guardarropa soñado no tiene que esperar. Con nuestras opciones de financiación, puedes dividir tu compra en hasta 12 cuotas sin interés con tarjetas de crédito de bancos aliados. También aceptamos Nequi, Daviplata, PSE y pago contra entrega. Invierte en ti mismo sin comprometer tu presupuesto, porque la confianza que da vestir bien no tiene precio.',
  },
];

export function FashionCTA() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-14 bg-gradient-to-br from-[#FAF8F5] via-[#F5EDE4] to-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((perk, i) => (
            <motion.div
              key={perk.title}
              animate={{ y: [0, -6, 0, 4, 0] }}
              transition={{ duration: 3.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              whileHover={{ scale: 1.04, y: -10 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="group relative flex flex-col p-5 rounded-2xl bg-white border border-[#EDE8E2] overflow-hidden cursor-pointer transition-all duration-500 hover:border-[#C4956A]/50 hover:shadow-xl"
            >
              {/* Corner glows */}
              <motion.div
                className="absolute -top-3 -left-3 w-16 h-16 rounded-full pointer-events-none"
                animate={{ background: ['radial-gradient(circle, rgba(196,149,106,0.15) 0%, transparent 70%)', 'radial-gradient(circle, rgba(196,149,106,0.5) 0%, transparent 70%)', 'radial-gradient(circle, rgba(196,149,106,0.15) 0%, transparent 70%)'] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
              />
              <motion.div
                className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full pointer-events-none"
                animate={{ background: ['radial-gradient(circle, rgba(212,167,106,0.12) 0%, transparent 70%)', 'radial-gradient(circle, rgba(212,167,106,0.55) 0%, transparent 70%)', 'radial-gradient(circle, rgba(212,167,106,0.12) 0%, transparent 70%)'] }}
                transition={{ duration: 2.2 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 + i * 0.25 }}
              />

              {/* Rotating border glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, rgba(196,149,106,0.5) 12%, rgba(255,255,255,0.9) 15%, rgba(196,149,106,0.5) 18%, transparent 30%, transparent 50%, rgba(212,167,106,0.4) 62%, rgba(255,255,255,0.8) 65%, rgba(212,167,106,0.4) 68%, transparent 80%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: '1.5px',
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'linear' }}
              />

              {/* Card glow pulse */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{ boxShadow: ['0 0 0px rgba(196,149,106,0)', '0 0 25px rgba(196,149,106,0.2)', '0 0 0px rgba(196,149,106,0)'] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              />

              {/* Main content row */}
              <div className="relative flex items-start gap-4">
                {/* Icon */}
                <motion.div
                  className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] group-hover:from-[#C4956A] group-hover:to-[#8B6F5E] transition-all duration-500"
                  animate={{ boxShadow: ['0 0 0px rgba(196,149,106,0)', '0 0 22px rgba(196,149,106,0.45)', '0 0 0px rgba(196,149,106,0)'] }}
                  transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                  >
                    <perk.icon className="h-5 w-5 text-[#C4956A] group-hover:text-white transition-colors duration-500" strokeWidth={1.8} />
                  </motion.div>
                </motion.div>

                <div className="relative flex-1">
                  <h3 className="text-sm font-bold text-stone-800 group-hover:text-[#C4956A] transition-colors duration-300">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </div>

              {/* Hover hint */}
              <AnimatePresence>
                {hoveredIndex === i && expandedIndex !== i && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative mt-2 text-[10px] text-[#C4956A] font-semibold"
                  >
                    Click para más info ✨
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Popup Modal */}
        <AnimatePresence>
          {expandedIndex !== null && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpandedIndex(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              />
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-[#C4956A]/20">
                  {/* Header gradient */}
                  <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] px-6 py-5 flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C4956A] to-[#8B6F5E] flex items-center justify-center shadow-lg">
                      {React.createElement(perks[expandedIndex].icon, { className: 'h-6 w-6 text-white', strokeWidth: 1.8 })}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{perks[expandedIndex].title}</h3>
                      <p className="text-sm text-white/60">{perks[expandedIndex].description}</p>
                    </div>
                    <button
                      onClick={() => setExpandedIndex(null)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {/* Body */}
                  <div className="px-6 py-6">
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {perks[expandedIndex].detail}
                    </p>
                  </div>
                  {/* Footer */}
                  <div className="px-6 pb-5">
                    <button
                      onClick={() => setExpandedIndex(null)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A76A] text-white font-semibold text-sm hover:from-[#D4A76A] hover:to-[#E8C496] transition-all shadow-md hover:shadow-lg"
                    >
                      Entendido ✓
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default FashionCTA;
