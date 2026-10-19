import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourseBySlug } from '../data/courses.js';
import { getDurationText, getFeeText } from '../utils/format.js';

const slugs = ['hs-cit', 'hs-cit-a', 'hs-cit-a-plus'];
const MAX_MONTHS = 12;

/**
 * Hero visual: the three HS-CIT programmes drawn as bars whose length is
 * proportional to course duration. Reads durations and fees from courses.js,
 * so it updates automatically when you edit the data.
 */
export default function DurationChart() {
  const rows = slugs.map(getCourseBySlug).filter((course) => course?.durationMonths);

  if (rows.length === 0) return null;

  return (
    <div className="on-dark rounded-[1.75rem] bg-brand-900 p-6 text-white shadow-xl shadow-brand-900/20 sm:p-8">
      <h2 className="font-display text-xl font-semibold sm:text-2xl">HS-CIT at a glance</h2>
      <p className="mt-1 text-sm text-brand-200">Bar length shows how long each programme runs.</p>

      <ul className="mt-6 space-y-5">
        {rows.map((course, index) => (
          <li key={course.slug}>
            <Link
              to={`/courses/${course.slug}`}
              className="group block rounded-xl py-1 transition-colors"
              aria-label={`${course.name}: ${getDurationText(course)}, ${getFeeText(course)}`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium group-hover:underline group-hover:underline-offset-4">
                  {course.name}
                </span>
                <span className="text-sm text-brand-200">{getFeeText(course)}</span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                <motion.div
                  className="h-full origin-left rounded-full bg-accent-400"
                  style={{ width: `${(course.durationMonths / MAX_MONTHS) * 100}%` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="mt-1.5 text-sm text-brand-100">{getDurationText(course)}</p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 border-t border-white/10 pt-4 text-xs text-brand-200">
        Fees as listed by the centre. Please confirm the current fee before you enrol.
      </p>
    </div>
  );
}
