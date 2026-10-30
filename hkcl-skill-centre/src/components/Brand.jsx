import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig.js';

export default function Brand() {
  const { logo } = siteConfig;

  return (
    <Link
      to="/"
      aria-label="HKCL Skill Centre, home"
      className="group flex min-w-0 items-center gap-3.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <img
        src="/images/logo.png"
        alt={logo.alt || 'HKCL Skill Centre logo'}
        className="h-13 w-13 sm:h-14 sm:w-14 lg:h-15 lg:w-15 shrink-0 object-contain transition-transform duration-200 group-hover:scale-105"
      />

      <span className="flex min-w-0 flex-col justify-center">
        <span className="whitespace-nowrap text-lg sm:text-xl lg:text-[22px] font-bold tracking-tight text-brand-950 leading-tight">
          HKCL Skill Centre
        </span>
        <span className="whitespace-nowrap text-xs sm:text-[13px] font-medium text-slate-500 leading-tight mt-0.5">
          Run by Achariya Educational Institution
        </span>
      </span>
    </Link>
  );
}
