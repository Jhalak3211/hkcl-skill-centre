import { useEffect, useState } from 'react';
import { ArrowUpRight, ShieldAlert } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import { FadeIn } from '../components/MotionReveal.jsx';
import { siteConfig } from '../data/siteConfig.js';
import { getStudentPortalUrl } from '../utils/contact.js';

// How long the notice is shown before the browser is sent to the HKCL portal.
const REDIRECT_DELAY_MS = 2500;

/**
 * /student-login
 * Sends the visitor to the official HKCL portal configured in
 * siteConfig.js (STUDENT_PORTAL_URL). This page has no login form and never
 * touches credentials. A manual link is always shown as a fallback.
 */
export default function StudentLogin() {
  const portalUrl = getStudentPortalUrl();
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (!portalUrl || cancelled) return undefined;
    const timer = window.setTimeout(() => {
      window.location.assign(portalUrl);
    }, REDIRECT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [portalUrl, cancelled]);

  return (
    <>
      <Seo title="Student Login" path="/student-login" noindex />
      <Container className="py-16 sm:py-24">
        <FadeIn className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-semibold text-brand-950 dark:text-white sm:text-4xl">Student Login</h1>

          {portalUrl ? (
            <>
              <p role="status" className="mt-4 text-lg text-muted dark:text-slate-300">
                {cancelled
                  ? 'Redirect stopped. You can continue whenever you are ready.'
                  : 'Taking you to the official HKCL website\u2026'}
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href={portalUrl} external={false} size="lg">
                  Continue to HKCL
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </Button>
                {!cancelled && (
                  <Button variant="secondary" size="lg" onClick={() => setCancelled(true)}>
                    Stop redirect
                  </Button>
                )}
              </div>
            </>
          ) : (
            <p className="mt-4 text-lg text-muted dark:text-slate-300">
              The student login link is not available right now. Please contact the centre for help.
            </p>
          )}

          <p className="mx-auto mt-8 flex max-w-md items-start gap-3 rounded-2xl border border-brand-200/80 bg-white/70 p-4 text-left text-sm text-muted shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-blue-400" aria-hidden="true" />
            <span>
              {siteConfig.name} never asks for your HKCL username or password. Only sign in on the official HKCL
              website.
            </span>
          </p>

          {import.meta.env.DEV && !siteConfig.studentPortal.verified && (
            <p className="mx-auto mt-4 max-w-md rounded-xl border border-accent-400/80 bg-accent-100/70 p-3 text-left text-xs text-accent-900 backdrop-blur-md dark:border-accent-500/40 dark:bg-amber-950/40 dark:text-amber-200">
              Developer note (visible in development only): the student portal URL in{' '}
              <code>src/data/siteConfig.js</code> has not been verified as the real student-login page. Replace it
              and set <code>studentPortal.verified</code> to true before launch.
            </p>
          )}
        </FadeIn>
      </Container>
    </>
  );
}
