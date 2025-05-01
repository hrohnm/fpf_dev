import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  badge?: React.ReactNode;
  onToggle?: (isOpen: boolean) => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  titleClassName = '',
  contentClassName = '',
  badge,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className={`border border-gray-200 rounded-md overflow-hidden ${className}`}>
      <div
        className={`flex justify-between items-center p-4 bg-white cursor-pointer hover:bg-gray-50 ${titleClassName}`}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            {isOpen ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-500 mr-2" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-500 mr-2" />
            )}
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          {badge && <div>{badge}</div>}
        </div>
      </div>
      {isOpen && (
        <div className={`p-4 bg-gray-50 border-t border-gray-200 ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
};

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ children, className = '' }) => {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
};

export default Accordion;
