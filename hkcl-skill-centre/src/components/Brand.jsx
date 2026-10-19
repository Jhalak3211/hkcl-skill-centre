import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig.js';

/**
 * Editable brand mark. Shows an image if siteConfig.logo.src is set,
 * otherwise a simple text-based mark.
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
        <img src={logo.src} alt={logo.alt} className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <span
          aria-hidden="true"
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-lg font-bold shadow-xs transition-all duration-300 group-hover:scale-105 ${
            onDark ? 'bg-white text-brand-900' : 'bg-brand-800 text-white group-hover:bg-brand-700'
          }`}
        >
          H
        </span>
      )}
      <span className="leading-tight">
        <span
          className={`block font-display text-base font-semibold sm:text-lg ${
            onDark ? 'text-white' : 'text-brand-950'
          }`}
        >
          {name}
        </span>
        <span className={`block text-xs ${onDark ? 'text-brand-200' : 'text-muted'}`}>{locationName}</span>
      </span>
    </Link>
  );
}
