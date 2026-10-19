import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig.js';

/**
 * Brand mark component.
 *
 * If siteConfig.logo.src is set (a real logo file), it renders as an <img>.
 * Otherwise it renders the SVG-based "H" mark that matches the favicon.svg.
 *
 * The animated H in the hero is a separate decorative element and does NOT
 * replace this navbar/footer brand mark.
 */
export default function Brand({ onDark = false }) {
  const { logo, name, locationName } = siteConfig;

  return (
    <Link
      to="/"
      className="group flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      aria-label={`${name}, home`}
    >
      {logo.src ? (
        /* Use the real logo if one has been placed in /public/images/ */
        <img
          src={logo.src}
          alt={logo.alt}
          className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        /* SVG mark — matches the favicon geometry for visual consistency */
        <span
          aria-hidden="true"
          className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-xs transition-all duration-300 group-hover:scale-105 ${
            onDark
              ? 'bg-white/15'
              : 'bg-brand-800 dark:bg-brand-700 group-hover:bg-brand-700 dark:group-hover:bg-brand-600'
          }`}
        >
          <svg viewBox="0 0 64 64" className="h-full w-full" fill="none" aria-hidden="true">
            {/* H letterform */}
            <path
              d="M20 16v32M44 16v32M20 32h24"
              stroke="white"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Accent bar — matches favicon */}
            <rect x="38" y="44" width="14" height="6" rx="3" fill="#f4b63d" />
          </svg>
        </span>
      )}

      <span className="leading-tight">
        <span
          className={`block font-display text-base font-semibold sm:text-lg ${
            onDark ? 'text-white' : 'text-brand-950 dark:text-white'
          }`}
        >
          {name}
        </span>
        <span
          className={`block text-xs ${
            onDark ? 'text-brand-200' : 'text-muted dark:text-slate-400'
          }`}
        >
          {locationName}
        </span>
      </span>
    </Link>
  );
}
