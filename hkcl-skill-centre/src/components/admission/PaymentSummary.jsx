import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useAdmission } from '../../context/AdmissionContext.jsx';

export default function PaymentSummary({ onStatusChange }) {
  const { user, application, simulatePayment } = useAdmission();
  const payment = application.payment;
  const course = application.course;
  const studentRef = user?.studentId || application.id;

  const handleSimulate = (status) => {
    simulatePayment(status);
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  return (
    <div className="space-y-5">
      {/* Checkout Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Registration Fee</h2>
            <p className="text-xs text-slate-500 mt-0.5">{course?.name || 'Skill Centre Course'}</p>
          </div>
          <span className="font-mono text-xs text-slate-400">Ref: {studentRef}</span>
        </div>

        {/* Breakdown */}
        <div className="space-y-2.5 text-xs text-slate-600 mb-4">
          <div className="flex justify-between">
            <span>Online Registration &amp; Processing</span>
            <span className="font-semibold text-slate-900">₹{payment.registrationFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Document Verification</span>
            <span className="text-emerald-700 font-medium">Free</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2.5 text-sm font-bold text-slate-900">
            <span>Total Payable</span>
            <span className="text-brand-900">₹{payment.registrationFee}</span>
          </div>
        </div>

        {/* Status display (only if state changes) */}
        {payment.status === 'paid' && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Payment Verified (Txn: {payment.transactionId})</span>
          </div>
        )}

        {payment.status === 'pending' && (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            <Clock className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Payment Pending Gateway Confirmation</span>
          </div>
        )}

        {payment.status === 'failed' && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
            <XCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>Payment Declined (Simulation)</span>
          </div>
        )}
      </div>

      {/* Discreet Simulation Controls for Testing */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold text-slate-700 mb-2.5">
          Prototype Test Controls:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSimulate('paid')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 transition"
          >
            Simulate Paid
          </button>
          <button
            type="button"
            onClick={() => handleSimulate('pending')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 transition"
          >
            Simulate Pending
          </button>
          <button
            type="button"
            onClick={() => handleSimulate('failed')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 transition"
          >
            Simulate Failed
          </button>
        </div>
      </div>
    </div>
  );
}
