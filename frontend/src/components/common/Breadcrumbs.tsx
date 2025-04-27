import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
  pathname: string;
}

/**
 * A breadcrumbs component that displays the current location in the app.
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ pathname }) => {
  // Skip rendering if we're at the root
  if (pathname === '/') {
    return null;
  }

  // Split the pathname into segments
  const segments = pathname.split('/').filter(Boolean);

  // Generate breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    // Create the path for this breadcrumb
    const path = `/${segments.slice(0, index + 1).join('/')}`;

    // Format the segment for display
    const formattedSegment = formatSegment(segment);

    // Determine if this is the last segment
    const isLast = index === segments.length - 1;

    return {
      name: formattedSegment,
      path,
      isLast,
    };
  });

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <svg
                className="flex-shrink-0 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {breadcrumbItems.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <svg
                className="flex-shrink-0 h-5 w-5 text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              {item.isLast ? (
                <span className="ml-2 text-sm font-medium text-gray-500">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {item.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Helper function to format segment names
const formatSegment = (segment: string): string => {
  // Map of segment names to display names
  const segmentMap: Record<string, string> = {
    admin: 'Administrator',
    carrier: 'Träger',
    manager: 'Fallmanager',
    leadership: 'Amtsleitung',
    dashboard: 'Dashboard',
    users: 'Benutzer',
    carriers: 'Träger',
    categories: 'Kategorien',
    facilities: 'Einrichtungen',
    availabilities: 'Verfügbarkeiten',
    statistics: 'Statistiken',
    search: 'Suche',
    favorites: 'Favoriten',
    occupancy: 'Belegungsquoten',
    trends: 'Trendanalyse',
    planning: 'Ressourcenplanung',
    reports: 'Berichte',
    profile: 'Profil',
    settings: 'Einstellungen',
    help: 'Hilfe',
  };

  // Return the mapped name or capitalize the first letter
  return segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
};

export default Breadcrumbs;
