import { siteConfig } from '../data/siteConfig.js';

const { contact, studentPortal } = siteConfig;

export const getTelHref = () => (contact.phoneE164 ? `tel:${contact.phoneE164}` : null);

export const getMailtoHref = (subject) => {
  if (!contact.email) return null;
  return subject ? `mailto:${contact.email}?subject=${encodeURIComponent(subject)}` : `mailto:${contact.email}`;
};

export const getWhatsAppHref = (message) => {
  if (!contact.whatsappNumber) return null;
  const base = `https://wa.me/${contact.whatsappNumber}`;
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
  const text = getAddressText();
  return text ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}` : null;
};

/**
 * Props for a <Button> that starts an enquiry about a course.
 * Uses WhatsApp when a number is configured, otherwise the Contact page.
 */
export const getEnquiryProps = (course) => {
  const href = getWhatsAppHref(`Hi, I am interested in ${course.name}. Please share more details.`);
  return href ? { href } : { to: '/contact' };
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
