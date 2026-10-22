import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { siteConfig } from '../data/siteConfig.js';
import { FadeInStagger, FadeInItem } from './MotionReveal.jsx';
import {
  getAddressLines,
  getMailtoHref,
  getMapsHref,
  getTelHref,
  getWhatsAppHref,
} from '../utils/contact.js';

const rowClass =
  'group flex min-h-14 items-start gap-4 rounded-2xl border border-brand-100/90 bg-white/80 p-4.5 transition-all duration-300 shadow-xs backdrop-blur-md';
const linkRowClass = `${rowClass} hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white hover:shadow-md hover:shadow-brand-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500`;

function IconBadge({ icon: Icon }) {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-800 transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-700 group-hover:text-white">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}

/**
 * Lists every contact method that is configured in siteConfig.js.
 * A method with an empty value is simply not shown.
 */
export default function ContactMethods({ showHours = true }) {
  const { contact, hours } = siteConfig;
  const tel = getTelHref();
  const whatsapp = getWhatsAppHref('Hi, I would like to know more about your courses.');
  const mailto = getMailtoHref('Course enquiry');
  const maps = getMapsHref();
  const addressLines = getAddressLines();

  return (
    <FadeInStagger className="space-y-3" as="ul">
      {tel && (
        <FadeInItem as="li">
          <a href={tel} className={linkRowClass}>
            <IconBadge icon={Phone} />
            <span>
              <span className="block text-sm text-slate-500">Call</span>
              <span className="block font-semibold text-brand-950">{contact.phoneDisplay}</span>
            </span>
          </a>
        </FadeInItem>
      )}

      {whatsapp && (
        <FadeInItem as="li">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={linkRowClass}>
            <IconBadge icon={MessageCircle} />
            <span>
              <span className="block text-sm text-slate-500">WhatsApp</span>
              <span className="block font-semibold text-brand-950">Send a message</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
          </a>
        </FadeInItem>
      )}

      {mailto && (
        <FadeInItem as="li">
          <a href={mailto} className={linkRowClass}>
            <IconBadge icon={Mail} />
            <span className="min-w-0">
              <span className="block text-sm text-slate-500">Email</span>
              <span className="block break-all font-semibold text-brand-950">{contact.email}</span>
            </span>
          </a>
        </FadeInItem>
      )}

      {addressLines.length > 0 && (
        <FadeInItem as="li" className={rowClass}>
          <IconBadge icon={MapPin} />
          <address className="not-italic">
            <span className="block text-sm text-slate-500">Visit</span>
            <span className="block font-semibold text-brand-950">
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
            {maps && (
              <a
                href={maps}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                Open in Google Maps
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </address>
        </FadeInItem>
      )}

      {showHours && hours?.length > 0 && (
        <FadeInItem as="li" className={rowClass}>
          <IconBadge icon={Clock} />
          <div className="w-full">
            <p className="text-sm text-slate-500">Opening hours</p>
            <dl className="mt-1 space-y-1">
              {hours.map((row) => (
                <div key={row.days} className="flex flex-wrap justify-between gap-x-4">
                  <dt className="font-medium text-brand-950">{row.days}</dt>
                  <dd className="text-slate-600">{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeInItem>
      )}
    </FadeInStagger>
  );
}
