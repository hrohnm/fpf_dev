import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import manager pages
const ManagerDashboardPage = React.lazy(() => import('../pages/manager/ManagerDashboardPage'));
const SearchPage = React.lazy(() => import('../pages/manager/SearchPage'));
const CategorySelectionPage = React.lazy(() => import('../pages/manager/CategorySelectionPage'));
const CarrierSelectionPage = React.lazy(() => import('../pages/manager/CarrierSelectionPage'));
const FacilitySelectionPage = React.lazy(() => import('../pages/manager/FacilitySelectionPage'));
const FacilityDetailsPage = React.lazy(() => import('../pages/manager/FacilityDetailsPage'));
const FavoritesPage = React.lazy(() => import('../pages/manager/FavoritesPage'));

/**
 * Routes for the manager role.
 */
const ManagerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<ManagerDashboardPage />} />
      <Route path="search" element={<SearchPage />} />
      <Route path="categories" element={<CategorySelectionPage />} />
      <Route path="categories/:categoryId/carriers" element={<CarrierSelectionPage />} />
      <Route path="categories/:categoryId/carriers/:carrierId/facilities" element={<FacilitySelectionPage />} />
      <Route path="facilities/:facilityId" element={<FacilityDetailsPage />} />
      <Route path="favorites" element={<FavoritesPage />} />
      <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
    </Routes>
  );
};

export default ManagerRoutes;
