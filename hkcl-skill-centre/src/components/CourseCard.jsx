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
 * Eligibility is shown on a card only when it is known. The details page
 * always shows it, with a fallback message when unknown.
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
          ? 'border-brand-200/90 bg-white/80 p-6 shadow-sm hover:border-brand-400 hover:shadow-xl hover:shadow-brand-900/8 sm:p-7 dark:border-white/12 dark:bg-slate-900/70 dark:shadow-black/40 dark:hover:border-white/25 dark:hover:shadow-black/60'
          : 'border-brand-100/90 bg-white/75 p-5 shadow-xs hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/6 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-black/30 dark:hover:border-white/20 dark:hover:shadow-black/50'
      }`}
    >
      {/* Top subtle brand gradient accent bar that reveals on hover */}
      {/* <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-brand-600 via-brand-400 to-accent-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-brand-500 dark:via-cyan-400 dark:to-accent-400"
        aria-hidden="true"
      /> */}

      {showCategory && (
        <p className="mb-3 inline-flex w-fit rounded-full bg-brand-50/90 px-3 py-1 text-xs font-medium text-brand-800 transition-colors group-hover:bg-brand-100/70 dark:border dark:border-white/10 dark:bg-white/10 dark:text-blue-300">
          {getCategoryLabel(course)}
        </p>
      )}

      <H
        id={headingId}
        className={`font-semibold text-brand-950 transition-colors duration-200 group-hover:text-brand-700 dark:text-white dark:group-hover:text-blue-300 ${
          feature ? 'text-3xl' : compact ? 'text-lg' : 'text-xl'
        }`}
      >
        <Link
          to={`/courses/${course.slug}`}
          className="rounded-sm hover:text-brand-700 hover:underline hover:decoration-brand-300 hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:text-blue-300"
        >
          {course.name}
        </Link>
      </H>

      {course.subtitle && (
        <p className={`mt-1 text-muted dark:text-slate-300 ${compact ? 'text-xs' : 'text-sm'}`}>{course.subtitle}</p>
      )}

      {!compact && <p className="mt-3 text-sm text-muted sm:text-base dark:text-slate-300 leading-relaxed">{course.summary}</p>}

      {feature ? (
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-brand-100 pt-5 dark:border-white/10">
          <div>
            <dt className="text-sm text-muted dark:text-slate-400">Duration</dt>
            <dd className="mt-1 font-display text-2xl font-semibold text-brand-900 dark:text-white">{duration}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted dark:text-slate-400">Fee</dt>
            <dd className="mt-1 font-display text-2xl font-semibold text-brand-900 dark:text-white">
              {fee}
              {feeUnit && <span className="block text-xs font-normal text-muted dark:text-slate-400">{feeUnit}</span>}
            </dd>
          </div>
        </dl>
      ) : (
        <dl className={`mt-4 grid gap-x-4 gap-y-2 text-sm ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <div>
            <dt className="text-xs text-muted dark:text-slate-400">Duration</dt>
            <dd className="font-medium text-brand-900 dark:text-white">{duration}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted dark:text-slate-400">Fee</dt>
            <dd className="font-medium text-brand-900 dark:text-white">
              {fee}
              {feeUnit && <span className="font-normal text-muted dark:text-slate-400"> {feeUnit}</span>}
            </dd>
          </div>
          {course.eligibility && (
            <div className="col-span-full">
              <dt className="text-xs text-muted dark:text-slate-400">Eligibility</dt>
              <dd className="font-medium text-brand-900 dark:text-white">{course.eligibility}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        <Button to={`/courses/${course.slug}`} variant="secondary" size="sm">
          View details
          <span className="sr-only"> for {course.name}</span>
        </Button>
        <Button {...enquiry} variant="primary" size="sm">
          <MessageCircle className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
          Enquire
          <span className="sr-only"> about {course.name}</span>
        </Button>
      </div>
    </article>
  );
}
