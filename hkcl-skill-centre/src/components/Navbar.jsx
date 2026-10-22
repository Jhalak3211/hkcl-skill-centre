import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Brand from './Brand.jsx';
import Container from './Container.jsx';
import ThemeToggle from './ThemeToggle.jsx';

/** Navigation links — Student Login intentionally removed. */
const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/courses', label: 'Courses' },
  { to: '/contact', label: 'Contact' },
];

const linkClass = ({ isActive }) =>
  `relative inline-flex min-h-11 items-center rounded-full px-4 text-[0.95rem] font-medium transition-all duration-200 active:scale-[0.98] ${
    isActive
      ? 'bg-brand-100 text-brand-900 shadow-xs dark:bg-white/15 dark:text-white dark:shadow-white/5'
      : 'text-brand-900/80 hover:bg-brand-50/80 hover:text-brand-950 dark:text-slate-200/80 dark:hover:bg-white/10 dark:hover:text-white'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors ${
    isActive
      ? 'bg-brand-100 font-semibold text-brand-900 dark:bg-white/15 dark:text-white'
      : 'text-brand-900 hover:bg-brand-50/80 dark:text-slate-200 dark:hover:bg-white/10'
  }`;

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  show: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef(null);

  // Monitor scroll position for dynamic glass navbar styling.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape and restore focus to the menu button.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-brand-200/80 bg-white/85 shadow-md shadow-brand-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85 dark:shadow-black/40'
          : 'border-b border-brand-100/80 bg-white/70 backdrop-blur-md dark:border-white/5 dark:bg-slate-950/70'
      }`}
    >
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Brand />

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-1.5 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <ThemeToggle className="ml-3" />
        </nav>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle size="sm" />
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white/80 text-brand-900 transition-all duration-200 hover:border-brand-400 hover:bg-brand-50 active:scale-95 dark:border-white/15 dark:bg-slate-900/80 dark:text-white dark:hover:border-white/30 dark:hover:bg-slate-800"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5 transition-transform duration-200 rotate-90" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5 transition-transform duration-200" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="overflow-hidden border-t border-brand-100/80 bg-white/95 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95 lg:hidden"
          >
            <Container as="nav" aria-label="Mobile" className="flex flex-col gap-1.5 py-4">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.to}
                  variants={mobileItemVariants}
                  transition={{ delay: idx * 0.04 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={mobileLinkClass}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}

              {/* Theme toggle row */}
              <motion.div
                variants={mobileItemVariants}
                transition={{ delay: navLinks.length * 0.04 }}
                className="mt-2 flex items-center justify-between rounded-xl border border-brand-100/70 bg-brand-50/50 px-4 py-2.5 dark:border-white/10 dark:bg-white/5"
              >
                <span className="text-sm font-medium text-brand-950 dark:text-slate-200">Theme</span>
                <ThemeToggle size="sm" />
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
