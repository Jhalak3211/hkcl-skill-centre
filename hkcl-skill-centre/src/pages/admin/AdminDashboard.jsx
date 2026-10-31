import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Megaphone,
  CreditCard,
  GraduationCap,
  History,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  UserX,
  Mail,
  Copy,
  Trash2,
  Edit,
  Eye,
  Download,
  Calendar,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Sparkles,
  X,
} from 'lucide-react';
import Seo from '../../components/Seo.jsx';
import PortalLayout from '../../components/portal/PortalLayout.jsx';
import StatCard from '../../components/portal/StatCard.jsx';
import StatusBadge from '../../components/portal/StatusBadge.jsx';
import SearchFilterBar from '../../components/portal/SearchFilterBar.jsx';
import DataTable from '../../components/portal/DataTable.jsx';
import Modal from '../../components/portal/Modal.jsx';
import ApplicationDetailModal from '../../components/portal/ApplicationDetailModal.jsx';
import {
  getAdminUser,
  isAdminAuthenticated,
  clearAdminSession,
  getAdminHeaders,
} from '../../utils/auth.js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentAdmin, setCurrentAdmin] = useState(() => getAdminUser());
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // ── DATA STATES ──────────────────────────────────────────────────────────
  const [overview, setOverview] = useState({
    statistics: {
      totalApplications: 0,
      underReview: 0,
      documentsApproved: 0,
      paymentsSubmitted: 0,
      activeStaff: 0,
      pendingStaffInvitations: 0,
      correctionsRequired: 0,
      admittedStudents: 0,
    },
    recentApplications: [],
    activityLogs: [],
  });

  const [applications, setApplications] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [adsList, setAdsList] = useState([]);
  const [logsList, setLogsList] = useState([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [staffFilter, setStaffFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: 'Admissions Officer',
    canReviewDocuments: true,
    canVerifyPayments: true,
    canProcessAdmissions: true,
  });

  const [showAdModal, setShowAdModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [adForm, setAdForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    ctaText: 'Apply Now',
    ctaUrl: '/admission/personal-details',
    badge: 'Admission Open',
    order: 0,
    displayOrder: 0,
    status: 'published',
  });

  const AD_PRESET_IMAGES = [
    {
      name: 'Computer Lab & Coding',
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Classroom & Training',
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Career & Certification',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleAdImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size exceeds 5MB limit. Please compress or select a smaller image.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setAdForm((prev) => ({ ...prev, imageUrl: loadEvent.target.result }));
      showToast('Banner image uploaded successfully!');
    };
    reader.onerror = () => {
      showToast('Failed to read image file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const [paymentActionModal, setPaymentActionModal] = useState(null);
  const [paymentNotes, setPaymentNotes] = useState('');

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4500);
  }, []);

  // Auth Guard: redirect to /admin/login if not logged in
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  // ── DATA FETCHERS ────────────────────────────────────────────────────────
  const fetchOverview = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/overview', {
        credentials: 'include',
        headers: getAdminHeaders(),
      });
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
      const res = await fetch('/api/staff/overview', {
        credentials: 'include',
        headers: getAdminHeaders(),
      });
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
      const res = await fetch('/api/admin/staff', {
        credentials: 'include',
        headers: getAdminHeaders(),
      });
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
      const res = await fetch('/api/admin/advertisements', {
        credentials: 'include',
        headers: getAdminHeaders(),
      });
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
      const res = await fetch('/api/admin/activity-logs?limit=100', {
        credentials: 'include',
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setLogsList(data.logs || []);
      }
    } catch (err) {
      console.warn('Logs fetch error:', err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchOverview(), fetchApplications(), fetchStaff(), fetchAds(), fetchLogs()]);
    setLoading(false);
  }, [fetchOverview, fetchApplications, fetchStaff, fetchAds, fetchLogs]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out of the Administrator Portal?')) {
      clearAdminSession();
      navigate('/admin/login');
    }
  };

  // ── ADMINISTRATIVE ACTIONS ───────────────────────────────────────────────

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

  // Staff Invite Handler (Nodemailer Gmail SMTP)
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

  // Toggle Staff Status (Active / Deactivated)
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

  // Save Advertisement
  const handleSaveAd = async (e) => {
    e.preventDefault();
    if (!adForm.title.trim()) {
      showToast('Campaign title is required.', 'error');
      return;
    }
    if (!adForm.imageUrl.trim()) {
      showToast('Please upload a banner image or enter an image URL.', 'error');
      return;
    }

    setLoading(true);
    try {
      const isEdit = Boolean(editingAd);
      const url = isEdit ? `/api/admin/advertisements/${editingAd._id || editingAd.id}` : '/api/admin/advertisements';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        title: adForm.title.trim(),
        description: (adForm.description || '').trim(),
        imageUrl: adForm.imageUrl.trim(),
        ctaText: (adForm.ctaText || 'Learn More').trim(),
        ctaUrl: (adForm.ctaUrl || '/admission/personal-details').trim(),
        badge: (adForm.badge || 'Admission Open').trim(),
        status: adForm.status || 'published',
        displayOrder: Number(adForm.displayOrder ?? adForm.order) || 0,
      };

      const res = await fetch(url, {
        method,
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.status === 401 || res.status === 403) {
        showToast('Your administrator session has expired. Please sign in again.', 'error');
        clearAdminSession();
        navigate('/admin/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        showToast(data.message || (isEdit ? 'Advertisement updated.' : 'Advertisement created successfully.'));
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
      showToast('No admitted students available to export.', 'error');
      return;
    }
    const headers = 'Application ID,Student ID,Full Name,Email,Phone,Course,Admitted Batch,Enrollment No,Admission Date\n';
    const rows = admittedList
      .map((a) => {
        const c = a.personalSnapshot || a.personal || {};
        return `"${a.applicationId}","${a.studentId}","${c.fullName || ''}","${c.email || ''}","${c.phone || ''}","${a.course?.name || ''}","${a.finalAdmission?.admittedBatch || 'Morning Batch'}","${a.finalAdmission?.enrollmentNo || 'HKCL-ADM-' + a.applicationId}","${a.finalAdmission?.decisionAt ? new Date(a.finalAdmission.decisionAt).toLocaleDateString() : new Date().toLocaleDateString()}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HKCL_Admitted_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Admitted students CSV report downloaded successfully.');
  };

  // ── FILTERED DATA LISTS ──────────────────────────────────────────────────

  const filteredApplications = applications.filter((app) => {
    const q = searchQuery.toLowerCase().trim();
    const candidateName = (app.personalSnapshot?.fullName || app.personal?.fullName || '').toLowerCase();
    const appId = (app.applicationId || '').toLowerCase();
    const studentId = (app.studentId || '').toLowerCase();
    const courseName = (app.course?.name || '').toLowerCase();

    const matchesQuery = !q || candidateName.includes(q) || appId.includes(q) || studentId.includes(q) || courseName.includes(q);

    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus =
        app.status === statusFilter ||
        app.documentReview?.status === statusFilter ||
        (statusFilter === 'payment_submitted' && app.payment?.status === 'submitted') ||
        (statusFilter === 'payment_verified' && (app.payment?.status === 'verified' || app.payment?.status === 'paid'));
    }

    let matchesStaff = true;
    if (staffFilter !== 'all') {
      if (staffFilter === 'unassigned') {
        matchesStaff = !app.assignedStaff?.staffId;
      } else {
        matchesStaff = String(app.assignedStaff?.staffId) === staffFilter;
      }
    }

    return matchesQuery && matchesStatus && matchesStaff;
  });

  const totalFilteredApps = filteredApplications.length;
  const paginatedApps = filteredApplications.slice((page - 1) * pageSize, page * pageSize);

  // Fee payments queue
  const paymentQueue = applications.filter(
    (a) => a.payment?.status === 'submitted' || a.payment?.status === 'verified' || a.payment?.status === 'paid'
  );

  // Admitted students list
  const admittedStudents = applications.filter(
    (a) => a.status === 'admitted' || a.finalAdmission?.status === 'admitted'
  );

  // Navigation Items for Admin Sidebar (Part 2.A)
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'applications',
      label: 'Applications',
      icon: FileText,
      count: overview.statistics.totalApplications || applications.length,
    },
    {
      id: 'staff',
      label: 'Staff Team',
      icon: Users,
      count: overview.statistics.activeStaff || staffList.filter((s) => s.status === 'active').length,
    },
    { id: 'ads', label: 'Advertisements', icon: Megaphone, count: adsList.length },
    {
      id: 'payments',
      label: 'Fee Payments',
      icon: CreditCard,
      count: overview.statistics.paymentsSubmitted || paymentQueue.filter((p) => p.payment?.status === 'submitted').length,
    },
    {
      id: 'admissions',
      label: 'Admissions',
      icon: GraduationCap,
      count: overview.statistics.admittedStudents || admittedStudents.length,
    },
    { id: 'logs', label: 'Activity Logs', icon: History },
  ];

  return (
    <>
      <Seo
        title="Admin Portal • HKCL Skill Centre"
        description="Comprehensive administration dashboard for admissions, staff management, and portal control."
        path="/admin/login"
        noindex={true}
      />

      <PortalLayout
        portalType="admin"
        portalTitle="Admin Portal"
        navItems={navItems}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setPage(1);
        }}
        user={currentAdmin}
        onSignOut={handleSignOut}
        globalSearch={searchQuery}
        onGlobalSearchChange={setSearchQuery}
        headerAction={
          <button
            type="button"
            onClick={refreshAll}
            disabled={loading}
            title="Refresh database records"
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#10284B]' : ''}`} />
          </button>
        }
      >
        {/* Global Toast Alert */}
        {toast.show && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
            <div
              className={`flex items-center gap-3 px-4.5 py-3 rounded-xl shadow-xl text-xs font-semibold text-white ${
                toast.type === 'error' ? 'bg-rose-900 border border-rose-700' : 'bg-[#10284B] border border-[#17365D]'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertCircle className="h-4 w-4 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: SYSTEM OVERVIEW (Part 2.C & 2.D)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Page Title & Subtitle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                  System Overview
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#718096]">
                  Key statistics and recent activity across the admission system.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInviteResult(null);
                  setShowInviteModal(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#10284B] text-white text-xs font-semibold hover:bg-[#0c1f3a] transition shadow-xs shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Invite Staff Member</span>
              </button>
            </div>

            {/* 8 Statistic Cards Grid (Part 2.C) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <StatCard
                title="Total Applications"
                value={overview.statistics.totalApplications}
                subtitle="All submitted candidates"
                icon={FileText}
                iconBg="bg-blue-50"
                iconColor="text-blue-700"
                onClick={() => {
                  setActiveTab('applications');
                  setStatusFilter('all');
                }}
              />
              <StatCard
                title="Under Review"
                value={overview.statistics.underReview}
                subtitle="Verification pending"
                icon={Clock}
                iconBg="bg-amber-50"
                iconColor="text-amber-700"
                onClick={() => {
                  setActiveTab('applications');
                  setStatusFilter('under_review');
                }}
              />
              <StatCard
                title="Documents Approved"
                value={overview.statistics.documentsApproved}
                subtitle="Ready for fee payment"
                icon={CheckCircle2}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-700"
                onClick={() => {
                  setActiveTab('applications');
                  setStatusFilter('documents_approved');
                }}
              />
              <StatCard
                title="Payments Submitted"
                value={overview.statistics.paymentsSubmitted}
                subtitle="₹500 UPI proofs awaiting review"
                icon={CreditCard}
                iconBg="bg-indigo-50"
                iconColor="text-indigo-700"
                onClick={() => setActiveTab('payments')}
              />
              <StatCard
                title="Active Staff"
                value={overview.statistics.activeStaff}
                subtitle="Admissions officers active"
                icon={UserCheck}
                iconBg="bg-teal-50"
                iconColor="text-teal-700"
                onClick={() => setActiveTab('staff')}
              />
              <StatCard
                title="Pending Staff Invites"
                value={overview.statistics.pendingStaffInvitations}
                subtitle="Awaiting password setup"
                icon={Mail}
                iconBg="bg-slate-100"
                iconColor="text-slate-700"
                onClick={() => setActiveTab('staff')}
              />
              <StatCard
                title="Corrections Required"
                value={overview.statistics.correctionsRequired}
                subtitle="Returned to student"
                icon={AlertCircle}
                iconBg="bg-rose-50"
                iconColor="text-rose-700"
                onClick={() => {
                  setActiveTab('applications');
                  setStatusFilter('corrections_required');
                }}
              />
              <StatCard
                title="Admitted Students"
                value={overview.statistics.admittedStudents}
                subtitle="Fully enrolled with batch"
                icon={GraduationCap}
                iconBg="bg-green-50"
                iconColor="text-green-800"
                onClick={() => setActiveTab('admissions')}
              />
            </div>

            {/* Recent Activity Sections (Part 2.D) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Recent Applications */}
              <div className="bg-white rounded-xl border border-[#E5EAF1] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#172033]">
                    Recent Applications
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('applications')}
                    className="text-xs font-semibold text-[#10284B] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {(overview.recentApplications || applications.slice(0, 5)).map((app) => (
                    <div
                      key={app.applicationId}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-[#172033] block truncate">
                          {app.personalSnapshot?.fullName || app.personal?.fullName || 'Applicant'}
                        </span>
                        <span className="text-[11px] text-[#718096] font-mono">
                          {app.applicationId} • {app.course?.name || 'Course'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={app.status} size="xs" />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApp(app);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-[#10284B] hover:bg-slate-50"
                          title="View application details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!overview.recentApplications || overview.recentApplications.length === 0) &&
                    applications.length === 0 && (
                      <p className="text-xs text-[#718096] py-4 text-center">
                        No applications recorded yet.
                      </p>
                    )}
                </div>
              </div>

              {/* Staff Activity Trail */}
              <div className="bg-white rounded-xl border border-[#E5EAF1] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#172033]">
                    Staff Activity Trail
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('logs')}
                    className="text-xs font-semibold text-[#10284B] hover:underline"
                  >
                    View Full Trail
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {(overview.activityLogs || logsList.slice(0, 5)).map((log, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-[#718096]">
                        <span className="font-semibold text-[#172033] capitalize">
                          {log.performedBy?.name || 'Staff Member'}
                        </span>
                        <span>{log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      </div>
                      <p className="text-[#718096] mt-0.5 truncate">{log.description}</p>
                    </div>
                  ))}
                  {(!overview.activityLogs || overview.activityLogs.length === 0) &&
                    logsList.length === 0 && (
                      <p className="text-xs text-[#718096] py-4 text-center">
                        No recent activity logged.
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: APPLICATIONS MANAGEMENT (Part 2.E)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'applications' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                Applications Directory
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#718096]">
                Manage submitted applicant dossiers, reassign staff officers, and monitor verification status.
              </p>
            </div>

            {/* Search and Filters */}
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                setPage(1);
              }}
              statusFilter={statusFilter}
              onStatusChange={(s) => {
                setStatusFilter(s);
                setPage(1);
              }}
              statusOptions={[
                { value: 'all', label: 'All Statuses' },
                { value: 'under_review', label: 'Under Review' },
                { value: 'corrections_required', label: 'Corrections Required' },
                { value: 'documents_approved', label: 'Documents Approved' },
                { value: 'payment_submitted', label: 'Payment Review' },
                { value: 'payment_verified', label: 'Fee Verified' },
                { value: 'admitted', label: 'Admitted' },
              ]}
              placeholder="Search by student name, application ID or course..."
            >
              {/* Staff Assignment Filter */}
              <select
                value={staffFilter}
                onChange={(e) => {
                  setStaffFilter(e.target.value);
                  setPage(1);
                }}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-[#172033] font-medium focus:outline-none focus:border-[#10284B] cursor-pointer"
              >
                <option value="all">All Staff Assignments</option>
                <option value="unassigned">Unassigned Only</option>
                {staffList.map((s) => (
                  <option key={s._id || s.id} value={String(s._id || s.id)}>
                    {s.name}
                  </option>
                ))}
              </select>
            </SearchFilterBar>

            {/* Applications Table */}
            <DataTable
              columns={[
                {
                  header: 'App ID',
                  cell: (row) => (
                    <div>
                      <span className="font-mono font-bold text-[#10284B] block leading-tight">
                        {row.applicationId}
                      </span>
                      <span className="text-[11px] font-mono text-[#718096]">
                        {row.studentId}
                      </span>
                    </div>
                  ),
                },
                {
                  header: 'Student Name',
                  cell: (row) => (
                    <div>
                      <span className="font-semibold text-[#172033] block">
                        {row.personalSnapshot?.fullName || row.personal?.fullName || 'Applicant'}
                      </span>
                      <span className="text-[11px] text-[#718096]">
                        {row.personalSnapshot?.phone || row.personal?.phone || '—'}
                      </span>
                    </div>
                  ),
                },
                {
                  header: 'Course',
                  cell: (row) => (
                    <span className="text-xs font-medium text-slate-700">
                      {row.course?.name || 'Vocational Course'}
                    </span>
                  ),
                },
                {
                  header: 'Submission Date',
                  cell: (row) => (
                    <span className="text-xs text-[#718096]">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  ),
                },
                {
                  header: 'Status',
                  cell: (row) => <StatusBadge status={row.status} />,
                },
                {
                  header: 'Assigned Staff',
                  cell: (row) => (
                    <div className="flex items-center gap-1.5">
                      <select
                        value={row.assignedStaff?.staffId || ''}
                        onChange={(e) => handleAssignStaff(row.applicationId, e.target.value)}
                        className="h-8 px-2 rounded-md border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#10284B]"
                      >
                        <option value="">Unassigned</option>
                        {staffList
                          .filter((s) => s.status === 'active')
                          .map((s) => (
                            <option key={s._id || s.id} value={s._id || s.id}>
                              {s.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  ),
                },
                {
                  header: 'Actions',
                  cell: (row) => (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedApp(row);
                        setIsDetailModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#10284B] hover:bg-slate-50 transition"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Details</span>
                    </button>
                  ),
                },
              ]}
              data={paginatedApps}
              loading={loading}
              emptyMessage="No applications found matching the selected criteria."
              pagination={{
                total: totalFilteredApps,
                page,
                limit: pageSize,
                totalPages: Math.ceil(totalFilteredApps / pageSize) || 1,
              }}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: STAFF MANAGEMENT (Part 2.F)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'staff' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                  Staff Directory
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#718096]">
                  Invite admissions officers, manage account permissions, and review assigned desk workload.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInviteResult(null);
                  setShowInviteModal(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#10284B] text-white text-xs font-semibold hover:bg-[#0c1f3a] transition shadow-xs shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Invite New Staff</span>
              </button>
            </div>

            {/* Staff Directory Table */}
            <DataTable
              columns={[
                {
                  header: 'Staff Member',
                  cell: (row) => (
                    <div>
                      <span className="font-semibold text-xs text-[#172033] block">
                        {row.name}
                      </span>
                      <span className="text-[11px] text-[#718096]">
                        {row.email}
                      </span>
                    </div>
                  ),
                },
                {
                  header: 'Designation',
                  cell: (row) => (
                    <span className="text-xs text-[#172033] font-medium">
                      {row.designation || 'Admissions Officer'}
                    </span>
                  ),
                },
                {
                  header: 'Account Status',
                  cell: (row) => <StatusBadge status={row.status} />,
                },
                {
                  header: 'Assigned Apps',
                  cell: (row) => {
                    const assignedCount = applications.filter(
                      (a) => String(a.assignedStaff?.staffId) === String(row._id || row.id)
                    ).length;
                    return (
                      <span className="text-xs font-semibold text-[#10284B]">
                        {assignedCount} Files
                      </span>
                    );
                  },
                },
                {
                  header: 'Invitation',
                  cell: (row) => (
                    <span className="text-xs text-[#718096]">
                      {row.status === 'pending' ? (
                        row.invitationExpires && new Date(row.invitationExpires) < new Date() ? (
                          <span className="text-rose-600 font-medium">Invite Expired</span>
                        ) : (
                          <span className="text-amber-600 font-medium">Invite Pending</span>
                        )
                      ) : (
                        <span className="text-emerald-600 font-medium">Activated</span>
                      )}
                    </span>
                  ),
                },
                {
                  header: 'Actions',
                  cell: (row) => (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {row.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleResendInvite(row._id || row.id)}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
                            title="Resend invitation email and refresh token"
                          >
                            Resend
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRevokeInvite(row._id || row.id)}
                            className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-[11px] font-semibold text-rose-700"
                            title="Revoke and delete pending invite"
                          >
                            Revoke
                          </button>
                        </>
                      )}
                      {row.status !== 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleToggleStaffStatus(row)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                            row.status === 'active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {row.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </div>
                  ),
                },
              ]}
              data={staffList}
              loading={loading}
              emptyMessage="No staff accounts registered."
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4: ADVERTISEMENT MANAGEMENT (Part 2.G)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'ads' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                  Advertisement Banners
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#718096]">
                  Configure promotional campaign banners displayed to applicants and public visitors.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingAd(null);
                  setAdForm({
                    title: '',
                    description: '',
                    imageUrl: '',
                    ctaText: 'Apply Now',
                    ctaUrl: '/admission/personal-details',
                    badge: 'Admission Open',
                    order: 0,
                    status: 'published',
                  });
                  setShowAdModal(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#10284B] text-white text-xs font-semibold hover:bg-[#0c1f3a] transition shadow-xs shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Create Advertisement</span>
              </button>
            </div>

            {/* Ads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adsList.map((ad) => (
                <div
                  key={ad._id || ad.id}
                  className="bg-white rounded-xl border border-[#E5EAF1] shadow-xs overflow-hidden flex flex-col"
                >
                  {ad.imageUrl && (
                    <div className="h-36 bg-slate-100 overflow-hidden relative">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2">
                        <StatusBadge status={ad.status} size="xs" />
                      </span>
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#172033]">{ad.title}</h4>
                      <p className="text-xs text-[#718096] mt-1 line-clamp-2">{ad.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#10284B]">
                        CTA: {ad.ctaText}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAd(ad);
                            setAdForm({
                              title: ad.title || '',
                              description: ad.description || '',
                              imageUrl: ad.imageUrl || '',
                              ctaText: ad.ctaText || 'Apply Now',
                              ctaUrl: ad.ctaUrl || '/admission/personal-details',
                              badge: ad.badge || 'Admission Open',
                              order: ad.displayOrder ?? ad.order ?? 0,
                              displayOrder: ad.displayOrder ?? ad.order ?? 0,
                              status: ad.status || 'published',
                            });
                            setShowAdModal(true);
                          }}
                          className="p-1.5 rounded-md text-slate-500 hover:text-[#10284B] hover:bg-slate-100"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAd(ad._id || ad.id)}
                          className="p-1.5 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {adsList.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white rounded-xl border border-[#E5EAF1] p-6">
                  <p className="text-xs text-[#718096]">No advertisements created yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 5: FEE PAYMENTS QUEUE (Part 2.H)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'payments' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                Fee Payments Registry
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#718096]">
                Inspect candidate transaction UTR receipts, verify registration fees, and issue official admission receipts.
              </p>
            </div>

            <DataTable
              columns={[
                {
                  header: 'App ID',
                  cell: (row) => (
                    <span className="font-mono font-bold text-xs text-[#10284B]">
                      {row.applicationId}
                    </span>
                  ),
                },
                {
                  header: 'Student Name',
                  cell: (row) => (
                    <span className="font-semibold text-xs text-[#172033]">
                      {row.personalSnapshot?.fullName || row.personal?.fullName || 'Applicant'}
                    </span>
                  ),
                },
                {
                  header: 'Amount',
                  cell: (row) => (
                    <span className="font-bold text-xs text-emerald-700">
                      ₹{row.payment?.amount || 500}
                    </span>
                  ),
                },
                {
                  header: 'UTR / Transaction Ref',
                  cell: (row) => (
                    <span className="font-mono text-xs text-[#172033]">
                      {row.payment?.utr || row.payment?.transactionId || row.payment?.referenceId || 'N/A'}
                    </span>
                  ),
                },
                {
                  header: 'Status',
                  cell: (row) => <StatusBadge status={row.payment?.status || 'pending'} />,
                },
                {
                  header: 'Receipt',
                  cell: (row) =>
                    row.payment?.receiptUrl ? (
                      <a
                        href={row.payment.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#10284B] underline font-medium"
                      >
                        Preview
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">None</span>
                    ),
                },
                {
                  header: 'Actions',
                  cell: (row) =>
                    row.payment?.status === 'submitted' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPaymentActionModal({ app: row, action: 'verify' })}
                          className="px-2 py-1 rounded bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-semibold"
                        >
                          Verify
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentActionModal({ app: row, action: 'reject' })}
                          className="px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Complete</span>
                    ),
                },
              ]}
              data={paymentQueue}
              loading={loading}
              emptyMessage="No fee payments recorded in queue."
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 6: ADMISSIONS (Part 2.I)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'admissions' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                  Admitted Students Registry
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#718096]">
                  Active enrolled learners with allocated morning/evening batches and registration credentials.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#10284B] text-white text-xs font-semibold hover:bg-[#0c1f3a] transition shadow-xs shrink-0"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV Report</span>
              </button>
            </div>

            <DataTable
              columns={[
                {
                  header: 'Enrollment No',
                  cell: (row) => (
                    <span className="font-mono font-bold text-xs text-[#10284B]">
                      {row.finalAdmission?.enrollmentNo || 'HKCL-ADM-' + row.applicationId}
                    </span>
                  ),
                },
                {
                  header: 'Student Name',
                  cell: (row) => (
                    <div>
                      <span className="font-semibold text-xs text-[#172033] block">
                        {row.personalSnapshot?.fullName || row.personal?.fullName}
                      </span>
                      <span className="text-[11px] text-[#718096]">
                        {row.personalSnapshot?.email || row.personal?.email}
                      </span>
                    </div>
                  ),
                },
                {
                  header: 'Course Enrolled',
                  cell: (row) => (
                    <span className="text-xs font-medium text-slate-700">
                      {row.course?.name}
                    </span>
                  ),
                },
                {
                  header: 'Batch Allocated',
                  cell: (row) => (
                    <span className="text-xs font-medium text-[#10284B]">
                      {row.finalAdmission?.admittedBatch || 'Morning Batch'}
                    </span>
                  ),
                },
                {
                  header: 'Admission Date',
                  cell: (row) => (
                    <span className="text-xs text-[#718096]">
                      {row.finalAdmission?.decisionAt
                        ? new Date(row.finalAdmission.decisionAt).toLocaleDateString()
                        : new Date().toLocaleDateString()}
                    </span>
                  ),
                },
              ]}
              data={admittedStudents}
              loading={loading}
              emptyMessage="No candidates have completed admission enrollment yet."
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 7: ACTIVITY LOGS / AUDIT TRAIL (Part 2.J)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'logs' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                Activity Logs &amp; Audit Trail
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#718096]">
                Immutable record of administrative, review, payment verification, and security events.
              </p>
            </div>

            <DataTable
              columns={[
                {
                  header: 'User',
                  cell: (row) => (
                    <span className="font-semibold text-xs text-[#172033]">
                      {row.performedBy?.name || 'Administrator'}
                    </span>
                  ),
                },
                {
                  header: 'Role',
                  cell: (row) => (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize">
                      {row.performedBy?.role || 'admin'}
                    </span>
                  ),
                },
                {
                  header: 'Action',
                  cell: (row) => (
                    <span className="font-semibold text-xs text-[#10284B]">
                      {row.action}
                    </span>
                  ),
                },
                {
                  header: 'Related Record',
                  cell: (row) => (
                    <span className="font-mono text-xs text-[#718096]">
                      {row.targetId || 'Global'}
                    </span>
                  ),
                },
                {
                  header: 'Description',
                  cell: (row) => (
                    <span className="text-xs text-[#718096]">
                      {row.description}
                    </span>
                  ),
                },
                {
                  header: 'Timestamp',
                  cell: (row) => (
                    <span className="text-xs text-slate-500">
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : ''}
                    </span>
                  ),
                },
              ]}
              data={logsList}
              loading={loading}
              emptyMessage="No activity logs recorded."
            />
          </div>
        )}

        {/* ── MODALS ──────────────────────────────────────────────────────── */}

        {/* Application Detail Modal (Part 2.E) */}
        <ApplicationDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedApp(null);
          }}
          app={selectedApp}
          portalType="admin"
          staffList={staffList}
          onAssignStaff={handleAssignStaff}
          onApproveDocs={async (appId) => {
            await fetch('/api/staff/documents/approve', {
              method: 'POST',
              headers: getAdminHeaders(),
              body: JSON.stringify({ applicationId: appId, notes: 'Approved by Administrator.' }),
            });
            showToast('Documents approved.');
            setIsDetailModalOpen(false);
            fetchApplications();
          }}
          onRequestCorrections={async (appId, explanation) => {
            await fetch('/api/staff/documents/request-corrections', {
              method: 'POST',
              headers: getAdminHeaders(),
              body: JSON.stringify({ applicationId: appId, explanation }),
            });
            showToast('Corrections requested.');
            setIsDetailModalOpen(false);
            fetchApplications();
          }}
          onRejectDocs={async (appId, reason) => {
            await fetch('/api/staff/documents/reject', {
              method: 'POST',
              headers: getAdminHeaders(),
              body: JSON.stringify({ applicationId: appId, reason }),
            });
            showToast('Application rejected.', 'error');
            setIsDetailModalOpen(false);
            fetchApplications();
          }}
          onVerifyPayment={async (appId) => {
            await fetch('/api/staff/payments/verify', {
              method: 'POST',
              headers: getAdminHeaders(),
              body: JSON.stringify({ applicationId: appId, verifierNotes: 'Verified by Admin.' }),
            });
            showToast('Payment verified.');
            setIsDetailModalOpen(false);
            fetchApplications();
          }}
          onFinalAdmit={async (appId) => {
            await fetch('/api/staff/admission/admit', {
              method: 'POST',
              headers: getAdminHeaders(),
              body: JSON.stringify({ applicationId: appId, batch: 'Morning Batch' }),
            });
            showToast('Student enrolled successfully.');
            setIsDetailModalOpen(false);
            fetchApplications();
          }}
        />

        {/* Staff Invite Modal (Part 2.F) */}
        <Modal
          isOpen={showInviteModal}
          onClose={() => {
            setShowInviteModal(false);
            setInviteResult(null);
          }}
          title="Invite Admissions Staff Member"
          subtitle="Generate a single-use invitation token with automated Gmail SMTP delivery."
        >
          <form onSubmit={handleInviteStaff} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={inviteData.name}
                onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                placeholder="e.g. Suman Sharma"
                className="h-9 w-full px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#10284B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Gmail Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={inviteData.email}
                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                placeholder="staff@gmail.com"
                className="h-9 w-full px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#10284B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={inviteData.phone}
                onChange={(e) => setInviteData({ ...inviteData, phone: e.target.value })}
                placeholder="9876543210"
                className="h-9 w-full px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#10284B]"
              />
            </div>

            {/* Invite Result Banner (Nodemailer status + fallback direct URL) */}
            {inviteResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  inviteResult.emailSent
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {inviteResult.emailSent ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  )}
                  <span>{inviteResult.message}</span>
                </div>
                {inviteResult.invitationUrl && (
                  <div className="pt-1 flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={inviteResult.invitationUrl}
                      className="h-8 flex-1 px-2.5 rounded bg-white border border-slate-200 text-[11px] font-mono text-slate-700 select-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(inviteResult.invitationUrl);
                        showToast('Invitation link copied to clipboard.');
                      }}
                      className="h-8 px-2.5 rounded bg-[#10284B] text-white text-xs font-semibold hover:bg-[#0c1f3a]"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#10284B] text-white text-xs font-semibold hover:bg-[#0c1f3a] transition disabled:opacity-50"
              >
                {loading ? 'Dispatching...' : 'Dispatch Invitation'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Advertisement Create / Edit Modal (Part 2.G) */}
        <Modal
          isOpen={showAdModal}
          onClose={() => {
            setShowAdModal(false);
            setEditingAd(null);
          }}
          title={editingAd ? 'Edit Advertisement' : 'Create Advertisement'}
          subtitle="Configure promotional campaign banners displayed on the home page."
        >
          <form onSubmit={handleSaveAd} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Campaign Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={adForm.title}
                  onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                  placeholder="e.g. HS-CIT Winter Coding Batch 2026"
                  className="h-9 w-full px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#10284B]"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Badge / Tag
                </label>
                <input
                  type="text"
                  value={adForm.badge}
                  onChange={(e) => setAdForm({ ...adForm, badge: e.target.value })}
                  placeholder="e.g. Admission Open"
                  className="h-9 w-full px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#10284B]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={adForm.description}
                onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
                placeholder="Short explanatory marketing copy shown on the home page..."
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#10284B]"
              />
            </div>

            {/* Banner Image Selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Banner Image <span className="text-rose-500">*</span>
              </label>

              {adForm.imageUrl ? (
                <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-2.5 flex items-center gap-3">
                  <div className="h-16 w-28 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                    <img
                      src={adForm.imageUrl}
                      alt="Banner Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      Banner image selected
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {adForm.imageUrl.startsWith('data:')
                        ? 'Direct uploaded image file'
                        : adForm.imageUrl}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdForm({ ...adForm, imageUrl: '' })}
                    className="p-1.5 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 shrink-0"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {/* File Upload Trigger */}
                  <label className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-[#10284B] rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/70 hover:bg-slate-100/60 transition group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAdImageUpload}
                      className="hidden"
                    />
                    <Upload className="h-5 w-5 text-slate-400 group-hover:text-[#10284B] transition mb-1" />
                    <span className="font-semibold text-slate-700 text-xs">
                      Click to upload banner image file
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      PNG, JPG, WebP up to 5MB
                    </span>
                  </label>

                  {/* Direct URL alternative */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">Or URL:</span>
                    <input
                      type="text"
                      value={adForm.imageUrl}
                      onChange={(e) => setAdForm({ ...adForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="h-8 flex-1 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#10284B]"
                    />
                  </div>

                  {/* Preset Banner Images */}
                  <div className="pt-1">
                    <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                      Or pick from sample presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {AD_PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setAdForm({ ...adForm, imageUrl: preset.url })}
                          className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-[#10284B] hover:text-[#10284B] transition flex items-center gap-1"
                        >
                          <Sparkles className="h-3 w-3 text-amber-500" />
                          <span>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={adForm.ctaText}
                  onChange={(e) => setAdForm({ ...adForm, ctaText: e.target.value })}
                  placeholder="Apply Now"
                  className="h-9 w-full px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#10284B]"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Button Link</label>
                <input
                  type="text"
                  value={adForm.ctaUrl}
                  onChange={(e) => setAdForm({ ...adForm, ctaUrl: e.target.value })}
                  placeholder="/admission/personal-details"
                  className="h-9 w-full px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#10284B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={adForm.status}
                  onChange={(e) => setAdForm({ ...adForm, status: e.target.value })}
                  className="h-9 w-full px-3 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="published">Published (Visible on Home)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={adForm.displayOrder ?? adForm.order ?? 0}
                  onChange={(e) =>
                    setAdForm({
                      ...adForm,
                      displayOrder: parseInt(e.target.value, 10) || 0,
                      order: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="h-9 w-full px-3 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#10284B] text-white font-semibold hover:bg-[#0c1f3a] transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Advertisement'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Payment Decision Confirmation Modal */}
        <Modal
          isOpen={Boolean(paymentActionModal)}
          onClose={() => setPaymentActionModal(null)}
          title={paymentActionModal?.action === 'verify' ? 'Confirm Fee Verification' : 'Reject Payment'}
          subtitle={`Application ID: ${paymentActionModal?.app?.applicationId}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-700">
              {paymentActionModal?.action === 'verify'
                ? 'Are you sure you want to verify this ₹500 fee transaction? An official verified receipt will be generated.'
                : 'Please state the reason for rejecting this payment submission:'}
            </p>
            <textarea
              rows={2}
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="Optional notes or rejection explanation..."
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#10284B]"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPaymentActionModal(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePaymentDecision}
                className={`px-3.5 py-2 rounded-lg font-semibold text-white transition ${
                  paymentActionModal?.action === 'verify'
                    ? 'bg-teal-600 hover:bg-teal-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {paymentActionModal?.action === 'verify' ? 'Confirm Verification' : 'Reject Fee'}
              </button>
            </div>
          </div>
        </Modal>
      </PortalLayout>
    </>
  );
}
