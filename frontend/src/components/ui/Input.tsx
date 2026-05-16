'use client';

import React, { useId } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = 'text', error, value, onChange, required, disabled, className = '', id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const errorId = `${id}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-small font-medium text-ut-text">
          {label}
          {required && <span className="text-ut-danger ml-0.5" aria-hidden="true">*</span>}
        </label>
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`
            w-full px-4 py-2.5 rounded-md border text-body
            bg-white text-ut-text placeholder:text-ut-text-muted
            transition-all duration-[var(--transition-fast)]
            focus:outline-none focus:ring-2 focus:ring-ut-accent focus:ring-offset-2 focus:border-ut-accent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-ut-danger ring-1 ring-ut-danger' : 'border-ut-surface-dark'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-small text-ut-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
