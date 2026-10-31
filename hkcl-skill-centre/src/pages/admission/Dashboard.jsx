import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Download,
  LogOut,
  Plus,
  CreditCard,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Eye,
  RefreshCw,
  AlertTriangle,
  Award,
  BookOpen,
  Receipt,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Container from '../../components/Container.jsx';
import Seo from '../../components/Seo.jsx';
import { useAdmission } from '../../context/AdmissionContext.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user,
    application,
    savedProfile,
    updateProfile,
    logout,
    startAnotherCourse,
    isLocked,
  } = useAdmission();

  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'payments' | 'profile'
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: 'Male',
    house: '',
    locality: '',
    city: 'Sirsa',
    district: 'Sirsa',
    state: 'Haryana',
    pincode: '',
  });

  // Fetch student applications from backend
  const loadApplications = useCallback(async () => {
    const token =
      sessionStorage.getItem('hkcl_auth_token') ||
      localStorage.getItem('hkcl_auth_token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.applications)) {
          setMyApplications(data.applications);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch applications from server:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // Sync profile form when user or savedProfile changes
  useEffect(() => {
    const p = savedProfile || application?.personal || {};
    const addr = p.address || {};
    setProfileForm({
      fullName: p.fullName || user?.name || '',
      email: p.email || user?.email || '',
      fatherName: p.fatherName || '',
      motherName: p.motherName || '',
      dob: p.dob || '',
      gender: p.gender || 'Male',
      house: addr.house || '',
      locality: addr.locality || '',
      city: addr.city || 'Sirsa',
      district: addr.district || 'Sirsa',
      state: addr.state || 'Haryana',
      pincode: addr.pincode || '',
    });
  }, [user, savedProfile, application]);

  // Handle logout
  const handleSignOut = () => {
    logout();
    navigate('/admission/login');
  };

  // Handle saving profile changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });

    const result = updateProfile({
      fullName: profileForm.fullName,
      email: profileForm.email,
      fatherName: profileForm.fatherName,
      motherName: profileForm.motherName,
      dob: profileForm.dob,
      gender: profileForm.gender,
      address: {
        house: profileForm.house,
        locality: profileForm.locality,
        city: profileForm.city,
        district: profileForm.district,
        state: profileForm.state,
        pincode: profileForm.pincode,
      },
    });

    if (result.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
      setIsEditingProfile(false);
    } else {
      setProfileMsg({ type: 'error', text: result.error || 'Failed to update profile.' });
    }
  };

  // Determine current active application (from backend list or local draft)
  const primaryApp =
    myApplications.length > 0
      ? myApplications[0]
      : application?.course?.slug || application?.personal?.fullName
      ? application
      : null;

  const hasSubmittedApp = myApplications.some(
    (a) =>
      a.status === 'submitted' ||
      a.status === 'under_review' ||
      a.status === 'approved' ||
      a.status === 'admitted' ||
      a.payment?.status === 'paid' ||
      a.payment?.status === 'verified'
  );

  const isDraftApp = primaryApp && !hasSubmittedApp && primaryApp.status === 'draft';

  // Badge renderer for application status
  const renderAppStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Clock className="h-3.5 w-3.5" />
            <span>Submitted & Pending Review</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="h-3.5 w-3.5" />
            <span>Under Review</span>
          </span>
        );
      case 'approved':
      case 'documents_approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Documents Approved</span>
          </span>
        );
      case 'admitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-300">
            <Award className="h-3.5 w-3.5" />
            <span>Officially Admitted</span>
          </span>
        );
      case 'corrections_required':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Corrections Required</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Rejected</span>
          </span>
        );
      case 'payment_pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Payment Pending</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <FileText className="h-3.5 w-3.5" />
            <span>Draft</span>
          </span>
        );
    }
  };

  // Badge renderer for payment status
  const renderPaymentBadge = (payment) => {
    const status = payment?.status;
    if (status === 'paid' || status === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>PAID (₹500)</span>
        </span>
      );
    }
    if (status === 'submitted') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="h-3.5 w-3.5" />
          <span>Verification Pending</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <CreditCard className="h-3.5 w-3.5" />
        <span>PENDING (₹500)</span>
      </span>
    );
  };

  return (
    <>
      <Seo
        title="Student Dashboard • HKCL Skill Centre"
        description="View your admission applications, fee payment receipts, and application review status."
        path="/admission/dashboard"
        noindex={true}
      />

      <div className="min-h-screen bg-[#F5F7FA] py-8 sm:py-10">
        <Container>
          {/* Top Institutional Header Card */}
          <div className="bg-white rounded-2xl border border-[#E5EAF1] p-6 sm:p-8 shadow-xs mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-[#10284B] text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                  {(user?.name || 'S')[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                      {user?.name || 'Student Portal'}
                    </h1>
                    <span className="font-mono text-xs font-bold text-[#10284B] bg-[#10284B]/10 px-2.5 py-0.5 rounded-md border border-[#10284B]/20">
                      {user?.studentId || 'HKCL-STUDENT'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#718096] flex flex-wrap items-center gap-4">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {user?.phone || 'Mobile not set'}
                    </span>
                    {user?.email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {user?.email}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={loadApplications}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  title="Refresh records"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('applications')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'applications'
                    ? 'bg-[#10284B] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                My Applications ({myApplications.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('payments')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'payments'
                    ? 'bg-[#10284B] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Payment & Receipts
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'profile'
                    ? 'bg-[#10284B] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Profile & Address
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              TAB 1: MY APPLICATIONS
             ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              {/* PRIMARY ACTION BANNER */}
              {!primaryApp && myApplications.length === 0 ? (
                /* EMPTY STATE: PART 3 REQUIREMENT */
                <div className="bg-white rounded-2xl border border-[#E5EAF1] p-8 sm:p-12 text-center shadow-xs">
                  <div className="h-16 w-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 border border-orange-100">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#172033]">
                    No admission application found
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#718096] max-w-md mx-auto leading-relaxed">
                    You have not submitted an admission application for the current academic session. Select a certified program and apply online today.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/admission/personal-details"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition shadow-md shadow-orange-600/20"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Apply for Admission</span>
                    </Link>
                  </div>
                </div>
              ) : (
                /* ACTIVE APPLICATION CARD */
                <div className="bg-white rounded-2xl border border-[#E5EAF1] p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider block">
                        Active Application
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-[#172033] mt-0.5">
                        {primaryApp?.course?.name || 'Skill & Certificate Course'}
                      </h3>
                      <p className="text-xs text-[#718096] mt-0.5">
                        Application ID: <span className="font-mono font-semibold text-slate-800">{primaryApp?.applicationId || primaryApp?.id || 'In Progress'}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {renderAppStatusBadge(primaryApp?.status)}
                      {renderPaymentBadge(primaryApp?.payment)}
                    </div>
                  </div>

                  {/* Application Timeline (Part 9) */}
                  <div className="py-6 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider mb-4">
                      Application Milestone Progress
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {/* Milestone 1 */}
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                        <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          <span>1. Form Filled</span>
                        </div>
                        <p className="text-[11px] text-emerald-700">Details & docs captured</p>
                      </div>

                      {/* Milestone 2 */}
                      <div
                        className={`p-3 rounded-xl border ${
                          primaryApp?.payment?.status === 'paid' || primaryApp?.payment?.status === 'verified'
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : 'bg-amber-50/70 border-amber-200'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 font-semibold mb-1 ${
                            primaryApp?.payment?.status === 'paid' || primaryApp?.payment?.status === 'verified'
                              ? 'text-emerald-800'
                              : 'text-amber-800'
                          }`}
                        >
                          {primaryApp?.payment?.status === 'paid' || primaryApp?.payment?.status === 'verified' ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          ) : (
                            <Clock className="h-4 w-4 shrink-0 text-amber-600" />
                          )}
                          <span>2. Fee Payment</span>
                        </div>
                        <p
                          className={`text-[11px] ${
                            primaryApp?.payment?.status === 'paid' || primaryApp?.payment?.status === 'verified'
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {primaryApp?.payment?.status === 'paid' || primaryApp?.payment?.status === 'verified'
                            ? '₹500 verified & receipt issued'
                            : '₹500 payment pending'}
                        </p>
                      </div>

                      {/* Milestone 3 */}
                      <div
                        className={`p-3 rounded-xl border ${
                          primaryApp?.documentReview?.status === 'approved' || primaryApp?.status === 'approved'
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : primaryApp?.status === 'submitted'
                            ? 'bg-blue-50/70 border-blue-200'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 font-semibold mb-1 ${
                            primaryApp?.documentReview?.status === 'approved' || primaryApp?.status === 'approved'
                              ? 'text-emerald-800'
                              : primaryApp?.status === 'submitted'
                              ? 'text-blue-800'
                              : 'text-slate-600'
                          }`}
                        >
                          {primaryApp?.documentReview?.status === 'approved' || primaryApp?.status === 'approved' ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          ) : (
                            <Clock className="h-4 w-4 shrink-0 text-blue-500" />
                          )}
                          <span>3. Verification</span>
                        </div>
                        <p className="text-[11px]">
                          {primaryApp?.documentReview?.status === 'approved'
                            ? 'Approved by admissions team'
                            : 'Staff document review'}
                        </p>
                      </div>

                      {/* Milestone 4 */}
                      <div
                        className={`p-3 rounded-xl border ${
                          primaryApp?.status === 'admitted'
                            ? 'bg-green-50/90 border-green-300 text-green-900'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-semibold mb-1">
                          {primaryApp?.status === 'admitted' ? (
                            <Award className="h-4 w-4 shrink-0 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                          )}
                          <span>4. Course Admission</span>
                        </div>
                        <p className="text-[11px]">
                          {primaryApp?.status === 'admitted'
                            ? `Enrolled in ${primaryApp?.course?.batch || 'Batch'}`
                            : 'Final admission confirmation'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-[#718096]">
                      {primaryApp?.submittedAt
                        ? `Submitted on ${new Date(primaryApp.submittedAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}`
                        : 'Application currently in progress'}
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* If Draft, provide Resume */}
                      {isDraftApp && (
                        <Link
                          to="/admission/personal-details"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold transition"
                        >
                          <span>Resume Application</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}

                      {/* If Payment is Pending, provide Complete Payment */}
                      {primaryApp?.payment?.status !== 'paid' && primaryApp?.payment?.status !== 'verified' && (
                        <Link
                          to="/admission/payment"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10284B] hover:bg-[#0c1f3a] text-white font-semibold transition"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>Pay Registration Fee (₹500)</span>
                        </Link>
                      )}

                      {/* If Paid, provide View Receipt */}
                      {(primaryApp?.payment?.status === 'paid' || primaryApp?.payment?.status === 'verified') && (
                        <Link
                          to="/admission/confirmation"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                        >
                          <Receipt className="h-3.5 w-3.5" />
                          <span>Download Receipt (PDF)</span>
                        </Link>
                      )}

                      {/* Review details */}
                      <Link
                        to="/admission/review"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Form Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* ALL APPLICATIONS LIST */}
              {myApplications.length > 1 && (
                <div className="bg-white rounded-2xl border border-[#E5EAF1] p-6 shadow-xs">
                  <h4 className="text-sm font-bold text-[#172033] mb-4">
                    All Application Records ({myApplications.length})
                  </h4>
                  <div className="divide-y divide-slate-100">
                    {myApplications.map((app) => (
                      <div
                        key={app._id || app.applicationId}
                        className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{app.course?.name || 'Certificate Course'}</p>
                          <p className="text-[#718096] text-[11px] mt-0.5">
                            ID: <span className="font-mono">{app.applicationId}</span> • Registered:{' '}
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderAppStatusBadge(app.status)}
                          {renderPaymentBadge(app.payment)}
                          {app.payment?.status === 'paid' && (
                            <Link
                              to="/admission/confirmation"
                              className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                            >
                              Receipt
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              TAB 2: PAYMENT & RECEIPTS (Part 5 & 6)
             ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#E5EAF1] p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#172033]">
                      Registration Fee & Payment Records
                    </h3>
                    <p className="text-xs text-[#718096] mt-0.5">
                      Fixed non-refundable registration fee: ₹500 (INR). Receipts are issued instantly after payment verification.
                    </p>
                  </div>

                  <Link
                    to="/admission/confirmation"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10284B] hover:bg-[#0c1f3a] text-white text-xs font-semibold transition shrink-0"
                  >
                    <Receipt className="h-3.5 w-3.5" />
                    <span>View Official 1-Page Receipt</span>
                  </Link>
                </div>

                {/* Payment History List */}
                <div className="mt-6">
                  {primaryApp?.payment?.status === 'paid' || primaryApp?.payment?.status === 'verified' ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                            {primaryApp.payment.receiptNo || 'HKCL-RCP-2026-VERIFIED'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                            VERIFIED & PAID
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-2">
                          Registration Fee: ₹500.00
                        </h4>
                        <p className="text-xs text-[#718096] mt-0.5">
                          Method: {primaryApp.payment.method || 'Razorpay Gateway (UPI/Card)'} • Transaction ID:{' '}
                          <span className="font-mono text-slate-800 font-medium">
                            {primaryApp.payment.transactionId || 'TXN-CONFIRMED'}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to="/admission/confirmation"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-xs"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download Receipt (PDF)</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-slate-50/70 rounded-xl border border-slate-200 p-6">
                      <CreditCard className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700">No verified payments on file yet</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Once you complete the ₹500 registration fee payment, your official receipt will appear here.
                      </p>
                      <Link
                        to="/admission/payment"
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition"
                      >
                        <span>Proceed to Fee Payment</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              TAB 3: PROFILE & ADDRESS (Part 2 & 4)
             ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-[#E5EAF1] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#172033]">
                    Permanent Student Identity & Address
                  </h3>
                  <p className="text-xs text-[#718096] mt-0.5">
                    This profile information auto-fills any course applications you submit.
                  </p>
                </div>

                {!isEditingProfile && (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {profileMsg.text && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium mb-4 ${
                    profileMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {profileMsg.text}
                </div>
              )}

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#10284B]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#10284B]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Father's Name</label>
                      <input
                        type="text"
                        value={profileForm.fatherName}
                        onChange={(e) => setProfileForm({ ...profileForm, fatherName: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#10284B]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mother's Name</label>
                      <input
                        type="text"
                        value={profileForm.motherName}
                        onChange={(e) => setProfileForm({ ...profileForm, motherName: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#10284B]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={profileForm.dob}
                        onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#10284B]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                      <select
                        value={profileForm.gender}
                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 pt-2 border-t border-slate-100">Permanent Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">House / Street</label>
                      <input
                        type="text"
                        value={profileForm.house}
                        onChange={(e) => setProfileForm({ ...profileForm, house: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Locality</label>
                      <input
                        type="text"
                        value={profileForm.locality}
                        onChange={(e) => setProfileForm({ ...profileForm, locality: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">District</label>
                      <input
                        type="text"
                        value={profileForm.district}
                        onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">PIN Code</label>
                      <input
                        type="text"
                        value={profileForm.pincode}
                        onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#10284B] text-white font-semibold hover:bg-[#0c1f3a] transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Full Legal Name</span>
                    <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                      {user?.name || profileForm.fullName || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Student Reference ID</span>
                    <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                      {user?.studentId || 'HKCL-STUDENT'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Registered Mobile</span>
                    <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                      {user?.phone || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Registered Email</span>
                    <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                      {user?.email || profileForm.email || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Father's Name</span>
                    <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                      {profileForm.fatherName || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Mother's Name</span>
                    <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                      {profileForm.motherName || 'Not specified'}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-medium block">Permanent Address</span>
                    <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                      {[
                        profileForm.house,
                        profileForm.locality,
                        profileForm.city,
                        profileForm.district,
                        profileForm.state,
                        profileForm.pincode,
                      ]
                        .filter(Boolean)
                        .join(', ') || 'Not specified'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
