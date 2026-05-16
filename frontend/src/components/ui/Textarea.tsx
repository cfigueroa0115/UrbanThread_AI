'use client';

import React, { useId } from 'react';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, value, onChange, maxLength, required, disabled, className = '', id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const errorId = `${id}-error`;
    const charCount = value?.length ?? 0;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-small font-medium text-ut-text">
          {label}
          {required && <span className="text-ut-danger ml-0.5" aria-hidden="true">*</span>}
        </label>
        <textarea
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          rows={4}
          className={`
            w-full px-4 py-2.5 rounded-md border text-body resize-y
            bg-white text-ut-text placeholder:text-ut-text-muted
            transition-all duration-[var(--transition-fast)]
            focus:outline-none focus:ring-2 focus:ring-ut-accent focus:ring-offset-2 focus:border-ut-accent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-ut-danger ring-1 ring-ut-danger' : 'border-ut-surface-dark'}
            ${className}
          `}
          {...props}
        />
        <div className="flex justify-between">
          {error && (
            <p id={errorId} className="text-small text-ut-danger" role="alert">
              {error}
            </p>
          )}
          {maxLength != null && (
            <p className="text-small text-ut-text-muted ml-auto">
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
