import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  BookOpenCheck,
  IndianRupee,
  Languages,
  MapPin,
  MonitorPlay,
  Phone,
  Landmark,
} from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import FaqList from '../components/FaqList.jsx';
import HeroSlideshow from '../components/HeroSlideshow.jsx';
import GoogleReviews from '../components/GoogleReviews.jsx';
import SocialSection from '../components/SocialSection.jsx';
import { FadeIn, FadeInStagger, FadeInItem } from '../components/MotionReveal.jsx';
import { hcocSectors } from '../data/courses.js';
import { previewFaqs } from '../data/faqs.js';
import { siteConfig } from '../data/siteConfig.js';
import { getTelHref } from '../utils/contact.js';

// Hero animation variants
const heroGroup = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// Why-choose reasons
const reasons = [
  {
    icon: BadgeCheck,
    title: 'HKCL and HSBTE certificates',
    text: 'HS-CIT programmes and 120-hour HCOC courses carry certificates from HKCL and the Haryana State Board of Technical Education.',
  },
  {
    icon: MonitorPlay,
    title: 'Online and offline batches',
    text: 'HS-CIT is offered in online and offline batches, with smart classes that use audio and video.',
  },
  {
    icon: Languages,
    title: 'English and Hindi',
    text: 'HS-CIT is taught in English and Hindi and includes typing practice in both languages.',
  },
  {
    icon: IndianRupee,
    title: 'Fees listed up front',
    text: 'Fees for the main programmes are shown on every course page, so you know the cost before you call.',
  },
  {
    icon: Landmark,
    title: 'Option for government employees',
    text: 'HS-CIT (A) lists SETC Part-I exemption for eligible government employees, subject to Haryana Government rules.',
  },
  {
    icon: MapPin,
    title: 'Easy to find',
    text: 'The centre is on Barnala Road in Sirsa, opposite Lenskart, on the first floor.',
  },
];

export default function Home() {
  const tel = getTelHref();

  return (
    <>
      <Seo path="/" />

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero-title"
        className="relative flex min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] items-center overflow-hidden border-b border-brand-100/80 bg-[var(--bg-page)]"
      >
        {/* Full-bleed automated background image slideshow with light gradient overlay */}
        <HeroSlideshow />

        <Container className="relative z-10 py-10 sm:py-14 lg:py-16 xl:py-20">
          <div className="max-w-2xl lg:max-w-3xl">
            <motion.div variants={heroGroup} initial="hidden" animate="show">
              {/* Main headline */}
              <motion.h1
                id="hero-title"
                variants={heroItem}
                className="text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl lg:text-5xl lg:leading-[1.15]"
              >
                Computer Education &amp; AI Skill Training Centre
              </motion.h1>

              {/* Tagline */}
              <motion.p
                variants={heroItem}
                className="mt-3 text-base font-semibold text-brand-700 sm:text-lg lg:text-xl"
              >
                {siteConfig.heroTagline}
              </motion.p>

              {/* Description */}
              <motion.p
                variants={heroItem}
                className="mt-3 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base"
              >
                HS-CIT programmes, HCOC career courses and typing training on Barnala Road.
                HS-CIT and 120-hour HCOC courses carry HKCL and HSBTE certificates.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={heroItem}
                className="mt-6 flex flex-wrap items-center gap-3"
              >
                <Button to="/courses" variant="primary" size="md">
                  Explore courses
                </Button>
                <Button to="/contact" variant="secondary" size="md">
                  Contact us
                </Button>
              </motion.div>

              {/* Phone quick-link */}
              {tel && (
                <motion.p
                  variants={heroItem}
                  className="mt-4 flex items-center gap-2 text-sm text-slate-700"
                >
                  <Phone className="h-4 w-4 text-brand-600" aria-hidden="true" />
                  <span>
                    Prefer to talk?{' '}
                    <a
                      href={tel}
                      className="font-semibold text-brand-800 underline underline-offset-4 hover:text-brand-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xs"
                    >
                      {siteConfig.contact.phoneDisplay}
                    </a>
                  </span>
                </motion.p>
              )}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── INTRODUCTION ─────────────────────────────────────────────────── */}
      <section aria-labelledby="intro-title" className="pt-16 sm:pt-20">
        <Container>
          <FadeIn className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <SectionHeading id="intro-title" title="Practical training for work and study" />
            <div className="space-y-4 text-base leading-relaxed text-muted sm:text-lg">
              <p>
                {siteConfig.name} offers computer education and skill development training that focuses
                on practical digital knowledge. Courses are designed to improve technical skills, support
                employability and prepare learners for future opportunities.
              </p>
              <p>
                You can choose a complete computer course such as HS-CIT, or a focused career-oriented
                course from the HCOC series.
              </p>
              <Button to="/about" variant="secondary">
                About the centre
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── HCOC BAND ────────────────────────────────────────────────────── */}
      <section aria-labelledby="hcoc-title" className="pt-16 sm:pt-20">
        <Container>
          <FadeIn>
            <div className="grid gap-8 rounded-[1.75rem] border border-brand-100/90 bg-white/70 p-6 shadow-sm backdrop-blur-md sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
              <div>
                <SectionHeading
                  id="hcoc-title"
                  title="HCOC career-oriented courses"
                  intro="HKCL's Career Oriented Course series is a bridge from college to careers. Courses run for 60 or 120 hours, and the listed fee is ₹4,500 per course."
                />
                <Button to="/courses?category=hcoc" className="mt-6">
                  Browse HCOC courses
                </Button>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-brand-950">
                  Ten sectors
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {hcocSectors.map((sector) => (
                    <li
                      key={sector}
                      className="rounded-full border border-brand-200/90 bg-white/80 px-3.5 py-1.5 text-sm font-medium text-brand-800 backdrop-blur-xs transition-all duration-200 hover:scale-[1.02] hover:border-brand-400 hover:bg-white"
                    >
                      {sector}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── WHY CHOOSE ───────────────────────────────────────────────────── */}
      <section aria-labelledby="why-title" className="pt-16 sm:pt-20">
        <Container>
          <FadeIn>
            <SectionHeading id="why-title" title="Why learners choose the centre" />
          </FadeIn>
          <FadeInStagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" as="ul">
            {reasons.map(({ icon: Icon, title, text }) => (
              <FadeInItem
                key={title}
                as="li"
                className="group flex gap-4 rounded-2xl border border-brand-100/80 bg-white/70 p-5 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md hover:shadow-brand-900/5"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700 transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-700 group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-brand-950 transition-colors group-hover:text-brand-900">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </Container>
      </section>

      {/* ── GOOGLE REVIEWS ───────────────────────────────────────────────── */}
      <GoogleReviews />

      {/* ── STAY CONNECTED WITH HKCL (SOCIAL MEDIA SECTION) ──────────────── */}
      <SocialSection />

      {/* ── FAQ PREVIEW ──────────────────────────────────────────────────── */}
      <section aria-labelledby="faq-title" className="pt-16 sm:pt-20">
        <Container>
          <FadeIn className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div>
              <SectionHeading
                id="faq-title"
                title="Common questions"
                intro="Short answers about courses, fees and where to find us."
              />
              <p className="mt-5 flex items-start gap-2 text-sm text-muted">
                <BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                <span>
                  Still unsure?{' '}
                  <Link
                    to="/contact"
                    className="font-semibold text-brand-800 underline underline-offset-4 hover:text-brand-950"
                  >
                    Ask the centre directly.
                  </Link>
                </span>
              </p>
            </div>
            <FaqList items={previewFaqs} />
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
