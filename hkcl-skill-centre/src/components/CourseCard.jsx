import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import Button from './Button.jsx';
import { getEnquiryProps } from '../utils/contact.js';
import {
  getCategoryLabel,
  getDurationText,
  getFeeText,
  getFeeUnit,
} from '../utils/format.js';

/**
 * Reusable course card.
 *  variant="feature" : large card with the duration set in display type (home page)
 *  variant="default" : standard card
 *  variant="compact" : dense card for long lists such as the HCOC series
 */
export default function CourseCard({ course, variant = 'default', headingLevel: H = 'h3', showCategory = true }) {
  const headingId = `course-${course.slug}`;
  const duration = getDurationText(course);
  const fee = getFeeText(course);
  const feeUnit = getFeeUnit(course);
  const enquiry = getEnquiryProps(course);
  const feature = variant === 'feature';
  const compact = variant === 'compact';

  return (
    <article
      aria-labelledby={headingId}
      className={`group relative flex h-full flex-col rounded-2xl border transition-all duration-300 ease-out hover:-translate-y-1 focus-within:ring-2 focus-within:ring-brand-500/20 backdrop-blur-md ${
        feature
          ? 'border-brand-200/90 bg-white/85 p-6 shadow-sm hover:border-brand-400 hover:shadow-xl hover:shadow-brand-900/8 sm:p-7'
          : 'border-brand-100/90 bg-white/80 p-5 shadow-xs hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/6'
      }`}
    >
      {showCategory && (
        <p className="mb-3 inline-flex w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800 transition-colors group-hover:bg-brand-100/80">
          {getCategoryLabel(course)}
        </p>
      )}

      <H
        id={headingId}
        className={`font-semibold text-brand-950 transition-colors duration-200 group-hover:text-brand-700 ${
          feature ? 'text-3xl' : compact ? 'text-lg' : 'text-xl'
        }`}
      >
        <Link
          to={`/courses/${course.slug}`}
          className="rounded-sm hover:text-brand-700 hover:underline hover:decoration-brand-300 hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {course.name}
        </Link>
      </H>

      {course.subtitle && (
        <p className={`mt-1 text-slate-500 ${compact ? 'text-xs' : 'text-sm'}`}>{course.subtitle}</p>
      )}

      {!compact && <p className="mt-3 text-sm text-slate-600 sm:text-base leading-relaxed">{course.summary}</p>}

      {feature ? (
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-brand-100 pt-5">
          <div>
            <dt className="text-sm text-slate-500">Duration</dt>
            <dd className="mt-1 font-display text-2xl font-semibold text-brand-900">{duration}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Fee</dt>
            <dd className="mt-1 font-display text-2xl font-semibold text-brand-900">
              {fee}
              {feeUnit && <span className="block text-xs font-normal text-slate-500">{feeUnit}</span>}
            </dd>
          </div>
        </dl>
      ) : (
        <dl className={`mt-4 grid gap-x-4 gap-y-2 text-sm ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <div>
            <dt className="text-xs text-slate-500">Duration</dt>
            <dd className="font-medium text-brand-900">{duration}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Fee</dt>
            <dd className="font-medium text-brand-900">
              {fee}
              {feeUnit && <span className="font-normal text-slate-500"> {feeUnit}</span>}
            </dd>
          </div>
          {course.eligibility && (
            <div className="col-span-full">
              <dt className="text-xs text-slate-500">Eligibility</dt>
              <dd className="font-medium text-brand-900">{course.eligibility}</dd>
            </div>
          )}
        </dl>
      )}

      
<div className="mt-auto flex flex-wrap gap-2 pt-6">
  <Button to={`/courses/${course.slug}`} variant="secondary" size="sm">
    View details
    <span className="sr-only"> for {course.name}</span>
  </Button>

  <Button to={`/apply?course=${encodeURIComponent(course.slug)}`} variant="primary" size="sm">
    Apply Now
    <span className="sr-only"> for {course.name}</span>
  </Button>

  <Button {...enquiry} variant="secondary" size="sm">
    <MessageCircle
      className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
      aria-hidden="true"
    />
    Enquire
    <span className="sr-only"> about {course.name}</span>
  </Button>
</div>

    </article>
  );
}
