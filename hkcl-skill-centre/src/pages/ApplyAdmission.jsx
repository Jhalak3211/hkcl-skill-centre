
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import Select from 'react-select';
import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import { courses } from '../data/courses.js';

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  qualification: '',
  course: '',
  batch: '',
  message: '',
  consent: false,
};

const inputClass =
  'mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10';

const labelClass = 'text-sm font-medium text-slate-700';

function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  children,
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      {children}

      {hint && (
        <p className="mt-1.5 text-xs leading-5 text-slate-500">
          {hint}
        </p>
      )}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ApplyAdmission() {
  const [searchParams] = useSearchParams();

  const availableCourses = useMemo(
    () => courses.filter((course) => course.published !== false),
    [],
  );

  const courseOptions = useMemo(
    () =>
      availableCourses.map((course) => ({
        value: course.slug,
        label: course.name,
        keywords: [
          course.name,
          course.slug,
          course.subtitle,
          course.summary,
          course.description,
          course.category,
        ]
          .filter(Boolean)
          .join(' '),
      })),
    [availableCourses],
  );

  const requestedCourse = searchParams.get('course') || '';

  const validRequestedCourse = availableCourses.some(
    (course) => course.slug === requestedCourse,
  )
    ? requestedCourse
    : '';

  const [form, setForm] = useState(() => ({
    ...initialForm,
    course: validRequestedCourse,
  }));

  const [errors, setErrors] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState('');

  const selectedCourse = availableCourses.find(
    (course) => course.slug === form.course,
  );

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }));

    setSubmissionMessage('');
  };

  const updatePhone = (event) => {
    const phone = event.target.value.replace(/\D/g, '').slice(0, 10);

    setForm((previous) => ({ ...previous, phone }));
    setErrors((previous) => ({ ...previous, phone: '' }));
    setSubmissionMessage('');
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.';
    } else if (form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter a valid name.';
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.qualification) {
      nextErrors.qualification = 'Please select your qualification.';
    }

    if (!form.course) {
      nextErrors.course = 'Please select a course.';
    }

    if (!form.batch) {
      nextErrors.batch = 'Please select your preferred batch.';
    }

    if (!form.consent) {
      nextErrors.consent = 'Please provide consent before continuing.';
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    const firstInvalidField = Object.keys(nextErrors)[0];

    if (firstInvalidField) {
      setSubmissionMessage('Please correct the highlighted fields.');

      const field = document.getElementById(firstInvalidField);

      field?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      field?.focus({ preventScroll: true });
      return;
    }

    setSubmissionMessage(
      'Your details passed validation, but online submission is not active yet. Please connect the admission API before accepting applications.',
    );
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 48,
      borderRadius: 12,
      borderColor: errors.course
        ? '#dc2626'
        : state.isFocused
          ? '#315b9b'
          : '#e2e8f0',
      boxShadow: state.isFocused
        ? '0 0 0 3px rgba(49,91,155,0.10)'
        : 'none',
      '&:hover': {
        borderColor: errors.course ? '#dc2626' : '#315b9b',
      },
      fontSize: 14,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '4px 12px',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#94a3b8',
    }),
    input: (base) => ({
      ...base,
      color: '#0f172a',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 12px 30px rgba(15,23,42,0.12)',
    }),
    option: (base, state) => ({
      ...base,
      padding: '11px 14px',
      fontSize: 14,
      color: state.isSelected ? '#ffffff' : '#334155',
      backgroundColor: state.isSelected
        ? '#234477'
        : state.isFocused
          ? '#f1f5f9'
          : '#ffffff',
      cursor: 'pointer',
    }),
  };

  return (
    <>
      <Seo
        title="Apply for Admission"
        path="/apply"
        description="Apply for courses at HKCL Skill Centre, Sirsa. Select your course and provide your contact details."
      />

      <section className="border-b border-slate-200 bg-slate-50">
        <Container className="py-7 sm:py-9">
          <Link
            to="/courses"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-brand-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to courses
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-800 text-white shadow-sm">
              <GraduationCap className="h-6 w-6" aria-hidden="true" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl">
                Admission Enquiry
              </h1>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                Share your details to enquire about a course.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-7 sm:py-10 lg:py-12">
        <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* Admission form */}
          <form
            id="admission-form"
            onSubmit={handleSubmit}
            noValidate
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
          >
            {/* Link to Multi-Step Complete Admission Portal */}
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
              <span className="text-slate-700">
                Applying for complete online admission?
              </span>
              <Link
                to="/admission/personal-details"
                className="font-semibold text-brand-800 hover:underline shrink-0"
              >
                Online Admission Application →
              </Link>
            </div>

            <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <p className="text-sm text-slate-600">
                Fields marked with{' '}
                <span className="font-semibold text-red-600">*</span> are
                required.
              </p>

              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <ShieldCheck
                  className="h-4 w-4 text-brand-700"
                  aria-hidden="true"
                />
                Admission details
              </span>
            </div>

            <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
              <FormField
                label="Full name"
                htmlFor="fullName"
                required
                error={errors.fullName}
              >
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={updateField}
                  placeholder="Enter your full name"
                  className={inputClass}
                  aria-invalid={Boolean(errors.fullName)}
                  required
                />
              </FormField>

              <FormField
                label="Mobile number"
                htmlFor="phone"
                required
                hint="Enter your 10-digit Indian mobile number."
                error={errors.phone}
              >
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  value={form.phone}
                  onChange={updatePhone}
                  placeholder="10-digit mobile number"
                  className={inputClass}
                  aria-invalid={Boolean(errors.phone)}
                  required
                />
              </FormField>

              <FormField
                label="Email address"
                htmlFor="email"
                hint="Optional"
                error={errors.email}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  className={inputClass}
                  aria-invalid={Boolean(errors.email)}
                />
              </FormField>

              <FormField
                label="Highest qualification"
                htmlFor="qualification"
                required
                error={errors.qualification}
              >
                <select
                  id="qualification"
                  name="qualification"
                  value={form.qualification}
                  onChange={updateField}
                  className={inputClass}
                  aria-invalid={Boolean(errors.qualification)}
                  required
                >
                  <option value="">Select qualification</option>
                  <option value="Below 10th">Below 10th</option>
                  <option value="10th pass">10th pass</option>
                  <option value="12th pass">12th pass</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Other">Other</option>
                </select>
              </FormField>

              <div className="sm:col-span-2">
                <FormField
                  label="Choose a course"
                  htmlFor="course"
                  required
                  hint="Search by course name, topic, or keyword."
                  error={errors.course}
                >
                  <div className="mt-2">
                    <Select
                      inputId="course"
                      name="course"
                      options={courseOptions}
                      value={
                        courseOptions.find(
                          (option) => option.value === form.course,
                        ) ?? null
                      }
                      onChange={(option) => {
                        setForm((previous) => ({
                          ...previous,
                          course: option?.value ?? '',
                        }));

                        setErrors((previous) => ({
                          ...previous,
                          course: '',
                        }));

                        setSubmissionMessage('');
                      }}
                      filterOption={(candidate, inputValue) => {
                        const searchableText =
                          `${candidate.label} ${candidate.data.keywords}`.toLowerCase();

                        const terms = inputValue
                          .trim()
                          .toLowerCase()
                          .split(/\s+/)
                          .filter(Boolean);

                        return terms.every((term) =>
                          searchableText.includes(term),
                        );
                      }}
                      placeholder="Search courses..."
                      noOptionsMessage={({ inputValue }) =>
                        inputValue
                          ? `No courses found for "${inputValue}"`
                          : 'No courses available'
                      }
                      isSearchable
                      isClearable
                      styles={selectStyles}
                      classNamePrefix="course-select"
                      aria-invalid={Boolean(errors.course)}
                    />
                  </div>
                </FormField>
              </div>

              {selectedCourse && (
                <div className="sm:col-span-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-800 shadow-sm">
                        <BookOpen className="h-5 w-5" aria-hidden="true" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-brand-950">
                          {selectedCourse.name}
                        </p>

                        {selectedCourse.subtitle && (
                          <p className="mt-1 text-sm leading-5 text-slate-600">
                            {selectedCourse.subtitle}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedCourse.duration && (
                            <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                              Duration: {selectedCourse.duration}
                            </span>
                          )}

                          {selectedCourse.fee != null && (
                            <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                              Fee: ₹
                              {Number(selectedCourse.fee).toLocaleString(
                                'en-IN',
                              )}
                              {selectedCourse.feeUnit
                                ? ` ${selectedCourse.feeUnit}`
                                : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <FormField
                label="Preferred batch"
                htmlFor="batch"
                required
                hint="Final timings will be confirmed by the centre."
                error={errors.batch}
              >
                <select
                  id="batch"
                  name="batch"
                  value={form.batch}
                  onChange={updateField}
                  className={inputClass}
                  aria-invalid={Boolean(errors.batch)}
                  required
                >
                  <option value="">Select batch preference</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Flexible">Flexible / Any batch</option>
                </select>
              </FormField>

              <div className="sm:col-span-2">
                <FormField
                  label="Additional questions"
                  htmlFor="message"
                  hint="Optional"
                >
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    maxLength={1000}
                    value={form.message}
                    onChange={updateField}
                    placeholder="Any questions about the course?"
                    className={`${inputClass} min-h-28 resize-y`}
                  />
                </FormField>
              </div>
            </div>

            <div className="mt-7 border-t border-slate-100 pt-6">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  id="consent"
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={updateField}
                  className="mt-1 h-4 w-4 shrink-0 accent-brand-800"
                  aria-invalid={Boolean(errors.consent)}
                  required
                />

                <span className="text-sm leading-6 text-slate-600">
                  I agree that HKCL Skill Centre may use the details I provide
                  to contact me regarding this admission enquiry.
                  <span className="ml-1 text-red-600">*</span>
                </span>
              </label>

              {errors.consent && (
                <p
                  className="mt-2 text-xs font-medium text-red-600"
                  role="alert"
                >
                  {errors.consent}
                </p>
              )}
            </div>

            {submissionMessage && (
              <div
                role="status"
                aria-live="polite"
                className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
              >
                {submissionMessage}
              </div>
            )}

            <div className="mt-7 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-500">
                Your details will not be stored or sent until the admission
                backend is connected.
              </p>

              <button
                type="submit"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                Submit enquiry
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </form>

          {/* Instructions outside the form */}
          <aside className="min-w-0 space-y-4 lg:sticky lg:top-6">
            <section className="rounded-2xl bg-brand-950 p-5 text-white sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <GraduationCap
                    className="h-5 w-5 text-orange-400"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Before you apply
                </h2>
              </div>

              <ul className="mt-4 space-y-3 text-sm leading-5 text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" aria-hidden="true" />
                  <span>Keep your mobile number handy so the centre can contact you.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" aria-hidden="true" />
                  <span>Review the course details before making your selection.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" aria-hidden="true" />
                  <span>Confirm fees and batch timings with the centre.</span>
                </li>
              </ul>

              <Link
                to="/courses"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-300 transition hover:text-orange-200"
              >
                Browse all courses
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-800" aria-hidden="true" />
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold leading-6 tracking-tight text-brand-950">
                    Your information
                  </h2>
                  <p className="mt-2 text-sm leading-5 text-slate-600">
                    Your details are requested for this admission enquiry. Online submission will be available once the admission backend is connected.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-800" aria-hidden="true" />
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold leading-6 tracking-tight text-brand-950">
                    Need help?
                  </h2>
                  <p className="mt-2 text-sm leading-5 text-slate-600">
                    Need help choosing a course?{' '}
                    <Link
                      to="/courses"
                      className="font-semibold text-brand-800 underline-offset-4 hover:underline"
                    >
                      Browse all courses
                    </Link>{' '}
                    or{' '}
                    <Link
                      to="/contact"
                      className="font-semibold text-brand-800 underline-offset-4 hover:underline"
                    >
                      contact the centre
                    </Link>.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </Container>
    </>
  );
}
