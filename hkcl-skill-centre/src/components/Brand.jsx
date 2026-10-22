
import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig.js';

export default function Brand({ onDark = false }) {
  const { logo, name, locationName } = siteConfig;

  return (
    <Link
      to="/"
      className="group flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      aria-label={`${name}, home`}
    >
      {/* Circular logo */}
      <img
        src="/images/logo.png"
        alt={logo.alt || `${name} logo`}
        className="h-10 w-10 shrink-0 rounded-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12"
      />

      {/* Brand name and location */}
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
