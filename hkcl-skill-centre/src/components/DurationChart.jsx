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
    <div className="relative">
      {/* Ambient decorative glow behind card */}
      <div
        className="pointer-events-none absolute -inset-2 rounded-[2rem] bg-gradient-to-tr from-brand-600/30 to-accent-500/20 opacity-70 blur-xl"
        aria-hidden="true"
      />

      <div className="on-dark relative rounded-[1.75rem] border border-white/15 bg-gradient-to-b from-brand-900 to-brand-950 p-6 text-white shadow-2xl shadow-brand-950/30 sm:p-8 backdrop-blur-xs">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-xl font-semibold sm:text-2xl">HS-CIT at a glance</h2>
          <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-accent-300">
            Certified
          </span>
        </div>
        <p className="mt-1 text-sm text-brand-200">Bar length shows how long each programme runs.</p>

        <ul className="mt-6 space-y-4">
          {rows.map((course, index) => (
            <li key={course.slug}>
              <Link
                to={`/courses/${course.slug}`}
                className="group block rounded-xl p-2 -mx-2 transition-all duration-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                aria-label={`${course.name}: ${getDurationText(course)}, ${getFeeText(course)}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium text-white transition-colors group-hover:text-accent-300">
                    {course.name}
                  </span>
                  <span className="text-sm font-semibold text-accent-300">{getFeeText(course)}</span>
                </div>
                <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                  <motion.div
                    className="h-full origin-left rounded-full bg-gradient-to-r from-accent-400 to-amber-300 shadow-xs"
                    style={{ width: `${(course.durationMonths / MAX_MONTHS) * 100}%` }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-brand-200">{getDurationText(course)}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 border-t border-white/10 pt-4 text-xs text-brand-200">
          Fees as listed by the centre. Please confirm the current fee before you enrol.
        </p>
      </div>
    </div>
  );
}
