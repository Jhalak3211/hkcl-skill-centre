import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Mail } from 'lucide-react';
import { useAdmission } from '../../context/AdmissionContext.jsx';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user } = useAdmission();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token in the URL. Please check the link from your email.');
      return;
    }

    let isMounted = true;
    async function verify() {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token.trim() }),
        });

        const data = await res.json().catch(() => ({}));
        if (!isMounted) return;

        if (res.ok && data.success) {
          if (data.token) {
            try {
              sessionStorage.setItem('hkcl_auth_token', data.token);
              localStorage.setItem('hkcl_auth_token', data.token);
            } catch {}
          }
          setStatus('success');
          setMessage(data.message || 'Your email has been verified successfully!');
          setStudentDetails(data.student);
        } else {
          setStatus('error');
          setMessage(data.error || 'Invalid or expired verification link. Tokens expire after 24 hours.');
        }
      } catch (err) {
        if (!isMounted) return;
        setStatus('error');
        setMessage('Network error while connecting to verification server. Please try again.');
      }
    }

    verify();
    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        {status === 'verifying' && (
          <div className="py-6 space-y-4">
            <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto" />
            <h1 className="text-lg font-bold text-slate-900">Verifying Email Address</h1>
            <p className="text-sm text-slate-600">Please wait while we validate your activation token...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Email Verified Successfully</h1>
            <p className="text-sm text-slate-600 leading-relaxed">{message}</p>

            {studentDetails && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-left text-xs space-y-1.5 my-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-semibold text-slate-800">{studentDetails.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference ID:</span>
                  <span className="font-mono font-bold text-brand-700">{studentDetails.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="text-slate-800">{studentDetails.email}</span>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 text-sm transition"
              >
                Go to Student Portal <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Verification Link Invalid</h1>
            <p className="text-sm text-slate-600 leading-relaxed">{message}</p>

            <div className="pt-4 space-y-2.5">
              <Link
                to="/admission/personal-details"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 text-sm transition"
              >
                Apply for Admission
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center w-full rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-2.5 text-sm transition"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
