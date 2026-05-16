'use client';

import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  error,
  required,
  disabled,
  placeholder = 'Seleccionar...',
  className = '',
  id: externalId,
}: SelectProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-small font-medium text-ut-text">
        {label}
        {required && <span className="text-ut-danger ml-0.5" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`
            w-full appearance-none px-4 py-2.5 pr-10 rounded-md border text-body
            bg-white text-ut-text
            transition-all duration-[var(--transition-fast)]
            focus:outline-none focus:ring-2 focus:ring-ut-accent focus:ring-offset-2 focus:border-ut-accent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-ut-danger ring-1 ring-ut-danger' : 'border-ut-surface-dark'}
            ${className}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ut-text-muted pointer-events-none"
          aria-hidden="true"
        />
      </div>
      {error && (
        <p id={errorId} className="text-small text-ut-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
