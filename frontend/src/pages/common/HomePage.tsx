import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth.types';
import rostockImage from '../../assets/images/design/rostock.jpeg';

/**
 * The home page component that serves as the landing page for the application.
 */
const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Determine the dashboard route based on user role
  const getDashboardRoute = () => {
    if (!user) return '/login';

    // For demo purposes, we'll use the common dashboard
    return '/dashboard';

    // In a real app, we would use role-specific dashboards
    /*
    switch (user.role) {
      case UserRole.ADMIN:
        return '/admin';
      case UserRole.CARRIER:
        return '/carrier';
      case UserRole.MANAGER:
        return '/manager';
      case UserRole.LEADERSHIP:
        return '/leadership';
      default:
        return '/dashboard';
    }
    */
  };

  return (
    <div className="min-h-screen bg-gray-100">
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

        {/* Header */}
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            Freiplatzfinder
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-primary-100">
            Die zentrale Plattform zur Verwaltung und Suche von freien Plätzen in Jugendhilfeeinrichtungen nach SGB VIII.
          </p>
          {isAuthenticated ? (
            <div className="mt-10">
              <Link
                to={getDashboardRoute()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Zum Dashboard
              </Link>
            </div>
          ) : (
            <div className="mt-10">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Anmelden
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
              Funktionen
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Optimierte Prozesse für alle Beteiligten
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Freiplatzfinder bietet maßgeschneiderte Funktionen für verschiedene Benutzerrollen im Jugendhilfesystem.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Schnelle Platzsuche
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Fallmanager können schnell und unkompliziert nach freien Plätzen suchen und filtern.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Einrichtungsverwaltung
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Träger können ihre Einrichtungen und verfügbaren Plätze einfach verwalten und aktualisieren.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Umfangreiche Auswertungen
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Amtsleitungen erhalten detaillierte Statistiken und Berichte für strategische Entscheidungen.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Zentrale Administration
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Administratoren können Benutzer, Träger und Kategorien zentral verwalten und konfigurieren.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="mt-8 flex justify-center space-x-6">
            <p className="text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} Freiplatzfinder. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
