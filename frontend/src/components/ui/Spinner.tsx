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
      <div className={`absolute ${s.ring} rounded-full border-[2.5px] border-transparent border-t-[#C4956A] animate-spin`} style={{ animationDuration: '0.8s' }} />
      <div className={`absolute ${s.ring} rounded-full border-[2.5px] border-transparent border-t-[#1A1A1A] animate-spin`} style={{ animationDuration: '1.2s', animationDirection: 'reverse' }} />
      <div className={`absolute ${s.ring} rounded-full border-[2.5px] border-transparent border-t-[#D4A76A] animate-spin`} style={{ animationDuration: '1.6s' }} />
      <span className="sr-only">Cargando...</span>
    </div>
  );
}

/** Loading overlay popup premium - sin fondo blanco, diseño glassmorphism oscuro */
export function LoadingOverlay({ message = 'Espere un momento por favor mientras validamos sus datos...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="flex flex-col items-center gap-6 max-w-sm w-full">
        {/* Spinner grande de 3 anillos */}
        <div className="relative w-28 h-28">
          {/* Glow exterior */}
          <div
            className="absolute inset-[-4px] rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(196,149,106,0.3) 25%, transparent 50%, rgba(212,167,106,0.3) 75%, transparent 100%)',
              animation: 'spin 3s linear infinite',
            }}
          />
          {/* Anillo exterior - Dorado grueso */}
          <div
            className="absolute inset-0 rounded-full border-[4px] border-transparent"
            style={{
              borderTopColor: '#C4956A',
              borderRightColor: 'rgba(196,149,106,0.4)',
              animation: 'spin 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />
          {/* Anillo medio - Blanco/Crema */}
          <div
            className="absolute inset-[10px] rounded-full border-[3.5px] border-transparent"
            style={{
              borderTopColor: '#FFFFFF',
              borderLeftColor: 'rgba(255,255,255,0.3)',
              animation: 'spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse',
            }}
          />
          {/* Anillo interior - Beige dorado */}
          <div
            className="absolute inset-[22px] rounded-full border-[3px] border-transparent"
            style={{
              borderBottomColor: '#D4A76A',
              borderRightColor: 'rgba(212,167,106,0.4)',
              animation: 'spin 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />
          {/* Centro con logo pulsante */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-5 h-5 rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A76A] shadow-lg"
              style={{
                animation: 'pulse-glow 1.4s ease-in-out infinite',
                boxShadow: '0 0 20px rgba(196,149,106,0.5)',
              }}
            />
          </div>
        </div>

        {/* Texto */}
        <div className="text-center space-y-2">
          <p className="text-lg font-bold text-white tracking-wide">Procesando</p>
          <p className="text-sm text-white/70 leading-relaxed px-4">{message}</p>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-48 h-[3px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C4956A] via-[#D4A76A] to-[#C4956A]"
            style={{
              width: '35%',
              animation: 'loading-slide 1.8s ease-in-out infinite',
            }}
          />
        </div>

        {/* Dots animados */}
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]" style={{ animation: 'dot-bounce 1.2s ease-in-out infinite' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4A76A]" style={{ animation: 'dot-bounce 1.2s ease-in-out 0.2s infinite' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" style={{ animation: 'dot-bounce 1.2s ease-in-out 0.4s infinite' }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes loading-slide {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(450%); }
        }
        @keyframes dot-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Spinner;
