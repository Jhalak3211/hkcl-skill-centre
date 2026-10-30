import { Link } from 'react-router-dom';
import { Clock, MessageCircle, Phone, ArrowLeft, ExternalLink, ShieldAlert } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import { FadeIn } from '../components/MotionReveal.jsx';
import { siteConfig } from '../data/siteConfig.js';
import { getTelHref, getWhatsAppHref } from '../utils/contact.js';

export default function ComingSoon() {
  const tel = getTelHref();
  const whatsapp = getWhatsAppHref(
    'Hi! I am an enrolled student at HKCL Skill Centre and need assistance with my course / portal login.'
  );

  return (
    <>
      <Seo
        title="Student Portal Coming Soon"
        path="/coming-soon"
        description="The student login and online learner portal for HKCL Skill Centre is coming soon."
        noindex
      />

      <section className="relative overflow-hidden py-16 sm:py-24">
        <Container className="max-w-3xl">
          <FadeIn className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold text-orange-800 shadow-xs">
              <Clock className="h-3.5 w-3.5 animate-pulse text-orange-600" aria-hidden="true" />
              <span>Under Active Development</span>
            </div>

            {/* Title */}
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-brand-950 sm:text-5xl">
              Student Portal Coming Soon
            </h1>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              We are building a seamless digital portal for enrolled students to access study modules, check batch schedules, and view certificates online. This service will be launched soon.
            </p>

            {/* Current Assistance Card */}
            <div className="mt-10 rounded-2xl border border-brand-100/90 bg-white/90 p-6 sm:p-8 text-left shadow-sm backdrop-blur-md">
              <h2 className="text-lg font-semibold text-brand-950 sm:text-xl">
                Need immediate course assistance or admission status?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Current students and new applicants can reach our centre staff directly. We will provide your batch timing, syllabus notes, and examination dates immediately.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {whatsapp && (
                  <Button href={whatsapp} target="_blank" rel="noopener noreferrer" variant="primary">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Enquire on WhatsApp
                  </Button>
                )}

                {tel && (
                  <Button href={tel} variant="secondary">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call {siteConfig.contact.phoneDisplay}
                  </Button>
                )}

                <Button to="/contact" variant="secondary">
                  Visit Contact Page
                </Button>
              </div>
            </div>

            {/* Security note */}
            <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-left text-xs sm:text-sm text-slate-600">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              <span>
                <strong>Security Reminder:</strong> {siteConfig.name} will never ask for your personal passwords or payment PINs. For official Haryana Knowledge Corporation Limited state portal details, visit{' '}
                <a
                  href="https://www.hkcl.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-brand-700 underline underline-offset-2 hover:text-brand-900"
                >
                  hkcl.in
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
                .
              </span>
            </div>

            {/* Back Home */}
            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-sm"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Return to Homepage
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
