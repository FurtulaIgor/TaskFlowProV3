import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/auth/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Lazy loaded pages
const Appointments = lazy(() => import('./pages/Appointments'));
const Clients = lazy(() => import('./pages/Clients'));
const Invoices = lazy(() => import('./pages/Invoices'));
const Messages = lazy(() => import('./pages/Messages'));
const Settings = lazy(() => import('./pages/Settings'));
const Admin = lazy(() => import('./pages/Admin'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      
      {/* App routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={
          <Suspense fallback={<PageLoader />}>
            <Appointments />
          </Suspense>
        } />
        <Route path="clients" element={
          <Suspense fallback={<PageLoader />}>
            <Clients />
          </Suspense>
        } />
        <Route path="invoices" element={
          <Suspense fallback={<PageLoader />}>
            <Invoices />
          </Suspense>
        } />
        <Route path="messages" element={
          <Suspense fallback={<PageLoader />}>
            <Messages />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        } />
        <Route path="admin" element={
          <Suspense fallback={<PageLoader />}>
            <AdminRoute>
              <Admin />
            </AdminRoute>
          </Suspense>
        } />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/\" replace />} />
    </Routes>
  );
}

export default App;