import { ArrowUpRight, Info } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ContactMethods from '../components/ContactMethods.jsx';
import { FadeIn } from '../components/MotionReveal.jsx';
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

      <section className="border-b border-brand-100/80 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50">
        <Container className="py-12 sm:py-16">
          <FadeIn>
            <SectionHeading
              as="h1"
              size="lg"
              title="Contact the centre"
              intro="The quickest way to get answers about courses, fees and batches is to call or send a WhatsApp message."
            />
          </FadeIn>
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
          <FadeIn delay={0.1}>
            <section
              aria-labelledby="tips-title"
              className="rounded-2xl border border-brand-100/90 bg-white/70 p-6 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60 dark:shadow-black/20"
            >
              <h2 id="tips-title" className="text-xl font-semibold text-brand-950 dark:text-white">
                When you get in touch
              </h2>
              <ul className="mt-3 space-y-2 text-muted dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500 dark:bg-blue-400" aria-hidden="true" />
                  <span>Mention the course name you are interested in.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500 dark:bg-blue-400" aria-hidden="true" />
                  <span>Ask about the next batch, class timings and online or offline options.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500 dark:bg-blue-400" aria-hidden="true" />
                  <span>Confirm the current fee and eligibility before you enrol.</span>
                </li>
              </ul>
            </section>
          </FadeIn>

          <FadeIn delay={0.2}>
            <aside
              aria-label="About online enquiries"
              className="flex gap-3 rounded-2xl border border-brand-200/80 bg-white/75 p-5 text-sm text-muted shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300"
            >
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-blue-400" aria-hidden="true" />
              <p>
                An online enquiry form is not available on this website yet. Please use the phone, WhatsApp or email
                options, or visit the centre.
              </p>
            </aside>
          </FadeIn>

          {portalUrl && (
            <FadeIn delay={0.3}>
              <section
                aria-labelledby="portal-title"
                className="group rounded-2xl border border-brand-100/90 bg-white/75 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-brand-400 hover:shadow-md hover:shadow-brand-900/5 dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-white/20 dark:hover:bg-slate-900/80 dark:hover:shadow-black/30"
              >
                <h2 id="portal-title" className="text-xl font-semibold text-brand-950 dark:text-white">
                  Already a student?
                </h2>
                <p className="mt-2 text-sm text-muted dark:text-slate-400">
                  Sign in on the official HKCL site. Never enter your HKCL username or password on this website.
                </p>
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center gap-1 rounded-sm font-semibold text-brand-700 dark:text-blue-400 underline underline-offset-4 hover:text-brand-900 dark:hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {siteConfig.studentPortal.label}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </section>
            </FadeIn>
          )}
        </div>
      </Container>
    </>
  );
}
