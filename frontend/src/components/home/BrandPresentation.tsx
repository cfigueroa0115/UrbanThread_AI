'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function BrandPresentation() {
  return (
    <section className="py-14 bg-white/60 backdrop-blur-sm"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='700' viewBox='0 0 700 700'%3E%3Ccircle cx='50' cy='50' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='200' cy='30' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='350' cy='70' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='500' cy='40' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='650' cy='60' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='120' cy='180' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='280' cy='160' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='430' cy='190' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='580' cy='170' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='70' cy='320' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='220' cy='300' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='370' cy='330' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='520' cy='310' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='670' cy='340' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Cline x1='50' y1='50' x2='200' y2='30' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='200' y1='30' x2='350' y2='70' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='350' y1='70' x2='500' y2='40' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='500' y1='40' x2='650' y2='60' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='50' y1='50' x2='120' y2='180' stroke='%23cfd8dc' stroke-width='1' opacity='0.5'/%3E%3Cline x1='200' y1='30' x2='280' y2='160' stroke='%23cfd8dc' stroke-width='1' opacity='0.5'/%3E%3Cline x1='350' y1='70' x2='430' y2='190' stroke='%23cfd8dc' stroke-width='1' opacity='0.5'/%3E%3Cline x1='500' y1='40' x2='580' y2='170' stroke='%23cfd8dc' stroke-width='1' opacity='0.5'/%3E%3Cline x1='120' y1='180' x2='280' y2='160' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='280' y1='160' x2='430' y2='190' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='430' y1='190' x2='580' y2='170' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='120' y1='180' x2='70' y2='320' stroke='%23cfd8dc' stroke-width='1' opacity='0.5'/%3E%3Cline x1='280' y1='160' x2='220' y2='300' stroke='%23cfd8dc' stroke-width='1' opacity='0.5'/%3E%3Cline x1='430' y1='190' x2='370' y2='330' stroke='%23cfd8dc' stroke-width='1' opacity='0.5'/%3E%3Cline x1='580' y1='170' x2='520' y2='310' stroke='%23cfd8dc' stroke-width='1' opacity='0.5'/%3E%3Cline x1='70' y1='320' x2='220' y2='300' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='220' y1='300' x2='370' y2='330' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='370' y1='330' x2='520' y2='310' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='520' y1='310' x2='670' y2='340' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='200' y1='30' x2='430' y2='190' stroke='%23cfd8dc' stroke-width='0.7' opacity='0.3'/%3E%3Cline x1='120' y1='180' x2='370' y2='330' stroke='%23cfd8dc' stroke-width='0.7' opacity='0.3'/%3E%3Cline x1='280' y1='160' x2='520' y2='310' stroke='%23cfd8dc' stroke-width='0.7' opacity='0.3'/%3E%3C/svg%3E")`,
        backgroundSize: '700px 700px',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="flex justify-center">
            <img src="/images/brand-icon.svg" alt="" className="h-16 w-16 drop-shadow-lg" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-ut-text">
            UrbanThread <span style={{ color: '#6C5CE7' }}>AI</span>
          </h2>

          <p className="text-xs uppercase tracking-[4px] text-ut-accent font-semibold">
            Smart Commerce &middot; IA &middot; Automatización &middot; Identidad digital
          </p>

          <p className="text-base text-ut-text-muted leading-relaxed max-w-2xl mx-auto">
            Plataforma Smart Commerce integral que transforma el retail de moda
            en una experiencia inteligente, fluida y sostenible. Conectamos
            clientes, datos y operaciones mediante inteligencia artificial,
            automatización avanzada e identidad digital.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default BrandPresentation;
