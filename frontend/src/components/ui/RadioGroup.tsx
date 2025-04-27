import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, value, onChange, name = 'radio-group' }) => {
  return (
    <div className="flex flex-col space-y-2">
      {options.map((option) => (
        <div key={option.value} className="flex items-center">
          <input
            id={`${name}-${option.value}`}
            name={name}
            type="radio"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <label htmlFor={`${name}-${option.value}`} className="ml-3 block text-sm font-medium text-gray-700">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;
