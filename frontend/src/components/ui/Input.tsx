import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, leftIcon, rightIcon, ...props }, ref) => {
    const baseClasses = 'block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm';
    const errorClasses = error ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300';
    const iconClasses = {
      left: leftIcon ? 'pl-10' : '',
      right: rightIcon ? 'pr-10' : '',
    };

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${iconClasses.left} ${iconClasses.right} ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
