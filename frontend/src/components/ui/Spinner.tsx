'use client';

import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles: Record<string, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-3',
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className={`
        inline-block rounded-full
        border-ut-surface-dark border-t-ut-accent
        animate-spin
        ${sizeStyles[size]}
        ${className}
      `}
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
}

export default Spinner;
