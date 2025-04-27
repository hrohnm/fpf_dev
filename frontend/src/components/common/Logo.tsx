import React from 'react';
import logoImage from '../../assets/images/design/logo-rostock.png';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-white p-1 rounded">
        <img
          src={logoImage}
          alt="Freiplatzfinder"
          className="h-8 w-auto"
        />
      </div>
      <span className="ml-2 text-lg font-semibold text-white">Freiplatzfinder</span>
    </div>
  );
};

export default Logo;
