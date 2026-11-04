import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';

export const AdminUnauthorized: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = '403 Unauthorized | Store Director Atelier';
    window.scrollTo(0, 0);
  }, []);

  const handleSwitchAccount = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#FAF8F5]">
      <div className="max-w-md w-full bg-white border border-black/10 p-8 sm:p-10 shadow-2xl space-y-6 text-center">
        <div className="flex justify-center mb-1">
          <BrandLogo layout="stacked" size="md" variant="dark" />
        </div>

        <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest font-bold bg-rose-100 text-rose-800 rounded-xs">
            HTTP 403 &bull; Access Restricted
          </span>
          <h1 className="font-sans font-black text-2xl uppercase tracking-tight text-[#0A0A0A]">
            Store Director Access Denied
          </h1>
          <p className="text-xs text-neutral-600 leading-relaxed">
            The authenticated account does not possess verified Store Director or administrative privileges.
          </p>
        </div>

        {user && (
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-sm text-left space-y-1">
            <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold">
              Current Session Identity:
            </p>
            <p className="text-xs font-semibold text-neutral-800 truncate font-mono">
              {user.email || user.name}
            </p>
            <p className="text-[10px] text-neutral-500">
              Role: <span className="font-mono font-bold uppercase">{user.role || 'customer'}</span>
            </p>
          </div>
        )}

        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left space-y-1 rounded-sm">
          <p className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-amber-950">
            <KeyRound className="w-3.5 h-3.5" />
            Authorization Requirement:
          </p>
          <p className="text-[11px] leading-relaxed text-amber-900">
            Store Director operations require a cryptographically assigned <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">admin: true</code> Firebase custom claim or an authorized corporate email.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={handleSwitchAccount}
            className="w-full py-3 bg-[#0A0A0A] hover:bg-[#1f1f1f] text-white text-xs font-bold uppercase tracking-widest border border-[#B99A6B]/50 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-[#B99A6B]" />
            <span>Sign In with Director Account</span>
          </button>

          <Link
            to="/"
            className="w-full py-2.5 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Boutique</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

