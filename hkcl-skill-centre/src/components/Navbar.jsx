import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import Brand from './Brand';
import { useAdmission } from '../context/AdmissionContext.jsx';

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
  const navigate = useNavigate();
  const { user, application } = useAdmission();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  const handleApplyClick = () => {
    navigate('/admission/personal-details');
  };

  const linkClass = ({ isActive }) =>
    `inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-2 text-[15px] lg:text-base font-medium transition-colors ${
      isActive
        ? 'bg-brand-50 text-brand-900 font-semibold'
        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
    }`;

  const isSubmitted = Boolean(
    application?.status === 'submitted' ||
    application?.status === 'approved' ||
    application?.payment?.status === 'paid'
  );

  const hasDraft = !isSubmitted && Boolean(application?.course?.slug || application?.personal?.fullName);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[88px] sm:min-h-[96px] items-center justify-between gap-4">
          {/* Brand & Logo */}
          <div className="min-w-0 shrink-0">
            <Brand />
          </div>

          {/* Desktop navigation & actions */}
          <div className="hidden min-w-0 flex-1 items-center justify-end gap-5 lg:flex">
            <nav aria-label="Main navigation" className="flex items-center gap-1.5">
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

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              {/* Submitted application / Profile link */}
              {isSubmitted && (
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `inline-flex min-h-10 items-center gap-2 rounded-lg border px-3.5 py-2 text-xs sm:text-sm font-medium transition ${
                      isActive
                        ? 'border-brand-800 bg-brand-50 text-brand-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`
                  }
                  title="View my application & receipt"
                >
                  <User className="h-4 w-4 text-slate-500" />
                  <span>My Application</span>
                </NavLink>
              )}

              {/* Draft in progress indicator */}
              {hasDraft && (
                <NavLink
                  to="/admission/personal-details"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                  title="Resume draft admission application"
                >
                  <span>Resume Draft</span>
                </NavLink>
              )}

              {/* Apply for Admission button */}
              <button
                type="button"
                onClick={handleApplyClick}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 active:scale-[0.98]"
              >
                Apply for Admission
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navbar-menu"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-slate-800" />}
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
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1.5 py-4 text-base">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center rounded-lg px-3.5 py-2 font-medium transition ${
                      isActive
                        ? 'bg-brand-50 text-brand-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {isSubmitted && (
                <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <NavLink
                    to="/profile"
                    className="flex min-h-11 items-center justify-between rounded-lg bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-800"
                  >
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-500" />
                      <span>My Application</span>
                    </span>
                    <span className="text-slate-400">→</span>
                  </NavLink>
                </div>
              )}

              {hasDraft && (
                <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <NavLink
                    to="/admission/personal-details"
                    className="flex min-h-11 items-center justify-between rounded-lg bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-800"
                  >
                    <span>Resume Draft Application</span>
                    <span className="text-slate-400">→</span>
                  </NavLink>
                </div>
              )}

              <button
                type="button"
                onClick={handleApplyClick}
                className="mt-3 inline-flex min-h-11 items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition"
              >
                Apply for Admission
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
