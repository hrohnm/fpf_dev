import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth.types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The sidebar component that displays navigation links based on user role.
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  // Define navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];

    switch (user.role) {
      case UserRole.ADMIN:
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
          { name: 'Benutzer', path: '/admin/users', icon: 'users' },
          { name: 'Träger', path: '/admin/carriers', icon: 'building' },
          { name: 'Kategorien', path: '/admin/categories', icon: 'folder' },
          { name: 'Systemlogs', path: '/admin/logs', icon: 'clipboard-list' },
          { name: 'Einstellungen', path: '/admin/settings', icon: 'cog' },
        ];
      case UserRole.CARRIER:
        return [
          { name: 'Dashboard', path: '/carrier/dashboard', icon: 'dashboard' },
          { name: 'Einrichtungen', path: '/carrier/facilities', icon: 'home' },
          { name: 'Verfügbarkeiten', path: '/carrier/availabilities', icon: 'calendar' },
          { name: 'Statistiken', path: '/carrier/statistics', icon: 'chart-bar' },
        ];
      case UserRole.MANAGER:
        return [
          { name: 'Dashboard', path: '/manager/dashboard', icon: 'dashboard' },
          { name: 'Suche', path: '/manager/search', icon: 'search' },
          { name: 'Kategorien', path: '/manager/categories', icon: 'folder' },
          { name: 'Favoriten', path: '/manager/favorites', icon: 'star' },
        ];
      case UserRole.LEADERSHIP:
        return [
          { name: 'Dashboard', path: '/leadership/dashboard', icon: 'dashboard' },
          { name: 'Belegungsquoten', path: '/leadership/occupancy', icon: 'chart-pie' },
          { name: 'Trendanalyse', path: '/leadership/trends', icon: 'chart-line' },
          { name: 'Ressourcenplanung', path: '/leadership/planning', icon: 'clipboard-check' },
          { name: 'Berichte', path: '/leadership/reports', icon: 'document-report' },
        ];
      default:
        return [];
    }
  };

  // Common navigation items for all authenticated users
  const commonItems = [
    { name: 'Profil', path: '/profile', icon: 'user' },
    { name: 'Hilfe', path: '/help', icon: 'question-mark-circle' },
  ];

  // Combine role-specific and common items
  const navigationItems = [...getNavigationItems(), ...commonItems];

  // Render icon based on name
  const renderIcon = (iconName: string) => {
    // This is a simplified version. In a real app, you would use an icon library
    // or import SVG icons for each name.
    return (
      <svg
        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    );
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      {/* Sidebar header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <div className="flex items-center">
          <img
            className="h-8 w-auto"
            src="/src/assets/images/design/logo-rostock.png"
            alt="Freiplatzfinder"
          />
          <span className="ml-2 text-lg font-semibold text-gray-900">
            Freiplatzfinder
          </span>
        </div>
        <button
          type="button"
          className="md:hidden text-gray-500 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="sr-only">Close sidebar</span>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-5 px-2 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive
                  ? 'bg-gray-100 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
            onClick={onClose}
          >
            {renderIcon(item.icon)}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar footer */}
      <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
        <div className="text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Freiplatzfinder</p>
          <p>Version 0.1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
