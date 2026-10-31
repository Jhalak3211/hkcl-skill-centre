import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Seo from '../../components/Seo.jsx';
import { setStaffSession } from '../../utils/auth.js';

export default function StaffAcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [invitationInfo, setInvitationInfo] = useState(null);
  const [validatingToken, setValidatingToken] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invitation token is missing from this link. Please check the link in your email.');
      return;
    }

    let isMounted = true;
    setValidatingToken(true);
    fetch(`/api/admin/accept-invite?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.staff) {
          setInvitationInfo(data.staff);
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch(() => {
        // Fallback on network error: allow user to attempt submitting
      })
      .finally(() => {
        if (isMounted) setValidatingToken(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invitation token is missing. Please request a new invitation from your administrator.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and confirmation password do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to activate staff account.');
      }

      // Session established immediately
      if (data.token && data.staff) {
        setStaffSession(data.token, data.staff, true);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/staff/dashboard', { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Unable to accept invitation. Please try again or contact your administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Accept Staff Invitation • HKCL Skill Centre"
        description="Set your account password and activate your HKCL Skill Centre staff account."
      />

      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-brand-950 p-6 sm:p-8 text-center relative border-b border-brand-900">
              <div className="inline-flex p-3 rounded-2xl bg-white shadow-md mb-4">
                <img src="/images/logo.png" alt="HKCL Logo" className="h-12 w-12 object-contain" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Staff Invitation Activation
              </h1>
              <p className="mt-1 text-xs text-brand-200">
                HKCL Skill Centre • Admissions &amp; Verification Desk
              </p>
            </div>

            <div className="p-6 sm:p-8">
              {success ? (
                <div className="text-center py-6 space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Account Activated!</h2>
                  <p className="text-sm text-slate-600">
                    Your password has been set and your staff account is now active. Redirecting you to the staff desk...
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/staff/dashboard"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-900 text-white font-semibold text-sm hover:bg-brand-950 transition"
                    >
                      <span>Proceed to Staff Desk</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                    <p className="font-semibold text-amber-950 flex items-center gap-1.5 mb-1 text-sm">
                      <ShieldCheck className="h-4 w-4 text-amber-600" />
                      {invitationInfo ? `Welcome, ${invitationInfo.name}!` : 'Welcome to HKCL Skill Centre!'}
                    </p>
                    {invitationInfo ? (
                      <p>
                        You have been invited as <strong>{invitationInfo.designation}</strong> ({invitationInfo.email}). Please choose a password of at least 6 characters to complete your activation.
                      </p>
                    ) : (
                      <p>
                        Please choose a strong password to activate your staff portal account. Once activated, you can log in anytime with your registered Gmail address.
                      </p>
                    )}
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm"
                    >
                      <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-red-900">Activation Error</p>
                        <p className="text-xs mt-0.5">{error}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="new-password"
                        className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                      >
                        Set Password (minimum 6 characters)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <input
                          id="new-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create strong password"
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

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <input
                          id="confirm-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !token}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-900 text-white font-semibold text-sm hover:bg-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Activating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Activate Account &amp; Log In</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
