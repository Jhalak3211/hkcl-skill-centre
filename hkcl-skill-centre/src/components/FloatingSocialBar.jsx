import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X } from 'lucide-react';
import { siteConfig } from '../data/siteConfig.js';
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from './SocialIcons.jsx';

export default function FloatingSocialBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef(null);
  const { social } = siteConfig;

  // Close mobile widget when clicking outside
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [mobileOpen]);

  const socialLinks = [
    {
      name: 'Instagram',
      href: social.instagram,
      icon: InstagramIcon,
      ariaLabel: 'Follow HKCL Skill Centre on Instagram',
      // Desktop: White button that lights up on hover
      desktopHoverClass:
        'hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white hover:border-transparent hover:shadow-pink-500/20',
      // Mobile: Instant official brand colors on touch screens
      mobileClass:
        'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white border-transparent shadow-md shadow-pink-500/25 active:scale-90',
    },
    {
      name: 'Facebook',
      href: social.facebook,
      icon: FacebookIcon,
      ariaLabel: 'Follow HKCL Skill Centre on Facebook',
      desktopHoverClass:
        'hover:bg-[#1877F2] hover:text-white hover:border-transparent hover:shadow-blue-500/20',
      mobileClass:
        'bg-[#1877F2] text-white border-transparent shadow-md shadow-blue-500/25 active:scale-90',
    },
    {
      name: 'WhatsApp Channel',
      href: social.whatsappChannel,
      icon: WhatsAppIcon,
      ariaLabel: 'Join HKCL Skill Centre official WhatsApp Channel',
      desktopHoverClass:
        'hover:bg-[#25D366] hover:text-white hover:border-transparent hover:shadow-emerald-500/20',
      mobileClass:
        'bg-[#25D366] text-white border-transparent shadow-md shadow-emerald-500/25 active:scale-90',
    },
    ...(social.youtube
      ? [
          {
            name: 'YouTube',
            href: social.youtube,
            icon: YouTubeIcon,
            ariaLabel: 'Subscribe to HKCL Skill Centre on YouTube',
            desktopHoverClass:
              'hover:bg-[#FF0000] hover:text-white hover:border-transparent hover:shadow-red-500/20',
            mobileClass:
              'bg-[#FF0000] text-white border-transparent shadow-md shadow-red-500/25 active:scale-90',
          },
        ]
      : []),
  ].filter((item) => item.href);

  if (socialLinks.length === 0) return null;

  return (
    <>
      {/* ── DESKTOP FLOATING WIDGET (Bottom-Right, Vertical Stack above WhatsApp) ─ */}
      <aside
        aria-label="Social media quick links"
        className="fixed bottom-24 right-6 z-40 hidden md:flex flex-col items-center gap-2.5"
      >
        <span className="sr-only">Social media links</span>
        {socialLinks.map(({ name, href, icon: Icon, ariaLabel, desktopHoverClass }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${ariaLabel} (opens in new tab)`}
            className={`group relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-600 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${desktopHoverClass}`}
          >
            <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

            {/* Accessible tooltip expanding safely to the left inside the viewport */}
            <span
              role="tooltip"
              className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-brand-950 px-2.5 py-1 text-xs font-semibold text-white shadow-lg group-hover:block"
            >
              {name}
            </span>
          </a>
        ))}
      </aside>

      {/* ── MOBILE FLOATING WIDGET (Bottom-Right Collapsible Button) ─────────── */}
      <div
        ref={containerRef}
        className="fixed bottom-20 right-5 z-40 md:hidden flex flex-col items-end"
      >
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 8 }}
              transition={{ duration: 0.2 }}
              className="mb-2.5 flex flex-col items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-xl backdrop-blur-md"
            >
              {socialLinks.map(({ name, href, icon: Icon, ariaLabel, mobileClass }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${ariaLabel} (opens in new tab)`}
                  onClick={() => setMobileOpen(false)}
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 ${mobileClass}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close social links menu' : 'Open social links'}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md backdrop-blur-md transition-all active:scale-95 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-slate-800" aria-hidden="true" />
          ) : (
            <Share2 className="h-5 w-5 text-brand-900" aria-hidden="true" />
          )}
        </button>
      </div>
    </>
  );
}
