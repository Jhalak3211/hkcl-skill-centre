import { Link, useNavigate } from 'react-router-dom';
import { Phone, Clock, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import Container from '../Container.jsx';
import Seo from '../Seo.jsx';
import AdmissionStepper from './AdmissionStepper.jsx';
import { useAdmission } from '../../context/AdmissionContext.jsx';
import { siteConfig } from '../../data/siteConfig.js';

export default function AdmissionLayout({
  title,
  currentStep = 1,
  children,
}) {
  const navigate = useNavigate();
  const { user, application, isLocked, autoFillDemoApplication } = useAdmission();

  return (
    <>
      <Seo
        title={`${title} | HKCL Skill Centre`}
        path={`/admission/${currentStep}`}
      />

      {/* Top Header: Clean, minimal breadcrumb and title */}
      <section className="border-b border-slate-200 bg-slate-50 py-5">
        <Container>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Link to="/" className="hover:text-slate-800 transition">
                  Home
                </Link>
                <span>/</span>
                <Link to="/profile" className="hover:text-slate-800 transition">
                  Profile
                </Link>
                <span>/</span>
                <span className="text-slate-800 font-medium">{title}</span>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {title}
                </h1>
                {isLocked && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-semibold">
                    <Lock className="h-3 w-3" />
                    Locked
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="font-mono text-slate-500 font-medium">
                Ref: {user?.studentId || application.id}
              </span>
              {user && (
                <>
                  <span>•</span>
                  <Link to="/profile" className="font-semibold text-slate-800 hover:underline">
                    {user.name}
                  </Link>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Main Container */}
      <Container className="py-6 sm:py-8">
        {/* Testing Mode Auto-Fill Bar */}
        {!isLocked && currentStep <= 4 && (
          <div className="mb-5 rounded-xl border border-indigo-200 bg-indigo-50/80 p-3.5 text-xs text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-xs shrink-0">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="font-bold text-indigo-950 text-xs sm:text-sm flex items-center gap-1.5">
                  <span>Testing Assistant: Auto-Fill Form</span>
                  <span className="text-[10px] font-mono uppercase bg-indigo-200/70 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">Dev / QA</span>
                </p>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  Populate valid candidate details, educational qualifications, and document proofs to test portal functioning.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentStep < 4 && (
                <button
                  type="button"
                  onClick={() => autoFillDemoApplication(currentStep)}
                  className="rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-800 hover:bg-indigo-100/70 transition shadow-2xs"
                  title="Populate inputs for this step only"
                >
                  Fill This Step
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  autoFillDemoApplication('all');
                  navigate('/admission/review');
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-2xs"
                title="Fill entire application and jump to Review & Submit step"
              >
                <span>Auto-Fill All &amp; Review</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Progress Stepper */}
        {(() => {
          const isDocsApproved =
            application?.documentReview?.status === 'approved' ||
            application?.status === 'documents_approved' ||
            application?.status === 'payment_submitted' ||
            application?.status === 'payment_verified' ||
            application?.status === 'admitted';

          const isPaymentCompleted =
            application?.payment?.status === 'verified' ||
            application?.status === 'payment_verified' ||
            application?.status === 'admitted';

          const maxUnlockedStep = isPaymentCompleted
            ? 6
            : isDocsApproved
              ? Math.max(application?.currentStep || 1, 5)
              : Math.min(application?.currentStep || 1, 4);

          return (
            <AdmissionStepper
              currentStep={currentStep}
              maxUnlockedStep={maxUnlockedStep}
            />
          );
        })()}

        {/* Locked Application Notice */}
        {isLocked && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-amber-950">Application Locked (Read-Only Mode)</p>
              <p className="mt-0.5 leading-relaxed text-amber-900">
                {application?.status === 'under_review' || application?.documentReview?.status === 'under_review'
                  ? 'Your admission application and uploaded documents are currently under review by HKCL admissions staff. Details are read-only while review is in progress. Once verified and approved, you can proceed to the ₹500 fee payment step.'
                  : 'Your admission application is registered. All form fields are locked against editing to preserve official records. You can review your submitted details below.'}
              </p>
              <p className="mt-1.5 text-[11px] text-amber-800">
                <strong>Need corrections?</strong> If your documents require amendments, staff will request corrections with instructions. In addition, you may contact the HKCL Skill Centre desk (Barnala Road, Sirsa).
              </p>
            </div>
          </div>
        )}

        {/* Content Layout */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* Main Form Step */}
          <main className="min-w-0">{children}</main>

          {/* Minimal Sidebar */}
          <aside className="space-y-4">
            {/* Selected Course */}
            {application.course?.name ? (
              <section className="rounded-xl border border-slate-200 bg-white p-4 text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-700">Course Selected</span>
                  {!isLocked && (
                    <Link
                      to="/admission/personal-details"
                      className="text-orange-600 hover:underline font-medium"
                    >
                      Change
                    </Link>
                  )}
                </div>
                <p className="font-bold text-slate-900 text-sm">{application.course.name}</p>
                <p className="text-slate-500 mt-1">
                  Batch: {application.course.batch || 'Select batch'}
                </p>
                {application.course.duration && (
                  <p className="text-slate-500 mt-0.5">Duration: {application.course.duration}</p>
                )}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-700">
                  <span>Registration Fee:</span>
                  <span className="font-bold text-slate-900">₹{application.payment?.registrationFee || 500}</span>
                </div>
                {isLocked && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Paid &amp; Confirmed
                    </span>
                  </div>
                )}
              </section>
            ) : null}

            {/* Quick Links when Locked */}
            {isLocked && (
              <section className="rounded-xl border border-slate-200 bg-white p-4 text-xs space-y-2">
                <p className="font-semibold text-slate-900">Quick Navigation</p>
                <Link
                  to="/admission/confirmation"
                  className="block text-brand-800 font-medium hover:underline"
                >
                  → View Official 1-Page Receipt
                </Link>
                <Link
                  to="/admission/review"
                  className="block text-brand-800 font-medium hover:underline"
                >
                  → Review Full Application
                </Link>
                <Link
                  to="/profile"
                  className="block text-brand-800 font-medium hover:underline"
                >
                  → Go to My Profile
                </Link>
              </section>
            )}

            {/* Simple Help Info */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-900 mb-2">Need Help?</p>
              <a
                href={`tel:${siteConfig.contact.phoneE164}`}
                className="flex items-center gap-2 font-medium text-brand-800 hover:underline mb-1.5"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{siteConfig.contact.phoneDisplay}</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                <span>Mon–Fri 9:00 AM – 6:00 PM</span>
              </div>
            </section>
          </aside>
        </div>
      </Container>
    </>
  );
}
