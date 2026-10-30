import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import Container from '../../components/Container.jsx';
import Seo from '../../components/Seo.jsx';
import { setAdminSession, isAdminAuthenticated } from '../../utils/auth.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in as Admin, redirect immediately to dashboard
  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanId = identifier.trim();
    if (!cleanId || !password) {
      setError('Please provide your administrator email or username and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid administrator credentials. Access restricted.');
      }

      // Store authenticated admin session
      setAdminSession(data.token, data.admin, remember);

      const destination = location.state?.from || '/admin/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to connect to HKCL Admin service. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Admin Login • HKCL Skill Centre"
        description="Authorised Administrator access for HKCL Skill Centre Admission and Staff Management Portal."
      />

      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-brand-950 p-6 sm:p-8 text-center relative border-b border-brand-900">
              <div className="inline-flex p-3 rounded-2xl bg-white shadow-md mb-4">
                <img src="/images/logo.png" alt="HKCL Logo" className="h-12 w-12 object-contain" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Centre Administration
              </h1>
              <p className="mt-1 text-xs text-brand-200">
                HKCL Skill Centre • Barnala Road, Sirsa
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[11px] font-semibold uppercase tracking-wider">
                <ShieldAlert className="h-3.5 w-3.5" />
                Restricted Admin Access
              </div>
            </div>

            {/* Form Section */}
            <div className="p-6 sm:p-8">
              {error && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm animate-in fade-in"
                >
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900">Authentication Failed</p>
                    <p className="text-xs mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="admin-identifier"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Email or Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="admin-identifier"
                      type="text"
                      autoComplete="username"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="admin@hkcl.in"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter administrator password"
                      className="w-full pl-10 pr-11 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs text-slate-600">Remember session on this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-900 text-white font-semibold text-sm hover:bg-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Admin Portal</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security notice & Staff link */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-center space-y-3">
                <p className="text-xs text-slate-500">
                  Admissions staff member?{' '}
                  <Link
                    to="/staff/login"
                    className="font-semibold text-brand-700 hover:text-brand-900 underline underline-offset-2"
                  >
                    Go to Staff Login
                  </Link>
                </p>
                <p className="text-[11px] text-slate-400">
                  Authorised personnel only. All access events and review actions are cryptographically logged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
