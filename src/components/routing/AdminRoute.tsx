import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const location = useLocation();
  const { getSession, isInitialized, initialize, getUserRoles, roles, checkRole } = useAuthStore();
  const queryClient = useQueryClient();
  
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
  
  // Check if user has admin role
  const isAdmin = checkRole('admin');
  console.log('AdminRoute - userRoles:', userRoles); // Debug log
  console.log('AdminRoute - store roles:', roles); // Debug log
  console.log('AdminRoute - isAdmin:', isAdmin); // Debug log
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};