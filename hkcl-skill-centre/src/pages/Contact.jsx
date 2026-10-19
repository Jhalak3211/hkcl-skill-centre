import { Link } from 'react-router-dom';
import { ArrowUpRight, Info } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ContactMethods from '../components/ContactMethods.jsx';
import { siteConfig } from '../data/siteConfig.js';
import { getStudentPortalUrl } from '../utils/contact.js';

export default function Contact() {
  const portalUrl = getStudentPortalUrl();

  return (
    <>
      <Seo
        title="Contact"
        path="/contact"
        description={`Contact ${siteConfig.name} in ${siteConfig.locationName}: phone, WhatsApp, email, address and opening hours.`}
      />

      <section className="border-b border-brand-100 bg-brand-50">
        <Container className="py-12 sm:py-16">
          <SectionHeading
            as="h1"
            size="lg"
            title="Contact the centre"
            intro="The quickest way to get answers about courses, fees and batches is to call or send a WhatsApp message."
          />
        </Container>
      </section>

      <Container className="grid gap-10 pt-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14 sm:pt-12">
        <section aria-labelledby="details-title">
          <h2 id="details-title" className="sr-only">
            Contact details
          </h2>
          <ContactMethods />
        </section>

        <div className="space-y-6">
          <section aria-labelledby="tips-title" className="rounded-2xl bg-brand-50 p-6">
            <h2 id="tips-title" className="text-xl font-semibold text-brand-950">
              When you get in touch
            </h2>
            <ul className="mt-3 space-y-2 text-muted">
              <li>Mention the course name you are interested in.</li>
              <li>Ask about the next batch, class timings and online or offline options.</li>
              <li>Confirm the current fee and eligibility before you enrol.</li>
            </ul>
          </section>

          <aside
            aria-label="About online enquiries"
            className="flex gap-3 rounded-2xl border border-brand-200 p-5 text-sm text-muted"
          >
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
            <p>
              An online enquiry form is not available on this website yet. Please use the phone, WhatsApp or email
              options, or visit the centre.
            </p>
          </aside>

          <section aria-labelledby="portal-title" className="rounded-2xl border border-brand-200 p-6">
            <h2 id="portal-title" className="text-xl font-semibold text-brand-950">
              Already a student?
            </h2>
            <p className="mt-2 text-sm text-muted">
              Sign in on the official HKCL site. Never enter your HKCL username or password on this website.
            </p>
            {portalUrl ? (
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center gap-1 rounded-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-900"
              >
                {siteConfig.studentPortal.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <Link
                to="/student-login"
                className="mt-4 inline-flex min-h-11 items-center rounded-sm font-semibold text-brand-700 underline underline-offset-4"
              >
                {siteConfig.studentPortal.label}
              </Link>
            )}
          </section>
        </div>
      </Container>
    </>
  );
}
