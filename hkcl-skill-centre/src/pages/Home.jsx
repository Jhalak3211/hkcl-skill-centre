import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, BookOpenCheck, IndianRupee, Languages, MapPin, MonitorPlay, Phone, Landmark } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import CourseCard from '../components/CourseCard.jsx';
import DurationChart from '../components/DurationChart.jsx';
import FaqList from '../components/FaqList.jsx';
import ContactMethods from '../components/ContactMethods.jsx';
import { getFeaturedCourses, hcocSectors } from '../data/courses.js';
import { previewFaqs } from '../data/faqs.js';
import { galleryImages } from '../data/gallery.js';
import { siteConfig } from '../data/siteConfig.js';
import { getTelHref } from '../utils/contact.js';

const group = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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

      {/* Hero */}
      <section aria-labelledby="hero-title" className="border-b border-brand-100 bg-brand-50">
        <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:py-20">
          <motion.div variants={group} initial="hidden" animate="show">
            <motion.h1
              id="hero-title"
              variants={item}
              className="text-4xl font-semibold text-brand-950 sm:text-5xl lg:text-6xl"
            >
              Computer and digital skills training in Sirsa
            </motion.h1>
            <motion.p variants={item} className="mt-5 max-w-xl text-lg text-muted">
              HS-CIT programmes, HCOC career courses and typing training on Barnala Road. HS-CIT and 120-hour HCOC
              courses carry HKCL and HSBTE certificates.
            </motion.p>
            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/courses" size="lg">
                Explore courses
              </Button>
              <Button to="/contact" variant="secondary" size="lg">
                Contact us
              </Button>
            </motion.div>
            {tel && (
              <motion.p variants={item} className="mt-6 flex items-center gap-2 text-sm text-muted">
                <Phone className="h-4 w-4 text-brand-600" aria-hidden="true" />
                <span>
                  Prefer to talk?{' '}
                  <a
                    href={tel}
                    className="rounded-sm font-semibold text-brand-800 underline underline-offset-4 hover:text-brand-950"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                </span>
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          >
            <DurationChart />
          </motion.div>
        </Container>
      </section>

      {/* Introduction */}
      <section aria-labelledby="intro-title" className="pt-16 sm:pt-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
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
        </Container>
      </section>

      {/* Featured courses */}
      <section aria-labelledby="featured-title" className="pt-16 sm:pt-20">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              id="featured-title"
              title="HS-CIT programmes"
              intro="The same core skills in three lengths. Pick the one that fits your time and goals."
            />
            <Button to="/courses" variant="secondary" className="self-start sm:self-auto">
              See all courses
            </Button>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((course) => (
              <CourseCard key={course.slug} course={course} variant="feature" />
            ))}
          </div>
        </Container>
      </section>

      {/* HCOC band */}
      <section aria-labelledby="hcoc-title" className="pt-16 sm:pt-20">
        <Container>
          <div className="grid gap-8 rounded-[1.75rem] bg-brand-50 p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
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
                    className="rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-sm font-medium text-brand-800"
                  >
                    {sector}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Why choose */}
      <section aria-labelledby="why-title" className="pt-16 sm:pt-20">
        <Container>
          <SectionHeading id="why-title" title="Why learners choose the centre" />
          <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <Icon className="mt-1 h-6 w-6 shrink-0 text-brand-600" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-semibold text-brand-950">{title}</h3>
                  <p className="mt-1 text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Gallery preview: only when real photos exist (see src/data/gallery.js) */}
      {galleryImages.length > 0 && (
        <section aria-labelledby="gallery-title" className="pt-16 sm:pt-20">
          <Container>
            <SectionHeading id="gallery-title" title="Inside the centre" />
            <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {galleryImages.slice(0, 4).map((image) => (
                <li key={image.src}>
                  <figure>
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-2xl object-cover"
                    />
                    {image.caption && (
                      <figcaption className="mt-2 text-sm text-muted">{image.caption}</figcaption>
                    )}
                  </figure>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* FAQ preview */}
      <section aria-labelledby="faq-title" className="pt-16 sm:pt-20">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <SectionHeading
              id="faq-title"
              title="Common questions"
              intro="Short answers about courses, fees and where to find us."
            />
            <p className="mt-5 flex items-start gap-2 text-sm text-muted">
              <BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              <span>
                Still unsure? <Link to="/contact" className="font-semibold text-brand-800 underline underline-offset-4">Ask the centre directly.</Link>
              </span>
            </p>
          </div>
          <FaqList items={previewFaqs} />
        </Container>
      </section>

      {/* Contact */}
      <section aria-labelledby="contact-title" className="pt-16 sm:pt-20">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
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
        </Container>
      </section>
    </>
  );
}
