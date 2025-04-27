import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth.types';

interface AppBarProps {
  title?: string;
  onMenuClick: () => void;
  actions?: React.ReactNode;
}

/**
 * The top app bar component that displays the title, menu button, and actions.
 */
const AppBar: React.FC<AppBarProps> = ({ title, onMenuClick, actions }) => {
  const { user, logout } = useAuth();

  // Determine the home route based on user role
  const getHomeRoute = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case UserRole.ADMIN:
        return '/admin/dashboard';
      case UserRole.CARRIER:
        return '/carrier/dashboard';
      case UserRole.MANAGER:
        return '/manager/dashboard';
      case UserRole.LEADERSHIP:
        return '/leadership/dashboard';
      default:
        return '/';
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Menu button */}
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo and title */}
            <div className="flex-shrink-0 flex items-center">
              <Link to={getHomeRoute()} className="flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/src/assets/images/design/logo-rostock.png"
                  alt="Freiplatzfinder"
                />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  {title || 'Freiplatzfinder'}
                </span>
              </Link>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center">
            {/* Additional actions */}
            {actions && <div className="ml-4">{actions}</div>}

            {/* User menu */}
            <div className="ml-4 relative flex-shrink-0">
              <div className="flex items-center">
                {user ? (
                  <div className="flex items-center">
                    <Link
                      to="/profile"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      {user.firstName} {user.lastName}
                    </Link>
                    <button
                      type="button"
                      className="ml-4 px-3 py-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                      onClick={logout}
                    >
                      Abmelden
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Anmelden
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppBar;
