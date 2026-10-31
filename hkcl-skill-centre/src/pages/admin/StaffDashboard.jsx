import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FileCheck,
  CreditCard,
  History,
  User,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  AlertTriangle,
  GraduationCap,
  Eye,
  Filter,
} from 'lucide-react';
import Seo from '../../components/Seo.jsx';
import PortalLayout from '../../components/portal/PortalLayout.jsx';
import StatCard from '../../components/portal/StatCard.jsx';
import StatusBadge from '../../components/portal/StatusBadge.jsx';
import SearchFilterBar from '../../components/portal/SearchFilterBar.jsx';
import DataTable from '../../components/portal/DataTable.jsx';
import ApplicationDetailModal from '../../components/portal/ApplicationDetailModal.jsx';
import {
  getStaffUser,
  isStaffAuthenticated,
  clearStaffSession,
  getStaffHeaders,
} from '../../utils/auth.js';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getStaffUser());
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Data states
  const [applications, setApplications] = useState([]);
  const [metrics, setMetrics] = useState({
    totalAssignedApplications: 0,
    newApplications: 0,
    underReview: 0,
    correctionsRequired: 0,
    documentsApproved: 0,
    paymentReviewPending: 0,
    admitted: 0,
  });
  const [activityLogs, setActivityLogs] = useState([]);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Selected application for detail modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  }, []);

  // Auth Guard: redirect to /staff/login if not logged in
  useEffect(() => {
    if (!isStaffAuthenticated()) {
      navigate('/staff/login', { replace: true });
    }
  }, [navigate]);

  // Fetch overview and application data from real backend APIs
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/staff/overview', {
        headers: getStaffHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        clearStaffSession();
        navigate('/staff/login', { replace: true });
        return;
      }

      const data = await res.json();
      if (data.success) {
        // Staff assigned workspace metrics
        const assignedList = data.assignedApplications || [];
        const allList = data.applications || [];

        // If staff member has assigned apps, default to assignedList, otherwise desk applications
        setApplications(assignedList.length > 0 ? assignedList : allList);

        if (data.myWorkspaceMetrics) {
          setMetrics(data.myWorkspaceMetrics);
        } else if (data.metrics) {
          setMetrics({
            totalAssignedApplications: data.assignedCount ?? assignedList.length,
            newApplications: data.metrics.underReview || 0,
            underReview: data.metrics.underReview || 0,
            correctionsRequired: data.metrics.correctionsRequired || 0,
            documentsApproved: data.metrics.documentsApproved || 0,
            paymentReviewPending: data.metrics.paymentSubmitted || 0,
            admitted: data.metrics.admitted || 0,
          });
        }
      }
    } catch (err) {
      console.warn('Staff workspace fetch notice:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out of the Staff Portal?')) {
      clearStaffSession();
      navigate('/staff/login');
    }
  };

  // ── REVIEW ACTIONS (Preserving existing endpoints and RBAC) ───────────────

  const handleApproveDocs = async (applicationId) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/staff/documents/approve', {
        method: 'POST',
        headers: getStaffHeaders(),
        body: JSON.stringify({ applicationId, notes: 'Documents verified and approved.' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Applicant documents approved successfully.');
        setIsDetailModalOpen(false);
        fetchData();
      } else {
        showToast(data.error || 'Failed to approve documents.', 'error');
      }
    } catch (err) {
      showToast('Network error while approving documents.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestCorrections = async (applicationId, explanation) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/staff/documents/request-corrections', {
        method: 'POST',
        headers: getStaffHeaders(),
        body: JSON.stringify({ applicationId, explanation }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Correction notice dispatched to applicant.');
        setIsDetailModalOpen(false);
        fetchData();
      } else {
        showToast(data.error || 'Failed to request corrections.', 'error');
      }
    } catch (err) {
      showToast('Network error while requesting corrections.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectDocs = async (applicationId, reason) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/staff/documents/reject', {
        method: 'POST',
        headers: getStaffHeaders(),
        body: JSON.stringify({ applicationId, reason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Application rejected.', 'error');
        setIsDetailModalOpen(false);
        fetchData();
      } else {
        showToast(data.error || 'Failed to reject application.', 'error');
      }
    } catch (err) {
      showToast('Network error while rejecting application.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyPayment = async (applicationId) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/staff/payments/verify', {
        method: 'POST',
        headers: getStaffHeaders(),
        body: JSON.stringify({ applicationId, verifierNotes: 'Verified via Staff Portal.' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Payment verified successfully. Receipt issued.');
        setIsDetailModalOpen(false);
        fetchData();
      } else {
        showToast(data.error || 'Payment verification failed.', 'error');
      }
    } catch (err) {
      showToast('Network error verifying payment.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async (applicationId, reason) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/staff/payments/reject', {
        method: 'POST',
        headers: getStaffHeaders(),
        body: JSON.stringify({ applicationId, reason: reason || 'Invalid payment proof.' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Payment rejected.', 'error');
        setIsDetailModalOpen(false);
        fetchData();
      } else {
        showToast(data.error || 'Payment rejection failed.', 'error');
      }
    } catch (err) {
      showToast('Network error rejecting payment.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinalAdmit = async (applicationId) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/staff/admission/admit', {
        method: 'POST',
        headers: getStaffHeaders(),
        body: JSON.stringify({ applicationId, batch: 'Morning Batch' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Student successfully admitted and enrolled!');
        setIsDetailModalOpen(false);
        fetchData();
      } else {
        showToast(data.error || 'Admission approval failed.', 'error');
      }
    } catch (err) {
      showToast('Network error admitting student.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered & Paginated Applications List
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
        (statusFilter === 'payment_submitted' && app.payment?.status === 'submitted');
    }

    if (activeTab === 'document_review') {
      return (
        matchesQuery &&
        matchesStatus &&
        (app.status === 'under_review' ||
          app.status === 'corrections_required' ||
          app.documentReview?.status === 'under_review' ||
          app.documentReview?.status === 'corrections_required')
      );
    }

    if (activeTab === 'payment_review') {
      return matchesQuery && matchesStatus && app.payment?.status === 'submitted';
    }

    return matchesQuery && matchesStatus;
  });

  const totalFiltered = filteredApplications.length;
  const paginatedApplications = filteredApplications.slice((page - 1) * pageSize, page * pageSize);

  // Table Columns Definition
  const appColumns = [
    {
      header: 'Application ID',
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
      header: 'Current Status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Fee Status',
      cell: (row) => (
        <span className="text-xs">
          {row.payment?.status === 'verified' || row.payment?.status === 'paid' ? (
            <span className="text-emerald-700 font-semibold">₹500 Paid</span>
          ) : row.payment?.status === 'submitted' ? (
            <span className="text-indigo-700 font-medium">Verification Pending</span>
          ) : (
            <span className="text-slate-500">Unpaid</span>
          )}
        </span>
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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#10284B] hover:bg-slate-50 hover:border-slate-300 transition shadow-xs"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Review</span>
        </button>
      ),
    },
  ];

  // Navigation Items for Staff Sidebar (Part 3.A)
  const navItems = [
    { id: 'overview', label: 'My Workspace', icon: LayoutDashboard },
    {
      id: 'my_applications',
      label: 'My Applications',
      icon: FileText,
      count: metrics.totalAssignedApplications,
    },
    {
      id: 'document_review',
      label: 'Document Review',
      icon: FileCheck,
      count: metrics.underReview,
    },
    {
      id: 'payment_review',
      label: 'Payment Review',
      icon: CreditCard,
      count: metrics.paymentReviewPending,
    },
    { id: 'activity_history', label: 'Activity History', icon: History },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <>
      <Seo
        title="Staff Workspace • HKCL Skill Centre"
        description="Authorised staff portal for admission verification and document reviews."
        path="/staff/dashboard"
        noindex={true}
      />

      <PortalLayout
        portalType="staff"
        portalTitle="Staff Portal"
        navItems={navItems}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setPage(1);
        }}
        user={currentUser}
        onSignOut={handleSignOut}
        globalSearch={searchQuery}
        onGlobalSearchChange={setSearchQuery}
        headerAction={
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            title="Refresh application data"
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#10284B]' : ''}`} />
          </button>
        }
      >
        {/* Toast Alert */}
        {toast.show && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
            <div
              className={`flex items-center gap-3 px-4.5 py-3 rounded-xl shadow-xl text-xs font-semibold text-white ${
                toast.type === 'error' ? 'bg-rose-900 border border-rose-700' : 'bg-[#10284B] border border-[#17365D]'
              }`}
            >
              {toast.type === 'error' ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: STAFF OVERVIEW / MY WORKSPACE (Part 3.C)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Page Title & Subtitle */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                My Workspace
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#718096]">
                Manage and review your assigned admission applications.
              </p>
            </div>

            {/* Statistic Cards (6 Key Values as requested in Part 3.C) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <StatCard
                title="Total Assigned"
                value={metrics.totalAssignedApplications}
                subtitle="Active in desk"
                icon={FileText}
                iconBg="bg-blue-50"
                iconColor="text-blue-700"
                onClick={() => {
                  setActiveTab('my_applications');
                  setStatusFilter('all');
                }}
              />
              <StatCard
                title="New Apps"
                value={metrics.newApplications}
                subtitle="Awaiting start"
                icon={Clock}
                iconBg="bg-sky-50"
                iconColor="text-sky-700"
                onClick={() => {
                  setActiveTab('my_applications');
                  setStatusFilter('under_review');
                }}
              />
              <StatCard
                title="Under Review"
                value={metrics.underReview}
                subtitle="Verification pending"
                icon={AlertTriangle}
                iconBg="bg-amber-50"
                iconColor="text-amber-700"
                onClick={() => {
                  setActiveTab('document_review');
                  setStatusFilter('under_review');
                }}
              />
              <StatCard
                title="Corrections"
                value={metrics.correctionsRequired}
                subtitle="Waiting student fix"
                icon={AlertCircle}
                iconBg="bg-rose-50"
                iconColor="text-rose-700"
                onClick={() => {
                  setActiveTab('my_applications');
                  setStatusFilter('corrections_required');
                }}
              />
              <StatCard
                title="Docs Approved"
                value={metrics.documentsApproved}
                subtitle="Ready for payment"
                icon={FileCheck}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-700"
                onClick={() => {
                  setActiveTab('my_applications');
                  setStatusFilter('documents_approved');
                }}
              />
              <StatCard
                title="Payment Review"
                value={metrics.paymentReviewPending}
                subtitle="UPI proof submitted"
                icon={CreditCard}
                iconBg="bg-indigo-50"
                iconColor="text-indigo-700"
                onClick={() => {
                  setActiveTab('payment_review');
                  setStatusFilter('payment_submitted');
                }}
              />
            </div>

            {/* Quick Applications Queue */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#172033]">
                  Assigned Applications Queue
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('my_applications')}
                  className="text-xs font-semibold text-[#10284B] hover:underline"
                >
                  View All ({applications.length})
                </button>
              </div>

              <DataTable
                columns={appColumns}
                data={paginatedApplications.slice(0, 5)}
                loading={loading}
                emptyMessage="No applications currently assigned to your staff account."
              />
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: MY APPLICATIONS TABLE (Part 3.D)
           ═══════════════════════════════════════════════════════════════════ */}
        {(activeTab === 'my_applications' ||
          activeTab === 'document_review' ||
          activeTab === 'payment_review') && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                {activeTab === 'document_review'
                  ? 'Document Review Desk'
                  : activeTab === 'payment_review'
                  ? 'Payment Review Queue'
                  : 'My Assigned Applications'}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#718096]">
                {activeTab === 'document_review'
                  ? 'Review candidate marksheets, photos, ID proof, and signature submissions.'
                  : activeTab === 'payment_review'
                  ? 'Inspect ₹500 fee transaction receipts and confirm payments.'
                  : 'Complete registry of all candidate admission files assigned to your desk.'}
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
                { value: 'admitted', label: 'Admitted' },
              ]}
              placeholder="Search by student name, ID or course..."
            />

            {/* Data Table */}
            <DataTable
              columns={appColumns}
              data={paginatedApplications}
              loading={loading}
              emptyMessage="No applications found matching the selected filters."
              pagination={{
                total: totalFiltered,
                page,
                limit: pageSize,
                totalPages: Math.ceil(totalFiltered / pageSize) || 1,
              }}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3: ACTIVITY HISTORY (Part 3.A)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'activity_history' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                Activity History
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#718096]">
                Immutable timeline of all document reviews, notes, and decisions performed by your account.
              </p>
            </div>

            <DataTable
              columns={[
                {
                  header: 'Action',
                  cell: (row) => (
                    <span className="font-semibold text-xs text-[#172033] capitalize">
                      {row.action?.replace(/_/g, ' ')}
                    </span>
                  ),
                },
                {
                  header: 'Application / Record',
                  cell: (row) => (
                    <span className="font-mono text-xs text-[#10284B]">
                      {row.targetId || 'General'}
                    </span>
                  ),
                },
                {
                  header: 'Description',
                  cell: (row) => (
                    <span className="text-xs text-[#718096]">
                      {row.description || 'System record update.'}
                    </span>
                  ),
                },
                {
                  header: 'Date & Time',
                  cell: (row) => (
                    <span className="text-xs text-slate-500">
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : 'Recent'}
                    </span>
                  ),
                },
              ]}
              data={activityLogs}
              loading={loading}
              emptyMessage="No recent activity entries recorded."
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 4: STAFF PROFILE / ACCOUNT (Part 3.F)
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                Staff Profile &amp; Account
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#718096]">
                Authorized admissions desk officer details and center credentials.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5EAF1] shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="h-14 w-14 rounded-full bg-[#10284B] text-white flex items-center justify-center text-lg font-bold">
                  {(currentUser?.name || 'S')[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172033]">
                    {currentUser?.name || 'Staff Officer'}
                  </h3>
                  <p className="text-xs text-[#718096]">
                    {currentUser?.designation || 'Admissions Review Officer'}
                  </p>
                  <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Account
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <span className="text-[#718096] block">Registered Gmail</span>
                  <span className="font-semibold text-[#172033] block mt-0.5">
                    {currentUser?.email || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[#718096] block">Institutional Role</span>
                  <span className="font-semibold text-[#172033] block mt-0.5 capitalize">
                    {currentUser?.role || 'Staff'}
                  </span>
                </div>
                <div>
                  <span className="text-[#718096] block">Assigned Applications</span>
                  <span className="font-semibold text-[#172033] block mt-0.5">
                    {metrics.totalAssignedApplications} Candidates
                  </span>
                </div>
                <div>
                  <span className="text-[#718096] block">Centre Location</span>
                  <span className="font-semibold text-[#172033] block mt-0.5">
                    HKCL Skill Centre • Barnala Road, Sirsa
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Detail Modal (Part 3.E) */}
        <ApplicationDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedApp(null);
          }}
          app={selectedApp}
          portalType="staff"
          onApproveDocs={handleApproveDocs}
          onRequestCorrections={handleRequestCorrections}
          onRejectDocs={handleRejectDocs}
          onVerifyPayment={handleVerifyPayment}
          onRejectPayment={handleRejectPayment}
          onFinalAdmit={handleFinalAdmit}
          loading={actionLoading}
        />
      </PortalLayout>
    </>
  );
}
