import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = '',
  error,
  ...rest
}) => {
  return (
    <div>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
          error ? 'border-red-300' : ''
        } ${className}`}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default TextArea;
