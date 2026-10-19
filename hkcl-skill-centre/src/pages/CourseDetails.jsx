import { Link, useParams } from 'react-router-dom';
import { Check, ChevronRight, MessageCircle, Phone } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import CourseCard from '../components/CourseCard.jsx';
import { FadeIn, FadeInStagger, FadeInItem } from '../components/MotionReveal.jsx';
import { getCourseBySlug, getRelatedCourses } from '../data/courses.js';
import { getEnquiryProps, getTelHref } from '../utils/contact.js';
import {
  getCategoryLabel,
  getDurationText,
  getEligibilityText,
  getFeeText,
  getFeeUnit,
  valueOrFallback,
} from '../utils/format.js';
import { siteConfig } from '../data/siteConfig.js';

function CourseNotFound() {
  return (
    <>
      <Seo title="Course not found" path="/courses" noindex />
      <Container className="py-20 text-center sm:py-28">
        <FadeIn>
          <h1 className="text-3xl font-semibold text-brand-950 dark:text-white sm:text-4xl">We could not find that course</h1>
          <p className="mx-auto mt-4 max-w-md text-muted dark:text-slate-400">
            The link may be out of date, or the course may no longer be listed. Browse the full list or contact the
            centre.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/courses">View all courses</Button>
            <Button to="/contact" variant="secondary">
              Contact the centre
            </Button>
          </div>
        </FadeIn>
      </Container>
    </>
  );
}

export default function CourseDetails() {
  const { slug } = useParams();
  const course = getCourseBySlug(slug);

  if (!course) return <CourseNotFound />;

  const enquiry = getEnquiryProps(course);
  const tel = getTelHref();
  const related = getRelatedCourses(course);
  const feeUnit = getFeeUnit(course);

  const facts = [
    { label: 'Duration', value: getDurationText(course) },
    { label: 'Fee', value: feeUnit ? `${getFeeText(course)} ${feeUnit}` : getFeeText(course) },
    { label: 'Eligibility', value: getEligibilityText(course) },
    { label: 'Certificate', value: valueOrFallback(course.certificate) },
    course.audience && { label: 'Suitable for', value: course.audience },
    course.language && { label: 'Language', value: course.language },
    course.mode && { label: 'Mode', value: course.mode },
  ].filter(Boolean);

  return (
    <>
      <Seo
        title={course.name}
        path={`/courses/${course.slug}`}
        description={`${course.name} at ${siteConfig.name}, ${siteConfig.locationName}. ${course.summary}`}
      />

      <section className="border-b border-brand-100/80 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50">
        <Container className="py-10 sm:py-14">
          <FadeIn>
            <nav aria-label="Breadcrumb" className="text-sm text-muted dark:text-slate-400">
              <ol className="flex flex-wrap items-center gap-1">
                <li>
                  <Link
                    to="/courses"
                    className="rounded-sm font-medium text-brand-700 dark:text-blue-400 underline underline-offset-4 hover:text-brand-900 dark:hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    Courses
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li aria-current="page" className="font-medium text-brand-900 dark:text-slate-200">
                  {course.name}
                </li>
              </ol>
            </nav>
            <p className="mt-5 inline-flex rounded-full border border-brand-200/60 bg-white/80 px-3 py-1 text-xs font-medium text-brand-800 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:text-blue-300">
              {getCategoryLabel(course)}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand-950 dark:text-white sm:text-4xl lg:text-5xl">
              {course.name}
            </h1>
            {course.subtitle && <p className="mt-2 text-lg text-muted dark:text-slate-300">{course.subtitle}</p>}
          </FadeIn>
        </Container>
      </section>

      <Container className="grid gap-10 pt-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14 sm:pt-12">
        <FadeIn className="min-w-0 space-y-10">
          <section aria-labelledby="overview-title">
            <h2 id="overview-title" className="text-2xl font-semibold text-brand-950 dark:text-white">
              Overview
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted dark:text-slate-300 sm:text-lg">
              {course.description}
            </p>
          </section>

          <section aria-labelledby="facts-title">
            <h2 id="facts-title" className="text-2xl font-semibold text-brand-950 dark:text-white">
              Course information
            </h2>
            <dl className="mt-4 divide-y divide-brand-100 rounded-2xl border border-brand-100/80 bg-white/75 shadow-xs backdrop-blur-md dark:divide-white/10 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-black/20">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid gap-1 px-5 py-4 transition-colors hover:bg-brand-50/50 dark:hover:bg-white/5 sm:grid-cols-[10rem_1fr] sm:gap-4"
                >
                  <dt className="text-sm font-medium text-muted dark:text-slate-400">{fact.label}</dt>
                  <dd className="font-medium text-brand-950 dark:text-white">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {course.highlights.length > 0 && (
            <section aria-labelledby="includes-title">
              <h2 id="includes-title" className="text-2xl font-semibold text-brand-950 dark:text-white">
                What it includes
              </h2>
              <ul className="mt-4 space-y-3">
                {course.highlights.map((point) => (
                  <li key={point} className="flex gap-3 text-muted dark:text-slate-300">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-brand-600 dark:text-blue-400" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.notes && (
            <aside
              aria-label="Note"
              className="rounded-2xl border border-accent-400/80 bg-accent-100/70 p-5 text-accent-900 shadow-xs backdrop-blur-md dark:border-accent-500/40 dark:bg-amber-950/40 dark:text-amber-200"
            >
              {course.notes}
            </aside>
          )}
        </FadeIn>

        <aside aria-labelledby="enquire-title" className="lg:sticky lg:top-24 lg:self-start">
          <FadeIn delay={0.15}>
            <div className="rounded-2xl border border-brand-200/80 bg-white/80 p-6 shadow-md shadow-brand-900/5 backdrop-blur-lg transition-all duration-300 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/40 dark:hover:border-white/20">
              <h2 id="enquire-title" className="text-xl font-semibold text-brand-950 dark:text-white">
                Enquire about this course
              </h2>
              <p className="mt-2 text-sm text-muted dark:text-slate-400">
                Ask about batches, start dates and eligibility. Fees are as listed by the centre, so confirm before you
                enrol.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <Button {...enquiry} variant="accent" size="lg">
                  <MessageCircle className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                  {enquiry.href ? 'Enquire on WhatsApp' : 'Contact the centre'}
                </Button>
                {tel && (
                  <Button href={tel} variant="secondary" size="lg">
                    <Phone className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" aria-hidden="true" />
                    Call {siteConfig.contact.phoneDisplay}
                  </Button>
                )}
                <Button to="/contact" variant="secondary">
                  All contact details
                </Button>
              </div>
            </div>
          </FadeIn>
        </aside>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="pt-16 sm:pt-20">
          <Container>
            <FadeIn>
              <h2 id="related-title" className="text-2xl font-semibold text-brand-950 dark:text-white">
                Related courses
              </h2>
            </FadeIn>
            <FadeInStagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <FadeInItem key={item.slug}>
                  <CourseCard course={item} variant="compact" />
                </FadeInItem>
              ))}
            </FadeInStagger>
          </Container>
        </section>
      )}
    </>
  );
}
