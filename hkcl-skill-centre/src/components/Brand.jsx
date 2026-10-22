
import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig.js';

export default function Brand() {
  const { logo, name, locationName } = siteConfig;

  return (
    <Link
      to="/"
      aria-label={`${name}, home`}
      className="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <img
        src="/images/logo.png"
        alt={logo.alt || `${name} logo`}
        className="h-14 w-14 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16 lg:h-[72px] lg:w-[72px]"
      />

      <span className="flex min-w-0 flex-col justify-center gap-1">
        <span className="whitespace-nowrap text-base font-semibold leading-tight text-brand-950 sm:text-lg">
          {name}
        </span>

        <span className="whitespace-nowrap text-[11px] font-bold uppercase leading-tight tracking-wide text-orange-600 sm:text-xs">
          Authorised Learning Centre
        </span>

        <span className="text-xs leading-tight text-slate-500 sm:text-sm">
          {locationName}
        </span>
      </span>
    </Link>
  );
}
