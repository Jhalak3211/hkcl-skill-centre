import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Search,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import Container from '../../components/Container.jsx';
import Seo from '../../components/Seo.jsx';
import { useAdmission } from '../../context/AdmissionContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithOtp, findStudentByPhone, user } = useAdmission();

  // If already logged in, redirect to profile
  useEffect(() => {
    if (user?.studentId) {
      navigate('/profile');
    }
  }, [user, navigate]);

  // Mode: 'login' | 'find_id'
  const [activeTab, setActiveTab] = useState('login');

  // Sign In State
  const [loginPhoneOrId, setLoginPhoneOrId] = useState('');
  const [loginErrors, setLoginErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Find Reference ID State
  const [findPhone, setFindPhone] = useState('');
  const [findErrors, setFindErrors] = useState({});
  const [isFindLoading, setIsFindLoading] = useState(false);
  const [recoveredStudent, setRecoveredStudent] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // ---------------------------------------------------------------------------
  // SIGN IN (DIRECT - NO OTP)
  // ---------------------------------------------------------------------------
  const validateLoginInput = () => {
    const val = loginPhoneOrId.trim();
    if (!val) {
      setLoginErrors({ identifier: 'Please enter your registered mobile number or Student Reference ID.' });
      return false;
    }
    const isMobile = /^[6-9]\d{9}$/.test(val);
    const isRefId = /^HKCL/i.test(val);
    if (!isMobile && !isRefId) {
      setLoginErrors({
        identifier: 'Enter a valid 10-digit mobile number (e.g. 9812345678) or Reference ID (e.g. HKCL-2026-123456).',
      });
      return false;
    }
    return true;
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!validateLoginInput()) return;

    setIsLoading(true);
    setLoginErrors({});

    setTimeout(() => {
      loginWithOtp(loginPhoneOrId.trim());
      setIsLoading(false);
      navigate('/profile');
    }, 200);
  };

  const handleDemoSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithOtp('9812345678', 'Rahul Sharma');
      setIsLoading(false);
      navigate('/profile');
    }, 150);
  };

  // ---------------------------------------------------------------------------
  // FIND REFERENCE ID (DIRECT - NO OTP)
  // ---------------------------------------------------------------------------
  const validateFindPhone = () => {
    const val = findPhone.trim().replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(val)) {
      setFindErrors({ phone: 'Please enter a valid 10-digit registered Indian mobile number.' });
      return false;
    }
    return true;
  };

  const handleFindReferenceId = (e) => {
    e.preventDefault();
    if (!validateFindPhone()) return;

    setIsFindLoading(true);
    setFindErrors({});

    setTimeout(() => {
      const lookup = findStudentByPhone(findPhone.trim());
      setIsFindLoading(false);

      if (lookup.success && lookup.student) {
        setRecoveredStudent(lookup.student);
      } else {
        setFindErrors({
          general: 'No registered account found with this number. Please create a student profile.',
        });
      }
    }, 250);
  };

  const handleCopyRecoveredId = () => {
    if (navigator?.clipboard?.writeText && recoveredStudent?.studentId) {
      navigator.clipboard.writeText(recoveredStudent.studentId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleLoginWithRecoveredId = () => {
    if (!recoveredStudent) return;
    loginWithOtp(recoveredStudent.studentId, recoveredStudent.fullName);
    navigate('/profile');
  };

  return (
    <>
      <Seo
        title={activeTab === 'login' ? 'Student Sign In | HKCL Skill Centre' : 'Find Reference ID | HKCL Skill Centre'}
        path="/admission/login"
      />

      <section className="bg-slate-50/70 py-12 sm:py-16 min-h-[580px] flex items-center justify-center">
        <Container>
          <div className="mx-auto max-w-[420px]">
            {/* Main Clean Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {activeTab === 'login' ? 'Student Sign In' : 'Find Reference ID'}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  {activeTab === 'login'
                    ? 'Enter your mobile number or Student Reference ID to access your dashboard.'
                    : 'Locate your assigned Reference ID using your registered mobile number.'}
                </p>
              </div>

              {/* Minimal Nav Switcher */}
              <div className="flex border-b border-slate-200 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setLoginErrors({});
                  }}
                  className={`pb-2.5 text-xs sm:text-sm font-semibold transition relative mr-6 ${
                    activeTab === 'login'
                      ? 'text-brand-800 border-b-2 border-brand-800 -mb-[1px]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('find_id');
                    setFindErrors({});
                    setRecoveredStudent(null);
                  }}
                  className={`pb-2.5 text-xs sm:text-sm font-semibold transition relative ${
                    activeTab === 'find_id'
                      ? 'text-brand-800 border-b-2 border-brand-800 -mb-[1px]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Find Reference ID
                </button>
              </div>

              {/* TAB 1: SIGN IN */}
              {activeTab === 'login' && (
                <>
                  <form onSubmit={handleSignIn} noValidate className="space-y-4">
                    <div>
                      <label htmlFor="loginPhoneOrId" className="block text-xs font-semibold text-slate-700">
                        Mobile Number or Student Reference ID
                      </label>
                      <div className="relative mt-1.5">
                        <input
                          id="loginPhoneOrId"
                          name="loginPhoneOrId"
                          type="text"
                          value={loginPhoneOrId}
                          onChange={(e) => {
                            setLoginPhoneOrId(e.target.value);
                            setLoginErrors({});
                          }}
                          placeholder="e.g. 9812345678 or HKCL-2026-482910"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-700 focus:ring-1 focus:ring-brand-700"
                          autoFocus
                        />
                      </div>
                      {loginErrors.identifier && (
                        <p className="mt-1.5 text-xs text-red-600">{loginErrors.identifier}</p>
                      )}
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900 transition disabled:opacity-50 active:scale-[0.99]"
                      >
                        <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>

                      {/* Demo Login Button */}
                      <button
                        type="button"
                        onClick={handleDemoSignIn}
                        className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-brand-200 bg-brand-50/60 px-4 py-2 text-xs sm:text-sm font-semibold text-brand-900 hover:bg-brand-100 transition active:scale-[0.99]"
                        title="Instant sign in with demo student account"
                      >
                        <Sparkles className="h-4 w-4 text-orange-500" />
                        <span>Demo Sign In (Rahul Sharma)</span>
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
                    New applicant?{' '}
                    <Link to="/admission/register" className="font-semibold text-brand-800 hover:underline">
                      Create Profile
                    </Link>
                  </div>
                </>
              )}

              {/* TAB 2: FIND REFERENCE ID */}
              {activeTab === 'find_id' && (
                <>
                  {!recoveredStudent ? (
                    <form onSubmit={handleFindReferenceId} noValidate className="space-y-4">
                      <div>
                        <label htmlFor="findPhone" className="block text-xs font-semibold text-slate-700">
                          Registered Mobile Number
                        </label>
                        <div className="relative mt-1.5">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-medium text-slate-500">
                            +91
                          </span>
                          <input
                            id="findPhone"
                            name="findPhone"
                            type="tel"
                            maxLength={10}
                            value={findPhone}
                            onChange={(e) => {
                              setFindPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                              setFindErrors({});
                            }}
                            placeholder="9812345678"
                            className="w-full rounded-lg border border-slate-300 bg-white pl-11 pr-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-700 focus:ring-1 focus:ring-brand-700"
                            autoFocus
                          />
                        </div>
                        {findErrors.phone ? (
                          <p className="mt-1.5 text-xs text-red-600">{findErrors.phone}</p>
                        ) : (
                          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Enter your 10-digit registered number.</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFindPhone('9812345678');
                                setFindErrors({});
                              }}
                              className="text-slate-400 hover:text-slate-700 underline text-[11px]"
                            >
                              Fill demo (9812345678)
                            </button>
                          </div>
                        )}
                      </div>

                      {findErrors.general && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                          <div>
                            <p>{findErrors.general}</p>
                            <Link to="/admission/register" className="mt-1 inline-block font-semibold underline text-red-900">
                              Register a new profile now &rarr;
                            </Link>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isFindLoading}
                        className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900 transition disabled:opacity-50 active:scale-[0.99]"
                      >
                        <Search className="h-4 w-4" />
                        <span>{isFindLoading ? 'Searching...' : 'Find Reference ID'}</span>
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-center">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-1.5">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-emerald-800">Account found for</p>
                        <p className="text-sm font-bold text-slate-900">{recoveredStudent.fullName}</p>

                        <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-white border border-emerald-200 p-2.5 shadow-2xs">
                          <span className="font-mono text-base font-bold text-brand-950 tracking-wider">
                            {recoveredStudent.studentId}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyRecoveredId}
                            className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                            title="Copy ID"
                          >
                            {copiedId ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleLoginWithRecoveredId}
                        className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900 transition active:scale-[0.99]"
                      >
                        <span>Sign In with this ID</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRecoveredStudent(null);
                            setFindPhone('');
                          }}
                          className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                        >
                          Look up another number
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="font-semibold text-brand-800 hover:underline"
                    >
                      &larr; Back to Sign In
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
