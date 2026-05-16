'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { RadicacionStepper } from '@/components/radicacion/RadicacionStepper';

export default function RadicacionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] shadow-lg">
          <FileText className="h-6 w-6 text-[#C4956A]" />
        </div>
        <div>
          <h1 className="text-h3 font-bold text-ut-text">Radicación de Solicitud</h1>
          <p className="text-small text-ut-text-muted">
            Completa los pasos para radicar tu solicitud
          </p>
        </div>
      </div>

      <RadicacionStepper />
    </div>
  );
}
