import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  id,
  disabled = false,
  className = '',
}) => {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-center ${className}`}>
      <label htmlFor={switchId} className="inline-flex relative items-center cursor-pointer">
        <input
          type="checkbox"
          id={switchId}
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`w-11 h-6 rounded-full peer peer-focus:ring-4
            ${checked
              ? 'after:translate-x-full after:border-white bg-green-500 peer-focus:ring-green-300'
              : 'after:border-gray-300 bg-red-500 peer-focus:ring-red-300'}
            after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300
            after:border after:rounded-full after:h-5 after:w-5 after:transition-all
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        ></div>
        {label && (
          <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>
        )}
      </label>
    </div>
  );
};
