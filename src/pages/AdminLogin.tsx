import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, RefreshCw, ArrowLeft, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';

export const AdminLogin: React.FC = () => {
  const { user, isAdmin, isAuthReady, isAuthenticated, signIn, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as any)?.from?.pathname || '/admin';

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    document.title = 'Store Director Sign In | STYLENEST × DRIPPY';
    window.scrollTo(0, 0);
  }, []);

  // If already authenticated and verified as admin, proceed directly to dashboard
  useEffect(() => {
    if (isAuthReady && isAuthenticated && isAdmin) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthReady, isAuthenticated, isAdmin, navigate, redirectPath]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim()) return;

    setAuthError(null);
    setIsLoading(true);

    try {
      const res = await signIn(adminEmail.trim(), adminPassword);
      if (!res.success) {
        setAuthError(res.message || 'Authentication failed. Please verify your director credentials.');
        setIsLoading(false);
        return;
      }

      // Check admin status after sign in
      // The onAuthStateChanged / token claim check will evaluate admin status
      // We will allow useEffect or short timeout to transition
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to authenticate Store Director session.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsGoogleLoading(true);

    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setAuthError(res.message || 'Google authentication failed.');
        setIsGoogleLoading(false);
        return;
      }

      setTimeout(() => {
        setIsGoogleLoading(false);
      }, 600);
    } catch (err: any) {
      setAuthError(err?.message || 'Google authentication failed.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-md w-full bg-white border border-black/10 p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <BrandLogo layout="stacked" size="md" variant="dark" />
          </div>

          <div className="w-14 h-14 mx-auto rounded-full bg-[#B99A6B]/15 border border-[#B99A6B]/30 flex items-center justify-center text-[#B99A6B]">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h1 className="font-sans font-black text-2xl uppercase tracking-tight text-[#0A0A0A]">
            Store Director Atelier
          </h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Role-based administrative portal for STYLENEST &times; DRIPPY. Authenticate to manage the catalog, orders, and clients.
          </p>
        </div>

        {/* Notice if logged in with non-admin account */}
        {isAuthenticated && user && !isAdmin && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-sm space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Signed in as customer: {user.email}</span>
            </p>
            <p className="text-[11px] text-amber-800">
              This account does not have Store Director privileges. Please sign in with an authorized administrator account.
            </p>
            <button
              type="button"
              onClick={() => logout()}
              className="text-[10px] font-bold uppercase tracking-wider text-amber-900 underline hover:text-black"
            >
              Sign Out of {user.email}
            </button>
          </div>
        )}

        {authError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 rounded-sm">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4 pt-1">
          <div>
            <label className="block text-[10px] font-mono uppercase font-bold tracking-wider text-neutral-700 mb-1">
              Store Director Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="director@stylenest.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF8F5] border border-black/15 text-xs text-[#0A0A0A] font-medium outline-none focus:border-black transition-colors"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase font-bold tracking-wider text-neutral-700 mb-1">
              Security Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF8F5] border border-black/15 text-xs text-[#0A0A0A] font-medium outline-none focus:border-black transition-colors"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3.5 bg-[#0A0A0A] hover:bg-[#1f1f1f] disabled:bg-neutral-400 text-white text-xs font-bold uppercase tracking-widest border border-[#B99A6B]/50 transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#B99A6B]" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <span>Sign In as Store Director</span>
            )}
          </button>
        </form>

        <div className="space-y-3 pt-2 border-t border-black/10">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3 bg-white hover:bg-neutral-50 active:bg-neutral-100 border border-black/20 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] transition-colors flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#B99A6B]" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isGoogleLoading ? 'Verifying Google Account...' : 'Continue with Google (Director)'}</span>
          </button>

          <Link
            to="/"
            className="w-full py-2 text-center text-xs text-neutral-500 hover:text-black transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Boutique</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

