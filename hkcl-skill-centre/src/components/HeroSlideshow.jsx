import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { heroSlides } from '../data/gallery.js';

export default function HeroSlideshow({ slides = heroSlides }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const total = slides?.length ?? 0;

  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);

    return () => clearInterval(timer);
  }, [total, isPaused]);

  if (total === 0) return null;

  const activeSlide = slides[current];

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Image Layer */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={activeSlide.id || activeSlide.src || current}
          className="absolute inset-0 h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.3 : 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.img
            src={activeSlide.src}
            alt={activeSlide.alt || 'HKCL Skill Centre facility'}
            loading={current === 0 ? 'eager' : 'lazy'}
            fetchPriority={current === 0 ? 'high' : 'auto'}
            className="h-full w-full object-cover object-center"
            initial={shouldReduceMotion ? {} : { scale: 1 }}
            animate={shouldReduceMotion ? {} : { scale: 1.04 }}
            transition={{ duration: 7, ease: 'linear' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Layer 1: Soft light scrim for natural photo balance */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-white/40"
        aria-hidden="true"
      />

      {/* Layer 2: Clean, luminous light directional gradient
          On mobile: vertical gradient providing crisp light background behind stacked text.
          On desktop: smooth horizontal gradient from bright white/page background behind text
          to open transparency on the right to preserve photograph clarity. */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#f8fafd]/95 via-[#f8fafd]/85 to-[#f8fafd]/40 lg:bg-gradient-to-r lg:from-[#f8fafd]/95 lg:via-[#f8fafd]/85 lg:to-[#f8fafd]/25"
        aria-hidden="true"
      />

      {/* Layer 3: Seamless bottom fade into page background */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 z-[3] bg-gradient-to-t from-[var(--bg-page)] to-transparent"
        aria-hidden="true"
      />

      {/* Slide indicators: light theme pill */}
      {total > 1 && (
        <div className="pointer-events-auto absolute bottom-6 right-6 z-10 hidden sm:flex items-center gap-2 rounded-full border border-brand-200/90 bg-white/90 px-3.5 py-1.5 shadow-xs backdrop-blur-md">
          {slides.map((slide, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={slide.id || idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}: ${slide.title || slide.alt || 'Campus view'}`}
                aria-current={isActive ? 'true' : 'false'}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isActive
                    ? 'w-6 bg-brand-700'
                    : 'w-2 bg-brand-900/25 hover:bg-brand-900/50'
                }`}
              >
                <span className="sr-only">Slide {idx + 1}</span>
              </button>
            );
          })}
          {activeSlide.title && (
            <span className="ml-1 text-xs font-medium text-brand-900/80">
              {activeSlide.title}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
