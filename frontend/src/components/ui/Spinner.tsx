'use client';

import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles: Record<string, { container: string; ring: string }> = {
  sm: { container: 'h-6 w-6', ring: 'h-6 w-6' },
  md: { container: 'h-10 w-10', ring: 'h-10 w-10' },
  lg: { container: 'h-16 w-16', ring: 'h-16 w-16' },
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const s = sizeStyles[size];
  return (
    <div role="status" aria-label="Cargando" className={`relative inline-flex items-center justify-center ${s.container} ${className}`}>
      {/* Ring 1 - Dorado */}
      <div className={`absolute ${s.ring} rounded-full border-[2.5px] border-transparent border-t-[#C4956A] animate-spin`} style={{ animationDuration: '0.8s' }} />
      {/* Ring 2 - Negro */}
      <div className={`absolute ${s.ring} rounded-full border-[2.5px] border-transparent border-t-[#1A1A1A] animate-spin`} style={{ animationDuration: '1.2s', animationDirection: 'reverse' }} />
      {/* Ring 3 - Beige */}
      <div className={`absolute ${s.ring} rounded-full border-[2.5px] border-transparent border-t-[#D4A76A] animate-spin`} style={{ animationDuration: '1.6s' }} />
      <span className="sr-only">Cargando...</span>
    </div>
  );
}

/** Loading overlay popup - se usa en toda la página cuando hay transacciones */
export function LoadingOverlay({ message = 'Espere un momento por favor mientras validamos sus datos...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-5">
        {/* Spinner de 3 anillos animados */}
        <div className="relative w-20 h-20">
          {/* Anillo exterior - Dorado */}
          <div
            className="absolute inset-0 rounded-full border-[3px] border-transparent"
            style={{
              borderTopColor: '#C4956A',
              borderRightColor: '#C4956A',
              animation: 'spin 1s linear infinite',
            }}
          />
          {/* Anillo medio - Negro */}
          <div
            className="absolute inset-[6px] rounded-full border-[3px] border-transparent"
            style={{
              borderTopColor: '#1A1A1A',
              borderLeftColor: '#1A1A1A',
              animation: 'spin 1.4s linear infinite reverse',
            }}
          />
          {/* Anillo interior - Beige dorado */}
          <div
            className="absolute inset-[12px] rounded-full border-[3px] border-transparent"
            style={{
              borderBottomColor: '#D4A76A',
              borderRightColor: '#D4A76A',
              animation: 'spin 0.9s linear infinite',
            }}
          />
          {/* Punto central pulsante */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-3 h-3 rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A76A]"
              style={{ animation: 'pulse 1.2s ease-in-out infinite' }}
            />
          </div>
        </div>

        {/* Mensaje */}
        <div className="text-center">
          <p className="text-sm font-semibold text-[#1A1A1A]">Procesando</p>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">{message}</p>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C4956A] via-[#D4A76A] to-[#C4956A]"
            style={{
              width: '40%',
              animation: 'loading-bar 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

export default Spinner;
