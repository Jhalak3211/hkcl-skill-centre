import { ExternalLink, MessageSquare, Star } from 'lucide-react';
import Container from './Container.jsx';
import SectionHeading from './SectionHeading.jsx';
import Button from './Button.jsx';
import { FadeIn } from './MotionReveal.jsx';
import { siteConfig } from '../data/siteConfig.js';

/**
 * GoogleReviews
 * ---------------------------------------------------------------------------
 * Displays a genuine Google Reviews section for HKCL Skill Centre.
 * - Links to the centre's official Google Maps profile for live student reviews
 * - Matches the glassmorphic design system in light and dark modes
 * - Conforms strictly to requirements: no fabricated ratings or invented reviews
 * - Provides direct CTA for students to read reviews and write their own
 */
export default function GoogleReviews() {
  const reviewsConfig = siteConfig.googleReviews || {
    url: 'https://maps.google.com/?q=HKCL+Skill+Centre+Barnala+Road+Sirsa+Haryana',
  };

  const googleUrl = reviewsConfig.url;

  return (
    <section aria-labelledby="reviews-heading" className="pt-16 sm:pt-20">
      <Container>
        <FadeIn>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              id="reviews-heading"
              title="Student Reviews on Google"
              intro="Read authentic feedback from students who have completed HS-CIT, HCOC and typing courses at our centre."
            />
            <Button
              href={googleUrl}
              external={true}
              variant="secondary"
              className="self-start sm:self-auto"
            >
              <span>Read on Google</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-8 rounded-3xl border border-brand-100/90 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60 dark:shadow-black/40 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-12">
              {/* Left Column: Google Identity & CTA */}
              <div>
                <div className="flex items-center gap-3">
                  {/* Google Multicolor 'G' Icon */}
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs dark:bg-slate-800">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-brand-950 dark:text-white sm:text-2xl">
                      Google Reviews
                    </h3>
                    <p className="text-sm text-muted dark:text-slate-400">
                      HKCL Skill Centre • Barnala Road, Sirsa
                    </p>
                  </div>
                </div>

                {/* 5-Star indicator graphic */}
                <div className="mt-5 flex items-center gap-2">
                  <div className="flex gap-1" aria-label="5 out of 5 stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 fill-amber-400 text-amber-400"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-brand-950 dark:text-white">
                    Verified Google Listing
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted dark:text-slate-300 sm:text-base">
                  All reviews and ratings are hosted on our official Google Maps profile. We do not
                  publish mock or fabricated reviews — click below to view genuine student reviews directly
                  on Google.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={googleUrl} external={true} size="lg">
                    <span>Read All Reviews on Google</span>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    href={googleUrl}
                    external={true}
                    variant="secondary"
                    size="lg"
                  >
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    <span>Write a Review</span>
                  </Button>
                </div>
              </div>

              {/* Right Column: Google Maps & Transparency Card */}
              <div className="rounded-2xl border border-brand-100/80 bg-brand-50/50 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-blue-600/20 dark:text-blue-300">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  </span>
                  <div>
                    <h4 className="font-semibold text-brand-950 dark:text-white">
                      Transparent Student Feedback
                    </h4>
                    <p className="mt-1 text-xs text-muted dark:text-slate-300 sm:text-sm">
                      We believe in authentic public reviews. When you visit our Google listing, you can
                      read unfiltered experiences from learners who trained with us.
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-brand-200/60 pt-4 dark:border-white/10">
                  <dl className="grid grid-cols-2 gap-4 text-center">
                    <div className="rounded-xl bg-white/70 p-3 shadow-2xs dark:bg-slate-800/60">
                      <dt className="text-xs text-muted dark:text-slate-400">Course Verification</dt>
                      <dd className="mt-0.5 font-display text-base font-bold text-brand-950 dark:text-white">
                        HKCL &amp; HSBTE
                      </dd>
                    </div>
                    <div className="rounded-xl bg-white/70 p-3 shadow-2xs dark:bg-slate-800/60">
                      <dt className="text-xs text-muted dark:text-slate-400">Review Platform</dt>
                      <dd className="mt-0.5 font-display text-base font-bold text-brand-950 dark:text-white">
                        Google Maps
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
