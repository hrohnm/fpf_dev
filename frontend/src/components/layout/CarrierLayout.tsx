import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import Logo from '../common/Logo';
import rostockImage from '../../assets/images/design/rostock.jpeg';

interface Breadcrumb {
  label: string;
  path: string;
}

interface CarrierLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs: Breadcrumb[];
}

const CarrierLayout: React.FC<CarrierLayoutProps> = ({ children, title, breadcrumbs }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search for:', searchQuery);
  };

  // Navigation items for carrier
  const navigationItems = [
    { name: t('navigation.dashboard'), href: '/carrier', current: location.pathname === '/carrier' },
    { name: t('navigation.facilities'), href: '/carrier/facilities', current: location.pathname.includes('/carrier/facilities') && !location.pathname.includes('/places') },
    { name: t('navigation.places'), href: '/carrier/places', current: location.pathname.includes('/carrier/places') },
    { name: t('navigation.availabilities'), href: '/carrier/availabilities', current: location.pathname === '/carrier/availabilities' },
    { name: t('navigation.statistics'), href: '/carrier/statistics', current: location.pathname === '/carrier/statistics' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with background image and blue overlay */}
      <div className="relative bg-primary-700">
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={rostockImage}
            alt="Rostock"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-primary-700 bg-opacity-75" />
        </div>

        {/* Top navigation */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/carrier">
                    <Logo className="h-10 w-auto" />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`${
                        item.current
                          ? 'border-white text-white'
                          : 'border-transparent text-primary-100 hover:border-primary-300 hover:text-white'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center">

                {/* Theme toggle */}
                <button
                  type="button"
                  className="bg-primary-600 p-1 rounded-full text-primary-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800 focus:ring-white"
                  onClick={toggleTheme}
                >
                  <span className="sr-only">Toggle theme</span>
                  {theme === 'dark' ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>

                {/* Profile dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      type="button"
                      className="bg-primary-600 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800 focus:ring-white"
                      id="user-menu-button"
                      aria-expanded={isProfileMenuOpen}
                      aria-haspopup="true"
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-medium">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </div>
                    </button>
                  </div>

                  {isProfileMenuOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex={-1}
                    >
                      <div className="px-4 py-2 text-xs text-gray-500">
                        {t('auth.loggedInAs')}
                      </div>
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={-1}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        {t('navigation.profile')}
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={-1}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        {t('navigation.settings')}
                      </Link>
                      <button
                        type="button"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={-1}
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        {t('auth.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-primary-200 hover:text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome section with breadcrumbs */}
        <div className="relative py-6 bg-primary-800 bg-opacity-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>

                {/* Breadcrumbs */}
                <nav className="flex mt-1" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2">
                    <li>
                      <div>
                        <Link to="/carrier" className="text-primary-200 hover:text-white">
                          <svg className="flex-shrink-0 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                          <span className="sr-only">Home</span>
                        </Link>
                      </div>
                    </li>
                    {breadcrumbs.map((breadcrumb, index) => (
                      <li key={breadcrumb.path}>
                        <div className="flex items-center">
                          <svg className="flex-shrink-0 h-5 w-5 text-primary-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                          </svg>
                          <Link
                            to={breadcrumb.path}
                            className={`ml-2 text-sm font-medium ${
                              index === breadcrumbs.length - 1
                                ? 'text-white'
                                : 'text-primary-200 hover:text-white'
                            }`}
                            aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                          >
                            {breadcrumb.label}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              {/* Search field */}
              <form onSubmit={handleSearch} className="hidden sm:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-primary-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="block w-64 pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-primary-600 bg-opacity-25 text-primary-100 placeholder-primary-300 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-primary-900 sm:text-sm"
                    placeholder={t('common.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="relative sm:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-200 hover:bg-primary-600 hover:text-white'
                  } block px-3 py-2 rounded-md text-base font-medium`}
                  aria-current={item.current ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile search */}
            <div className="pt-4 pb-3 border-t border-primary-600">
              <form onSubmit={handleSearch} className="px-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-primary-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="mobile-search"
                    id="mobile-search"
                    className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-primary-600 bg-opacity-25 text-primary-100 placeholder-primary-300 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-primary-900 sm:text-sm"
                    placeholder={t('common.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* Mobile user menu */}
            <div className="pt-4 pb-3 border-t border-primary-600">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-medium">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user?.firstName} {user?.lastName}</div>
                  <div className="text-sm font-medium text-primary-200">{user?.email}</div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 bg-primary-600 p-1 rounded-full text-primary-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800 focus:ring-white"
                  onClick={toggleTheme}
                >
                  <span className="sr-only">Toggle theme</span>
                  {theme === 'dark' ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-200 hover:text-white hover:bg-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('navigation.profile')}
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-200 hover:text-white hover:bg-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('navigation.settings')}
                </Link>
                <button
                  type="button"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary-200 hover:text-white hover:bg-primary-600"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  {t('auth.logout')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500 text-center">
              &copy; {new Date().getFullYear()} Freiplatzfinder. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CarrierLayout;
