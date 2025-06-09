import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface AuthContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  fallback 
}) => {
  const { initialize, isInitialized, isLoading, error } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  const contextValue: AuthContextType = {
    isInitialized,
    isLoading,
    error,
  };

  // Show loading fallback during initialization
  if (!isInitialized && isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 