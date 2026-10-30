import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  GraduationCap,
  Megaphone,
  History,
  Search,
  Filter,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Mail,
  Send,
  UserCheck,
  UserX,
  RotateCcw,
  Download,
  Printer,
  Check,
  X,
  ShieldAlert,
} from 'lucide-react';
import Container from '../../components/Container.jsx';
import Seo from '../../components/Seo.jsx';
import AdminHeader from '../../components/admin/AdminHeader.jsx';
import { getAdminHeaders, isAdminAuthenticated, clearAdminSession } from '../../utils/auth.js';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Navigation tab: 'overview' | 'applications' | 'staff' | 'ads' | 'payments' | 'admissions' | 'logs'
  const [activeTab, setActiveTab] = useState('overview');

  // Loading and feedback states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // 1. Overview state
  const [overview, setOverview] = useState({
    statistics: {
      totalApplications: 0,
      underReview: 0,
      correctionsRequired: 0,
      documentsApproved: 0,
      paymentsSubmitted: 0,
      paymentsVerified: 0,
      admittedStudents: 0,
      rejectedApplications: 0,
      totalStaff: 0,
      activeStaff: 0,
      pendingStaffInvitations: 0,
    },
    recentApplications: [],
    recentActivities: [],
    recentAdmissionUpdates: [],
  });

  // 2. Applications state
  const [applications, setApplications] = useState([]);
  const [appSearch, setAppSearch] = useState('');
  const [appFilterCourse, setAppFilterCourse] = useState('all');
  const [appFilterStatus, setAppFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);

  // 3. Staff state
  const [staffList, setStaffList] = useState([]);
  const [staffSearch, setStaffSearch] = useState('');
  const [staffFilterStatus, setStaffFilterStatus] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(null);
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: 'Admissions Officer',
    canReviewDocuments: true,
    canVerifyPayments: true,
    canProcessAdmissions: true,
  });
  const [inviteResult, setInviteResult] = useState(null);

  // 4. Advertisements state
  const [adsList, setAdsList] = useState([]);
  const [showAdModal, setShowAdModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [previewAd, setPreviewAd] = useState(null);
  const [adForm, setAdForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    ctaText: 'Learn More',
    ctaUrl: '/courses',
    badge: 'Admission Open',
    status: 'published',
    displayOrder: 1,
    startDate: '',
    endDate: '',
  });

  // 5. Payments state
  const [paymentsList, setPaymentsList] = useState([]);
  const [paymentFilterStatus, setPaymentFilterStatus] = useState('all');
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState(null);
  const [paymentActionModal, setPaymentActionModal] = useState(null); // { app, action: 'verify' | 'reject' }
  const [paymentNotes, setPaymentNotes] = useState('');

  // 6. Admissions state
  const [viewCertificateApp, setViewCertificateApp] = useState(null);

  // 7. Activity logs state
  const [logsList, setLogsList] = useState([]);
  const [logFilterCategory, setLogFilterCategory] = useState('all');
  const [logSearch, setLogSearch] = useState('');

  // Toast notifier
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4500);
  }, []);

  // Check auth
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  // Data Fetchers
  const fetchOverview = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/overview', { credentials: 'include', headers: getAdminHeaders() });
      if (res.status === 401 || res.status === 403) {
        clearAdminSession();
        navigate('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setOverview(data);
      }
    } catch (err) {
      console.warn('Overview fetch error:', err);
    }
  }, [navigate]);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/staff/overview', { credentials: 'include', headers: getAdminHeaders() });
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.warn('Applications fetch error:', err);
    }
  }, []);

  const fetchStaff = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/staff', { credentials: 'include', headers: getAdminHeaders() });
      const data = await res.json();
      if (data.success) {
        setStaffList(data.staff || []);
      }
    } catch (err) {
      console.warn('Staff fetch error:', err);
    }
  }, []);

  const fetchAds = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/advertisements', { credentials: 'include', headers: getAdminHeaders() });
      const data = await res.json();
      if (data.success) {
        setAdsList(data.advertisements || []);
      }
    } catch (err) {
      console.warn('Ads fetch error:', err);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/activity-logs?limit=100', { credentials: 'include', headers: getAdminHeaders() });
      const data = await res.json();
      if (data.success) {
        setLogsList(data.logs || []);
      }
    } catch (err) {
      console.warn('Logs fetch error:', err);
    }
  }, []);

  // Fetch all initial data
  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchOverview(), fetchApplications(), fetchStaff(), fetchAds(), fetchLogs()]);
    setLoading(false);
  }, [fetchOverview, fetchApplications, fetchStaff, fetchAds, fetchLogs]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Staff Assignment
  const handleAssignStaff = async (applicationId, staffId) => {
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/assign`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ staffId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchApplications();
        fetchOverview();
        if (selectedApp?.applicationId === applicationId) {
          setSelectedApp((prev) => ({ ...prev, assignedStaff: data.assignedStaff }));
        }
      } else {
        showToast(data.error || 'Assignment failed.', 'error');
      }
    } catch {
      showToast('Network error assigning staff.', 'error');
    }
  };

  // Staff Invite Handler
  const handleInviteStaff = async (e) => {
    e.preventDefault();
    setInviteResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/staff/invite', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          name: inviteData.name,
          email: inviteData.email,
          phone: inviteData.phone,
          designation: inviteData.designation,
          permissions: {
            canReviewDocuments: inviteData.canReviewDocuments,
            canVerifyPayments: inviteData.canVerifyPayments,
            canProcessAdmissions: inviteData.canProcessAdmissions,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInviteResult(data);
        showToast(data.message);
        fetchStaff();
        fetchOverview();
        setInviteData({
          name: '',
          email: '',
          phone: '',
          designation: 'Admissions Officer',
          canReviewDocuments: true,
          canVerifyPayments: true,
          canProcessAdmissions: true,
        });
      } else {
        showToast(data.error || 'Failed to send invitation.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error sending invitation.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Staff Status Toggle
  const handleToggleStaffStatus = async (staffMember) => {
    const nextStatus = staffMember.status === 'active' ? 'deactivated' : 'active';
    if (!window.confirm(`Are you sure you want to change status of ${staffMember.name} to ${nextStatus}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/staff/${staffMember._id || staffMember.id}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchStaff();
        fetchOverview();
      } else {
        showToast(data.error || 'Failed to update status.', 'error');
      }
    } catch {
      showToast('Failed to change status.', 'error');
    }
  };

  // Resend Staff Invite
  const handleResendInvite = async (staffId) => {
    try {
      const res = await fetch(`/api/admin/staff/${staffId}/resend-invite`, {
        method: 'POST',
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        if (data.invitationUrl) {
          navigator.clipboard?.writeText(data.invitationUrl);
        }
      } else {
        showToast(data.error || 'Failed to resend.', 'error');
      }
    } catch {
      showToast('Failed to resend invitation.', 'error');
    }
  };

  // Revoke Staff Invite
  const handleRevokeInvite = async (staffId) => {
    if (!window.confirm('Are you sure you want to revoke and delete this pending invitation?')) return;
    try {
      const res = await fetch(`/api/admin/staff/${staffId}/revoke-invite`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchStaff();
        fetchOverview();
      } else {
        showToast(data.error || 'Failed to revoke.', 'error');
      }
    } catch {
      showToast('Failed to revoke invitation.', 'error');
    }
  };

  // Advertisement Save (Create or Edit)
  const handleSaveAd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEdit = Boolean(editingAd);
      const url = isEdit ? `/api/admin/advertisements/${editingAd._id || editingAd.id}` : '/api/admin/advertisements';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAdminHeaders(),
        body: JSON.stringify(adForm),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setShowAdModal(false);
        setEditingAd(null);
        fetchAds();
      } else {
        showToast(data.error || 'Failed to save advertisement.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error saving advertisement.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete Advertisement
  const handleDeleteAd = async (adId) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) return;
    try {
      const res = await fetch(`/api/admin/advertisements/${adId}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchAds();
      } else {
        showToast(data.error || 'Failed to delete advertisement.', 'error');
      }
    } catch {
      showToast('Network error deleting ad.', 'error');
    }
  };

  // Payment Verification / Rejection
  const handlePaymentDecision = async () => {
    if (!paymentActionModal) return;
    const { app, action } = paymentActionModal;
    const endpoint = action === 'verify' ? '/api/staff/payments/verify' : '/api/staff/payments/reject';
    const payload =
      action === 'verify'
        ? { applicationId: app.applicationId, notes: paymentNotes }
        : { applicationId: app.applicationId, reason: paymentNotes || 'Payment rejected by administrator.' };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setPaymentActionModal(null);
        setPaymentNotes('');
        fetchApplications();
        fetchOverview();
      } else {
        showToast(data.error || 'Action failed.', 'error');
      }
    } catch {
      showToast('Error processing payment decision.', 'error');
    }
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const admittedList = applications.filter(
      (a) => a.finalAdmission?.status === 'admitted' || a.status === 'admitted'
    );
    if (admittedList.length === 0) {
      showToast('No admitted students found to export.', 'error');
      return;
    }

    const headers = [
      'Enrollment No',
      'Student Reference ID',
      'Application ID',
      'Candidate Name',
      'Mobile Phone',
      'Email',
      'Course Name',
      'Admitted Batch',
      'Admission Date',
      'Registration Fee Status',
      'Payment UTR',
    ];

    const rows = admittedList.map((a) => [
      `"${a.finalAdmission?.enrollmentNo || ''}"`,
      `"${a.studentId || ''}"`,
      `"${a.applicationId || ''}"`,
      `"${(a.personalSnapshot?.fullName || a.personal?.fullName || '').replace(/"/g, '""')}"`,
      `"${a.personalSnapshot?.phone || a.personal?.phone || ''}"`,
      `"${a.personalSnapshot?.email || a.personal?.email || ''}"`,
      `"${(a.course?.name || '').replace(/"/g, '""')}"`,
      `"${a.finalAdmission?.admittedBatch || a.course?.batch || ''}"`,
      `"${a.finalAdmission?.decisionAt ? new Date(a.finalAdmission.decisionAt).toLocaleDateString() : ''}"`,
      `"${a.payment?.status || ''}"`,
      `"${a.payment?.utr || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HKCL_Admitted_Students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${admittedList.length} admitted student records.`);
  };

  // Filtered applications
  const filteredApps = applications.filter((a) => {
    if (appFilterCourse !== 'all' && a.course?.slug !== appFilterCourse) return false;
    if (appFilterStatus !== 'all' && a.status !== appFilterStatus) return false;
    if (appSearch) {
      const q = appSearch.toLowerCase();
      const name = (a.personalSnapshot?.fullName || a.personal?.fullName || '').toLowerCase();
      const phone = a.personalSnapshot?.phone || a.personal?.phone || '';
      const sId = (a.studentId || '').toLowerCase();
      const appId = (a.applicationId || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || sId.includes(q) || appId.includes(q);
    }
    return true;
  });

  return (
    <>
      <Seo
        title="Centre Administrator Portal • HKCL Skill Centre"
        description="Comprehensive administration dashboard for admissions, staff management, and portal control."
      />

      <div className="min-h-screen bg-slate-100/70 pb-20">
        <AdminHeader />

        {/* Global Toast Alert */}
        {toast.show && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
            <div
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium ${
                toast.type === 'error'
                  ? 'bg-red-900 border-red-700 text-white'
                  : 'bg-emerald-900 border-emerald-700 text-white'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-300 shrink-0" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Sub-Header Tabs Bar */}
        <div className="bg-white border-b border-slate-200 sticky top-[72px] sm:top-[80px] z-40 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 py-2">
              <nav className="flex space-x-1 sm:space-x-2 shrink-0">
                {[
                  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                  { id: 'applications', label: 'Applications', icon: FileText, count: overview.statistics.totalApplications },
                  { id: 'staff', label: 'Staff Team', icon: Users, count: overview.statistics.totalStaff },
                  { id: 'ads', label: 'Advertisements', icon: Megaphone, count: adsList.length },
                  { id: 'payments', label: 'Fee Payments', icon: CreditCard, count: overview.statistics.paymentsSubmitted },
                  { id: 'admissions', label: 'Admissions', icon: GraduationCap, count: overview.statistics.admittedStudents },
                  { id: 'logs', label: 'Activity Logs', icon: History },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition shrink-0 ${
                        isActive
                          ? 'bg-brand-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span>{tab.label}</span>
                      {typeof tab.count === 'number' && (
                        <span
                          className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive ? 'bg-brand-800 text-amber-300' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2 pl-4 shrink-0">
                <button
                  type="button"
                  onClick={refreshAll}
                  disabled={loading}
                  title="Refresh all records"
                  className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-brand-600' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <Container className="py-8">
          {/* ═══════════════════════════════════════════════════════════════════
              TAB 1: OVERVIEW (REAL DATABASE STATISTICS)
             ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Live database statistics across applicants, staff verifications and admissions.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setInviteResult(null);
                      setShowInviteModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-900 text-white text-xs sm:text-sm font-semibold hover:bg-brand-950 transition shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Invite Staff Member</span>
                  </button>
                </div>
              </div>

              {/* KPI Statistics Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Total Applications</span>
                  <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">{overview.statistics.totalApplications}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Registered applicants</span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 block">Under Review</span>
                  <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-600">{overview.statistics.underReview}</p>
                  <span className="text-[10px] text-amber-700/80 mt-1 block">Pending staff action</span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-200/80 bg-indigo-50/20 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 block">Docs Approved</span>
                  <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-indigo-600">{overview.statistics.documentsApproved}</p>
                  <span className="text-[10px] text-indigo-700/80 mt-1 block">Unlocked for payment</span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-200/80 bg-blue-50/20 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 block">Payments Submitted</span>
                  <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-blue-600">{overview.statistics.paymentsSubmitted}</p>
                  <span className="text-[10px] text-blue-700/80 mt-1 block">Awaiting bank verification</span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 block">Admitted Students</span>
                  <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-600">{overview.statistics.admittedStudents}</p>
                  <span className="text-[10px] text-emerald-700/80 mt-1 block">Enrollment finalized</span>
                </div>
              </div>

              {/* Secondary Counters (Staff & Corrections) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Active Staff</span>
                  <p className="text-xl font-bold text-slate-800 mt-1">{overview.statistics.activeStaff} / {overview.statistics.totalStaff}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Pending Staff Invites</span>
                  <p className="text-xl font-bold text-amber-600 mt-1">{overview.statistics.pendingStaffInvitations}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Corrections Required</span>
                  <p className="text-xl font-bold text-purple-600 mt-1">{overview.statistics.correctionsRequired}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Payments Verified</span>
                  <p className="text-xl font-bold text-emerald-600 mt-1">{overview.statistics.paymentsVerified}</p>
                </div>
              </div>

              {/* Two Column Layout: Recent Applications & Recent Activities */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Applications Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-brand-600" />
                      Recent Applications
                    </h3>
                    <button
                      onClick={() => setActiveTab('applications')}
                      className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1"
                    >
                      View All <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {overview.recentApplications?.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No recent applications recorded yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {overview.recentApplications?.map((app) => (
                        <div
                          key={app.applicationId}
                          onClick={() => {
                            setSelectedApp(applications.find((a) => a.applicationId === app.applicationId) || app);
                            setActiveTab('applications');
                          }}
                          className="group p-3 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-slate-50/70 transition cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-slate-900 group-hover:text-brand-900">
                                {app.candidateName}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">{app.applicationId}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{app.courseName}</p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                app.status === 'admitted'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.status === 'payment_submitted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : app.status === 'documents_approved'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : app.status === 'corrections_required'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {app.status?.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Activities Audit Feed */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <History className="h-4 w-4 text-brand-600" />
                      Staff Activity Trail
                    </h3>
                    <button
                      onClick={() => setActiveTab('logs')}
                      className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1"
                    >
                      Audit Trail <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {overview.recentActivities?.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No activity logged yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {overview.recentActivities?.map((log, idx) => (
                        <div key={log._id || idx} className="flex items-start gap-3 text-xs">
                          <span className="h-2 w-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-800 font-medium truncate">{log.description}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span>By: {log.performedBy?.name || 'System'}</span>
                              <span>•</span>
                              <span>{log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0 uppercase">
                            {log.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              TAB 2: APPLICATION MANAGEMENT & STAFF ASSIGNMENT
             ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'applications' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Application Management</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    View, filter, monitor documents and payment status, and assign applications to staff.
                  </p>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    placeholder="Search by student name, ID, mobile or application ID..."
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={appFilterStatus}
                    onChange={(e) => setAppFilterStatus(e.target.value)}
                    className="py-2 px-3 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="under_review">Under Review</option>
                    <option value="corrections_required">Corrections Required</option>
                    <option value="documents_approved">Documents Approved</option>
                    <option value="payment_submitted">Payment Submitted</option>
                    <option value="payment_verified">Payment Verified</option>
                    <option value="admitted">Admitted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Applications Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="py-3.5 px-4">Applicant</th>
                        <th className="py-3.5 px-4">Course</th>
                        <th className="py-3.5 px-4">Doc Review</th>
                        <th className="py-3.5 px-4">Payment</th>
                        <th className="py-3.5 px-4">Admission</th>
                        <th className="py-3.5 px-4">Assigned Staff</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApps.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            No applications matching your current filter.
                          </td>
                        </tr>
                      ) : (
                        filteredApps.map((app) => (
                          <tr key={app.applicationId} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-900 block">
                                {app.personalSnapshot?.fullName || app.personal?.fullName || 'Candidate'}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                {app.studentId} • {app.applicationId}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-medium text-slate-800 block truncate max-w-[180px]">
                                {app.course?.name || 'Course'}
                              </span>
                              <span className="text-[10px] text-slate-400">{app.course?.batch || 'Regular Batch'}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  app.documentReview?.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : app.documentReview?.status === 'corrections_required'
                                    ? 'bg-purple-100 text-purple-800'
                                    : app.documentReview?.status === 'rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {app.documentReview?.status || 'pending'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  app.payment?.status === 'verified' || app.payment?.status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : app.payment?.status === 'submitted'
                                    ? 'bg-blue-100 text-blue-800'
                                    : app.payment?.status === 'rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {app.payment?.status || 'unpaid'}
                              </span>
                              {app.payment?.utr && (
                                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                                  UTR: {app.payment.utr}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  app.finalAdmission?.status === 'admitted'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : app.finalAdmission?.status === 'rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {app.finalAdmission?.status || 'pending'}
                              </span>
                              {app.finalAdmission?.enrollmentNo && (
                                <span className="text-[10px] font-mono text-emerald-700 block mt-0.5 font-bold">
                                  {app.finalAdmission.enrollmentNo}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              {/* Staff Assignment Select */}
                              <select
                                value={app.assignedStaff?.staffId || ''}
                                onChange={(e) => handleAssignStaff(app.applicationId, e.target.value)}
                                className="text-xs py-1 px-2 rounded border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                              >
                                <option value="">Unassigned</option>
                                {staffList.map((st) => (
                                  <option key={st._id || st.id} value={st._id || st.id}>
                                    {st.name} ({st.designation || 'Staff'})
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-brand-700 hover:bg-brand-50 transition"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Details</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              TAB 3: STAFF MANAGEMENT & GMAIL INVITATION
             ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'staff' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Management</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Register staff members through secure Gmail invitations, manage roles, and review permissions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setInviteResult(null);
                    setShowInviteModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-900 text-white text-xs sm:text-sm font-semibold hover:bg-brand-950 transition shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Send Staff Invitation</span>
                </button>
              </div>

              {/* Staff Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="py-3.5 px-4">Staff Member</th>
                        <th className="py-3.5 px-4">Designation</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Permissions</th>
                        <th className="py-3.5 px-4">Invited / Active</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {staffList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            No staff accounts registered yet. Click &quot;Send Staff Invitation&quot; to invite a team member.
                          </td>
                        </tr>
                      ) : (
                        staffList.map((st) => (
                          <tr key={st._id || st.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-900 block">{st.name}</span>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Mail className="h-3 w-3 text-slate-400" />
                                {st.email} • {st.phone}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-800">{st.designation}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  st.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : st.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {st.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1">
                                {st.permissions?.canReviewDocuments && (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600">
                                    Docs
                                  </span>
                                )}
                                {st.permissions?.canVerifyPayments && (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600">
                                    Payments
                                  </span>
                                )}
                                {st.permissions?.canProcessAdmissions && (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600">
                                    Admissions
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[11px] text-slate-500">
                              {st.status === 'active' && st.lastLogin ? (
                                <span>Last: {new Date(st.lastLogin).toLocaleDateString()}</span>
                              ) : st.status === 'pending' ? (
                                <span className="text-amber-700">Invite Pending</span>
                              ) : (
                                <span>Deactivated</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {st.status === 'pending' ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleResendInvite(st._id || st.id)}
                                      className="px-2 py-1 rounded border border-amber-300 bg-amber-50 text-[11px] font-medium text-amber-800 hover:bg-amber-100 transition"
                                      title="Resend invitation"
                                    >
                                      Resend
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRevokeInvite(st._id || st.id)}
                                      className="px-2 py-1 rounded border border-red-200 bg-red-50 text-[11px] font-medium text-red-700 hover:bg-red-100 transition"
                                      title="Revoke invitation"
                                    >
                                      Revoke
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStaffStatus(st)}
                                    className={`px-2 py-1 rounded border text-[11px] font-medium transition ${
                                      st.status === 'active'
                                        ? 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100'
                                        : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                    }`}
                                  >
                                    {st.status === 'active' ? 'Deactivate' : 'Activate'}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              TAB 4: ADVERTISEMENT MANAGEMENT
             ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'ads' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Homepage Advertisements</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Control dynamic promotional banners and announcement displays on the website homepage.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingAd(null);
                    setAdForm({
                      title: '',
                      description: '',
                      imageUrl: '',
                      ctaText: 'Apply For Admission',
                      ctaUrl: '/admission/personal-details',
                      badge: 'New Batch 2026',
                      status: 'published',
                      displayOrder: 1,
                      startDate: '',
                      endDate: '',
                    });
                    setShowAdModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-900 text-white text-xs sm:text-sm font-semibold hover:bg-brand-950 transition shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Advertisement</span>
                </button>
              </div>

              {/* Advertisements Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adsList.length === 0 ? (
                  <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
                    <Megaphone className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-700">No advertisements configured.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click &quot;Create Advertisement&quot; to publish promotional banners to the homepage.
                    </p>
                  </div>
                ) : (
                  adsList.map((ad) => (
                    <div
                      key={ad._id || ad.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {/* Image banner */}
                        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                          <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800';
                            }}
                          />
                          <span
                            className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                              ad.status === 'published'
                                ? 'bg-emerald-600 text-white'
                                : ad.status === 'scheduled'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-white'
                            }`}
                          >
                            {ad.status}
                          </span>
                          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                            {ad.badge}
                          </span>
                        </div>

                        {/* Text Content */}
                        <div className="p-4 sm:p-5">
                          <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">{ad.title}</h4>
                          <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{ad.description}</p>
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Order: {ad.displayOrder}</span>
                            <span className="font-semibold text-brand-700">{ad.ctaText} →</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action footer */}
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewAd(ad)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white transition"
                        >
                          Preview
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAd(ad);
                              setAdForm({
                                title: ad.title,
                                description: ad.description,
                                imageUrl: ad.imageUrl,
                                ctaText: ad.ctaText,
                                ctaUrl: ad.ctaUrl,
                                badge: ad.badge,
                                status: ad.status,
                                displayOrder: ad.displayOrder,
                                startDate: ad.startDate ? ad.startDate.slice(0, 10) : '',
                                endDate: ad.endDate ? ad.endDate.slice(0, 10) : '',
                              });
                              setShowAdModal(true);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-900 hover:bg-white transition"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAd(ad._id || ad.id)}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              TAB 5: PAYMENT MONITORING
             ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Fee Payment Monitoring</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Inspect manual UPI transaction references, receipts, and verify against centre bank records.
                  </p>
                </div>
              </div>

              {/* Payments Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="py-3.5 px-4">Candidate</th>
                        <th className="py-3.5 px-4">Amount</th>
                        <th className="py-3.5 px-4">UTR Number</th>
                        <th className="py-3.5 px-4">Payer UPI ID</th>
                        <th className="py-3.5 px-4">Payment Status</th>
                        <th className="py-3.5 px-4">Verified By</th>
                        <th className="py-3.5 px-4 text-right">Receipt / Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applications.filter((a) => a.payment?.status && a.payment?.status !== 'pending' && a.payment?.status !== 'unpaid').length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            No payment submissions recorded yet.
                          </td>
                        </tr>
                      ) : (
                        applications
                          .filter((a) => a.payment?.status && a.payment?.status !== 'pending' && a.payment?.status !== 'unpaid')
                          .map((app) => (
                            <tr key={app.applicationId} className="hover:bg-slate-50/70 transition">
                              <td className="py-3.5 px-4">
                                <span className="font-semibold text-slate-900 block">
                                  {app.personalSnapshot?.fullName || app.personal?.fullName}
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">{app.applicationId}</span>
                              </td>
                              <td className="py-3.5 px-4 font-bold text-slate-900">₹{app.payment?.registrationFee || 500}</td>
                              <td className="py-3.5 px-4 font-mono font-medium text-slate-800">{app.payment?.utr || '—'}</td>
                              <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{app.payment?.payerUpiId || '—'}</td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    app.payment?.status === 'verified' || app.payment?.status === 'paid'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : app.payment?.status === 'submitted'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {app.payment?.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-xs text-slate-500">
                                {app.payment?.verifiedBy || app.payment?.rejectedBy || '—'}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {app.payment?.screenshotUrl && (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedReceiptUrl(app.payment.screenshotUrl)}
                                      className="px-2 py-1 rounded border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                      Receipt
                                    </button>
                                  )}
                                  {app.payment?.status === 'submitted' && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => setPaymentActionModal({ app, action: 'verify' })}
                                        className="px-2 py-1 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                                      >
                                        Verify
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setPaymentActionModal({ app, action: 'reject' })}
                                        className="px-2 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              TAB 6: ADMISSIONS MANAGEMENT & REPORT EXPORT
             ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'admissions' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admitted Students &amp; Enrolments</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Official candidate enrollments, batch assignments, certificate previews, and CSV report export.
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-800 transition shadow-xs"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Admitted Students CSV</span>
                </button>
              </div>

              {/* Admitted Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="py-3.5 px-4">Enrollment No</th>
                        <th className="py-3.5 px-4">Student Name</th>
                        <th className="py-3.5 px-4">Course</th>
                        <th className="py-3.5 px-4">Batch</th>
                        <th className="py-3.5 px-4">Admission Date</th>
                        <th className="py-3.5 px-4 text-right">Certificate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applications.filter((a) => a.finalAdmission?.status === 'admitted' || a.status === 'admitted').length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            No admitted students found in the database.
                          </td>
                        </tr>
                      ) : (
                        applications
                          .filter((a) => a.finalAdmission?.status === 'admitted' || a.status === 'admitted')
                          .map((app) => (
                            <tr key={app.applicationId} className="hover:bg-slate-50/70 transition">
                              <td className="py-3.5 px-4 font-mono font-bold text-brand-900">
                                {app.finalAdmission?.enrollmentNo || 'HKCL-ADM-ENR'}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="font-semibold text-slate-900 block">
                                  {app.personalSnapshot?.fullName || app.personal?.fullName}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {app.studentId} • {app.personalSnapshot?.phone || app.personal?.phone}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-medium text-slate-800">{app.course?.name}</td>
                              <td className="py-3.5 px-4 text-xs text-slate-600">
                                {app.finalAdmission?.admittedBatch || app.course?.batch || 'Morning Batch'}
                              </td>
                              <td className="py-3.5 px-4 text-xs text-slate-500">
                                {app.finalAdmission?.decisionAt
                                  ? new Date(app.finalAdmission.decisionAt).toLocaleDateString()
                                  : 'Recently'}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setViewCertificateApp(app)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-200 text-xs font-semibold text-brand-800 hover:bg-brand-50 transition"
                                >
                                  <Printer className="h-3.5 w-3.5 text-brand-600" />
                                  <span>Certificate</span>
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              TAB 7: ACTIVITY LOGS / AUDIT TRAIL
             ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'logs' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Audit Trail</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Immutable log of all administrative, staff review, payment verification, and security events.
                  </p>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                {['all', 'staff', 'application', 'payment', 'admission', 'advertisement', 'auth'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setLogFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                      logFilterCategory === cat
                        ? 'bg-brand-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Logs Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Performed By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {logsList.filter((l) => logFilterCategory === 'all' || l.category === logFilterCategory).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            No activity logs found for this filter.
                          </td>
                        </tr>
                      ) : (
                        logsList
                          .filter((l) => logFilterCategory === 'all' || l.category === logFilterCategory)
                          .map((log, idx) => (
                            <tr key={log._id || idx} className="hover:bg-slate-50/70">
                              <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">
                                {log.createdAt ? new Date(log.createdAt).toLocaleString() : ''}
                              </td>
                              <td className="py-2.5 px-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                                  {log.category}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 font-mono font-semibold text-brand-900">{log.action}</td>
                              <td className="py-2.5 px-4 text-slate-800">{log.description}</td>
                              <td className="py-2.5 px-4 font-medium text-slate-700">
                                {log.performedBy?.name || 'System'} ({log.performedBy?.role || 'staff'})
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* ── MODAL: INVITE STAFF MEMBER ────────────────────────────────────── */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-brand-950 p-6 text-white flex items-center justify-between border-b border-brand-900">
              <div>
                <h3 className="font-bold text-lg text-white">Invite Staff Member</h3>
                <p className="text-xs text-brand-200 mt-0.5">Send single-use invitation link to Gmail address</p>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {inviteResult ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                    <p className="font-bold text-sm text-emerald-950 flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Invitation Generated Successfully!
                    </p>
                    {inviteResult.emailDelivery?.sent ? (
                      <p>An official invitation email has been dispatched to <strong>{inviteResult.staff?.email}</strong>.</p>
                    ) : (
                      <p>
                        Email delivery service is unconfigured. For immediate setup/testing, share this direct invitation link:
                      </p>
                    )}
                  </div>

                  {inviteResult.invitationUrl && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono break-all text-slate-800">
                      {inviteResult.invitationUrl}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    {inviteResult.invitationUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(inviteResult.invitationUrl);
                          showToast('Invitation link copied to clipboard!');
                        }}
                        className="px-4 py-2 rounded-xl bg-brand-900 text-white font-semibold text-xs hover:bg-brand-950 transition"
                      >
                        Copy Link
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInviteStaff} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={inviteData.name}
                      onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Gmail / Email Address</label>
                    <input
                      type="email"
                      required
                      value={inviteData.email}
                      onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                      placeholder="ramesh.hkcl@gmail.com"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={inviteData.phone}
                        onChange={(e) => setInviteData({ ...inviteData, phone: e.target.value })}
                        placeholder="9812345678"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                      <input
                        type="text"
                        required
                        value={inviteData.designation}
                        onChange={(e) => setInviteData({ ...inviteData, designation: e.target.value })}
                        placeholder="Admissions Officer"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-2">Assigned Permissions</span>
                    <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inviteData.canReviewDocuments}
                          onChange={(e) => setInviteData({ ...inviteData, canReviewDocuments: e.target.checked })}
                          className="rounded text-brand-600 focus:ring-brand-500"
                        />
                        <span>Review Academic Documents &amp; Request Corrections</span>
                      </label>
                      <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inviteData.canVerifyPayments}
                          onChange={(e) => setInviteData({ ...inviteData, canVerifyPayments: e.target.checked })}
                          className="rounded text-brand-600 focus:ring-brand-500"
                        />
                        <span>Verify Registration Fee Payments (UTR / Bank Checks)</span>
                      </label>
                      <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inviteData.canProcessAdmissions}
                          onChange={(e) => setInviteData({ ...inviteData, canProcessAdmissions: e.target.checked })}
                          className="rounded text-brand-600 focus:ring-brand-500"
                        />
                        <span>Grant Final Admissions &amp; Generate Enrollment Numbers</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2 rounded-xl bg-brand-900 text-white text-xs font-semibold hover:bg-brand-950 transition shadow-xs flex items-center gap-2"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{loading ? 'Sending...' : 'Send Invitation'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE / EDIT ADVERTISEMENT ────────────────────────────── */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 my-8">
            <div className="bg-brand-950 p-6 text-white flex items-center justify-between border-b border-brand-900">
              <div>
                <h3 className="font-bold text-lg text-white">
                  {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
                </h3>
                <p className="text-xs text-brand-200 mt-0.5">Manage homepage banner promotions and announcements</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAdModal(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Headline / Title</label>
                <input
                  type="text"
                  required
                  value={adForm.title}
                  onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                  placeholder="e.g. HS-CIT Computer Batch 2026 Admissions Open"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={adForm.description}
                  onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
                  placeholder="e.g. Government-certified training with practical lab sessions and placement support."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  required
                  value={adForm.imageUrl}
                  onChange={(e) => setAdForm({ ...adForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {adForm.imageUrl && (
                  <div className="mt-2 h-24 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={adForm.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    required
                    value={adForm.ctaText}
                    onChange={(e) => setAdForm({ ...adForm, ctaText: e.target.value })}
                    placeholder="Apply Now"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CTA Target Link</label>
                  <input
                    type="text"
                    required
                    value={adForm.ctaUrl}
                    onChange={(e) => setAdForm({ ...adForm, ctaUrl: e.target.value })}
                    placeholder="/courses or /admission/personal-details"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={adForm.badge}
                    onChange={(e) => setAdForm({ ...adForm, badge: e.target.value })}
                    placeholder="New Batch"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={adForm.status}
                    onChange={(e) => setAdForm({ ...adForm, status: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={adForm.displayOrder}
                    onChange={(e) => setAdForm({ ...adForm, displayOrder: e.target.value })}
                    min={0}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAdModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-brand-900 text-white text-xs font-semibold hover:bg-brand-950 transition shadow-xs"
                >
                  {loading ? 'Saving...' : editingAd ? 'Update Advertisement' : 'Publish Advertisement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: PREVIEW ADVERTISEMENT ─────────────────────────────────── */}
      {previewAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span>Homepage Banner Live Preview</span>
              <button type="button" onClick={() => setPreviewAd(null)} className="p-1 text-white/70 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 bg-slate-50">
              <div className="rounded-2xl border border-brand-200 bg-white p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center gap-6">
                <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                  <img src={previewAd.imageUrl} alt={previewAd.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 mb-2">
                    {previewAd.badge}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">{previewAd.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{previewAd.description}</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-900 text-white text-xs font-semibold shadow-xs">
                      {previewAd.ctaText} →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PAYMENT DECISION (VERIFY / REJECT) ────────────────────── */}
      {paymentActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div
              className={`p-5 text-white flex items-center justify-between ${
                paymentActionModal.action === 'verify' ? 'bg-emerald-800' : 'bg-red-800'
              }`}
            >
              <h3 className="font-bold text-base">
                {paymentActionModal.action === 'verify' ? 'Confirm Payment Verification' : 'Reject Payment Submission'}
              </h3>
              <button
                type="button"
                onClick={() => setPaymentActionModal(null)}
                className="p-1 rounded text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <p className="text-slate-700">
                Applicant:{' '}
                <strong>
                  {paymentActionModal.app?.personalSnapshot?.fullName || paymentActionModal.app?.personal?.fullName}
                </strong>
                <br />
                UTR Reference: <strong>{paymentActionModal.app?.payment?.utr || 'N/A'}</strong>
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {paymentActionModal.action === 'verify'
                    ? 'Verifier Notes / Receipt Reference'
                    : 'Reason for Rejection (Visible to student)'}
                </label>
                <textarea
                  rows={3}
                  required={paymentActionModal.action === 'reject'}
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder={
                    paymentActionModal.action === 'verify'
                      ? 'Verified in Union Bank of India account records...'
                      : 'UTR reference not found in bank statement, amount mismatch...'
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPaymentActionModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePaymentDecision}
                  className={`px-5 py-2 rounded-xl text-white text-xs font-semibold transition ${
                    paymentActionModal.action === 'verify'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {paymentActionModal.action === 'verify' ? 'Confirm & Verify' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: RECEIPT PREVIEW ────────────────────────────────────────── */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span>Submitted Payment Receipt</span>
              <button type="button" onClick={() => setSelectedReceiptUrl(null)} className="p-1 text-white/70 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 bg-slate-100 flex items-center justify-center max-h-[75vh] overflow-y-auto">
              <img src={selectedReceiptUrl} alt="Receipt" className="max-w-full rounded shadow" />
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ADMISSION CERTIFICATE / CONFIRMATION RECEIPT ─────────────── */}
      {viewCertificateApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="p-4 bg-brand-950 text-white flex items-center justify-between text-xs font-bold uppercase tracking-wider print:hidden">
              <span>Official Admission Confirmation</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </button>
                <button type="button" onClick={() => setViewCertificateApp(null)} className="p-1 text-white/70 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Printable Certificate Content */}
            <div className="p-8 sm:p-10 bg-white border-8 border-brand-900/10 m-4 rounded-xl text-center space-y-6">
              <div className="flex justify-center">
                <img src="/images/logo.png" alt="HKCL Logo" className="h-16 w-16 object-contain" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-brand-950 uppercase tracking-tight">HKCL Skill Centre</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
                  Haryana Knowledge Corporation Limited • Sirsa Centre
                </p>
                <p className="text-xs font-semibold text-brand-700 mt-0.5">Barnala Road, Opposite Lenskart, Sirsa, Haryana</p>
              </div>

              <div className="py-2 border-y-2 border-brand-900/20">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
                  Certificate of Course Admission
                </h3>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed text-left">
                This is to certify that candidate <strong>{viewCertificateApp.personalSnapshot?.fullName || viewCertificateApp.personal?.fullName}</strong>{' '}
                bearing Student Reference ID <strong>{viewCertificateApp.studentId}</strong> has successfully completed document
                verification and payment verification. The student is officially admitted to the following programme:
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block">Course Name</span>
                  <span className="font-bold text-slate-900 text-sm">{viewCertificateApp.course?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block">Enrollment Number</span>
                  <span className="font-bold text-brand-900 font-mono text-sm">{viewCertificateApp.finalAdmission?.enrollmentNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block">Admitted Batch</span>
                  <span className="font-medium text-slate-800">{viewCertificateApp.finalAdmission?.admittedBatch || 'Regular Batch'}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block">Admission Date</span>
                  <span className="font-medium text-slate-800">
                    {viewCertificateApp.finalAdmission?.decisionAt
                      ? new Date(viewCertificateApp.finalAdmission.decisionAt).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200">
                <div className="text-left">
                  <p className="font-semibold text-slate-900">Fee Status: ₹500 Paid &amp; Verified</p>
                  <p className="font-mono text-[10px] text-slate-400">UTR: {viewCertificateApp.payment?.utr || 'Verified'}</p>
                </div>
                <div className="text-right">
                  <div className="h-8 border-b border-slate-400 mb-1 w-32" />
                  <p className="font-semibold text-slate-900">Centre Administrator</p>
                  <p className="text-[10px] text-slate-400">HKCL Skill Centre (Sirsa)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: APPLICATION DETAILS & AUDIT ────────────────────────────── */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-brand-950 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Application Record Details</h3>
                <p className="text-xs text-brand-200 mt-0.5">
                  {selectedApp.studentId} • {selectedApp.applicationId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs sm:text-sm">
              {/* Candidate Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold uppercase">Candidate Name</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedApp.personalSnapshot?.fullName || selectedApp.personal?.fullName}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold uppercase">Contact Phone</span>
                  <span className="font-medium text-slate-800">
                    {selectedApp.personalSnapshot?.phone || selectedApp.personal?.phone}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold uppercase">Email</span>
                  <span className="font-medium text-slate-800">
                    {selectedApp.personalSnapshot?.email || selectedApp.personal?.email || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold uppercase">Course Enrolled</span>
                  <span className="font-semibold text-brand-900">{selectedApp.course?.name}</span>
                </div>
              </div>

              {/* Status Row */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Doc Review</span>
                  <span className="font-bold text-slate-800 mt-1 block">
                    {selectedApp.documentReview?.status || 'pending'}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Payment Status</span>
                  <span className="font-bold text-slate-800 mt-1 block">{selectedApp.payment?.status || 'unpaid'}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Final Admission</span>
                  <span className="font-bold text-slate-800 mt-1 block">
                    {selectedApp.finalAdmission?.status || 'pending'}
                  </span>
                </div>
              </div>

              {/* Staff Assignment */}
              <div className="p-4 rounded-xl border border-brand-100 bg-brand-50/30">
                <span className="text-xs font-bold text-brand-950 block mb-1.5">Assigned Staff Reviewer</span>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedApp.assignedStaff?.staffId || ''}
                    onChange={(e) => handleAssignStaff(selectedApp.applicationId, e.target.value)}
                    className="flex-1 text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Unassigned (Open for all staff)</option>
                    {staffList.map((st) => (
                      <option key={st._id || st.id} value={st._id || st.id}>
                        {st.name} — {st.designation || 'Staff'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
