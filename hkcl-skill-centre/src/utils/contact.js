import { siteConfig } from '../data/siteConfig.js';

const { contact, studentPortal } = siteConfig;

/**
 * Returns the official WhatsApp phone number (digits only).
 * Can be overridden via VITE_WHATSAPP_NUMBER environment variable.
 */
export const getWhatsAppNumber = () => {
  const envNumber =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_WHATSAPP_NUMBER;
  const rawNumber = envNumber || contact.whatsappNumber || '';
  return rawNumber.replace(/\D/g, '');
};

export const getTelHref = () => {
  const envPhone =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_PHONE_E164;
  const phone = envPhone || contact.phoneE164;
  return phone ? `tel:${phone}` : null;
};

export const getMailtoHref = (subject) => {
  if (!contact.email) return null;
  return subject
    ? `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${contact.email}`;
};

export const getWhatsAppHref = (message) => {
  const number = getWhatsAppNumber();
  if (!number) return null;
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

/** Address as an array of display lines, e.g. for <address> blocks. */
export const getAddressLines = () => {
  const { lines = [], city, state, postalCode } = contact.address ?? {};
  const cityLine = [city, postalCode].filter(Boolean).join(' ');
  return [...lines, [cityLine, state].filter(Boolean).join(', ')].filter(Boolean);
};

export const getAddressText = () => getAddressLines().join(', ');

/** Opens Google Maps with the address pre-filled. Returns null if no address. */
export const getMapsHref = () => {
  return 'https://www.google.com/maps/place/HKCL+Skill+Centre/@29.5369842,75.0304069,13z/data=!4m6!3m5!1s0x3f00bef3bee1259:0xc37731455a293b23!8m2!3d29.5390876!4d75.0457041!16s%2Fg%2F11w9slnc_n?entry=ttu&g_ep=EgoyMDI2MTAxOS4wIKXMDSoASAFQAw%3D%3D';
};

/**
 * Props for a <Button> that starts an enquiry about a course.
 * Uses WhatsApp when a number is configured, otherwise the Contact page.
 */
export const getEnquiryProps = (course) => {
  const href = getWhatsAppHref(`Hi, I am interested in ${course.name}. Please share more details.`);
  return href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { to: '/contact' };
};

/**
 * Returns the configured student portal URL only if it is a valid http(s)
 * address. Returns null otherwise so the UI can fail gracefully.
 */
export const getStudentPortalUrl = () => {
  try {
    const url = new URL(studentPortal.url);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
};
