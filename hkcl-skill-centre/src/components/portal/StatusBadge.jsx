import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  CreditCard,
  GraduationCap,
  Shield,
  UserCheck,
  UserX,
} from 'lucide-react';

/**
 * Standardized Institutional Status Badge
 */
export default function StatusBadge({ status, label, size = 'sm' }) {
  const norm = (status || '').toString().toLowerCase().trim();

  let config = {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    icon: FileText,
    textLabel: label || norm.replace(/_/g, ' '),
  };

  switch (norm) {
    case 'under_review':
    case 'review':
      config = {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: Clock,
        textLabel: label || 'Under Review',
      };
      break;

    case 'corrections_required':
    case 'correction':
      config = {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        icon: AlertTriangle,
        textLabel: label || 'Corrections Needed',
      };
      break;

    case 'documents_approved':
      config = {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: CheckCircle2,
        textLabel: label || 'Docs Approved',
      };
      break;

    case 'payment_pending':
      config = {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: Clock,
        textLabel: label || 'Fee Pending',
      };
      break;

    case 'payment_submitted':
      config = {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        icon: CreditCard,
        textLabel: label || 'Payment Review',
      };
      break;

    case 'payment_verified':
    case 'paid':
      config = {
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
        icon: CheckCircle2,
        textLabel: label || 'Fee Verified',
      };
      break;

    case 'admitted':
    case 'approved':
      config = {
        bg: 'bg-green-50',
        text: 'text-green-800',
        border: 'border-green-300',
        icon: GraduationCap,
        textLabel: label || 'Admitted',
      };
      break;

    case 'rejected':
      config = {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: XCircle,
        textLabel: label || 'Rejected',
      };
      break;

    case 'submitted':
    case 'new':
      config = {
        bg: 'bg-sky-50',
        text: 'text-sky-700',
        border: 'border-sky-200',
        icon: Clock,
        textLabel: label || 'New Submission',
      };
      break;

    case 'active':
      config = {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: UserCheck,
        textLabel: label || 'Active',
      };
      break;

    case 'pending':
      config = {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: Clock,
        textLabel: label || 'Pending',
      };
      break;

    case 'deactivated':
      config = {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        icon: UserX,
        textLabel: label || 'Deactivated',
      };
      break;

    case 'published':
      config = {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: CheckCircle2,
        textLabel: label || 'Published',
      };
      break;

    case 'draft':
      config = {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-200',
        icon: FileText,
        textLabel: label || 'Draft',
      };
      break;

    default:
      config = {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
        icon: FileText,
        textLabel: label || norm || 'Unknown',
      };
      break;
  }

  const Icon = config.icon;
  const sizeClasses = size === 'xs' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md capitalize ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <Icon className={size === 'xs' ? 'h-3 w-3 shrink-0' : 'h-3.5 w-3.5 shrink-0'} />
      <span className="truncate">{config.textLabel}</span>
    </span>
  );
}
