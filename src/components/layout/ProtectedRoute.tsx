import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useSettingsStore } from '../../store/useSettingsStore';

interface ProtectedRouteProps {
  allowUnpaid?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowUnpaid = false }) => {
  const { user, isLoading: authLoading } = useAuthStore();
  const { subscriptionStatus, isLoading: settingsLoading } = useSettingsStore();
  const location = useLocation();

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If subscription is not active and we are NOT on a page that allows unpaid access
  if (subscriptionStatus !== 'active' && !allowUnpaid) {
    return <Navigate to="/checkout" replace />;
  }

  // If subscription IS active and we are on the checkout page, redirect to dashboard
  if (subscriptionStatus === 'active' && location.pathname === '/checkout') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
