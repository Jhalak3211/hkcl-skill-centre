import { MapPin, Navigation } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ContactMethods from '../components/ContactMethods.jsx';
import { FadeIn } from '../components/MotionReveal.jsx';
import { siteConfig } from '../data/siteConfig.js';
import { getMapsHref } from '../utils/contact.js';

export default function Contact() {
  const mapsHref = getMapsHref();

  return (
    <>
      <Seo
        title="Contact"
        path="/contact"
        description={`Contact ${siteConfig.name} in ${siteConfig.locationName}: phone, WhatsApp, email, address and opening hours.`}
      />

      <section className="border-b border-brand-100/80 bg-white/70 backdrop-blur-md">
        <Container className="py-12 sm:py-16">
          <FadeIn>
            <SectionHeading
              as="h1"
              size="lg"
              title="Contact the Centre"
              intro="The quickest way to get answers about courses, fees, batch schedules, and admissions is to call, send a WhatsApp message, or visit our centre in Sirsa."
            />
          </FadeIn>
        </Container>
      </section>

      <Container className="grid gap-10 pt-10 pb-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 sm:pt-12 sm:pb-24">
        {/* Left Column: Direct Contact Info (Phone, WhatsApp, Email, Timings, Address) */}
        <div className="space-y-6">
          <section aria-labelledby="details-title">
            <h2 id="details-title" className="text-xl font-semibold text-brand-950 mb-4">
              Get in Touch Directly
            </h2>
            <ContactMethods />
          </section>
        </div>

        {/* Right Column: Centre Location & Visiting Tips */}
        <div className="space-y-6">
          {/* Location & Landmark Information */}
          <FadeIn delay={0.1}>
            <section
              aria-labelledby="location-title"
              className="rounded-2xl border border-brand-100/90 bg-white/80 p-6 shadow-xs backdrop-blur-md"
            >
              <div className="flex items-center gap-2.5 text-brand-900 mb-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                <h2 id="location-title" className="text-lg font-semibold text-brand-950">
                  Centre Address &amp; Landmarks
                </h2>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {siteConfig.contact.address.lines.join(', ')}, {siteConfig.contact.address.city}, {siteConfig.contact.address.state} - {siteConfig.contact.address.postalCode}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Landmarks: Opposite Lenskart showroom, behind Canara Bank on Barnala Road.
              </p>
              {mapsHref && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-brand-900 transition"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Get Directions on Google Maps</span>
                  </a>
                </div>
              )}
            </section>
          </FadeIn>

          {/* Visiting / Enquiry Tips */}
          <FadeIn delay={0.2}>
            <section
              aria-labelledby="tips-title"
              className="rounded-2xl border border-brand-100/90 bg-white/80 p-6 shadow-xs backdrop-blur-md"
            >
              <h2 id="tips-title" className="text-lg font-semibold text-brand-950">
                When You Connect With Us
              </h2>
              <ul className="mt-3 space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
                  <span>Specify the programme you are interested in (e.g. HS-CIT, Tally Prime, Python, or Typing).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
                  <span>Ask about available batch schedules (Morning, Afternoon, or Evening) and practical lab slots.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
                  <span>For admissions, you can register and pay the ₹500 registration fee directly through our online admission portal.</span>
                </li>
              </ul>
            </section>
          </FadeIn>
        </div>
      </Container>
    </>
  );
}
