import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactElement;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, isAuthReady, user } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 bg-[#FAF8F5]">
        <div className="w-14 h-14 rounded-full bg-[#B99A6B]/15 border border-[#B99A6B]/30 flex items-center justify-center text-[#B99A6B]">
          <ShieldCheck className="w-7 h-7 animate-pulse" />
        </div>
        <div className="w-10 h-10 border-2 border-[#B99A6B] border-t-transparent rounded-full animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-xs uppercase tracking-widest-luxury text-[#0A0A0A] font-bold">
            Verifying Store Director Credentials
          </p>
          <p className="text-[11px] text-neutral-500 font-mono">
            Cryptographic token & custom claims inspection in progress...
          </p>
        </div>
      </div>
    );
  }

  // Not signed in -> send to dedicated admin login portal
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Signed in, but lacking verified Store Director privileges -> forbidden
  if (!isAdmin) {
    return <Navigate to="/admin/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

