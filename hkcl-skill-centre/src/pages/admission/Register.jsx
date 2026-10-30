import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import Container from '../../components/Container.jsx';
import Seo from '../../components/Seo.jsx';
import { useAdmission } from '../../context/AdmissionContext.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { registerWithOtp, user } = useAdmission();

  // If already logged in and not on success screen, redirect
  useEffect(() => {
    if (user?.studentId && step !== 'registered') {
      navigate('/profile');
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
  });

  const [step, setStep] = useState('details'); // 'details' | 'registered'
  const [createdStudentId, setCreatedStudentId] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const updatePhone = (e) => {
    const phone = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm((prev) => ({ ...prev, phone }));
    setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const validateDetails = () => {
    const nextErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full legal name.';
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!validateDetails()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const regResult = await registerWithOtp(form);
      setCreatedStudentId(regResult.user.studentId);
      setStep('registered');
    } catch {
      setErrors({ phone: 'Registration failed. Please check your network and retry.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyId = () => {
    if (navigator?.clipboard?.writeText && createdStudentId) {
      navigator.clipboard.writeText(createdStudentId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleQuickDemo = () => {
    setForm({
      fullName: 'Rahul Sharma',
      phone: '9812345678',
      email: 'rahul.sharma@example.com',
    });
    setErrors({});
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-700 focus:ring-1 focus:ring-brand-700';

  return (
    <>
      <Seo
        title="Student Registration | HKCL Skill Centre"
        path="/admission/register"
      />

      <section className="bg-slate-50/70 py-12 sm:py-16 min-h-[580px] flex items-center justify-center">
        <Container>
          <div className="mx-auto max-w-[420px]">
            {step === 'registered' ? (
              /* Success Step: Clean & Crisp Reference ID Card */
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs text-center space-y-5">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Registration Complete
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    Your student account has been created. Here is your permanent Reference ID:
                  </p>
                </div>

                {/* Reference ID Display Box */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex items-center justify-between gap-3">
                  <div className="text-left">
                    <span className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider block">
                      Student Reference ID
                    </span>
                    <span className="text-lg sm:text-xl font-mono font-bold text-brand-950">
                      {createdStudentId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    {copiedId ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => navigate('/admission/personal-details')}
                    className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900 transition active:scale-[0.99]"
                  >
                    <span>Proceed to Admission Form</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <Link
                    to="/profile"
                    className="w-full inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Create Student Profile
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    Enter your details to generate your permanent Student Reference ID.
                  </p>
                </div>

                <form onSubmit={handleCreateProfile} noValidate className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={form.fullName}
                        onChange={updateField}
                        placeholder="Applicant's full name"
                        className={inputClass}
                        autoFocus
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-medium text-slate-500">
                        +91
                      </span>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={form.phone}
                        onChange={updatePhone}
                        placeholder="10-digit mobile"
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                    {errors.phone ? (
                      <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
                    ) : (
                      <p className="mt-1.5 text-[11px] text-slate-500">
                        Used for account identification and login.
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
                        Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleQuickDemo}
                        className="text-slate-400 hover:text-slate-700 underline text-[11px]"
                        title="Pre-fill sample details"
                      >
                        Demo fill
                      </button>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={updateField}
                      placeholder="e.g. name@example.com"
                      className={inputClass}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900 transition disabled:opacity-50 active:scale-[0.99] mt-2"
                  >
                    <span>{isLoading ? 'Creating Profile...' : 'Create Profile'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
                  Already have a profile?{' '}
                  <Link to="/admission/login" className="font-semibold text-brand-800 hover:underline">
                    Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
