import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import leadership pages
const LeadershipDashboardPage = React.lazy(() => import('../pages/leadership/LeadershipDashboardPage'));
const OccupancyRatesPage = React.lazy(() => import('../pages/leadership/OccupancyRatesPage'));
const TrendAnalysisPage = React.lazy(() => import('../pages/leadership/TrendAnalysisPage'));
const ResourcePlanningPage = React.lazy(() => import('../pages/leadership/ResourcePlanningPage'));
const ReportingPage = React.lazy(() => import('../pages/leadership/ReportingPage'));

/**
 * Routes for the leadership role.
 */
const LeadershipRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<LeadershipDashboardPage />} />
      <Route path="occupancy" element={<OccupancyRatesPage />} />
      <Route path="trends" element={<TrendAnalysisPage />} />
      <Route path="planning" element={<ResourcePlanningPage />} />
      <Route path="reports" element={<ReportingPage />} />
      <Route path="*" element={<Navigate to="/leadership/dashboard" replace />} />
    </Routes>
  );
};

export default LeadershipRoutes;
