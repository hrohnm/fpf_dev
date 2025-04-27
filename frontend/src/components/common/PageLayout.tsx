import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppBar from './AppBar';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import Breadcrumbs from './Breadcrumbs';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBreadcrumbs?: boolean;
}

/**
 * A layout component that provides a consistent page structure with
 * an app bar, sidebar, and main content area.
 */
const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  showBreadcrumbs = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* App bar */}
        <AppBar
          title={title}
          onMenuClick={toggleSidebar}
          actions={<NotificationBell />}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Breadcrumbs */}
          {showBreadcrumbs && <Breadcrumbs pathname={location.pathname} />}

          {/* Page content */}
          <div className="mt-4">{children}</div>
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default PageLayout;
