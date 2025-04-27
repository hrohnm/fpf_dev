import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import admin pages
const AdminDashboardPage = React.lazy(() => import('../pages/admin/AdminDashboardPage'));
const UserManagementPage = React.lazy(() => import('../pages/admin/UserManagementPage'));
const CarrierManagementPage = React.lazy(() => import('../pages/admin/CarrierManagementPage'));
const CategoryManagementPage = React.lazy(() => import('../pages/admin/CategoryManagementPage'));
const SystemLogsPage = React.lazy(() => import('../pages/admin/SystemLogsPage'));

/**
 * Routes for the admin role.
 */
const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminDashboardPage />
        </React.Suspense>
      } />
      <Route path="users" element={
        <React.Suspense fallback={<div>Loading...</div>}>
          <UserManagementPage />
        </React.Suspense>
      } />
      <Route path="carriers" element={
        <React.Suspense fallback={<div>Loading...</div>}>
          <CarrierManagementPage />
        </React.Suspense>
      } />
      <Route path="categories" element={
        <React.Suspense fallback={<div>Loading...</div>}>
          <CategoryManagementPage />
        </React.Suspense>
      } />
      <Route path="logs" element={
        <React.Suspense fallback={<div>Loading...</div>}>
          <SystemLogsPage />
        </React.Suspense>
      } />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
