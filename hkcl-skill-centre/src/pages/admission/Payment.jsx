import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  FileText,
  Lock,
  Copy,
  Check,
  QrCode,
  Upload,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import AdmissionLayout from '../../components/admission/AdmissionLayout.jsx';
import { useAdmission } from '../../context/AdmissionContext.jsx';
import { siteConfig } from '../../data/siteConfig.js';

export default function Payment() {
  const navigate = useNavigate();
  const {
    user,
    application,
    submitUpiPayment,
    simulatePayment,
    simulateDocumentReview,
    isLocked,
  } = useAdmission();

  const upiConfig = siteConfig.upiPayment || {
    registrationFeeInr: 500,
    upiId: 'QR919215913211-0157@unionbankofindia',
    payeeName: 'ACHARIYA EDUCATIONAL INSTITUTION (Union Bank of India)',
    qrImage: '/images/hkcl-upi-payment-qr.jpg',
    isConfigured: true,
    instructions: [],
  };

  const personal = application?.personal || {};
  const course = application?.course || {};
  const payment = application?.payment || {};
  const docReview = application?.documentReview || {};
  const studentRefId = user?.studentId || application?.id || 'HKCL-2026-XXXX';

  const docStatus = docReview.status || 'pending';
  const isDocApproved =
    docStatus === 'approved' || application?.status === 'documents_approved';

  const paymentStatus = payment.status || 'pending';
  const isVerified = paymentStatus === 'verified' || paymentStatus === 'paid' || isLocked;
  const isSubmitted = paymentStatus === 'submitted';
  const isRejected = paymentStatus === 'rejected';

  // Form State
  const [utr, setUtr] = useState(payment.utr || '');
  const [payerUpiId, setPayerUpiId] = useState(payment.payerUpiId || '');
  const [paymentDate, setPaymentDate] = useState(
    payment.paymentDate || new Date().toISOString().split('T')[0]
  );
  const [screenshotPreview, setScreenshotPreview] = useState(payment.screenshotUrl || '');
  const [screenshotName, setScreenshotName] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  // UI state
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Format submission date if available
  const submissionDateFormatted = application.submittedAt
    ? new Date(application.submittedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiConfig.upiId);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Payment screenshot must be smaller than 5MB.');
        return;
      }
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessBanner('');

    const cleanUtr = utr.trim();
    if (!cleanUtr) {
      setFormError('Please enter the 12-digit UPI Transaction ID / UTR number.');
      return;
    }
    if (cleanUtr.length < 6 || cleanUtr.length > 32 || !/^[A-Za-z0-9_-]+$/.test(cleanUtr)) {
      setFormError('Please enter a valid reference number (6 to 32 alphanumeric characters).');
      return;
    }

    if (!paymentDate) {
      setFormError('Please select the date when you completed the payment.');
      return;
    }

    if (!consentChecked) {
      setFormError(
        'Please acknowledge the declaration confirming you have transferred ₹500.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitUpiPayment({
        utr: cleanUtr,
        payerUpiId: payerUpiId.trim(),
        paymentDate,
        screenshotUrl: screenshotPreview,
      });

      if (result.success) {
        setSuccessBanner('Payment details submitted. Your payment will be verified by the admissions team.');
      } else {
        setFormError(result.error || 'Failed to submit payment details. Please check and try again.');
      }
    } catch (err) {
      setFormError(err.message || 'An error occurred while submitting payment details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdmissionLayout title="Admission Registration Fee (Manual UPI QR)" currentStep={5}>
      {/* Mandatory Document-First Review Guard */}
      {!isDocApproved && !isVerified ? (
        <div className="rounded-xl border border-blue-200 bg-white p-6 sm:p-8 shadow-xs text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-700 mx-auto">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Payment Step Locked — Document Verification in Progress
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In accordance with HKCL Skill Centre's document-first policy, registration fee payment (₹500) is unlocked only after an authorized admissions officer reviews and approves your uploaded documents.
          </p>

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs text-left space-y-2">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Document Review Status:</span>
              <span className="font-semibold text-blue-800 capitalize">
                {docStatus === 'corrections_required'
                  ? 'Corrections Required'
                  : docStatus === 'under_review'
                    ? 'Documents Under Review'
                    : 'Pending Submission'}
              </span>
            </div>
            {docReview.correctionNotes && (
              <div className="pt-1 text-red-700">
                <strong>Staff Feedback: </strong>
                {docReview.correctionNotes}
              </div>
            )}
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Payable Fee:</span>
              <span className="font-mono font-bold text-slate-900">₹500.00</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2.5 justify-center">
            {docStatus === 'corrections_required' ? (
              <Link
                to="/admission/documents"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-700 transition"
              >
                <span>Correct &amp; Resubmit Documents</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                to="/profile"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-800 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-900 transition"
              >
                <span>View Status on Student Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Configuration notice if placeholders are active */}
          {!upiConfig.isConfigured && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900">Configuration Notice: UPI Placeholder Active</p>
                  <p className="mt-0.5 text-amber-800 leading-relaxed">
                    The centre's official UPI ID and QR code asset have not yet been provided.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
        {/* =================================================================== */}
        {/* LEFT COLUMN: Official UPI QR Code, Fee & Step-by-Step Instructions */}
        {/* =================================================================== */}
        <div className="space-y-6">
          {/* Section 1: Official QR Code & UPI ID Box */}
          <section
            aria-labelledby="qr-section-heading"
            className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs"
          >
            <div className="border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="qr-section-heading" className="text-sm sm:text-base font-bold text-slate-900">
                    Step 1: Scan QR or Pay via UPI
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official HKCL Skill Centre admissions payment portal.
                  </p>
                </div>
                <span className="rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-bold text-brand-900">
                  Fixed Fee: ₹{upiConfig.registrationFeeInr}
                </span>
              </div>
            </div>

            {/* QR Card Container */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              {/* QR Image Box */}
              <div className="shrink-0 flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <img
                  src={upiConfig.qrImage}
                  alt="HKCL Skill Centre Official UPI QR Code"
                  className="h-56 w-auto max-w-[200px] object-contain rounded-lg"
                />
                <span className="mt-2 text-[10px] font-mono font-medium text-slate-500 flex items-center gap-1">
                  <QrCode className="h-3 w-3 text-brand-800" />
                  Scan with any UPI app
                </span>
              </div>

              {/* UPI ID & Payee details */}
              <div className="flex-1 w-full space-y-3 text-center sm:text-left">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Official UPI ID (VPA)
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm sm:text-base break-all bg-white px-2.5 py-1.5 rounded-lg border border-slate-300 select-all inline-block w-full sm:w-auto">
                      {upiConfig.upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpiId}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-900 active:scale-95 transition shadow-xs"
                      title="Copy UPI ID to clipboard"
                    >
                      {copyFeedback ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-500" />
                          <span>Copy UPI ID</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Verified Payee Name
                  </label>
                  <p className="mt-0.5 text-xs font-semibold text-slate-800">
                    {upiConfig.payeeName}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Amount to Transfer:</span>
                    <span className="font-mono text-base font-bold text-brand-900">
                      ₹{upiConfig.registrationFeeInr}.00
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    * Transfer exact amount only. No extra convenience charge.
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Payment Instructions */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                How to Pay:
              </h3>
              <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
                <li>Open <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, <strong>BHIM</strong>, or your mobile bank UPI app.</li>
                <li>Scan the QR code shown above, or copy and paste the UPI ID into your app.</li>
                <li>Verify that the payee name matches <strong>{upiConfig.payeeName}</strong>.</li>
                <li>Enter exactly <strong>₹500</strong> as the transfer amount and complete the PIN authentication.</li>
                <li>Upon completion, find your <strong>12-digit UPI Reference / UTR Number</strong> from your payment receipt and enter it on Step 2.</li>
              </ol>
            </div>
          </section>

          {/* Application & Applicant Summary Card */}
          <section
            aria-labelledby="summary-heading"
            className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h2 id="summary-heading" className="text-sm font-bold text-slate-900">
                Application Summary
              </h2>
              <span className="text-xs font-mono font-bold text-brand-900 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                Ref: {studentRefId}
              </span>
            </div>

            <dl className="divide-y divide-slate-100 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-2">
                <dt className="text-slate-500">Applicant Name</dt>
                <dd className="font-semibold text-slate-900">
                  {personal.fullName || user?.name || 'Student Applicant'}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-slate-500">Enrolled Course</dt>
                <dd className="font-semibold text-slate-900">
                  {course.name || 'HS-CIT (Information Technology)'}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-slate-500">Preferred Batch</dt>
                <dd className="font-medium text-slate-800">
                  {course.batch || 'Morning Batch'}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-slate-500">Current Payment Status</dt>
                <dd>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Verified by Staff
                    </span>
                  )}
                  {isSubmitted && !isVerified && (
                    <span className="inline-flex items-center gap-1 font-semibold text-blue-700">
                      <Clock className="h-3.5 w-3.5 text-blue-600" />
                      Submitted (Verification Pending)
                    </span>
                  )}
                  {isRejected && (
                    <span className="inline-flex items-center gap-1 font-semibold text-red-700">
                      <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                      Rejected (Correction Required)
                    </span>
                  )}
                  {!isVerified && !isSubmitted && !isRejected && (
                    <span className="font-semibold text-amber-700">
                      Pending Payment
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: Transaction Details Submission Form / Status Cards     */}
        {/* =================================================================== */}
        <div className="space-y-6">
          {/* Status Display Banners */}
          {isVerified && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-emerald-900">
                    Payment Verified Against Centre Records
                  </h3>
                  <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
                    Your ₹500 registration fee has been confirmed by our admissions desk. Your admission is officially approved and permanently locked.
                  </p>
                  <div className="mt-3 text-xs font-mono text-emerald-900">
                    Receipt No: <strong>{payment.receiptNo || 'REC-2026-VERIFIED'}</strong>
                    {payment.utr && <span className="block mt-0.5">UTR Reference: {payment.utr}</span>}
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/admission/confirmation')}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition shadow-xs"
                    >
                      <FileText className="h-4 w-4" />
                      <span>View &amp; Print Official 1-Page Receipt</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isSubmitted && !isVerified && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/90 p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-blue-900">
                    Payment Details Submitted
                  </h3>
                  <p className="mt-1 text-xs text-blue-800 leading-relaxed">
                    “Payment details submitted. Your payment will be verified by the admissions team.”
                  </p>
                  <div className="mt-3 rounded-lg bg-white p-3 border border-blue-100 text-xs space-y-1 font-mono text-slate-700">
                    <div><strong>Submitted UTR:</strong> {payment.utr || utr}</div>
                    <div><strong>Payment Date:</strong> {payment.paymentDate || paymentDate}</div>
                    {payment.payerUpiId && <div><strong>Payer UPI:</strong> {payment.payerUpiId}</div>}
                    <div><strong>Status:</strong> <span className="text-blue-700 font-bold">Staff Verification Pending</span></div>
                  </div>
                  <p className="mt-2 text-[11px] text-blue-600 italic">
                    Note: A transaction ID is not proof that money was received. Staff will verify your transaction against bank records before issuing the official fee receipt.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('/admission/confirmation')}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-900 transition"
                    >
                      <span>View Acknowledgment Page</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isRejected && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-red-900">
                    Payment Verification Rejected
                  </h3>
                  <p className="mt-1 text-xs text-red-800 leading-relaxed">
                    The admissions team reviewed your payment submission and could not confirm receipt with the provided details.
                  </p>
                  <div className="mt-2 rounded-lg bg-white p-3 border border-red-200 text-xs">
                    <span className="font-semibold text-red-900">Rejection Reason: </span>
                    <span className="text-red-700 font-medium">
                      {payment.rejectionReason || 'UTR not found in centre bank records. Please check your transaction receipt.'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-red-800">
                    <strong>Action Required:</strong> Please check your UPI application receipt, correct the UTR number or date in the form below, and resubmit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Transaction Reference & Proof Form */}
          {/* Always accessible when pending, rejected, or for resubmission (never permanently locked by just submitting UTR) */}
          {!isVerified && (
            <section
              aria-labelledby="form-heading"
              className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs"
            >
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h2 id="form-heading" className="text-sm sm:text-base font-bold text-slate-900">
                  {isRejected ? 'Step 2: Correct & Resubmit Payment Details' : isSubmitted ? 'Update Submitted Payment Details' : 'Step 2: Enter Payment Reference & Proof'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter the transaction reference from your UPI app receipt to initiate staff verification.
                </p>
              </div>

              {/* Success / Error Banners */}
              {successBanner && (
                <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successBanner}</span>
                </div>
              )}

              {formError && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitPayment} className="space-y-4">
                {/* 1. UPI Transaction ID / UTR Number (Required) */}
                <div>
                  <label htmlFor="utr-input" className="block text-xs font-semibold text-slate-800 mb-1">
                    UPI Transaction ID / UTR Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="utr-input"
                    type="text"
                    required
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="e.g. 412345678901 (12 digits)"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Find this 12-digit number labelled "UPI Ref No", "UTR", or "Transaction ID" in your payment app receipt.
                  </p>
                </div>

                {/* 2. Payer's UPI ID (Optional) */}
                <div>
                  <label htmlFor="payer-upi-input" className="block text-xs font-semibold text-slate-800 mb-1">
                    Payer's UPI ID <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="payer-upi-input"
                    type="text"
                    value={payerUpiId}
                    onChange={(e) => setPayerUpiId(e.target.value)}
                    placeholder="e.g. rahul@oksbi or 9812345678@paytm"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Helpful if someone else paid on your behalf or from a family member's account.
                  </p>
                </div>

                {/* 3. Payment Date (Required) */}
                <div>
                  <label htmlFor="payment-date-input" className="block text-xs font-semibold text-slate-800 mb-1">
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="payment-date-input"
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
                  />
                </div>

                {/* 4. Payment Screenshot (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Payment Screenshot / Receipt <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs">
                      <Upload className="h-3.5 w-3.5 text-slate-500" />
                      <span>{screenshotName ? 'Replace Screenshot' : 'Upload Screenshot'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleScreenshotChange}
                        className="hidden"
                      />
                    </label>
                    {screenshotName && (
                      <span className="text-xs text-slate-600 truncate max-w-[200px]">
                        {screenshotName}
                      </span>
                    )}
                  </div>
                  {screenshotPreview && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={screenshotPreview}
                        alt="Uploaded payment proof"
                        className="h-20 w-auto rounded border border-slate-200 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* 5. Mandatory Declaration & Consent */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-800 focus:ring-brand-700 shrink-0"
                    />
                    <span className="text-xs text-slate-700 leading-relaxed">
                      “I confirm that I have transferred ₹500 via UPI using the transaction details entered above.
                      I understand that a transaction ID is not automatic proof of payment, and my admission will be confirmed only after staff verification against centre bank records.”
                      <span className="text-red-500 font-bold ml-1">*</span>
                    </span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !consentChecked}
                    className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-brand-900 transition disabled:opacity-45 disabled:cursor-not-allowed shadow-xs active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        <span>Submitting for Verification...</span>
                      </>
                    ) : isRejected ? (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        <span>Resubmit Corrected Payment Details</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        <span>Submit Payment Details for Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          )}
          {/* Note: Online payment gateway disabled for initial public launch */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 shadow-xs">
            <p className="font-semibold text-amber-950">Payment Notice</p>
            <p className="mt-1">
              Online automatic payment processing is currently in setup. Course fees and registration fees can be deposited directly at the HKCL Skill Centre reception or via verified bank transfer.
            </p>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Navigation Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admission/review')}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Application Review</span>
        </button>

        {isVerified ? (
          <Link
            to="/admission/confirmation"
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition"
          >
            <span>View Verified Receipt</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : isSubmitted ? (
          <Link
            to="/admission/confirmation"
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-800 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-900 transition"
          >
            <span>View Acknowledgment</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </AdmissionLayout>
  );
}