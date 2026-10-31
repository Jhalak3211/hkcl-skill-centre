import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
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
        title="Admin Sign In • HKCL Skill Centre"
        description="Administrative access for HKCL Skill Centre Portal."
        path="/admin/login"
        noindex={true}
      />

      <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[400px]">
          {/* Main Login Card */}
          <div className="bg-white rounded-[14px] border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
            {/* Header: Compact dark navy banner */}
            <div className="bg-[#10284B] px-6 py-5 text-center border-b border-[#0d213f]">
              <div className="inline-flex p-1.5 rounded-xl bg-white shadow-xs mb-2.5">
                <img src="/images/logo.png" alt="HKCL Logo" className="h-8 w-8 object-contain" />
              </div>
              <h1 className="text-lg font-semibold text-white tracking-tight leading-snug">
                Admin Sign In
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                HKCL Skill Centre
              </p>
            </div>

            {/* Login Form Section */}
            <div className="p-6">
              {error && (
                <div
                  role="alert"
                  className="mb-4 flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200/80 text-red-700 text-xs animate-in fade-in"
                >
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email / Username Field */}
                <div>
                  <label
                    htmlFor="admin-identifier"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Email or Username
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 pointer-events-none">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      id="admin-identifier"
                      type="text"
                      autoComplete="username"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="admin@hkcl.in"
                      className="h-[44px] w-full pl-9 pr-3.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#10284B] focus:ring-1 focus:ring-[#10284B] transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 pointer-events-none">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter administrator password"
                      className="h-[44px] w-full pl-9 pr-10 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#10284B] focus:ring-1 focus:ring-[#10284B] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Session Checkbox */}
                <div className="pt-0.5">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-[#10284B] focus:ring-[#10284B]"
                    />
                    <span className="text-xs text-slate-500">Remember session</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="h-[46px] w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#10284B] text-white text-sm font-medium hover:bg-[#0c1f3a] focus:outline-none focus:ring-2 focus:ring-[#10284B] focus:ring-offset-2 transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>

              {/* Card Footer: Subtle divider and Staff link */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  Staff member?{' '}
                  <Link
                    to="/staff/login"
                    className="font-medium text-[#10284B] hover:underline underline-offset-2"
                  >
                    Staff Login
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Page Footer: Muted copyright line directly below card */}
          <p className="mt-4 text-center text-xs text-slate-400">
            &copy; 2026 HKCL Skill Centre
          </p>
        </div>
      </div>
    </>
  );
}
