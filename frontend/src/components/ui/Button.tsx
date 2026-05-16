'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-ut-accent text-white hover:bg-ut-accent-hover focus-ring',
  secondary:
    'bg-ut-primary text-white hover:bg-ut-primary-light focus-ring',
  outline:
    'border-2 border-ut-accent text-ut-accent hover:bg-ut-accent hover:text-white focus-ring',
  ghost:
    'text-ut-text-muted hover:bg-ut-surface-dark hover:text-ut-text focus-ring',
  danger:
    'bg-ut-danger text-white hover:bg-red-600 focus-ring',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-small rounded-sm gap-1.5',
  md: 'px-5 py-2.5 text-body rounded-md gap-2',
  lg: 'px-7 py-3.5 text-body rounded-lg gap-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      children,
      className = '',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center font-medium
          transition-colors duration-[var(--transition-fast)]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : icon ? (
          <span aria-hidden="true">{icon}</span>
        ) : null}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
