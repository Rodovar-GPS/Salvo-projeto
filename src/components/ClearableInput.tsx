import React from 'react';
import { X } from 'lucide-react';

interface ClearableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: (value: string) => void;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  onClear?: () => void;
}

export const ClearableInput: React.FC<ClearableInputProps> = ({
  value,
  onValueChange,
  leftIcon,
  containerClassName = '',
  className = '',
  placeholder = '',
  type = 'text',
  disabled,
  onClear,
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full ${containerClassName}`}>
      {leftIcon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
          {leftIcon}
        </div>
      )}
      <input
        {...props}
        type={type}
        disabled={disabled}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full text-xs font-semibold rounded-2xl outline-none transition-all ${
          leftIcon ? 'pl-10' : 'pl-4'
        } ${value ? 'pr-10' : 'pr-4'} ${className}`}
      />
      {value && !disabled && (
        <button
          type="button"
          onClick={() => {
            onValueChange('');
            if (onClear) onClear();
          }}
          tabIndex={-1}
          aria-label="Apagar texto"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer select-none"
        >
          <X className="w-3 h-3 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};

interface ClearableTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onValueChange: (value: string) => void;
  containerClassName?: string;
  onClear?: () => void;
}

export const ClearableTextarea: React.FC<ClearableTextareaProps> = ({
  value,
  onValueChange,
  containerClassName = '',
  className = '',
  placeholder = '',
  disabled,
  onClear,
  rows = 3,
  ...props
}) => {
  return (
    <div className={`relative w-full ${containerClassName}`}>
      <textarea
        {...props}
        rows={rows}
        disabled={disabled}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full text-xs font-semibold rounded-2xl outline-none transition-all p-3 ${
          value ? 'pr-8' : 'pr-3'
        } ${className}`}
      />
      {value && !disabled && (
        <button
          type="button"
          onClick={() => {
            onValueChange('');
            if (onClear) onClear();
          }}
          tabIndex={-1}
          aria-label="Apagar texto"
          className="absolute right-3 top-3 w-5 h-5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer select-none"
        >
          <X className="w-3 h-3 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};
