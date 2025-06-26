import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/auth/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { AdminRoute } from './components/routing/AdminRoute';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const Appointments = lazy(() => import('./pages/Appointments'));
const Clients = lazy(() => import('./pages/Clients'));
const Invoices = lazy(() => import('./pages/Invoices'));
const Messages = lazy(() => import('./pages/Messages'));
const Settings = lazy(() => import('./pages/Settings'));
const Admin = lazy(() => import('./pages/Admin'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* App Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route
            path="appointments"
            element={
              <Suspense fallback={<PageLoader />}>
                <Appointments />
              </Suspense>
            }
          />
          <Route
            path="clients"
            element={
              <Suspense fallback={<PageLoader />}>
                <Clients />
              </Suspense>
            }
          />
          <Route
            path="invoices"
            element={
              <Suspense fallback={<PageLoader />}>
                <Invoices />
              </Suspense>
            }
          />
          <Route
            path="messages"
            element={
              <Suspense fallback={<PageLoader />}>
                <Messages />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<PageLoader />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="admin"
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              </Suspense>
            }
          />
        </Route>

        {/* Redirect old routes to new structure */}
        <Route path="/appointments" element={<Navigate to="/app/appointments" replace />} />
        <Route path="/clients" element={<Navigate to="/app/clients" replace />} />
        <Route path="/invoices" element={<Navigate to="/app/invoices" replace />} />
        <Route path="/messages" element={<Navigate to="/app/messages" replace />} />
        <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
        <Route path="/admin" element={<Navigate to="/app/admin" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;