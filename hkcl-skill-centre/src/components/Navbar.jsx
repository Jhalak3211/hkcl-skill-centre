import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Brand from './Brand.jsx';
import Button from './Button.jsx';
import Container from './Container.jsx';
import { siteConfig } from '../data/siteConfig.js';
import { getStudentPortalUrl } from '../utils/contact.js';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/contact', label: 'Contact' },
];

const linkClass = ({ isActive }) =>
  `relative inline-flex min-h-11 items-center rounded-full px-4 text-[0.95rem] font-medium transition-all duration-200 active:scale-[0.98] ${
    isActive
      ? 'bg-brand-100 text-brand-900 shadow-xs'
      : 'text-brand-900/80 hover:bg-brand-50 hover:text-brand-950'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors ${
    isActive ? 'bg-brand-100 font-semibold text-brand-900' : 'text-brand-900 hover:bg-brand-50'
  }`;

/** Student Login: direct external link when the URL is valid, else the /student-login page. */
function StudentLoginButton({ className = '', size = 'md' }) {
  const portalUrl = getStudentPortalUrl();
  const label = siteConfig.studentPortal.label;
  const props = portalUrl ? { href: portalUrl } : { to: '/student-login' };
  return (
    <Button variant="primary" size={size} className={className} {...props}>
      {label}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
    </Button>
  );
}

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  show: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape and give focus back to the menu button.
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
          ? 'border-b border-brand-200/80 bg-white/95 shadow-xs shadow-brand-900/5 backdrop-blur-md'
          : 'border-b border-brand-100 bg-white/90 backdrop-blur-sm'
      }`}
    >
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Brand />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <StudentLoginButton className="ml-3" />
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 text-brand-900 transition-all duration-200 hover:border-brand-400 hover:bg-brand-50 active:scale-95 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X className="h-5 w-5 transition-transform duration-200 rotate-90" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5 transition-transform duration-200" aria-hidden="true" />
          )}
        </button>
      </Container>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="overflow-hidden border-t border-brand-100 bg-white/95 backdrop-blur-md lg:hidden"
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
              <motion.div
                variants={mobileItemVariants}
                transition={{ delay: navLinks.length * 0.04 }}
              >
                <StudentLoginButton size="lg" className="mt-3 w-full" />
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
