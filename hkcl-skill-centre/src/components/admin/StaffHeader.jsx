import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ExternalLink, LogOut, User } from 'lucide-react';
import { getStaffUser, clearStaffSession, isStaffAuthenticated } from '../../utils/auth.js';

export default function StaffHeader() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState(() => getStaffUser());
  const [hasAuth, setHasAuth] = useState(() => isStaffAuthenticated());

  useEffect(() => {
    setStaff(getStaffUser());
    setHasAuth(isStaffAuthenticated());
  }, []);

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out of the Staff Portal?')) {
      clearStaffSession();
      setHasAuth(false);
      navigate('/staff/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-900 bg-brand-950 text-white shadow-sm print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[72px] sm:min-h-[80px] items-center justify-between gap-4">
          {/* Brand + Portal Label */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/staff/dashboard"
              className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label="HKCL Skill Centre Staff Administration Portal"
            >
              <img
                src="/images/logo.png"
                alt="HKCL Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full bg-white object-contain p-1"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base tracking-tight text-white block">
                    HKCL Skill Centre
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
                    <ShieldCheck className="h-3 w-3" />
                    Staff Portal
                  </span>
                </div>
                <span className="text-[11px] text-brand-200 hidden sm:block">
                  Admissions, Document Verification &amp; Fee Management • Barnala Road, Sirsa
                </span>
              </div>
            </Link>
          </div>

          {/* Right Action Controls: Discrete, strictly staff-only */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Staff User Info Pill */}
            {staff && (
              <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-brand-100">
                <User className="h-3.5 w-3.5 text-amber-400" />
                <div className="text-left">
                  <span className="font-semibold text-white block leading-tight">{staff.name}</span>
                  <span className="text-[10px] text-brand-300 block">{staff.designation || 'Staff'}</span>
                </div>
              </div>
            )}

            {/* Link to public website */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-brand-100 hover:bg-white/10 hover:text-white transition"
              title="Return to public student website"
            >
              <ExternalLink className="h-3.5 w-3.5 text-brand-300" />
              <span className="hidden sm:inline">Public Site</span>
              <span className="sm:hidden">Site</span>
            </Link>

            {/* Sign Out button */}
            {hasAuth && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-900/60 transition"
                title="Sign out of Staff Portal"
              >
                <LogOut className="h-3.5 w-3.5 text-red-300" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
