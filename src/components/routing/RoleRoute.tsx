import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface RoleRouteProps {
  children: React.ReactNode;
  requiredRole: string;
  fallbackPath?: string;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ 
  children, 
  requiredRole, 
  fallbackPath = '/' 
}) => {
  const location = useLocation();
  const { getSession, isInitialized, initialize, getUserRoles } = useAuthStore();
  
  // Initialize auth state if not already initialized
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);
  
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    enabled: isInitialized,
  });
  
  const { data: userRoles, isLoading: isRoleLoading } = useQuery({
    queryKey: ['userRoles', user?.id],
    queryFn: () => getUserRoles(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
  
  // Show loading during initialization or checks
  if (!isInitialized || isUserLoading || isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  // Check if user has required role
  const hasRequiredRole = userRoles?.includes(requiredRole) || false;
  
  if (!hasRequiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  return <>{children}</>;
}; 