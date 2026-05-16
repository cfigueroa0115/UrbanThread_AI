'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  default: 'bg-white/80 backdrop-blur-sm border border-ut-surface-dark shadow-card hover:border-ut-accent/30 hover:shadow-[0_8px_30px_rgba(0,212,170,0.12)] hover:bg-gradient-to-br hover:from-white hover:to-ut-accent/5 transition-all duration-300',
  elevated: 'bg-white/90 backdrop-blur-sm shadow-elevated hover:shadow-[0_12px_40px_rgba(108,92,231,0.15)] hover:bg-gradient-to-br hover:from-white hover:to-ut-electric/5 hover:border hover:border-ut-electric/20 transition-all duration-300',
  glass: 'glass-card hover:bg-white/30 transition-all duration-300',
  gradient: 'gradient-primary text-white hover:opacity-90 transition-all duration-300',
};

const paddingStyles: Record<string, string> = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hover = false,
      children,
      className = '',
      ...props
    },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -6, scale: 1.02 } : { y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`
          rounded-xl cursor-default
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = 'Card';

export default Card;
