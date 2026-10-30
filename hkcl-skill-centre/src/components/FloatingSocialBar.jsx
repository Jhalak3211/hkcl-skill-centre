import { useState } from 'react';
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
  const { social } = siteConfig;

  const socialLinks = [
    {
      name: 'Instagram',
      href: social.instagram,
      icon: InstagramIcon,
      ariaLabel: 'Follow HKCL Skill Centre on Instagram',
      colorClass: 'text-[#E1306C] hover:bg-[#E1306C] hover:text-white',
    },
    {
      name: 'Facebook',
      href: social.facebook,
      icon: FacebookIcon,
      ariaLabel: 'Follow HKCL Skill Centre on Facebook',
      colorClass: 'text-[#1877F2] hover:bg-[#1877F2] hover:text-white',
    },
    {
      name: 'WhatsApp Channel',
      href: social.whatsappChannel,
      icon: WhatsAppIcon,
      ariaLabel: 'Join HKCL Skill Centre official WhatsApp Channel',
      colorClass: 'text-[#25D366] hover:bg-[#25D366] hover:text-white',
    },
    ...(social.youtube
      ? [
          {
            name: 'YouTube',
            href: social.youtube,
            icon: YouTubeIcon,
            ariaLabel: 'Subscribe to HKCL Skill Centre on YouTube',
            colorClass: 'text-[#FF0000] hover:bg-[#FF0000] hover:text-white',
          },
        ]
      : []),
  ].filter((item) => item.href);

  if (socialLinks.length === 0) return null;

  return (
    <>
      {/* ── DESKTOP FLOATING BAR (Left-aligned, non-intrusive) ─────────── */}
      <aside
        aria-label="Social media quick links"
        className="fixed left-3 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2 rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-lg shadow-slate-900/5 backdrop-blur-md"
      >
        <span className="sr-only">Social links</span>
        {socialLinks.map(({ name, href, icon: Icon, ariaLabel, colorClass }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${ariaLabel} (opens in new tab)`}
            title={name}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 ${colorClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500`}
          >
            <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            {/* Tooltip on hover */}
            <span className="pointer-events-none absolute left-full ml-2.5 hidden whitespace-nowrap rounded-lg bg-brand-950 px-2.5 py-1 text-xs font-semibold text-white shadow-md group-hover:block z-50">
              {name}
            </span>
          </a>
        ))}
      </aside>

      {/* ── MOBILE FLOATING SHORTCUT (Left-aligned compact speed-dial) ─ */}
      <div className="fixed bottom-6 left-6 z-40 md:hidden">
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mb-2.5 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur-md"
            >
              {socialLinks.map(({ name, href, icon: Icon, ariaLabel, colorClass }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${ariaLabel} (opens in new tab)`}
                  onClick={() => setMobileOpen(false)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 transition-all ${colorClass}`}
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
          aria-label={mobileOpen ? 'Close social links menu' : 'Open official social links'}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-all active:scale-95 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
