import { ArrowUpRight } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ContactMethods from '../components/ContactMethods.jsx';
import EnquiryForm from '../components/EnquiryForm.jsx';
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

      <section className="border-b border-brand-100/80 bg-white/70 backdrop-blur-md">
        <Container className="py-12 sm:py-16">
          <FadeIn>
            <SectionHeading
              as="h1"
              size="lg"
              title="Contact the centre"
              intro="The quickest way to get answers about courses, fees and batches is to call, send a WhatsApp message, or submit an online enquiry."
            />
          </FadeIn>
        </Container>
      </section>

      <Container className="grid gap-10 pt-10 pb-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 sm:pt-12 sm:pb-24">
        {/* Left Column: Direct Contact Info & Online Enquiry Form */}
        <div className="space-y-8">
          <section aria-labelledby="details-title">
            <h2 id="details-title" className="text-xl font-semibold text-brand-950 mb-4">
              Get in Touch Directly
            </h2>
            <ContactMethods />
          </section>

          <FadeIn delay={0.15}>
            <EnquiryForm />
          </FadeIn>
        </div>

        {/* Right Column: Tips & Student Portal */}
        <div className="space-y-6">
          <FadeIn delay={0.1}>
            <section
              aria-labelledby="tips-title"
              className="rounded-2xl border border-brand-100/90 bg-white/80 p-6 shadow-xs backdrop-blur-md"
            >
              <h2 id="tips-title" className="text-xl font-semibold text-brand-950">
                When you get in touch
              </h2>
              <ul className="mt-3 space-y-2.5 text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
                  <span>Mention the specific course or skill programme you are interested in.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
                  <span>Ask about the upcoming batch commencement, class timings, and online or offline options.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
                  <span>Confirm current fees, instalment plans, and eligibility criteria before enrolment.</span>
                </li>
              </ul>
            </section>
          </FadeIn>

          {portalUrl && (
            <FadeIn delay={0.25}>
              <section
                aria-labelledby="portal-title"
                className="group rounded-2xl border border-brand-100/90 bg-white/80 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-brand-400 hover:shadow-md hover:shadow-brand-900/5"
              >
                <h2 id="portal-title" className="text-xl font-semibold text-brand-950">
                  Already a student?
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Sign in on the official HKCL portal to access your learner dashboard and course materials. Never enter your credentials on third-party sites.
                </p>
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
