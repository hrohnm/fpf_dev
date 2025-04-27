import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import carrier pages
const CarrierDashboardPage = React.lazy(() => import('../pages/carrier/CarrierDashboardPage'));
const FacilityListPage = React.lazy(() => import('../pages/carrier/FacilityListPage'));
const FacilityFormPage = React.lazy(() => import('../pages/carrier/FacilityFormPage'));
const AvailabilityPage = React.lazy(() => import('../pages/carrier/AvailabilityPage'));
const StatisticsPage = React.lazy(() => import('../pages/carrier/StatisticsPage'));

/**
 * Routes for the carrier role.
 */
const CarrierRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={
        <React.Suspense fallback={<div>Loading...</div>}>
          <CarrierDashboardPage />
        </React.Suspense>
      } />
      <Route path="facilities" element={
        <React.Suspense fallback={<div>Loading...</div>}>
          <FacilityListPage />
        </React.Suspense>
      } />
      <Route path="facilities/new" element={
        <React.Suspense fallback={<div>Loading...</div>}>
          <FacilityFormPage />
        </React.Suspense>
      } />
      <Route path="facilities/:id" element={
        <React.Suspense fallback={<div>Loading...</div>}>
          <FacilityFormPage />
        </React.Suspense>
      } />
      <Route path="availabilities" element={
        <React.Suspense fallback={<div>Loading...</div>}>
          <AvailabilityPage />
        </React.Suspense>
      } />
      <Route path="statistics" element={
        <React.Suspense fallback={<div>Loading...</div>}>
          <StatisticsPage />
        </React.Suspense>
      } />
      <Route path="*" element={<Navigate to="/carrier" replace />} />
    </Routes>
  );
};

export default CarrierRoutes;
