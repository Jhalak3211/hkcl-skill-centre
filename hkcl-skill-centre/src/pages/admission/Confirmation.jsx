import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Printer,
  CheckCircle2,
  ShieldCheck,
  User,
  LayoutDashboard,
  ArrowRight,
  PlusCircle,
  QrCode,
  Award,
  Clock,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import Container from '../../components/Container.jsx';
import Seo from '../../components/Seo.jsx';
import { useAdmission } from '../../context/AdmissionContext.jsx';
import { siteConfig } from '../../data/siteConfig.js';

export default function Confirmation() {
  const navigate = useNavigate();
  const { user, application, startAnotherCourse } = useAdmission();
  const receiptRef = useRef(null);

  const studentRefId = user?.studentId || application.id || 'HKCL-2026-4891';
  const payment = application.payment || {};
  const personal = application.personal || {};
  const address = personal.address || {};
  const course = application.course || {};

  const paymentStatus = payment.status || 'pending';
  const isVerified = paymentStatus === 'verified' || paymentStatus === 'paid';
  const isSubmitted = paymentStatus === 'submitted';
  const isRejected = paymentStatus === 'rejected';

  const receiptNo = payment.receiptNo || `REC-2026-${studentRefId.replace(/\D/g, '') || '4891'}`;
  const transactionId = payment.utr || payment.transactionId || `TXN-HKCL-${studentRefId.replace(/\D/g, '') || '91204'}`;
  const paymentDate = payment.verifiedAt || payment.paidAt
    ? new Date(payment.verifiedAt || payment.paidAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : payment.paymentDate ||
      new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  const fullAddress = [
    address.house,
    address.locality,
    address.city || 'Sirsa',
    address.district || 'Sirsa',
    address.state || 'Haryana',
    address.pincode,
  ]
    .filter(Boolean)
    .join(', ');

  const handlePrint = () => {
    if (isVerified) {
      window.print();
    }
  };

  const handleApplyAnother = () => {
    startAnotherCourse();
    navigate('/admission/personal-details');
  };

  return (
    <>
      <Seo
        title={
          isVerified
            ? 'Official Admission Receipt | HKCL Skill Centre'
            : 'Admission Application Submitted | HKCL Skill Centre'
        }
        path="/admission/confirmation"
      />

      {/* Screen Only: Status Header */}
      <section className="print:hidden border-b border-slate-200 bg-slate-50 py-8 sm:py-10">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            {isVerified ? (
              <>
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mb-3">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Admission Registration Confirmed
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
                  Student Reference ID:{' '}
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {studentRefId}
                  </span>
                  {' '}• Status:{' '}
                  <span className="font-semibold text-emerald-700">
                    Payment Verified Against Bank Records
                  </span>
                </p>
              </>
            ) : isRejected ? (
              <>
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-3">
                  <AlertCircle className="h-7 w-7" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Payment Verification Rejected
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-red-700">
                  Reference ID:{' '}
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {studentRefId}
                  </span>
                  {' '}• Reason: {payment.rejectionReason || 'UTR not verified in bank records.'}
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-3">
                  <Clock className="h-7 w-7" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Admission Application Submitted
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-700 font-medium">
                  “Payment details submitted. Your payment will be verified by the admissions team.”
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Student Reference ID:{' '}
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {studentRefId}
                  </span>
                  {' '}• Status:{' '}
                  <span className="font-semibold text-blue-700">
                    Staff Verification Pending
                  </span>
                </p>
              </>
            )}

            {/* Quick Actions */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {isVerified && (
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-brand-800 px-5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-brand-900 transition shadow-xs"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Verified 1-Page Receipt</span>
                </button>
              )}

              {isRejected && (
                <Link
                  to="/admission/payment"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition shadow-xs"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Correct &amp; Resubmit Payment Details</span>
                </Link>
              )}

              {isSubmitted && !isVerified && (
                <Link
                  to="/admission/payment"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                >
                  <span>Review Payment Details</span>
                </Link>
              )}

              <Link
                to="/profile"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <LayoutDashboard className="h-4 w-4 text-slate-500" />
                <span>My Profile</span>
              </Link>

              <button
                type="button"
                onClick={handleApplyAnother}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-orange-600 transition"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Apply for Another Course</span>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <Container className="py-6 sm:py-8 print:p-0 print:m-0 print:max-w-none">
        <div className="mx-auto max-w-3xl">
          {/* CASE 1: VERIFIED PAYMENT -> Official Verified 1-Page Receipt */}
          {isVerified ? (
            <div
              ref={receiptRef}
              id="verified-receipt"
              className="rounded-xl border border-slate-300 bg-white p-6 sm:p-8 shadow-xs print:rounded-none print:border-none print:p-4 print:shadow-none print:w-full"
            >
              {/* 1. Official Letterhead */}
              <div className="border-b-2 border-slate-900 pb-4 mb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase tracking-widest text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        Govt. of Haryana Recognised Centre
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Centre Code: ALC-HKCL-SIRSA-125055
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 uppercase tracking-tight">
                      Haryana Knowledge Corporation Limited
                    </h2>
                    <p className="text-xs font-semibold text-slate-700">
                      {siteConfig.name} • Authorized Learning Centre
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {siteConfig.contact.address.lines.join(', ')}, {siteConfig.contact.address.city}, Haryana - 125055 | Phone: {siteConfig.contact.phoneDisplay}
                    </p>
                  </div>

                  {/* Verified Digital Seal / Stamp */}
                  <div className="shrink-0 flex flex-col items-center justify-center rounded-xl border-2 border-emerald-600 bg-emerald-50/50 p-2.5 text-center min-w-[120px]">
                    <ShieldCheck className="h-6 w-6 text-emerald-600 mx-auto" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 mt-0.5">
                      Verified
                    </span>
                    <span className="text-[9px] font-semibold text-emerald-700">
                      HKCL ALC Sirsa
                    </span>
                    <span className="text-[8px] font-mono text-slate-500">
                      Auth: Bank Verified
                    </span>
                  </div>
                </div>

                {/* Title bar */}
                <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-wider">
                    ADMISSION ACKNOWLEDGEMENT &amp; FEE RECEIPT (2026-27)
                  </span>
                  <span className="text-slate-600 font-medium">
                    Verified Date: <strong>{paymentDate}</strong>
                  </span>
                </div>
              </div>

              {/* 2. Top Reference & Key Identifiers Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 rounded-lg p-3 text-xs border border-slate-200 mb-4 print:bg-slate-50">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Student Reference ID
                  </span>
                  <span className="font-mono font-bold text-brand-900 text-sm">
                    {studentRefId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Receipt Number
                  </span>
                  <span className="font-mono font-semibold text-slate-800 text-xs">
                    {receiptNo}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    UPI UTR / Reference
                  </span>
                  <span className="font-mono font-semibold text-slate-800 text-xs truncate block" title={transactionId}>
                    {transactionId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Payment Status
                  </span>
                  <span className="font-bold text-emerald-700 inline-flex items-center gap-1 text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    BANK VERIFIED (₹500)
                  </span>
                </div>
              </div>

              {/* 3. Candidate & Academic Details */}
              <div className="border border-slate-200 rounded-lg p-3 mb-4 text-xs">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] pb-1.5 mb-2 border-b border-slate-200 flex items-center justify-between">
                  <span>Candidate &amp; Academic Details</span>
                  <span className="font-normal text-slate-500 lowercase">verified student applicant</span>
                </h3>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-slate-500 text-[11px]">Applicant Full Name</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">{personal.fullName || user?.name || 'Student Applicant'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-[11px]">Father's Name</dt>
                    <dd className="font-medium text-slate-800 mt-0.5">{personal.fatherName || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-[11px]">Mother's Name</dt>
                    <dd className="font-medium text-slate-800 mt-0.5">{personal.motherName || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-[11px]">Mobile Number</dt>
                    <dd className="font-medium text-slate-800 mt-0.5">{personal.phone || user?.phone || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-[11px]">Email Address</dt>
                    <dd className="font-medium text-slate-800 mt-0.5">{personal.email || user?.email || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-[11px]">Date of Birth / Gender</dt>
                    <dd className="font-medium text-slate-800 mt-0.5">
                      {personal.dob || '—'} {personal.gender ? `(${personal.gender})` : ''}
                    </dd>
                  </div>
                  <div className="sm:col-span-3 pt-1 border-t border-slate-100">
                    <dt className="text-slate-500 text-[11px]">Permanent Address</dt>
                    <dd className="font-medium text-slate-800 mt-0.5">{fullAddress || 'Sirsa, Haryana'}</dd>
                  </div>
                </dl>
              </div>

              {/* 4. Enrolled Course & Fee Structure Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden mb-4 text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="py-2 px-3 font-bold text-[11px] uppercase">Enrolled Course</th>
                      <th className="py-2 px-3 font-bold text-[11px] uppercase">Batch / Timing</th>
                      <th className="py-2 px-3 font-bold text-[11px] uppercase">Duration</th>
                      <th className="py-2 px-3 text-right font-bold text-[11px] uppercase">Reg. Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-900">{course.name || 'HS-CIT (Information Technology)'}</p>
                        <p className="text-[11px] text-slate-500">HKCL Curriculum • HSBTE Joint Certification</p>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {course.batch || 'Morning Batch'}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {course.duration || '3 Months'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{payment.registrationFee || 500}.00
                      </td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td colSpan={3} className="py-1.5 px-3 text-[11px] text-slate-600">
                        Digital Student Portal, Course Material &amp; Assessment Access
                      </td>
                      <td className="py-1.5 px-3 text-right text-[11px] font-semibold text-emerald-700">
                        INCLUDED
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="border-t-2 border-slate-900 bg-slate-50">
                    <tr className="font-bold text-slate-900">
                      <td colSpan={3} className="py-2 px-3 text-right uppercase tracking-wider text-[11px]">
                        Total Amount Received &amp; Verified:
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-sm text-brand-900">
                        ₹{payment.registrationFee || 500}.00
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* 5. Verification Token & Authorized Signatory Block */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-xs items-end">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 border border-slate-300 rounded bg-slate-100 flex items-center justify-center">
                      <QrCode className="h-7 w-7 text-slate-700" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-[11px] text-slate-800 block">
                        VERIFY-HKCL-{studentRefId.replace(/\D/g, '') || '2026'}
                      </span>
                      <span className="text-[10px] text-slate-500 leading-tight block">
                        Verified by: {payment.verifiedBy || 'Admissions Staff'}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic mt-1">
                    * This is an official receipt issued after manual verification against centre bank records.
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-block text-center min-w-[160px]">
                    <div className="h-9 flex items-end justify-center mb-1">
                      <span className="font-serif italic font-bold text-brand-900 text-sm tracking-wide">
                        Anil Verma
                      </span>
                    </div>
                    <div className="border-t border-slate-800 pt-1 text-[11px] font-bold text-slate-900">
                      Authorized Signatory
                    </div>
                    <div className="text-[10px] text-slate-500">
                      HKCL Skill Centre, Sirsa (ALC #125055)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : isRejected ? (
            /* CASE 2: REJECTED PAYMENT -> Alert and Redirection Card */
            <div className="rounded-xl border border-red-200 bg-white p-6 sm:p-8 shadow-xs text-center space-y-4">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto">
                <AlertCircle className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Payment Verification Unsuccessful
              </h2>
              <div className="mx-auto max-w-lg rounded-lg bg-red-50 border border-red-200 p-4 text-xs text-left text-red-900 space-y-1">
                <p className="font-bold">Staff Rejection Reason:</p>
                <p className="font-medium text-red-800">
                  {payment.rejectionReason || 'The transaction reference (UTR) submitted could not be matched against centre bank records.'}
                </p>
              </div>
              <p className="text-xs text-slate-600 max-w-lg mx-auto">
                Do not worry — your admission form details remain securely saved. Please check your bank or UPI app receipt, correct the UTR number, and resubmit for verification.
              </p>
              <div className="pt-2">
                <Link
                  to="/admission/payment"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition shadow-xs"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Correct &amp; Resubmit Payment Details</span>
                </Link>
              </div>
            </div>
          ) : (
            /* CASE 3: SUBMITTED (UNDER REVIEW) -> Verification Pending Acknowledgment */
            <div className="rounded-xl border border-blue-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left border-b border-slate-100 pb-5">
                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                  <Clock className="h-8 w-8" />
                </div>
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1">
                    Staff Verification in Progress
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Admission Form &amp; Payment Submitted
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    “Payment details submitted. Your payment will be verified by the admissions team.”
                  </p>
                </div>
              </div>

              {/* Submitted Payment Snapshot */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs space-y-3">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Submitted Payment Information
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <dt className="text-slate-500">Submitted UTR / Transaction ID</dt>
                    <dd className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                      {payment.utr || 'Under Processing'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Payment Date</dt>
                    <dd className="font-medium text-slate-900 mt-0.5">
                      {payment.paymentDate || new Date().toISOString().split('T')[0]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Amount Payable</dt>
                    <dd className="font-mono font-bold text-brand-900 text-sm mt-0.5">
                      ₹{payment.registrationFee || 500}.00
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Admissions Desk Verification</dt>
                    <dd className="font-semibold text-blue-700 mt-0.5">
                      Pending (Verifying against bank records)
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Advisory note */}
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900">
                <p className="font-bold text-amber-950 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-amber-700 shrink-0" />
                  Why is my official fee receipt not generated yet?
                </p>
                <p className="mt-1 leading-relaxed text-amber-800">
                  A UPI transaction ID or screenshot is not automatic proof that funds have reached the centre account.
                  To protect applicants and maintain accurate audit logs, centre staff manually compare every UTR against official bank records before issuing the official stamped receipt.
                </p>
              </div>

              {/* Navigation Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link
                  to="/admission/payment"
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Update Submitted Payment Details</span>
                </Link>

                <Link
                  to="/profile"
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-800 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-900 transition shadow-xs"
                >
                  <span>Go to Student Profile</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Screen Only: Centre Instructions (Shown if verified) */}
          {isVerified && (
            <div className="print:hidden mt-6 rounded-xl border border-slate-200 bg-white p-5 text-xs text-slate-600">
              <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-orange-500" />
                What to bring on your first day at the Centre:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Printed copy of this receipt (quote Reference ID: <strong>{studentRefId}</strong>).</li>
                <li>Original and one photocopy of your 10th marksheet for verification.</li>
                <li>Government Photo ID proof (Aadhaar Card, Voter ID, or School/College ID).</li>
                <li>Two recent passport-size photographs.</li>
              </ul>
            </div>
          )}
        </div>
      </Container>

      {/* Strict 1-Page Print Stylesheet */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 8mm 8mm 8mm;
          }
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden, nav, header, footer {
            display: none !important;
          }
          #verified-receipt {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 4mm !important;
            border: 1.5px solid #0f172a !important;
            border-radius: 6px !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
    </>
  );
}