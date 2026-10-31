import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ExternalLink, LogOut, User, Users } from 'lucide-react';
import { getAdminUser, clearAdminSession } from '../../utils/auth.js';

export default function AdminHeader() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(() => getAdminUser());

  useEffect(() => {
    setAdmin(getAdminUser());
  }, []);

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out of the Administrator Portal?')) {
      clearAdminSession();
      navigate('/admin/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-900 bg-brand-950 text-white shadow-md print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[72px] sm:min-h-[80px] items-center justify-between gap-4">
          {/* Brand + Admin Label */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label="HKCL Skill Centre Admin Portal"
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
                  <span className="inline-flex items-center rounded-md bg-brand-800/80 px-2 py-0.5 text-[11px] font-medium text-brand-200">
                    Admin Portal
                  </span>
                </div>
                <span className="text-[11px] text-brand-200 hidden sm:block">
                  System Administration, Staff &amp; Admissions Control • Sirsa
                </span>
              </div>
            </Link>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Admin User Info Pill */}
            {admin && (
              <div className="hidden md:flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-brand-100">
                <User className="h-3.5 w-3.5 text-amber-400" />
                <div className="text-left">
                  <span className="font-semibold text-white block leading-tight">{admin.name}</span>
                  <span className="text-[10px] text-brand-300 block">{admin.designation || 'Administrator'}</span>
                </div>
              </div>
            )}

            {/* Link to Staff Portal */}
            <Link
              to="/staff/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-500/20 transition"
              title="Open Staff Review Desk"
            >
              <Users className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Staff Desk</span>
            </Link>

            {/* Link to public website */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-brand-100 hover:bg-white/10 hover:text-white transition"
              title="Return to public student website"
            >
              <ExternalLink className="h-3.5 w-3.5 text-brand-300" />
              <span className="hidden sm:inline">Public Site</span>
            </Link>

            {/* Sign Out button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-900/60 transition"
              title="Sign out of Administrator Portal"
            >
              <LogOut className="h-3.5 w-3.5 text-red-300" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
