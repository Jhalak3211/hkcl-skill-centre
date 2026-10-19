import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ImagePlaceholder from '../components/ImagePlaceholder.jsx';
import { galleryImages } from '../data/gallery.js';
import { siteConfig } from '../data/siteConfig.js';

// Only statements that appear on the centre's existing public profile.
const offerings = [
  {
    title: 'HS-CIT programmes',
    text: 'Computer and digital skills courses in three lengths: 3 months, 6 months and 1 year.',
  },
  {
    title: 'HCOC career-oriented courses',
    text: 'HKCL\'s Career Oriented Course series, built to bridge college and careers through employability skills.',
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

      <section className="border-b border-brand-100 bg-brand-50">
        <Container className="py-12 sm:py-16">
          <SectionHeading
            as="h1"
            size="lg"
            title={`About ${siteConfig.name}`}
            intro="Computer education and skill development training for students, job seekers and working professionals in Sirsa."
          />
        </Container>
      </section>

      <section aria-labelledby="who-title" className="pt-14 sm:pt-16">
        <Container className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <SectionHeading id="who-title" title="What the centre does" />
          <div className="space-y-4 text-base text-muted sm:text-lg">
            <p>
              {siteConfig.name} provides computer education and skill development training that gives students
              practical digital knowledge. The centre runs computer courses, IT training, digital literacy and
              career-oriented programmes designed to improve technical skills and employability.
            </p>
            <p>
              Courses are linked to HKCL, and HS-CIT programmes and 120-hour HCOC courses carry certificates from HKCL
              and the Haryana State Board of Technical Education.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="offer-title" className="pt-14 sm:pt-16">
        <Container>
          <SectionHeading id="offer-title" title="What you can study" />
          <dl className="mt-8 grid gap-6 md:grid-cols-3">
            {offerings.map((offering) => (
              <div key={offering.title} className="border-l-4 border-brand-300 pl-5">
                <dt className="font-display text-lg font-semibold text-brand-950">{offering.title}</dt>
                <dd className="mt-1 text-muted">{offering.text}</dd>
              </div>
            ))}
          </dl>
          <Button to="/courses" className="mt-8">
            View all courses
          </Button>
        </Container>
      </section>

      <section aria-labelledby="approach-title" className="pt-14 sm:pt-16">
        <Container className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <SectionHeading
              id="approach-title"
              title="Learning approach and facilities"
              intro="As described by the centre."
            />
            <ul className="mt-6 space-y-3 text-muted">
              {approach.map((point) => (
                <li key={point} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Replace these placeholders by adding photos in src/data/gallery.js */}
          <div className="grid gap-4 sm:grid-cols-2">
            {photos.length > 0
              ? photos.map((image) => (
                  <img
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-2xl object-cover"
                  />
                ))
              : ['Classroom photograph', 'Reception photograph'].map((label) => (
                  <ImagePlaceholder key={label} label={label} className="aspect-[4/3]" />
                ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="visit-title" className="pt-14 sm:pt-16">
        <Container>
          <div className="rounded-[1.75rem] bg-brand-50 p-6 sm:p-10">
            <SectionHeading
              id="visit-title"
              title="Visit or call the centre"
              intro="Ask about batches, fees and eligibility for the course you have in mind."
            />
            <Button to="/contact" className="mt-6">
              Contact us
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
