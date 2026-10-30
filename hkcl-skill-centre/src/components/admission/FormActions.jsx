import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmission } from '../../context/AdmissionContext.jsx';

export default function FormActions({
  backPath,
  backLabel = 'Back',
  nextLabel = 'Save & Continue',
  onNext,
  isSubmitting = false,
  showSaveDraft = true,
  disabled = false,
  submitType = 'button',
}) {
  const navigate = useNavigate();
  const { saveDraft, draftSavedToast } = useAdmission();

  return (
    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Back Button */}
      {backPath ? (
        <button
          type="button"
          onClick={() => navigate(backPath)}
          disabled={isSubmitting}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{backLabel}</span>
        </button>
      ) : (
        <div />
      )}

      {/* Right: Save Draft & Primary Next/Submit Action */}
      <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5">
        {showSaveDraft && (
          <button
            type="button"
            onClick={saveDraft}
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
          >
            {draftSavedToast ? 'Saved ✓' : 'Save Draft'}
          </button>
        )}

        <button
          type={submitType}
          onClick={submitType === 'button' ? onNext : undefined}
          disabled={disabled || isSubmitting}
          className="w-full sm:w-auto inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-brand-800 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-900 transition disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>{nextLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
