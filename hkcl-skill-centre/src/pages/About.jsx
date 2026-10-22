import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ImagePlaceholder from '../components/ImagePlaceholder.jsx';
import { FadeIn, FadeInStagger, FadeInItem } from '../components/MotionReveal.jsx';
import { galleryImages } from '../data/gallery.js';
import { siteConfig } from '../data/siteConfig.js';
import { Monitor, GraduationCap, Award } from 'lucide-react';
// Statements regarding centre offerings
const offerings = [
  {
    title: 'HS-CIT programmes',
    text: 'Computer and digital skills courses in three lengths: 3 months, 6 months and 1 year.',
  },
  {
    title: 'HCOC career-oriented courses',
    text: "HKCL's Career Oriented Course series, built to bridge college and careers through employability skills.",
  },
  {
    title: 'Typing and short courses',
    text: 'Standalone courses such as Typing Skills, listed on the courses page.',
  },
];

const approach = [
  'Practical digital knowledge that learners can use at work and in daily life',
  'Job-oriented content, including MS Office 365 with AI tools in HS-CIT',
  'Online and offline batches for HS-CIT',
  'Smart classes that use audio and video teaching',
  'Teaching in English and Hindi for HS-CIT',
];

export default function About() {
  const photos = galleryImages.slice(0, 2);

  return (
    <>
      <Seo
        title="About"
        path="/about"
        description={`About ${siteConfig.name} in ${siteConfig.locationName}: practical computer education, HS-CIT and HCOC courses, and typing training.`}
      />

      <section className="border-b border-brand-100/80 bg-white/70 backdrop-blur-md">
        <Container className="py-12 sm:py-16">
          <FadeIn>
            <SectionHeading
              as="h1"
              size="lg"
              title={`About ${siteConfig.name}`}
              intro="Computer education and skill development training for students, job seekers and working professionals in Sirsa."
            />
          </FadeIn>
        </Container>
      </section>

      
{/* What the centre does */}
<section
  aria-labelledby="who-title"
  className="pt-12 sm:pt-16"
>
  <Container>
    <FadeIn className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">

      {/* Left column: heading and feature highlights */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-orange-600">
          About our centre
        </p>

        <SectionHeading
          id="who-title"
          title="What the centre does"
        />

        <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
          Practical computer education and digital skills to help learners
          build confidence in an increasingly digital world.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-white/80 p-3 sm:p-4">
            <Monitor
              className="mt-0.5 h-5 w-5 shrink-0 text-orange-600"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-sm font-semibold leading-5 text-brand-950">
                Computer Education
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                Computer courses and digital literacy.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-white/80 p-3 sm:p-4">
            <GraduationCap
              className="mt-0.5 h-5 w-5 shrink-0 text-orange-600"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-sm font-semibold leading-5 text-brand-950">
                Skill Development
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                Practical, career-oriented learning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right column: description and certification information */}
      <div className="min-w-0 space-y-4">
        <p className="text-base leading-7 text-slate-700">
          {siteConfig.name} provides computer education and skill development
          training that gives students practical digital knowledge. The centre
          offers computer courses, IT training, digital literacy and
          career-oriented programmes designed to develop technical skills and
          support employability.
        </p>

        <p className="text-base leading-7 text-slate-700">
          Courses are linked to HKCL. HS-CIT programmes and 120-hour HCOC
          courses carry the certifications described by the centre and its
          applicable course information.
        </p>

        <div className="rounded-xl border border-brand-100 bg-slate-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 ring-1 ring-brand-100">
              <Award className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-brand-950">
                Courses and certification
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Explore HS-CIT and HCOC programmes to learn about their
                course content, duration and applicable certification details.
              </p>

              <Button to="/courses" className="mt-3">
                Explore courses
              </Button>
            </div>
          </div>
        </div>
      </div>

    </FadeIn>
  </Container>
</section>


      {/* What you can study */}
      <section aria-labelledby="offer-title" className="pt-14 sm:pt-16">
        <Container>
          <FadeIn>
            <SectionHeading id="offer-title" title="What you can study" />
          </FadeIn>
          <FadeInStagger className="mt-8 grid gap-6 md:grid-cols-3" as="dl">
            {offerings.map((offering) => (
              <FadeInItem
                key={offering.title}
                className="group rounded-2xl border-l-4 border-l-brand-600 border border-brand-100/80 bg-white/80 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-l-brand-700 hover:bg-white hover:shadow-lg hover:shadow-brand-900/5"
              >
                <dt className="font-display text-lg font-semibold text-brand-950 transition-colors group-hover:text-brand-900">
                  {offering.title}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-600">{offering.text}</dd>
              </FadeInItem>
            ))}
          </FadeInStagger>
          <FadeIn delay={0.2}>
            <Button to="/courses" className="mt-8">
              View all courses
            </Button>
          </FadeIn>
        </Container>
      </section>

      {/* Learning approach and facilities */}
      <section aria-labelledby="approach-title" className="pt-14 sm:pt-16">
        <Container>
          <FadeIn className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <SectionHeading
                id="approach-title"
                title="Learning approach and facilities"
                intro="Practical, career-focused learning environment."
              />
              <ul className="mt-6 space-y-3 text-slate-700">
                {approach.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Centre photographs with clearly visible captions */}
            <div className="grid gap-5 sm:grid-cols-2">
              {photos.length > 0
                ? photos.map((image) => (
                    <div
                      key={image.src}
                      className="group overflow-hidden rounded-2xl border border-brand-100/90 bg-white/80 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-brand-300 hover:shadow-md"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-brand-50">
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="p-4 text-left">
                        <h3 className="font-semibold text-sm text-brand-950">
                          {image.title}
                        </h3>
                        {image.caption && (
                          <p className="mt-1 text-xs text-slate-500">
                            {image.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                : ['Classroom photograph', 'Reception photograph'].map((label) => (
                    <ImagePlaceholder key={label} label={label} className="aspect-[4/3]" />
                  ))}
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Visit or call the centre section - full visible padding */}
      <section aria-labelledby="visit-title" className="py-14 sm:py-16 sm:pb-20">
        <Container>
          <FadeIn>
            <div className="rounded-[1.75rem] border border-brand-100/90 bg-white/80 p-6 shadow-xs backdrop-blur-md sm:p-10">
              <SectionHeading
                id="visit-title"
                title="Visit or call the centre"
                intro="Ask about batches, fees and eligibility for the course you have in mind."
              />
              <Button to="/contact" className="mt-6">
                Contact us
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
