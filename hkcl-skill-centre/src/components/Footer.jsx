import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Container from './Container.jsx';
import { siteConfig } from '../data/siteConfig.js';
import {
  getAddressLines,
  getMailtoHref,
  getTelHref,
  getWhatsAppHref,
} from '../utils/contact.js';
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from './SocialIcons.jsx';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

const programmeLinks = [
  { to: '/courses/hs-cit', label: 'HS-CIT' },
  { to: '/courses/hs-cit-a', label: 'HS-CIT (A)' },
  { to: '/courses/hs-cit-a-plus', label: 'HS-CIT (A+)' },
  { to: '/courses?category=hcoc', label: 'HCOC courses' },
];

const headingStyle =
  'text-sm font-semibold tracking-wide text-white sm:text-base';

const linkStyle =
  'inline-flex min-h-8 items-center rounded-sm text-sm leading-5 text-brand-200 transition-colors hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400';

export default function Footer() {
  const { contact, social } = siteConfig;

  const tel = getTelHref();
  const whatsapp = getWhatsAppHref();
  const mailto = getMailtoHref('Course enquiry – HKCL Skill Centre');
  const addressLines = getAddressLines();

  const socialLinks = [
    {
      href: social.facebook,
      label: 'Facebook',
      ariaLabel: 'Follow HKCL Skill Centre on Facebook (opens in new tab)',
      icon: FacebookIcon,
      hoverClass: 'hover:bg-[#1877F2] hover:text-white',
    },
    {
      href: social.instagram,
      label: 'Instagram',
      ariaLabel: 'Follow HKCL Skill Centre on Instagram (opens in new tab)',
      icon: InstagramIcon,
      hoverClass: 'hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white',
    },
    {
      href: social.whatsappChannel,
      label: 'WhatsApp Channel',
      ariaLabel: 'Join HKCL Skill Centre official WhatsApp Channel (opens in new tab)',
      icon: WhatsAppIcon,
      hoverClass: 'hover:bg-[#25D366] hover:text-white',
    },
    ...(social.youtube
      ? [
          {
            href: social.youtube,
            label: 'YouTube',
            ariaLabel: 'Subscribe to HKCL Skill Centre on YouTube (opens in new tab)',
            icon: YouTubeIcon,
            hoverClass: 'hover:bg-[#FF0000] hover:text-white',
          },
        ]
      : []),
  ].filter((item) => item.href);

  return (
    <footer className="on-dark mt-12 bg-brand-950 text-brand-100 sm:mt-16">
      {/* Main footer */}
      <Container className="py-8 sm:py-9 lg:py-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr_1.2fr] lg:gap-x-10 lg:gap-y-0">
          {/* Brand and address */}
          <div className="min-w-0">
            <Link
              to="/"
              aria-label={`${siteConfig.name}, home`}
              className="inline-flex max-w-full items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              <img
                src="/images/hkcl-brand-logo.png"
                alt={siteConfig.logo.alt || `${siteConfig.name} logo`}
                className="h-20 w-auto sm:h-24 sm:w-auto shrink-0 rounded-2xl bg-white object-contain p-2 shadow-sm"
              />

              <span className="min-w-0">
                <span className="block text-base font-bold leading-tight text-white sm:text-lg">
                  {siteConfig.name}
                </span>
                <span className="mt-1 block text-xs text-brand-300 sm:text-sm">
                  {siteConfig.locationName}
                </span>
              </span>
            </Link>

            {addressLines.length > 0 && (
              <address className="mt-3 flex min-w-0 items-start gap-2 text-sm leading-[2rem] text-brand-200 not-italic">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  {addressLines.map((line, index) => (
                    <span key={`${line}-${index}`} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </address>
            )}
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links" className="min-w-0">
            <h2 className={headingStyle}>Quick Links</h2>
            <ul className="mt-3 space-y-1">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkStyle}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Programmes */}
          <nav aria-label="Footer programmes" className="min-w-0">
            <h2 className={headingStyle}>Our Programmes</h2>
            <ul className="mt-3 space-y-1">
              {programmeLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkStyle}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact and social links */}
          <div className="min-w-0">
            <h2 className={headingStyle}>Get in Touch</h2>

            <ul className="mt-3 space-y-1">
              {tel && (
                <li>
                  <a href={tel} className={linkStyle}>
                    <Phone
                      className="mr-2 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{contact.phoneDisplay}</span>
                  </a>
                </li>
              )}

              {whatsapp && (
                <li>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkStyle}
                  >
                    <MessageCircle
                      className="mr-2 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    WhatsApp Chat
                  </a>
                </li>
              )}

              {mailto && (
                <li>
                  <a
                    href={mailto}
                    className={`${linkStyle} max-w-full`}
                  >
                    <Mail
                      className="mr-2 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="break-all">{contact.email}</span>
                  </a>
                </li>
              )}
            </ul>

            {/* Social Media Links Section in Footer */}
            {socialLinks.length > 0 && (
              <div className="mt-5 pt-4 border-t border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
                  Follow Us Online
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {socialLinks.map(({ href, label, ariaLabel, icon: Icon, hoverClass }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={ariaLabel}
                      title={label}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-brand-100 shadow-xs backdrop-blur-xs transition-all duration-200 hover:scale-105 ${hoverClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Copyright and disclaimer */}
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-3 text-xs leading-5 text-brand-200 sm:flex-row sm:items-center sm:justify-between">
          <p className="shrink-0">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
