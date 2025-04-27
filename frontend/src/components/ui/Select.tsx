import React, { SelectHTMLAttributes, ChangeEvent } from 'react';
import classNames from 'classnames';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  helperText?: string;
  className?: string;
  onChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  error,
  label,
  helperText,
  className,
  children,
  onChange,
  ...props
}) => {
  // Eigener onChange-Handler, der den Wert statt des Events zurückgibt
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        {...props}
        onChange={handleChange}
        className={classNames(
          'block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md',
          {
            'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500': error,
          },
          className
        )}
      >
        {children}
      </select>
      {error ? (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Select;
