import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  User,
  Search,
  RefreshCw,
  Lock,
  Eye,
  Check,
  X,
  RotateCcw,
  Award,
  ExternalLink,
  ChevronRight,
  Key,
} from 'lucide-react';
import Container from '../../components/Container.jsx';
import Seo from '../../components/Seo.jsx';
import { getStaffHeaders, getStaffUser, isStaffAuthenticated, clearStaffSession } from '../../utils/auth.js';

const DEFAULT_STAFF_KEY = 'hkcl_staff_secret_key_2026';

export default function StaffDashboard() {
  const [staffKey, setStaffKey] = useState(
    () => sessionStorage.getItem('hkcl_staff_access_key') || ''
  );
  const [inputKey, setInputKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => isStaffAuthenticated());
  const [currentStaff, setCurrentStaff] = useState(() => getStaffUser());
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState('under_review'); // 'under_review' | 'corrections_required' | 'documents_approved' | 'payment_submitted' | 'final_admission' | 'all'
  const [metrics, setMetrics] = useState({
    underReview: 0,
    correctionsRequired: 0,
    documentsApproved: 0,
    paymentSubmitted: 0,
    paymentVerified: 0,
    admitted: 0,
    rejected: 0,
    totalApplications: 0,
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Action modal states
  const [actionType, setActionType] = useState(null); // 'approve_docs' | 'request_corrections' | 'reject_docs' | 'verify_payment' | 'reject_payment' | 'final_admit'
  const [actionInput, setActionInput] = useState('');
  const [actionBatch, setActionBatch] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchError, setFetchError] = useState('');

  // Fetch overview data using staff key
  const fetchOverview = useCallback(async (keyToUse = staffKey) => {
    if (!keyToUse) return;
    setLoading(true);
    setFetchError('');
    setActionMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/staff/overview', {
        headers: getStaffHeaders(),
      });

      if (res.status === 403 || res.status === 401) {
        setIsAuthenticated(false);
        setAuthError('Invalid staff authorization key. Access denied.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setMetrics(data.metrics || {});
        setApplications(data.applications || []);
        sessionStorage.setItem('hkcl_staff_access_key', keyToUse);
        setFetchError('');
      } else {
        throw new Error(data.error || 'Failed to retrieve application overview.');
      }
    } catch (err) {
      console.warn('Staff overview fetch notice:', err);
      setFetchError(err.message || 'Unable to connect to HKCL staff service. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  }, [staffKey]);

  useEffect(() => {
    if (isStaffAuthenticated() || staffKey) {
      fetchOverview(staffKey);
    }
  }, [staffKey, fetchOverview]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setAuthError('Please enter the Staff Authorization Key.');
      return;
    }
    setStaffKey(inputKey.trim());
    fetchOverview(inputKey.trim());
  };

  const handleLogout = () => {
    clearStaffSession();
    setStaffKey('');
    setIsAuthenticated(false);
    setCurrentStaff(null);
    setSelectedApp(null);
  };

  // Perform review action
  const handlePerformAction = async () => {
    if (!selectedApp || !actionType) return;
    setActionSubmitting(true);
    setActionMessage({ type: '', text: '' });

    const appId = selectedApp.applicationId;
    let endpoint = '';
    let payload = { applicationId: appId };

    if (actionType === 'approve_docs') {
      endpoint = '/api/staff/documents/approve';
      payload.notes = actionInput;
    } else if (actionType === 'request_corrections') {
      if (!actionInput.trim()) {
        setActionMessage({ type: 'error', text: 'Mandatory explanation for requested corrections is required.' });
        setActionSubmitting(false);
        return;
      }
      endpoint = '/api/staff/documents/request-corrections';
      payload.explanation = actionInput.trim();
    } else if (actionType === 'reject_docs') {
      if (!actionInput.trim()) {
        setActionMessage({ type: 'error', text: 'Mandatory rejection reason is required.' });
        setActionSubmitting(false);
        return;
      }
      endpoint = '/api/staff/documents/reject';
      payload.reason = actionInput.trim();
    } else if (actionType === 'verify_payment') {
      endpoint = '/api/staff/payments/verify';
      payload.verifierNotes = actionInput.trim() || 'Verified against centre bank records.';
    } else if (actionType === 'reject_payment') {
      if (!actionInput.trim()) {
        setActionMessage({ type: 'error', text: 'Mandatory payment rejection reason is required.' });
        setActionSubmitting(false);
        return;
      }
      endpoint = '/api/staff/payments/reject';
      payload.reason = actionInput.trim();
    } else if (actionType === 'final_admit') {
      endpoint = '/api/staff/admission/admit';
      payload.notes = actionInput.trim();
      payload.batch = actionBatch || selectedApp.course?.batch || 'Morning Batch';
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: getStaffHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: data.message || 'Action executed successfully.' });
        setActionType(null);
        setActionInput('');
        fetchOverview();
        // Update selected app locally
        if (actionType === 'approve_docs') {
          setSelectedApp((prev) => ({
            ...prev,
            status: 'documents_approved',
            documentReview: { ...prev.documentReview, status: 'approved' },
          }));
        } else if (actionType === 'request_corrections') {
          setSelectedApp((prev) => ({
            ...prev,
            status: 'corrections_required',
            documentReview: { ...prev.documentReview, status: 'corrections_required', correctionNotes: payload.explanation },
          }));
        } else if (actionType === 'verify_payment') {
          setSelectedApp((prev) => ({
            ...prev,
            payment: { ...prev.payment, status: 'verified', receiptNo: data.receiptNo },
          }));
        } else if (actionType === 'final_admit') {
          setSelectedApp((prev) => ({
            ...prev,
            status: 'admitted',
            finalAdmission: { status: 'admitted', enrollmentNo: data.enrollmentNo },
          }));
        }
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to complete action.' });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Network error executing staff action.' });
    } finally {
      setActionSubmitting(false);
    }
  };

  // Filter applications by tab & search query
  const filteredApps = applications.filter((app) => {
    const studentName = app.personalSnapshot?.fullName || app.personal?.fullName || '';
    const studentPhone = app.personalSnapshot?.phone || app.personal?.phone || '';
    const studentEmail = app.personalSnapshot?.email || app.personal?.email || '';

    const matchesSearch =
      !searchQuery ||
      app.applicationId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studentPhone.includes(searchQuery) ||
      studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.course?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'under_review') {
      return (
        app.status === 'under_review' ||
        app.documentReview?.status === 'under_review' ||
        (app.status === 'draft' && app.declarationAccepted)
      );
    }
    if (activeTab === 'corrections_required') {
      return (
        app.status === 'corrections_required' ||
        app.documentReview?.status === 'corrections_required'
      );
    }
    if (activeTab === 'documents_approved') {
      return (
        (app.status === 'documents_approved' || app.documentReview?.status === 'approved') &&
        app.payment?.status !== 'verified' &&
        app.status !== 'admitted'
      );
    }
    if (activeTab === 'payment_submitted') {
      return app.payment?.status === 'submitted';
    }
    if (activeTab === 'final_admission') {
      return (
        (app.payment?.status === 'verified' || app.payment?.status === 'paid') ||
        app.status === 'admitted' ||
        app.finalAdmission?.status === 'admitted'
      );
    }
    return true;
  });

  return (
    <>
      <Seo
        title="Staff &amp; Admissions Verification Portal | HKCL Skill Centre"
        path="/staff/dashboard"
      />

      {/* Staff Header */}
      <section className="border-b border-brand-900 bg-brand-950 text-white py-6">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-brand-800 border border-brand-700 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-amber-300">
                  Staff Only • Authorized Access
                </span>
                <span className="text-xs text-slate-400">Centre Code: #125055 (Sirsa)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Admissions &amp; Document Review Portal
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Manage document verification, correction requests, UPI fee confirmation, and final admissions.
              </p>
            </div>

            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fetchOverview()}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-900/60 transition"
                >
                  <Lock className="h-3.5 w-3.5 text-red-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Content Area */}
      <section className="py-8 bg-slate-50 min-h-[75vh]">
        <Container>
          {!isAuthenticated ? (
            /* ================================================================= */
            /* ACCESS PROTECTION GATE: Require Staff Authorization Key           */
            /* ================================================================= */
            <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs text-center space-y-4">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-brand-50 text-brand-900 mx-auto">
                <Key className="h-7 w-7 text-brand-800" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Staff Verification Portal
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Enter your assigned Staff Authorization Key to review pending student documents, approve fees, and process admissions.
                </p>
              </div>

              {authError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-800 flex items-start gap-2 text-left">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="mb-4">
                <Link to="/staff/login" className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-900 text-white font-semibold text-xs hover:bg-brand-950 transition shadow-xs">
                  <span>Log In with Registered Gmail</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <span className="relative bg-white px-2 text-[11px] text-slate-400 uppercase tracking-wider">or use staff key</span>
                </div>
              </div>
              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label htmlFor="staff-key-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Staff Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="staff-key-input"
                    type="password"
                    value={inputKey}
                    onChange={(e) => {
                      setInputKey(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="Enter staff secret key..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm font-mono text-slate-900 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Default key: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-600">{DEFAULT_STAFF_KEY}</code>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-brand-900 transition shadow-xs"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>Access Staff Portal</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ================================================================= */
            /* AUTHENTICATED STAFF DASHBOARD                                     */
            /* ================================================================= */
            <div className="space-y-6">
              {/* Notification Banner */}
              {actionMessage.text && (
                <div
                  className={`rounded-xl p-4 text-xs flex items-start justify-between gap-3 shadow-xs ${
                    actionMessage.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border border-red-200 text-red-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {actionMessage.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span>{actionMessage.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActionMessage({ type: '', text: '' })}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Database / Network Error Banner */}
              {fetchError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-900 flex items-start justify-between gap-3 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-950">Database / Network Sync Notice</p>
                      <p className="mt-0.5 text-red-800 leading-relaxed">{fetchError}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchOverview()}
                    disabled={loading}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800 transition"
                  >
                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {/* 1. Metrics Overview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('under_review')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    activeTab === 'under_review'
                      ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                    Doc Review
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-blue-700 block mt-1">
                    {metrics.underReview || 0}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Pending Review</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('corrections_required')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    activeTab === 'corrections_required'
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                    Corrections
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-amber-700 block mt-1">
                    {metrics.correctionsRequired || 0}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Changes Requested</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('documents_approved')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    activeTab === 'documents_approved'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                    Docs Approved
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 block mt-1">
                    {metrics.documentsApproved || 0}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Payment Unlocked</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('payment_submitted')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    activeTab === 'payment_submitted'
                      ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                    UPI Payments
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-purple-700 block mt-1">
                    {metrics.paymentSubmitted || 0}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Bank Check Pending</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('final_admission')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    activeTab === 'final_admission'
                      ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                    Admissions
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-indigo-700 block mt-1">
                    {metrics.admitted || 0}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Final Enrolled</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    activeTab === 'all'
                      ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-800 block mt-1">
                    {metrics.totalApplications || 0}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">All Submissions</span>
                </button>
              </div>

              {/* 2. Search & Section Filters Bar */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student name, phone, App ID, Ref ID..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-800 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-400 text-[11px] uppercase font-semibold mr-1">Section:</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('under_review')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'under_review' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Doc Review ({metrics.underReview || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('corrections_required')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'corrections_required' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Corrections ({metrics.correctionsRequired || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('documents_approved')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'documents_approved' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Approved Docs ({metrics.documentsApproved || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('payment_submitted')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'payment_submitted' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    UPI Payments ({metrics.paymentSubmitted || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('final_admission')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'final_admission' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Admissions ({metrics.admitted || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>

              {/* 3. Applications Table & Inspection Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
                {/* Left: Applications Table */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                  <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      Applications ({filteredApps.length})
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Select an application to view details &amp; take action
                    </span>
                  </div>

                  {loading ? (
                    <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                      <RefreshCw className="h-6 w-6 text-brand-700 animate-spin mx-auto" />
                      <p className="font-semibold text-slate-700">Loading applications from HKCL database...</p>
                      <p className="text-[11px] text-slate-400">Verifying review pipeline &amp; applicant records.</p>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                      <FileText className="h-8 w-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-800 text-sm">No Applications Submitted Yet</p>
                      <p className="max-w-xs mx-auto text-slate-500 text-[11px]">
                        No student admission applications have been submitted for document verification yet. Once submitted, records will appear here.
                      </p>
                    </div>
                  ) : filteredApps.length === 0 ? (
                    <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                      <p className="font-semibold text-slate-700">No applications match this section filter.</p>
                      <p className="text-[11px] text-slate-400">
                        Switch section tabs or adjust your search filter ({searchQuery}).
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-[650px] overflow-y-auto">
                      {filteredApps.map((app) => {
                        const isSelected = selectedApp?.applicationId === app.applicationId;
                        const docStatus = app.documentReview?.status || 'pending';
                        const payStatus = app.payment?.status || 'pending';
                        const isAdmitted = app.status === 'admitted';
                        const applicantName =
                          app.personalSnapshot?.fullName || app.personal?.fullName || 'Student Applicant';
                        const applicantPhone =
                          app.personalSnapshot?.phone || app.personal?.phone || '—';

                        return (
                          <div
                            key={app.applicationId}
                            onClick={() => {
                              setSelectedApp(app);
                              setActionType(null);
                              setActionMessage({ type: '', text: '' });
                            }}
                            className={`p-4 cursor-pointer transition flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-50/80 border-l-4 border-l-brand-800'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-xs text-brand-900">
                                  {app.applicationId}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ({app.studentId})
                                </span>
                              </div>
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {applicantName}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {app.course?.name || 'HS-CIT'} • Phone: {applicantPhone}
                              </p>
                            </div>

                            <div className="text-right shrink-0 space-y-1">
                              {isAdmitted ? (
                                <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                  Admitted
                                </span>
                              ) : payStatus === 'verified' ? (
                                <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                                  Fee Verified
                                </span>
                              ) : payStatus === 'submitted' ? (
                                <span className="inline-block rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 border border-purple-200">
                                  UPI Submitted
                                </span>
                              ) : docStatus === 'approved' ? (
                                <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                                  Docs Approved
                                </span>
                              ) : docStatus === 'corrections_required' ? (
                                <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
                                  Corrections Req.
                                </span>
                              ) : (
                                <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                                  Under Review
                                </span>
                              )}
                              <span className="block text-[10px] text-slate-400">
                                {app.submittedAt
                                  ? new Date(app.submittedAt).toLocaleDateString('en-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                    })
                                  : 'Draft'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right: Selected Application Inspection & Action Drawer */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
                  {!selectedApp ? (
                    <div className="p-12 text-center text-slate-400 text-xs">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold text-slate-700">No Application Selected</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        Select an application from the list on the left to review submitted details and take action.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Application Header */}
                      <div className="border-b border-slate-100 pb-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-brand-900">
                              {selectedApp.applicationId}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              Student ID: {selectedApp.studentId}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-1">
                            {selectedApp.personalSnapshot?.fullName || selectedApp.personal?.fullName || 'Student Applicant'}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Enrolled: <strong>{selectedApp.course?.name || 'HS-CIT'}</strong> ({selectedApp.course?.batch || 'Morning Batch'})
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                            Fee Status
                          </span>
                          <span className="font-mono font-bold text-xs text-slate-800">
                            ₹{selectedApp.payment?.registrationFee || 500} • {selectedApp.payment?.status || 'pending'}
                          </span>
                        </div>
                      </div>

                      {/* 1. Candidate Details Snapshot */}
                      <div className="rounded-lg bg-slate-50 p-3 text-xs space-y-1.5 border border-slate-200">
                        <h5 className="font-bold text-[11px] uppercase tracking-wider text-slate-700">
                          Candidate Information
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-slate-600">
                          <div><strong>Phone:</strong> {selectedApp.personalSnapshot?.phone || selectedApp.personal?.phone || '—'}</div>
                          <div><strong>Email:</strong> {selectedApp.personalSnapshot?.email || selectedApp.personal?.email || '—'}</div>
                          <div><strong>Father:</strong> {selectedApp.personalSnapshot?.fatherName || selectedApp.personal?.fatherName || '—'}</div>
                          <div><strong>Mother:</strong> {selectedApp.personalSnapshot?.motherName || selectedApp.personal?.motherName || '—'}</div>
                          <div><strong>DOB:</strong> {selectedApp.personalSnapshot?.dob || selectedApp.personal?.dob || '—'}</div>
                          <div><strong>Gender:</strong> {selectedApp.personalSnapshot?.gender || selectedApp.personal?.gender || '—'}</div>
                          <div className="col-span-2">
                            <strong>Address:</strong> {[
                              selectedApp.personalSnapshot?.address?.house || selectedApp.personal?.address?.house,
                              selectedApp.personalSnapshot?.address?.locality || selectedApp.personal?.address?.locality,
                              selectedApp.personalSnapshot?.address?.city || selectedApp.personal?.address?.city || 'Sirsa',
                              selectedApp.personalSnapshot?.address?.state || selectedApp.personal?.address?.state || 'Haryana',
                              selectedApp.personalSnapshot?.address?.pincode || selectedApp.personal?.address?.pincode,
                            ].filter(Boolean).join(', ') || 'Sirsa, Haryana'}
                          </div>
                        </div>
                      </div>

                      {/* 2. Educational Qualifications */}
                      <div className="rounded-lg bg-slate-50 p-3 text-xs space-y-1.5 border border-slate-200">
                        <h5 className="font-bold text-[11px] uppercase tracking-wider text-slate-700">
                          Academic Details
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-slate-600">
                          <div><strong>10th Board:</strong> {selectedApp.education?.tenth?.board || '—'}</div>
                          <div><strong>10th Roll:</strong> {selectedApp.education?.tenth?.rollNo || '—'}</div>
                          <div><strong>10th Marks:</strong> {selectedApp.education?.tenth?.marksObtained || 0} / {selectedApp.education?.tenth?.maxMarks || 500}</div>
                          <div><strong>Year:</strong> {selectedApp.education?.tenth?.passingYear || '—'}</div>
                          {selectedApp.education?.hasTwelfth && (
                            <>
                              <div className="col-span-2 pt-1 border-t border-slate-200/60">
                                <strong>12th Board / Stream:</strong> {selectedApp.education?.twelfth?.board || '—'} ({selectedApp.education?.twelfth?.stream || '—'}) • Roll: {selectedApp.education?.twelfth?.rollNo || '—'}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 3. Document Proofs & Previews */}
                      <div className="space-y-2">
                        <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                          Uploaded Document Proofs
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                          {/* Photo */}
                          <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center">
                            <span className="text-[10px] font-semibold text-slate-500 mb-1">Photo</span>
                            {selectedApp.documents?.photoUrl ? (
                              <img
                                src={selectedApp.documents.photoUrl}
                                alt="Applicant Photo"
                                className="h-16 w-16 object-cover rounded border border-slate-300"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                                Uploaded
                              </div>
                            )}
                          </div>

                          {/* Signature */}
                          <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center">
                            <span className="text-[10px] font-semibold text-slate-500 mb-1">Signature</span>
                            {selectedApp.documents?.signatureUrl ? (
                              <img
                                src={selectedApp.documents.signatureUrl}
                                alt="Signature"
                                className="h-16 w-16 object-contain rounded border border-slate-300 bg-white"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                                Uploaded
                              </div>
                            )}
                          </div>

                          {/* 10th Marksheet */}
                          <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center">
                            <span className="text-[10px] font-semibold text-slate-500 mb-1">Marksheet</span>
                            <div className="h-16 w-16 rounded border border-slate-300 bg-white flex flex-col items-center justify-center text-slate-600">
                              <FileText className="h-6 w-6 text-brand-800" />
                              <span className="text-[9px] mt-0.5 font-medium">10th Doc</span>
                            </div>
                          </div>

                          {/* UPI Screenshot if present */}
                          <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center">
                            <span className="text-[10px] font-semibold text-slate-500 mb-1">Payment Proof</span>
                            {selectedApp.payment?.screenshotUrl ? (
                              <img
                                src={selectedApp.payment.screenshotUrl}
                                alt="Payment Receipt"
                                className="h-16 w-16 object-cover rounded border border-slate-300"
                              />
                            ) : selectedApp.payment?.utr ? (
                              <div className="h-16 w-16 rounded border border-slate-300 bg-white flex flex-col items-center justify-center text-slate-600 p-1">
                                <span className="text-[8px] font-mono font-bold break-all">{selectedApp.payment.utr}</span>
                              </div>
                            ) : (
                              <div className="h-16 w-16 rounded border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                                None
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 4. Payment Reference Section */}
                      {selectedApp.payment?.utr && (
                        <div className="rounded-lg bg-purple-50/70 border border-purple-200 p-3 text-xs space-y-1">
                          <h5 className="font-bold text-[11px] uppercase tracking-wider text-purple-900">
                            Submitted UPI Transaction Reference
                          </h5>
                          <div className="grid grid-cols-2 gap-2 text-purple-950 font-mono">
                            <div><strong>UTR:</strong> {selectedApp.payment.utr}</div>
                            <div><strong>Date:</strong> {selectedApp.payment.paymentDate || '—'}</div>
                            <div><strong>Payer UPI:</strong> {selectedApp.payment.payerUpiId || '—'}</div>
                            <div><strong>Fee:</strong> ₹{selectedApp.payment.registrationFee || 500}</div>
                          </div>
                        </div>
                      )}

                      {/* 5. Document Review History / Audit Trail */}
                      {selectedApp.documentReview?.history?.length > 0 && (
                        <div className="rounded-lg bg-slate-50 p-3 text-xs border border-slate-200 space-y-1.5">
                          <h5 className="font-bold text-[11px] uppercase tracking-wider text-slate-700">
                            Review Audit History
                          </h5>
                          <ul className="space-y-1 text-slate-600">
                            {selectedApp.documentReview.history.map((h, i) => (
                              <li key={i} className="text-[11px] flex items-start gap-1.5">
                                <span className="font-bold uppercase text-[10px] text-slate-800">
                                  [{h.action}]
                                </span>
                                <span>{h.notes}</span>
                                <span className="text-slate-400 ml-auto font-mono text-[10px]">
                                  {new Date(h.timestamp).toLocaleDateString()}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 6. Action Execution Form / Buttons */}
                      <div className="pt-3 border-t border-slate-200 space-y-3">
                        <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                          Staff Review Decisions
                        </h5>

                        {actionType ? (
                          <div className="rounded-xl border border-slate-300 bg-slate-50 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs uppercase text-slate-800">
                                {actionType === 'approve_docs' && 'Approve Documents (Unlocks Fee Payment)'}
                                {actionType === 'request_corrections' && 'Request Document Corrections'}
                                {actionType === 'reject_docs' && 'Reject Application'}
                                {actionType === 'verify_payment' && 'Verify Fee Payment Against Bank Record'}
                                {actionType === 'reject_payment' && 'Reject Payment Submission'}
                                {actionType === 'final_admit' && 'Grant Final Admission'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setActionType(null)}
                                className="text-xs text-slate-500 hover:text-slate-800"
                              >
                                Cancel
                              </button>
                            </div>

                            {/* Inputs */}
                            {actionType === 'final_admit' && (
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Assign Batch:
                                </label>
                                <select
                                  value={actionBatch}
                                  onChange={(e) => setActionBatch(e.target.value)}
                                  className="w-full rounded border border-slate-300 p-1.5 text-xs bg-white"
                                >
                                  <option value="Morning Batch (9:00 am - 12:00 pm)">Morning Batch (9:00 am - 12:00 pm)</option>
                                  <option value="Afternoon Batch (1:00 pm - 4:00 pm)">Afternoon Batch (1:00 pm - 4:00 pm)</option>
                                  <option value="Evening Batch (4:00 pm - 6:00 pm)">Evening Batch (4:00 pm - 6:00 pm)</option>
                                </select>
                              </div>
                            )}

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                {actionType === 'request_corrections'
                                  ? 'Mandatory Explanation for Student *'
                                  : actionType === 'reject_docs' || actionType === 'reject_payment'
                                    ? 'Mandatory Rejection Reason *'
                                    : 'Internal Staff Notes (Optional):'}
                              </label>
                              <textarea
                                rows={2}
                                value={actionInput}
                                onChange={(e) => setActionInput(e.target.value)}
                                placeholder={
                                  actionType === 'request_corrections'
                                    ? 'Explain what the student needs to correct (e.g. 10th marksheet photo is blurry)...'
                                    : 'Enter notes or reason...'
                                }
                                className="w-full rounded border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:border-brand-800"
                              />
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handlePerformAction}
                                disabled={actionSubmitting}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-xs transition ${
                                  actionType === 'reject_docs' || actionType === 'reject_payment'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : actionType === 'request_corrections'
                                      ? 'bg-amber-600 hover:bg-amber-700'
                                      : 'bg-emerald-700 hover:bg-emerald-800'
                                }`}
                              >
                                {actionSubmitting ? (
                                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
                                )}
                                <span>Confirm Decision</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Action Buttons */
                          <div className="flex flex-wrap gap-2 text-xs">
                            {/* Step A: Document Review Decisions */}
                            {selectedApp.documentReview?.status !== 'approved' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionType('approve_docs');
                                    setActionInput('');
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 font-semibold text-white hover:bg-emerald-800 transition shadow-xs"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>Approve Documents</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionType('request_corrections');
                                    setActionInput('');
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 font-semibold text-white hover:bg-amber-700 transition shadow-xs"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  <span>Request Corrections</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionType('reject_docs');
                                    setActionInput('');
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-2 font-semibold text-red-700 hover:bg-red-100 transition"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  <span>Reject Application</span>
                                </button>
                              </>
                            )}

                            {/* Step B: Payment Verification Decision */}
                            {selectedApp.payment?.status === 'submitted' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionType('verify_payment');
                                    setActionInput('');
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-purple-700 px-3.5 py-2 font-semibold text-white hover:bg-purple-800 transition shadow-xs"
                                >
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                  <span>Verify Payment (Bank Match)</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionType('reject_payment');
                                    setActionInput('');
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-2 font-semibold text-red-700 hover:bg-red-100 transition"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  <span>Reject Payment (No Bank Match)</span>
                                </button>
                              </>
                            )}

                            {/* Step C: Final Admission Decision (Separate Decision) */}
                            {selectedApp.documentReview?.status === 'approved' &&
                              (selectedApp.payment?.status === 'verified' || selectedApp.payment?.status === 'paid') &&
                              selectedApp.status !== 'admitted' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionType('final_admit');
                                    setActionInput('');
                                    setActionBatch(selectedApp.course?.batch || 'Morning Batch');
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-700 px-4 py-2 font-bold text-white hover:bg-indigo-800 transition shadow-xs"
                                >
                                  <Award className="h-4 w-4 text-amber-300" />
                                  <span>Grant Final Admission</span>
                                </button>
                              )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
