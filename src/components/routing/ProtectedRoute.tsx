import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { getSession, isInitialized, initialize } = useAuthStore();
  const queryClient = useQueryClient();
  
  // Initialize auth state if not already initialized
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    enabled: isInitialized, // Only run query after auth is initialized
  });
  
  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_OUT') {
          queryClient.setQueryData(['session'], null);
          queryClient.removeQueries({ queryKey: ['admin'] }); // Clear admin cache too
        } else if (event === 'SIGNED_IN' && session) {
          queryClient.setQueryData(['session'], session.user);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
  
  // Show loading during initialization or session check
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  // Handle auth errors
  if (error) {
    console.error('Auth error in ProtectedRoute:', error);
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}; 