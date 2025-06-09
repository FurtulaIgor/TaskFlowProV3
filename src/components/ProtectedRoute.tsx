import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LoadingSpinner } from './common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { user, isLoading, initialize } = useAuthStore();
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    if (!hasInitialized) {
      initialize().finally(() => setHasInitialized(true));
    }
  }, [initialize, hasInitialized]);
  
  if (!hasInitialized || isLoading) {
    return <LoadingSpinner size="lg\" className="min-h-screen" />;
  }
  
  if (!user) {
    return <Navigate to="/auth/login\" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};