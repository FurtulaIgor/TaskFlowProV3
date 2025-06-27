import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { Toaster } from 'sonner';
import { AuthProvider } from './components/auth/AuthProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LanguageProvider } from './lib/i18n';

// Create a client with better defaults to prevent infinite loops
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false, // Disable retries to prevent loops
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Only fetch when explicitly needed
      refetchOnReconnect: false,
    },
  },
});

// Create router with future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

// Ensure the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create root and render
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter {...router}>
            <AuthProvider>
              <App />
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);