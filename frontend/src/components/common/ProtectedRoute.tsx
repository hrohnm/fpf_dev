import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth.types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

/**
 * A component that protects routes by checking if the user is authenticated
 * and optionally if they have the required role.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/login',
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // If the user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If roles are specified and the user doesn't have one of the allowed roles, redirect to profile
  if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/profile" replace />;
  }

  // If the user is authenticated and has the required role, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
