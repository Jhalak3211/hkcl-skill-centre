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
  Sparkles,
} from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import CourseCard from '../components/CourseCard.jsx';
import DurationChart from '../components/DurationChart.jsx';
import FaqList from '../components/FaqList.jsx';
import ContactMethods from '../components/ContactMethods.jsx';
import { FadeIn, FadeInStagger, FadeInItem } from '../components/MotionReveal.jsx';
import { getFeaturedCourses, hcocSectors } from '../data/courses.js';
import { previewFaqs } from '../data/faqs.js';
import { galleryImages } from '../data/gallery.js';
import { siteConfig } from '../data/siteConfig.js';
import { getTelHref } from '../utils/contact.js';

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
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

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
  const featured = getFeaturedCourses();

  return (
    <>
      <Seo path="/" />

      {/* Hero with ambient floating gradient elements */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-brand-100 bg-brand-50/70">
        {/* Soft, slow-moving ambient gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div
            className="absolute -left-20 -top-24 h-96 w-96 rounded-full bg-gradient-to-tr from-brand-300/35 via-brand-200/25 to-transparent blur-3xl"
            animate={{
              x: [0, 24, 0],
              y: [0, -18, 0],
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-gradient-to-bl from-accent-400/20 via-brand-200/20 to-transparent blur-3xl"
            animate={{
              x: [0, -20, 0],
              y: [0, 20, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <Container className="relative z-10 grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:py-20">
          <motion.div variants={heroGroup} initial="hidden" animate="show">
            {/* Trust badge */}
            <motion.div variants={heroItem} className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200/90 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-brand-900 shadow-xs backdrop-blur-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>HKCL Authorised Learning Centre &bull; Sirsa</span>
            </motion.div>

            <motion.h1
              id="hero-title"
              variants={heroItem}
              className="text-4xl font-semibold text-brand-950 sm:text-5xl lg:text-6xl tracking-tight"
            >
              Computer and digital skills training in Sirsa
            </motion.h1>

            <motion.p variants={heroItem} className="mt-5 max-w-xl text-lg text-muted leading-relaxed">
              HS-CIT programmes, HCOC career courses and typing training on Barnala Road. HS-CIT and 120-hour HCOC
              courses carry HKCL and HSBTE certificates.
            </motion.p>

            <motion.div variants={heroItem} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/courses" size="lg">
                Explore courses
              </Button>
              <Button to="/contact" variant="secondary" size="lg">
                Contact us
              </Button>
            </motion.div>

            {tel && (
              <motion.p variants={heroItem} className="mt-6 flex items-center gap-2 text-sm text-muted">
                <Phone className="h-4 w-4 text-brand-600 transition-transform duration-200 group-hover:rotate-12" aria-hidden="true" />
                <span>
                  Prefer to talk?{' '}
                  <a
                    href={tel}
                    className="rounded-sm font-semibold text-brand-800 underline underline-offset-4 hover:text-brand-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                </span>
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <DurationChart />
          </motion.div>
        </Container>
      </section>

      {/* Introduction */}
      <section aria-labelledby="intro-title" className="pt-16 sm:pt-20">
        <Container>
          <FadeIn className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <SectionHeading id="intro-title" title="Practical training for work and study" />
            <div className="space-y-4 text-base text-muted sm:text-lg">
              <p>
                {siteConfig.name} offers computer education and skill development training that focuses on practical
                digital knowledge. Courses are designed to improve technical skills, support employability and prepare
                learners for future opportunities.
              </p>
              <p>
                You can choose a complete computer course such as HS-CIT, or a focused career-oriented course from the
                HCOC series.
              </p>
              <Button to="/about" variant="secondary">
                About the centre
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Featured courses with staggered card entrance */}
      <section aria-labelledby="featured-title" className="pt-16 sm:pt-20">
        <Container>
          <FadeIn className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              id="featured-title"
              title="HS-CIT programmes"
              intro="The same core skills in three lengths. Pick the one that fits your time and goals."
            />
            <Button to="/courses" variant="secondary" className="self-start sm:self-auto">
              See all courses
            </Button>
          </FadeIn>

          <FadeInStagger className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((course) => (
              <FadeInItem key={course.slug}>
                <CourseCard course={course} variant="feature" />
              </FadeInItem>
            ))}
          </FadeInStagger>
        </Container>
      </section>

      {/* HCOC band */}
      <section aria-labelledby="hcoc-title" className="pt-16 sm:pt-20">
        <Container>
          <FadeIn>
            <div className="grid gap-8 rounded-[1.75rem] border border-brand-100 bg-brand-50/80 p-6 shadow-xs sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
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
                <h3 className="font-display text-lg font-semibold text-brand-950">Ten sectors</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {hcocSectors.map((sector) => (
                    <li
                      key={sector}
                      className="rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-sm font-medium text-brand-800 transition-all duration-200 hover:border-brand-400 hover:bg-brand-50 hover:scale-[1.02]"
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

      {/* Why choose: Staggered entrance */}
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
                className="group flex gap-4 rounded-2xl border border-brand-100/70 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md hover:shadow-brand-900/5"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700 transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-700 group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-brand-950 transition-colors group-hover:text-brand-900">{title}</h3>
                  <p className="mt-1 text-sm text-muted leading-relaxed">{text}</p>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </Container>
      </section>

      {/* Gallery preview */}
      {galleryImages.length > 0 && (
        <section aria-labelledby="gallery-title" className="pt-16 sm:pt-20">
          <Container>
            <FadeIn>
              <SectionHeading id="gallery-title" title="Inside the centre" />
            </FadeIn>
            <FadeInStagger className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4" as="ul">
              {galleryImages.slice(0, 4).map((image) => (
                <FadeInItem key={image.src} as="li">
                  <figure className="group overflow-hidden rounded-2xl bg-brand-100">
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {image.caption && (
                      <figcaption className="mt-2 text-sm text-muted">{image.caption}</figcaption>
                    )}
                  </figure>
                </FadeInItem>
              ))}
            </FadeInStagger>
          </Container>
        </section>
      )}

      {/* FAQ preview */}
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
                  Still unsure? <Link to="/contact" className="font-semibold text-brand-800 underline underline-offset-4 hover:text-brand-950">Ask the centre directly.</Link>
                </span>
              </p>
            </div>
            <FaqList items={previewFaqs} />
          </FadeIn>
        </Container>
      </section>

      {/* Contact */}
      <section aria-labelledby="contact-title" className="pt-16 sm:pt-20">
        <Container>
          <FadeIn className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div>
              <SectionHeading
                id="contact-title"
                title="Talk to the centre"
                intro="Ask about batches, fees or eligibility. Call, message on WhatsApp or visit during opening hours."
              />
              <Button to="/contact" variant="secondary" className="mt-6">
                Full contact details
              </Button>
            </div>
            <ContactMethods />
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
