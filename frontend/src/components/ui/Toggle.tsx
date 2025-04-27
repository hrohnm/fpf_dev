import React from 'react';

interface ToggleProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, setEnabled, label, disabled = false }) => {
  return (
    <div className="flex items-center">
      <button
        type="button"
        className={`${
          enabled ? 'bg-primary-600' : 'bg-gray-200'
        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        role="switch"
        aria-checked={enabled}
        onClick={() => !disabled && setEnabled(!enabled)}
        disabled={disabled}
      >
        <span className="sr-only">{label || 'Toggle'}</span>
        <span
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        />
      </button>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>
      )}
    </div>
  );
};

export default Toggle;
