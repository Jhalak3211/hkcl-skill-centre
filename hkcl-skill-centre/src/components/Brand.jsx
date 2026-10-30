import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig.js';

export default function Brand() {
  const { logo, name, locationName } = siteConfig;

  return (
    <Link
      to="/"
      aria-label={`${name}, home`}
      className="group flex min-w-0 items-center gap-3.5 sm:gap-4.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <img
        src="/images/hkcl-brand-logo.png"
        alt={logo.alt || `${name} logo`}
        className="h-20 w-auto shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-24 lg:h-28 xl:h-32"
      />

      <span className="flex min-w-0 flex-col justify-center">
        <span className="whitespace-nowrap font-display text-lg font-bold leading-tight text-brand-950 sm:text-xl lg:text-2xl xl:text-3xl">
          {name}
        </span>

        <span className="mt-1 text-xs font-medium leading-tight text-slate-500 sm:text-sm lg:text-base">
          {locationName}
        </span>
      </span>
    </Link>
  );
}
