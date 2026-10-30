import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, ArrowRight, Sparkles } from 'lucide-react';
import Container from './Container.jsx';

export default function HomeAdvertisement() {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadPublishedAds() {
      try {
        const res = await fetch('/api/advertisements/published');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.advertisements)) {
          setAdvertisements(data.advertisements);
        }
      } catch {
        // Silently handle if offline or no backend
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPublishedAds();
    return () => {
      isMounted = false;
    };
  }, []);

  // Gracefully hide entire section if no published advertisements exist
  if (loading || advertisements.length === 0) {
    return null;
  }

  // Display the primary active advertisement
  const ad = advertisements[0];

  return (
    <section aria-label="Special Announcements" className="py-6 sm:py-8 bg-slate-50/70 border-b border-brand-100/60">
      <Container>
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-brand-200/90 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 text-white shadow-lg">
          {/* Subtle Ambient Decorative Light */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/10 blur-2xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 p-6 sm:p-8 lg:p-10">
            {/* Left Content */}
            <div className="max-w-2xl text-center lg:text-left">
              {ad.badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{ad.badge}</span>
                </div>
              )}

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-snug">
                {ad.title}
              </h2>

              {ad.description && (
                <p className="mt-2 text-xs sm:text-sm lg:text-base text-brand-100/90 leading-relaxed max-w-xl">
                  {ad.description}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  to={ad.ctaUrl || '/courses'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs sm:text-sm transition shadow-md hover:shadow-orange-600/20 hover:-translate-y-0.5"
                >
                  <span>{ad.ctaText || 'Learn More'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-xs sm:text-sm transition"
                >
                  <span>Enquire at Centre</span>
                </Link>
              </div>
            </div>

            {/* Right Banner Image */}
            {ad.imageUrl && (
              <div className="w-full lg:w-auto shrink-0 flex justify-center">
                <div className="relative h-44 w-full sm:w-80 lg:w-96 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/15 shadow-xl bg-brand-900/40">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
