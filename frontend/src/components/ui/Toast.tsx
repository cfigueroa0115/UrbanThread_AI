'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export interface ToastData {
  id: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
}

const variantConfig = {
  success: { icon: CheckCircle, bg: 'bg-green-50 border-ut-success', iconColor: 'text-ut-success' },
  error: { icon: AlertCircle, bg: 'bg-red-50 border-ut-danger', iconColor: 'text-ut-danger' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50 border-ut-warning', iconColor: 'text-ut-warning' },
  info: { icon: Info, bg: 'bg-blue-50 border-ut-info', iconColor: 'text-ut-info' },
};

export function Toast({ id, variant, title, message, duration = 5000, onDismiss }: ToastProps) {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      role="alert"
      aria-live="assertive"
      className={`
        flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-elevated
        ${config.bg}
      `}
    >
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-small font-semibold text-ut-text">{title}</p>
        {message && <p className="text-small text-ut-text-muted mt-0.5">{message}</p>}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="p-1 rounded-md text-ut-text-muted hover:text-ut-text hover:bg-white/50 transition-colors"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

/* Toast container — manages a list of toasts */
export interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      className="fixed top-4 right-4 flex flex-col gap-3 w-full max-w-sm"
      style={{ zIndex: 'var(--z-toast)' }}
      aria-label="Notificaciones"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* Hook for managing toasts */
let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismissToast };
}

export default Toast;
