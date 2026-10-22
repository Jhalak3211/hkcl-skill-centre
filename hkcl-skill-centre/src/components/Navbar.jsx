
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Brand from './Brand';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  const linkClass = ({ isActive }) =>
    `inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors xl:px-4 ${
      isActive
        ? 'bg-brand-100 text-brand-900'
        : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Main header */}
        <div className="flex min-h-[88px] items-center justify-between gap-2 sm:min-h-[96px] sm:gap-4 lg:min-h-[100px]">
          {/* Brand: logo, name and tagline */}
          <div className="min-w-0 flex-1 lg:flex-none">
            <Brand />
          </div>

          {/* Desktop navigation */}
          <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 lg:flex xl:gap-4">
            <nav
              aria-label="Main navigation"
              className="flex items-center gap-1"
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={linkClass}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <NavLink
              to="/admission"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
            >
              Apply for Admission
              <span aria-hidden="true">→</span>
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-brand-900 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navbar-menu"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        <div
          id="mobile-navbar-menu"
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out lg:hidden ${
            open
              ? 'grid-rows-[1fr] border-t border-slate-100 opacity-100'
              : 'pointer-events-none grid-rows-[0fr] opacity-0'
          }`}
          aria-hidden={!open}
          inert={!open}
        >
          <div className="overflow-hidden">
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1 py-3"
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-100 text-brand-900'
                        : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <NavLink
                to="/admission"
                className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                Apply for Admission
                <span aria-hidden="true">→</span>
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
