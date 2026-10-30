import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export const ADMISSION_STEPS = [
  { step: 1, id: 'personal', name: 'Course & Personal', path: '/admission/personal-details' },
  { step: 2, id: 'education', name: 'Education', path: '/admission/educational-details' },
  { step: 3, id: 'documents', name: 'Documents', path: '/admission/documents' },
  { step: 4, id: 'review', name: 'Review', path: '/admission/review' },
  { step: 5, id: 'payment', name: 'Payment', path: '/admission/payment' },
  { step: 6, id: 'confirmation', name: 'Confirmation', path: '/admission/confirmation' },
];

export default function AdmissionStepper({ currentStep = 1, maxUnlockedStep = 1 }) {
  const currentStepData = ADMISSION_STEPS.find((s) => s.step === currentStep) || ADMISSION_STEPS[0];
  const progressPercentage = Math.round(((currentStep - 1) / (ADMISSION_STEPS.length - 1)) * 100);

  return (
    <nav aria-label="Progress" className="w-full mb-6 sm:mb-8">
      {/* Mobile: Simple 1-line progress */}
      <div className="block lg:hidden rounded-lg border border-slate-200 bg-white p-3 text-xs">
        <div className="flex items-center justify-between text-slate-600 mb-1.5 font-medium">
          <span>Step {currentStep} of {ADMISSION_STEPS.length}: {currentStepData.name}</span>
          <span className="font-semibold text-slate-800">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-brand-800 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(10, progressPercentage)}%` }}
          />
        </div>
      </div>

      {/* Desktop: Clean horizontal stepper */}
      <div className="hidden lg:block rounded-xl border border-slate-200 bg-white p-4">
        <ol className="flex items-center justify-between w-full">
          {ADMISSION_STEPS.map((s, index) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            const isUnlocked = s.step <= maxUnlockedStep;

            return (
              <li
                key={s.id}
                className={`relative flex-1 flex flex-col items-center ${
                  index !== ADMISSION_STEPS.length - 1
                    ? 'after:content-[""] after:w-full after:h-px after:bg-slate-200 after:absolute after:top-3.5 after:left-1/2 after:z-0'
                    : ''
                } ${isCompleted ? 'after:!bg-brand-700' : ''}`}
              >
                {isUnlocked ? (
                  <Link
                    to={s.path}
                    className="relative z-10 flex flex-col items-center group focus:outline-none"
                  >
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition ${
                        isCompleted
                          ? 'bg-brand-800 text-white'
                          : isCurrent
                            ? 'bg-orange-500 text-white font-bold'
                            : 'border border-slate-300 bg-white text-slate-500 group-hover:border-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : s.step}
                    </div>
                    <span
                      className={`mt-1.5 text-xs text-center ${
                        isCurrent
                          ? 'font-bold text-slate-900'
                          : isCompleted
                            ? 'font-medium text-slate-700'
                            : 'text-slate-400'
                      }`}
                    >
                      {s.name}
                    </span>
                  </Link>
                ) : (
                  <div className="relative z-10 flex flex-col items-center cursor-not-allowed">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-400">
                      {s.step}
                    </div>
                    <span className="mt-1.5 text-xs text-slate-400 text-center">
                      {s.name}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
