import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  GraduationCap,
  FileText,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  ExternalLink,
  Users,
} from 'lucide-react';
import Modal from './Modal.jsx';
import StatusBadge from './StatusBadge.jsx';

export default function ApplicationDetailModal({
  isOpen,
  onClose,
  app,
  portalType = 'staff', // 'admin' | 'staff'
  staffList = [],
  onAssignStaff,
  onApproveDocs,
  onRequestCorrections,
  onRejectDocs,
  onVerifyPayment,
  onRejectPayment,
  onFinalAdmit,
  loading = false,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [correctionNote, setCorrectionNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [previewDocUrl, setPreviewDocUrl] = useState(null);

  if (!app) return null;

  const candidate = app.personalSnapshot || app.personal || {};
  const course = app.course || {};
  const education = app.education || {};
  const documents = app.documents || {};
  const payment = app.payment || {};
  const assigned = app.assignedStaff || {};
  const docReview = app.documentReview || {};
  const finalAdmission = app.finalAdmission || {};
  const history = docReview.history || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Application Details — ${app.applicationId}`}
      subtitle={`${course.name || 'Vocational Course'} • Registered: ${
        app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'
      }`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="bg-slate-50 border border-[#E5EAF1] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#10284B] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {(candidate.fullName || 'S')[0]?.toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#172033]">
                {candidate.fullName || 'Student Applicant'}
              </h4>
              <p className="text-xs text-[#718096]">
                Student ID: <span className="font-mono font-medium">{app.studentId}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={app.status} />
            {assigned.name && (
              <span className="text-xs bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>Assigned: {assigned.name}</span>
              </span>
            )}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="border-b border-[#E5EAF1] flex space-x-4 overflow-x-auto no-scrollbar text-xs font-semibold">
          {[
            { id: 'overview', label: 'Student Profile' },
            { id: 'academic', label: 'Academic Details' },
            { id: 'documents', label: 'Uploaded Documents' },
            { id: 'payment', label: 'Payment & Fee' },
            { id: 'timeline', label: 'History & Review' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 px-1 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#10284B] text-[#10284B]'
                  : 'border-transparent text-[#718096] hover:text-[#172033]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW / PERSONAL DETAILS */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div className="p-3 bg-slate-50/70 border border-[#E5EAF1] rounded-lg">
                <span className="text-[#718096] block font-medium">Full Legal Name</span>
                <span className="text-[#172033] font-semibold block mt-0.5">{candidate.fullName || '—'}</span>
              </div>
              <div className="p-3 bg-slate-50/70 border border-[#E5EAF1] rounded-lg">
                <span className="text-[#718096] block font-medium">Email Address</span>
                <span className="text-[#172033] font-semibold block mt-0.5">{candidate.email || '—'}</span>
              </div>
              <div className="p-3 bg-slate-50/70 border border-[#E5EAF1] rounded-lg">
                <span className="text-[#718096] block font-medium">Mobile Phone</span>
                <span className="text-[#172033] font-semibold block mt-0.5">{candidate.phone || '—'}</span>
              </div>
              <div className="p-3 bg-slate-50/70 border border-[#E5EAF1] rounded-lg">
                <span className="text-[#718096] block font-medium">Date of Birth</span>
                <span className="text-[#172033] font-semibold block mt-0.5">{candidate.dob || '—'}</span>
              </div>
              <div className="p-3 bg-slate-50/70 border border-[#E5EAF1] rounded-lg">
                <span className="text-[#718096] block font-medium">Gender</span>
                <span className="text-[#172033] font-semibold block mt-0.5 capitalize">{candidate.gender || '—'}</span>
              </div>
              <div className="p-3 bg-slate-50/70 border border-[#E5EAF1] rounded-lg">
                <span className="text-[#718096] block font-medium">Father's Name</span>
                <span className="text-[#172033] font-semibold block mt-0.5">{candidate.fatherName || '—'}</span>
              </div>
              <div className="p-3 bg-slate-50/70 border border-[#E5EAF1] rounded-lg">
                <span className="text-[#718096] block font-medium">Mother's Name</span>
                <span className="text-[#172033] font-semibold block mt-0.5">{candidate.motherName || '—'}</span>
              </div>
              <div className="p-3 bg-slate-50/70 border border-[#E5EAF1] rounded-lg sm:col-span-2">
                <span className="text-[#718096] block font-medium">Permanent Address</span>
                <span className="text-[#172033] font-semibold block mt-0.5">
                  {typeof candidate.address === 'object'
                    ? [
                        candidate.address.line1,
                        candidate.address.city,
                        candidate.address.district,
                        candidate.address.state,
                        candidate.address.pincode,
                      ]
                        .filter(Boolean)
                        .join(', ') || '—'
                    : candidate.address || '—'}
                </span>
              </div>
            </div>

            {/* Admin Assignment Section */}
            {portalType === 'admin' && staffList.length > 0 && (
              <div className="mt-4 p-4 bg-slate-50 border border-[#E5EAF1] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold text-[#172033]">Staff Assignment</h5>
                  <p className="text-[11px] text-[#718096]">
                    Currently assigned to: <span className="font-semibold text-[#172033]">{assigned.name || 'Unassigned'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedStaffId || assigned.staffId || ''}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-slate-200 text-xs text-[#172033] bg-white focus:outline-none focus:border-[#10284B]"
                  >
                    <option value="">Select Staff Member</option>
                    {staffList
                      .filter((s) => s.status === 'active')
                      .map((s) => (
                        <option key={s._id || s.id} value={s._id || s.id}>
                          {s.name} ({s.designation || 'Staff'})
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    disabled={loading || !selectedStaffId}
                    onClick={() => onAssignStaff && onAssignStaff(app.applicationId, selectedStaffId)}
                    className="h-9 px-3.5 rounded-lg bg-[#10284B] text-white text-xs font-semibold hover:bg-[#0c1f3a] transition disabled:opacity-50"
                  >
                    Assign
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACADEMIC DETAILS */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Secondary (10th) */}
              <div className="p-4 bg-slate-50/70 border border-[#E5EAF1] rounded-xl">
                <h5 className="font-bold text-[#172033] mb-2 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-[#10284B]" />
                  <span>Class 10th / Matriculation</span>
                </h5>
                <div className="space-y-1.5 text-[#718096]">
                  <p>Board: <span className="font-medium text-[#172033]">{education.secondary?.board || '—'}</span></p>
                  <p>Year of Passing: <span className="font-medium text-[#172033]">{education.secondary?.passingYear || '—'}</span></p>
                  <p>Roll No: <span className="font-medium text-[#172033]">{education.secondary?.rollNo || '—'}</span></p>
                  <p>Marks / Percentage: <span className="font-medium text-[#172033]">{education.secondary?.percentage ? `${education.secondary.percentage}%` : '—'}</span></p>
                </div>
              </div>

              {/* Senior Secondary (12th) */}
              <div className="p-4 bg-slate-50/70 border border-[#E5EAF1] rounded-xl">
                <h5 className="font-bold text-[#172033] mb-2 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-[#10284B]" />
                  <span>Class 12th / Intermediate</span>
                </h5>
                <div className="space-y-1.5 text-[#718096]">
                  <p>Board: <span className="font-medium text-[#172033]">{education.seniorSecondary?.board || '—'}</span></p>
                  <p>Year of Passing: <span className="font-medium text-[#172033]">{education.seniorSecondary?.passingYear || '—'}</span></p>
                  <p>Stream: <span className="font-medium text-[#172033]">{education.seniorSecondary?.stream || '—'}</span></p>
                  <p>Marks / Percentage: <span className="font-medium text-[#172033]">{education.seniorSecondary?.percentage ? `${education.seniorSecondary.percentage}%` : '—'}</span></p>
                </div>
              </div>

              {/* Graduation / Higher Qualification */}
              {education.graduation && (
                <div className="p-4 bg-slate-50/70 border border-[#E5EAF1] rounded-xl sm:col-span-2">
                  <h5 className="font-bold text-[#172033] mb-2 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-[#10284B]" />
                    <span>Graduation / Higher Studies</span>
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#718096]">
                    <p>Degree: <span className="font-medium text-[#172033] block">{education.graduation.degree || '—'}</span></p>
                    <p>University: <span className="font-medium text-[#172033] block">{education.graduation.university || '—'}</span></p>
                    <p>Year: <span className="font-medium text-[#172033] block">{education.graduation.passingYear || '—'}</span></p>
                    <p>Percentage: <span className="font-medium text-[#172033] block">{education.graduation.percentage || '—'}</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: UPLOADED DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'passportPhoto', label: 'Applicant Photograph', file: documents.photo || documents.passportPhoto },
                { key: 'signature', label: 'Specimen Signature', file: documents.signature },
                { key: 'class10Marksheet', label: '10th Marksheet Proof', file: documents.marksheet10 || documents.class10Marksheet },
                { key: 'class12Marksheet', label: '12th Marksheet Proof', file: documents.marksheet12 || documents.class12Marksheet },
                { key: 'idProof', label: 'Government ID Proof', file: documents.idProof },
              ].map((doc, idx) => {
                const hasFile = Boolean(doc.file);
                const fileUrl = typeof doc.file === 'string' ? doc.file : doc.file?.url || doc.file?.data;
                return (
                  <div
                    key={idx}
                    className="p-3.5 border border-[#E5EAF1] rounded-xl bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-[#172033] block truncate">
                        {doc.label}
                      </span>
                      <span className="text-[11px] text-[#718096]">
                        {hasFile ? 'Uploaded and verified' : 'Document not attached'}
                      </span>
                    </div>

                    {hasFile ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewDocUrl(fileUrl)}
                          className="h-8 px-2.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition flex items-center gap-1 font-medium"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Missing
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Document Preview Box if requested */}
            {previewDocUrl && (
              <div className="mt-4 p-4 border border-[#E5EAF1] rounded-xl bg-slate-100 text-center">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-semibold text-[#172033]">Document Preview</span>
                  <button
                    type="button"
                    onClick={() => setPreviewDocUrl(null)}
                    className="text-slate-500 hover:text-slate-700 font-medium"
                  >
                    Close Preview
                  </button>
                </div>
                <div className="max-h-[300px] overflow-auto flex items-center justify-center bg-white p-2 rounded-lg border border-slate-200">
                  <img
                    src={previewDocUrl}
                    alt="Document Preview"
                    className="max-h-[280px] max-w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Document Verification Decision Box (Staff & Admin) */}
            <div className="mt-4 p-4 bg-white border border-[#E5EAF1] rounded-xl space-y-3">
              <h5 className="text-xs font-bold text-[#172033]">Document Review Decision</h5>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onApproveDocs && onApproveDocs(app.applicationId)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve Documents</span>
                </button>

                <button
                  type="button"
                  disabled={loading || !correctionNote}
                  onClick={() => {
                    if (onRequestCorrections) onRequestCorrections(app.applicationId, correctionNote);
                    setCorrectionNote('');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>Request Corrections</span>
                </button>

                <button
                  type="button"
                  disabled={loading || !rejectionReason}
                  onClick={() => {
                    if (onRejectDocs) onRejectDocs(app.applicationId, rejectionReason);
                    setRejectionReason('');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject Application</span>
                </button>
              </div>

              {/* Notes inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#718096] mb-1">
                    Correction Notice (required to request corrections)
                  </label>
                  <input
                    type="text"
                    value={correctionNote}
                    onChange={(e) => setCorrectionNote(e.target.value)}
                    placeholder="e.g. Please re-upload clearer 10th marksheet proof..."
                    className="h-9 w-full px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#10284B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#718096] mb-1">
                    Rejection Reason (required to reject)
                  </label>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Ineligible as per Haryana Skill qualification rules..."
                    className="h-9 w-full px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#10284B]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT DETAILS */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-[#E5EAF1] rounded-xl text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#718096]">Application Fee Amount:</span>
                  <span className="ml-2 text-base font-bold text-[#172033]">
                    ₹{payment.amount || 500}
                  </span>
                </div>
                <StatusBadge status={payment.status || 'pending'} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <p>
                  <span className="text-[#718096]">UTR / Transaction Ref:</span>{' '}
                  <span className="font-mono font-medium text-[#172033]">
                    {payment.utr || payment.transactionId || payment.referenceId || 'N/A'}
                  </span>
                </p>
                <p>
                  <span className="text-[#718096]">Payment Method:</span>{' '}
                  <span className="capitalize font-medium text-[#172033]">
                    {payment.method || 'Online / UPI'}
                  </span>
                </p>
                <p>
                  <span className="text-[#718096]">Submitted At:</span>{' '}
                  <span className="font-medium text-[#172033]">
                    {payment.submittedAt ? new Date(payment.submittedAt).toLocaleString() : 'N/A'}
                  </span>
                </p>
                <p>
                  <span className="text-[#718096]">Verified By:</span>{' '}
                  <span className="font-medium text-[#172033]">
                    {payment.verifiedBy || 'Pending verification'}
                  </span>
                </p>
              </div>

              {/* Payment Receipt Preview */}
              {payment.receiptUrl && (
                <div className="pt-2">
                  <span className="text-[#718096] block mb-1">Fee Receipt:</span>
                  <img
                    src={payment.receiptUrl}
                    alt="Receipt"
                    className="max-h-48 border border-slate-200 rounded-lg p-1 bg-white"
                  />
                </div>
              )}
            </div>

            {/* Payment Verification Action Box */}
            <div className="p-4 bg-white border border-[#E5EAF1] rounded-xl space-y-3">
              <h5 className="text-xs font-bold text-[#172033]">Payment Verification Decision</h5>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onVerifyPayment && onVerifyPayment(app.applicationId)}
                  className="px-3.5 py-2 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Verify ₹500 Payment</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onRejectPayment && onRejectPayment(app.applicationId, paymentNote)}
                  className="px-3.5 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition flex items-center gap-1.5 shadow-xs"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject Payment</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TIMELINE & REVIEW HISTORY */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="border border-[#E5EAF1] rounded-xl p-4 bg-white divide-y divide-slate-100 text-xs">
              {history.length > 0 ? (
                history.map((item, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between text-[11px] text-[#718096]">
                      <span className="font-semibold text-[#172033] capitalize">
                        {item.action?.replace(/_/g, ' ')}
                      </span>
                      <span>{item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}</span>
                    </div>
                    <p className="text-[#172033] mt-0.5">{item.notes || 'No review notes entered.'}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">By: {item.performedBy || 'Desk Staff'}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#718096] py-2 text-center">
                  No previous review events recorded for this application.
                </p>
              )}
            </div>

            {/* Final Admission Grant Box */}
            <div className="p-4 bg-slate-50 border border-[#E5EAF1] rounded-xl flex items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-bold text-[#172033]">Final Course Enrollment</h5>
                <p className="text-[11px] text-[#718096]">
                  Admit student, allocate morning/evening batch, and generate official enrollment number.
                </p>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => onFinalAdmit && onFinalAdmit(app.applicationId)}
                className="px-4 py-2 rounded-lg bg-[#10284B] text-white text-xs font-semibold hover:bg-[#0c1f3a] transition flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Grant Final Admission</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
