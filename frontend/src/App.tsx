import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/common/HomePage';
import NotFoundPage from './pages/common/NotFoundPage';
import ErrorPage from './pages/common/ErrorPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import { UserRole } from './types/auth.types';

// Lazy load pages
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const ProfilePage = lazy(() => import('./pages/common/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/common/SettingsPage'));
const HelpPage = lazy(() => import('./pages/common/HelpPage'));

// Lazy load role-specific routes
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));
const CarrierRoutes = lazy(() => import('./routes/CarrierRoutes'));
const ManagerRoutes = lazy(() => import('./routes/ManagerRoutes'));
const LeadershipRoutes = lazy(() => import('./routes/LeadershipRoutes'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading (e.g., checking auth status)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <SettingsProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ForgotPasswordPage />
                </Suspense>
              } />
              <Route path="/reset-password" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ResetPasswordPage />
                </Suspense>
              } />

              {/* Protected common routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <ProfilePage />
                  </Suspense>
                } />
                <Route path="/settings" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <SettingsPage />
                  </Suspense>
                } />
                <Route path="/help" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <HelpPage />
                  </Suspense>
                } />
              </Route>

              {/* Role-specific routes */}
              <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
                <Route path="/admin/*" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <AdminRoutes />
                  </Suspense>
                } />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={[UserRole.CARRIER]} />}>
                <Route path="/carrier/*" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <CarrierRoutes />
                  </Suspense>
                } />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={[UserRole.MANAGER]} />}>
                <Route path="/manager/*" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <ManagerRoutes />
                  </Suspense>
                } />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={[UserRole.LEADERSHIP]} />}>
                <Route path="/leadership/*" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <LeadershipRoutes />
                  </Suspense>
                } />
              </Route>

              {/* Error and fallback routes */}
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </SettingsProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
