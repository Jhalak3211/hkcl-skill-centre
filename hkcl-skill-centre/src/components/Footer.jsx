import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Brand from './Brand.jsx';
import Container from './Container.jsx';
import { siteConfig } from '../data/siteConfig.js';
import { getAddressLines, getMailtoHref, getTelHref, getWhatsAppHref } from '../utils/contact.js';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/contact', label: 'Contact' },
];

const programmeLinks = [
  { to: '/courses/hs-cit', label: 'HS-CIT' },
  { to: '/courses/hs-cit-a', label: 'HS-CIT (A)' },
  { to: '/courses/hs-cit-a-plus', label: 'HS-CIT (A+)' },
  { to: '/courses?category=hcoc', label: 'HCOC courses' },
];

const linkStyle =
  'group inline-flex min-h-11 items-center text-brand-200 transition-all duration-200 hover:text-white hover:translate-x-0.5 sm:min-h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 rounded-sm';

export default function Footer() {
  const { contact, social } = siteConfig;
  const tel = getTelHref();
  const whatsapp = getWhatsAppHref();
  /**
   * The email link uses a standard mailto: URL with an encoded subject.
   * This opens the visitor's own email client — it does NOT send email from
   * this server. Verify that info@hkclsirsa.in is active before launch.
   */
  const mailto = getMailtoHref('Course enquiry – HKCL Skill Centre');
  const addressLines = getAddressLines();

  const socialLinks = [
    { href: social.facebook, label: 'Facebook' },
    { href: social.instagram, label: 'Instagram' },
    { href: social.whatsappChannel, label: 'WhatsApp channel' },
  ].filter((item) => item.href);

  return (
    <footer className="on-dark mt-24 bg-brand-950 text-brand-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        {/* Brand + address */}
        <div>
          <Brand onDark />
          <p className="mt-4 max-w-xs text-sm text-brand-200">
            Computer and digital skills training in {siteConfig.locationName}.
          </p>
          {addressLines.length > 0 && (
            <address className="mt-4 flex gap-2 text-sm not-italic text-brand-200">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </address>
          )}
        </div>

        {/* Quick links — Student Login removed */}
        <nav aria-label="Footer quick links">
          <h2 className="font-display text-base font-semibold text-white">Quick links</h2>
          <ul className="mt-3 space-y-1 text-sm">
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
        <nav aria-label="Footer programmes">
          <h2 className="font-display text-base font-semibold text-white">Programmes</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {programmeLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={linkStyle}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h2 className="font-display text-base font-semibold text-white">Get in touch</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {tel && (
              <li>
                <a href={tel} className={linkStyle}>
                  <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                  {contact.phoneDisplay}
                </a>
              </li>
            )}
            {whatsapp && (
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={linkStyle}>
                  <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                  WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            )}
            {mailto && (
              <li>
                <a href={mailto} className={`${linkStyle} break-all`}>
                  <Mail className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
            )}
          </ul>

          {socialLinks.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-x-4 text-sm">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkStyle}>
                    {item.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-brand-200 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="max-w-xl sm:text-right">
            This website provides information only. Always verify fees, batch timings and eligibility
            directly with the centre before enrolment.
          </p>
        </Container>
      </div>
    </footer>
  );
}
