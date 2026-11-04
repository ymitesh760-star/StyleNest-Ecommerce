import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAuthReady, user } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4">
        <div className="w-10 h-10 border-2 border-[#B99A6B] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest-luxury text-[#B99A6B] font-semibold">
          Synchronizing Client Privé Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/account" state={{ from: location }} replace />;
  }

  return children;
};

