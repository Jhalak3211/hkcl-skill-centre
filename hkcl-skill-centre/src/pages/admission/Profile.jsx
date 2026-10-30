import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  ArrowRight,
  LogOut,
  FileText,
  Copy,
  Check,
  PlusCircle,
  BookOpen,
  Edit2,
  Lock,
  RotateCcw,
} from 'lucide-react';
import Container from '../../components/Container.jsx';
import Seo from '../../components/Seo.jsx';
import { useAdmission } from '../../context/AdmissionContext.jsx';
import { ADMISSION_STEPS } from '../../components/admission/AdmissionStepper.jsx';

export default function Profile() {
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

  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'profile'
  const [copiedId, setCopiedId] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Profile Edit Form State
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    fatherName: '',
    motherName: '',
    house: '',
    locality: '',
    city: 'Sirsa',
    district: 'Sirsa',
    state: 'Haryana',
    pincode: '',
  });

  // Sync profileForm when user or savedProfile changes
  useEffect(() => {
    const p = savedProfile || application.personal || {};
    const addr = p.address || {};
    setProfileForm({
      fullName: p.fullName || user?.name || '',
      email: p.email || user?.email || '',
      fatherName: p.fatherName || '',
      motherName: p.motherName || '',
      house: addr.house || '',
      locality: addr.locality || '',
      city: addr.city || 'Sirsa',
      district: addr.district || 'Sirsa',
      state: addr.state || 'Haryana',
      pincode: addr.pincode || '',
    });
  }, [user, savedProfile, application.personal]);

  const isSubmitted = Boolean(
    application?.status === 'submitted' ||
    application?.status === 'approved' ||
    application?.payment?.status === 'paid'
  );

  const hasDraft = !isSubmitted && Boolean(
    application?.course?.slug ||
    application?.personal?.fullName
  );

  // If the user has NOT submitted an application and has NO draft in progress
  if (!isSubmitted && !hasDraft) {
    return (
      <>
        <Seo title="Student Profile | HKCL Skill Centre" path="/profile" />
        <section className="py-16 bg-slate-50 border-b border-slate-200 min-h-[480px] flex items-center justify-center">
          <Container>
            <div className="mx-auto max-w-md text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Admission Applications</h1>
              <p className="mt-2 text-sm text-slate-600">
                You haven't submitted an admission application yet. Fill out the direct online application form to get started.
              </p>
              <div className="mt-6">
                <Link
                  to="/admission/personal-details"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition"
                >
                  <span>Apply for Admission</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </>
    );
  }

  // If the user has an unsubmitted draft saved in this browser
  if (!isSubmitted && hasDraft) {
    return (
      <>
        <Seo title="Application Draft in Progress | HKCL Skill Centre" path="/profile" />
        <section className="py-16 bg-slate-50 border-b border-slate-200 min-h-[480px] flex items-center justify-center">
          <Container>
            <div className="mx-auto max-w-lg bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Admission Draft in Progress</h1>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  You started an application but have not submitted it yet. Your draft is saved locally in your browser.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-left text-xs space-y-2">
                {application?.personal?.fullName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Applicant Name:</span>
                    <span className="font-semibold text-slate-800">{application.personal.fullName}</span>
                  </div>
                )}
                {application?.personal?.phone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mobile Number:</span>
                    <span className="text-slate-800">{application.personal.phone}</span>
                  </div>
                )}
                {application?.course?.name && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Selected Course:</span>
                    <span className="font-semibold text-brand-700">{application.course.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Progress:</span>
                  <span className="text-orange-600 font-semibold">Step {application.currentStep || 1} of 6</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/admission/personal-details"
                  className="flex-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition"
                >
                  <span>Continue Application</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/admission/personal-details');
                  }}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Discard Draft &amp; Start Fresh
                </button>
              </div>
            </div>
          </Container>
        </section>
      </>
    );
  }

  const studentRefId = user?.studentId || user?.id || application?.id || savedProfile?.studentId || 'HKCL-2026-PENDING';
  const studentName = user?.name || application?.personal?.fullName || savedProfile?.fullName || 'Student Applicant';
  const studentPhone = user?.phone || application?.personal?.phone || savedProfile?.phone || '';
  const studentEmail = user?.email || application?.personal?.email || savedProfile?.email || '';

  const handleCopyRefId = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(studentRefId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleApplyClick = () => {
    startAnotherCourse();
    navigate('/admission/personal-details');
  };

  const handleProfileFieldChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) {
      setProfileMessage({ type: 'error', text: 'Full name is required.' });
      return;
    }

    const payload = {
      fullName: profileForm.fullName.trim(),
      email: profileForm.email.trim(),
      fatherName: profileForm.fatherName.trim(),
      motherName: profileForm.motherName.trim(),
      address: {
        house: profileForm.house.trim(),
        locality: profileForm.locality.trim(),
        city: profileForm.city.trim(),
        district: profileForm.district.trim(),
        state: profileForm.state.trim(),
        pincode: profileForm.pincode.trim(),
      },
    };

    const res = updateProfile(payload);
    if (res.success) {
      setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
      setIsEditingProfile(false);
      setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
    } else {
      setProfileMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfileMessage({ type: '', text: '' });
  };

  // Reusable Profile data
  const currentProfile = savedProfile || application.personal || {};
  const currentAddress = currentProfile.address || {};

  // Application data
  const course = application.course;
  const payment = application.payment;
  const docReview = application.documentReview || {};
  const finalAdmission = application.finalAdmission || {};
  const hasApplication = Boolean(course?.name);

  const docStatus = docReview.status || 'pending';
  const isDocApproved = docStatus === 'approved' || application?.status === 'documents_approved';
  const isUnderReview = application?.status === 'under_review' || docStatus === 'under_review';
  const isCorrectionsRequired = application?.status === 'corrections_required' || docStatus === 'corrections_required';
  const isAdmitted = application?.status === 'admitted' || finalAdmission.status === 'admitted';
  const isAppRejected = application?.status === 'rejected' || docStatus === 'rejected' || finalAdmission.status === 'rejected';

  const isPaid = payment?.status === 'paid' || payment?.status === 'verified';
  const isSubmittedUpi = payment?.status === 'submitted';
  const isRejectedUpi = payment?.status === 'rejected';

  const currentStepData =
    ADMISSION_STEPS.find((s) => s.step === application.currentStep) ||
    ADMISSION_STEPS[0];

  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-1 focus:ring-brand-600';

  return (
    <>
      <Seo
        title={`${studentName} - Student Portal | HKCL Skill Centre`}
        path="/profile"
      />

      {/* =================================================================== */}
      {/* 1. Header & Student Information Banner (No fake badges)              */}
      {/* =================================================================== */}
      <section className="border-b border-brand-800 bg-brand-900 text-white py-6">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-300">HKCL Learner Portal</p>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">{studentName}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-slate-300">
                {studentPhone && <span>Phone: {studentPhone}</span>}
                {studentEmail && (
                  <>
                    <span>•</span>
                    <span>Email: {studentEmail}</span>
                  </>
                )}
              </div>
            </div>

            {/* Clean Student Reference ID Panel with Copy ID */}
            <div className="rounded-xl bg-white/10 p-3 sm:p-3.5 border border-white/15 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                  Student Reference ID
                </p>
                <p className="text-base sm:text-lg font-mono font-bold text-orange-400 tracking-wide mt-0.5">
                  {studentRefId}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyRefId}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 hover:bg-white/25 px-3 py-1.5 text-xs font-semibold text-white transition active:scale-95"
                title="Copy Reference ID"
              >
                {copiedId ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied</span>
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
        </Container>
      </section>

      {/* =================================================================== */}
      {/* 2. Dashboard Navigation Tabs & Primary Actions                     */}
      {/* =================================================================== */}
      <section className="border-b border-slate-200 bg-white py-3.5">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Two Clear Sections: Applications & Enrolments, and My Profile */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setActiveTab('applications'); setIsEditingProfile(false); }}
                className={`py-1.5 px-3.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'applications'
                    ? 'bg-brand-50 text-brand-900 border border-brand-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Applications &amp; Enrolments
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`py-1.5 px-3.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'profile'
                    ? 'bg-brand-50 text-brand-900 border border-brand-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                My Profile
              </button>
            </div>

            {/* Actions: Main Orange "Apply for Admission" + Secondary "Sign Out" */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleApplyClick}
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition shadow-xs"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Apply for Admission</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-slate-50 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Notification Toast */}
      {profileMessage.text && (
        <Container className="pt-4">
          <div
            className={`rounded-lg p-3 text-xs flex items-center justify-between ${
              profileMessage.type === 'error'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <span>{profileMessage.text}</span>
            <button
              type="button"
              onClick={() => setProfileMessage({ type: '', text: '' })}
              className="text-xs font-bold px-1"
            >
              ×
            </button>
          </div>
        </Container>
      )}

      {/* =================================================================== */}
      {/* 3. Main Content: Applications OR My Profile                        */}
      {/* =================================================================== */}
      <Container className="py-6 sm:py-8 min-h-[420px]">
        {/* TAB 1: Applications & Enrolments */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {hasApplication ? (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                {/* Course Title and Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-800">
                      Course Application
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      {course.name}
                    </h2>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isAdmitted ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Officially Admitted
                      </span>
                    ) : isPaid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Payment Verified (Awaiting Final Admission)
                      </span>
                    ) : isSubmittedUpi ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        Payment Submitted (Staff Verification Pending)
                      </span>
                    ) : isRejectedUpi ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                        <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                        Payment Rejected (Correction Needed)
                      </span>
                    ) : isDocApproved ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Documents Approved (Payment Unlocked)
                      </span>
                    ) : isCorrectionsRequired ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-300">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                        Corrections Required
                      </span>
                    ) : isUnderReview ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        Documents under review
                      </span>
                    ) : isAppRejected ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                        <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                        Application Rejected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        Draft in Progress (Step {application.currentStep} of 6)
                      </span>
                    )}
                  </div>
                </div>

                {/* Workflow Status Context Banners */}
                {isUnderReview && (
                  <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900 flex items-start gap-2">
                    <Clock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Documents under review</p>
                      <p className="mt-0.5 text-blue-800 leading-relaxed">
                        Your uploaded certificates, marksheets, and personal details have been submitted to the admissions desk.
                        Registration fee payment (₹500) will be unlocked once an authorized staff member approves your documents.
                      </p>
                    </div>
                  </div>
                )}

                {isCorrectionsRequired && (
                  <div className="mb-4 rounded-lg bg-amber-50 border border-amber-300 p-3 text-xs text-amber-900 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-950">Action Required: Staff Requested Corrections</p>
                      <p className="mt-1 font-medium text-amber-900 bg-white/70 p-2 rounded border border-amber-200">
                        "{docReview.correctionNotes || 'Please review your uploaded documents and submit corrections.'}"
                      </p>
                      <p className="mt-1 text-amber-800">
                        Please update the requested details/documents and resubmit for review.
                      </p>
                    </div>
                  </div>
                )}

                {isDocApproved && !isPaid && !isSubmittedUpi && (
                  <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Documents Approved</p>
                      <p className="mt-0.5 text-emerald-800 leading-relaxed">
                        Your documents have been verified and approved by the admissions desk. Please proceed to pay the ₹500 registration fee via UPI to complete your admission.
                      </p>
                    </div>
                  </div>
                )}

                {isAdmitted && (
                  <div className="mb-4 rounded-lg bg-emerald-100 border border-emerald-300 p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
                    <Award className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Officially Admitted to HKCL Skill Centre!</p>
                      <p className="mt-0.5 text-emerald-800">
                        Enrollment Number: <strong className="font-mono text-emerald-950">{finalAdmission.enrollmentNo || 'ENR-2026-CONFIRMED'}</strong> • Batch: <strong>{finalAdmission.admittedBatch || course.batch || 'Morning Batch'}</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Compact Aligned Rows (No nested cards) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600 pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Application Ref</span>
                    <span className="font-mono font-bold text-slate-900">{studentRefId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Preferred Batch</span>
                    <span className="font-medium text-slate-800">{course.batch || 'Not Selected'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Duration</span>
                    <span className="font-medium text-slate-800">{course.duration || '3 Months'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Registration Fee</span>
                    <span className="font-semibold text-slate-900">
                      ₹{payment.registrationFee || 500} {isPaid ? '(Paid)' : '(Payable)'}
                    </span>
                  </div>
                </div>

                {/* Relevant Next Action */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {isAdmitted || isPaid ? (
                    <>
                      <Link
                        to="/admission/confirmation"
                        className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-brand-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-900 transition"
                      >
                        <Receipt className="h-3.5 w-3.5" />
                        <span>View Official 1-Page Receipt</span>
                      </Link>
                      <Link
                        to="/admission/review"
                        className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                      >
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        <span>View Application Details</span>
                      </Link>
                    </>
                  ) : isRejectedUpi ? (
                    <Link
                      to="/admission/payment"
                      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Correct &amp; Resubmit Payment Details</span>
                    </Link>
                  ) : isSubmittedUpi ? (
                    <>
                      <Link
                        to="/admission/confirmation"
                        className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-brand-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-900 transition"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>View Payment Status</span>
                      </Link>
                      <Link
                        to="/admission/payment"
                        className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                      >
                        <span>Update Payment Details</span>
                      </Link>
                    </>
                  ) : isDocApproved ? (
                    <Link
                      to="/admission/payment"
                      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Proceed to Payment (₹500)</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : isCorrectionsRequired ? (
                    <Link
                      to="/admission/documents"
                      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 transition shadow-xs"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Correct &amp; Resubmit Documents</span>
                    </Link>
                  ) : isUnderReview ? (
                    <Link
                      to="/admission/review"
                      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                      <span>View Application Details (Under Review)</span>
                    </Link>
                  ) : (
                    <Link
                      to={currentStepData.path}
                      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-brand-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-900 transition"
                    >
                      <span>Continue Form: {currentStepData.name}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              /* Clean, Minimal Empty State */
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center max-w-md mx-auto shadow-xs">
                <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-900">No applications yet</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  You have not submitted an admission application for any course yet. Select a course to begin.
                </p>
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="mt-4 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Apply for Admission</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: My Profile (Basic Reusable Information ONLY) */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    My Profile
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your reusable personal and contact details for admissions.
                  </p>
                </div>

                {!isEditingProfile && (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {/* View Mode OR Edit Mode */}
              {!isEditingProfile ? (
                /* View Mode: Clean 2/3 Column Grid */
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-xs sm:text-sm">
                  <div>
                    <dt className="text-slate-400 text-xs">Full Name</dt>
                    <dd className="font-semibold text-slate-900 mt-0.5">
                      {currentProfile.fullName || studentName || <span className="text-slate-400 italic">Not provided</span>}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-400 text-xs">Registered Mobile</dt>
                    <dd className="font-semibold text-slate-900 mt-0.5">
                      {currentProfile.phone || studentPhone || <span className="text-slate-400 italic">Not provided</span>}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-400 text-xs">Email Address</dt>
                    <dd className="font-semibold text-slate-900 mt-0.5">
                      {currentProfile.email || studentEmail || <span className="text-slate-400 italic">Not provided</span>}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-400 text-xs">Father's Name</dt>
                    <dd className="font-medium text-slate-800 mt-0.5">
                      {currentProfile.fatherName || <span className="text-slate-400 italic">Not provided</span>}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-400 text-xs">Mother's Name</dt>
                    <dd className="font-medium text-slate-800 mt-0.5">
                      {currentProfile.motherName || <span className="text-slate-400 italic">Not provided</span>}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-400 text-xs">Account Reference ID</dt>
                    <dd className="font-mono font-medium text-brand-900 mt-0.5">
                      {studentRefId}
                    </dd>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 pt-2 border-t border-slate-100">
                    <dt className="text-slate-400 text-xs">Permanent Residential Address</dt>
                    <dd className="font-medium text-slate-800 mt-0.5">
                      {[
                        currentAddress.house,
                        currentAddress.locality,
                        currentAddress.city,
                        currentAddress.district,
                        currentAddress.state,
                        currentAddress.pincode,
                      ]
                        .filter(Boolean)
                        .join(', ') || <span className="text-slate-400 italic">Not provided</span>}
                    </dd>
                  </div>
                </dl>
              ) : (
                /* Edit Mode Flow */
                <form onSubmit={handleSaveProfile} noValidate className="space-y-4">
                  <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label htmlFor="fullName" className="text-xs font-semibold text-slate-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={profileForm.fullName}
                        onChange={handleProfileFieldChange}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phoneDisabled" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>Mobile Number</span>
                        <span className="text-[10px] text-slate-400 font-normal">Account Primary</span>
                      </label>
                      <input
                        id="phoneDisabled"
                        type="text"
                        disabled
                        value={studentPhone}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="text-xs font-semibold text-slate-700">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileFieldChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="fatherName" className="text-xs font-semibold text-slate-700">
                        Father's Name
                      </label>
                      <input
                        id="fatherName"
                        name="fatherName"
                        type="text"
                        value={profileForm.fatherName}
                        onChange={handleProfileFieldChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="motherName" className="text-xs font-semibold text-slate-700">
                        Mother's Name
                      </label>
                      <input
                        id="motherName"
                        name="motherName"
                        type="text"
                        value={profileForm.motherName}
                        onChange={handleProfileFieldChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="house" className="text-xs font-semibold text-slate-700">
                        House No. &amp; Street
                      </label>
                      <input
                        id="house"
                        name="house"
                        type="text"
                        value={profileForm.house}
                        onChange={handleProfileFieldChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="locality" className="text-xs font-semibold text-slate-700">
                        Locality / Village
                      </label>
                      <input
                        id="locality"
                        name="locality"
                        type="text"
                        value={profileForm.locality}
                        onChange={handleProfileFieldChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="text-xs font-semibold text-slate-700">
                        City / Tehsil
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={profileForm.city}
                        onChange={handleProfileFieldChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="district" className="text-xs font-semibold text-slate-700">
                        District
                      </label>
                      <input
                        id="district"
                        name="district"
                        type="text"
                        value={profileForm.district}
                        onChange={handleProfileFieldChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="text-xs font-semibold text-slate-700">
                        State
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={profileForm.state}
                        onChange={handleProfileFieldChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="pincode" className="text-xs font-semibold text-slate-700">
                        PIN Code
                      </label>
                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        maxLength={6}
                        value={profileForm.pincode}
                        onChange={handleProfileFieldChange}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Edit Actions: Save Changes & Cancel */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
                    <button
                      type="submit"
                      className="inline-flex min-h-9 items-center justify-center rounded-lg bg-brand-800 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-900 transition"
                    >
                      Save Profile Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
