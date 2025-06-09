import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { LoadingSpinner } from './common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { getSession } = useAuthStore();
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry on error to prevent loops
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Only fetch once
    refetchOnReconnect: false,
  });
  
  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_OUT') {
        queryClient.setQueryData(['session'], null);
      } else if (event === 'SIGNED_IN' && session?.user) {
        queryClient.setQueryData(['session'], session.user);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
  
  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }
  
  if (error || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};