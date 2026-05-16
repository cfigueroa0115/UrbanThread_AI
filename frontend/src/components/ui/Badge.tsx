'use client';

import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-ut-surface-dark text-ut-text',
  success: 'bg-green-50 text-ut-success',
  warning: 'bg-amber-50 text-ut-warning',
  danger: 'bg-red-50 text-ut-danger',
  info: 'bg-blue-50 text-ut-info',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-small font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
