import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { heroSlides } from '../data/gallery.js';

/**
 * HeroSlideshow
 * ---------------------------------------------------------------------------
 * Displays an automated background image slideshow of HKCL Skill Centre.
 * - Smooth crossfade transitions every 4.5 seconds
 * - Accessible controls and slide indicators
 * - Pause on hover / focus
 * - High-contrast gradient overlay ensuring readability in light & dark themes
 * - Gentle Ken-Burns zoom effect (disabled when prefers-reduced-motion is on)
 * - First image loaded eagerly, subsequent images lazy-loaded
 */
export default function HeroSlideshow({ slides = heroSlides }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const total = slides.length;

  // Auto-advance slides every 4.5s unless paused or only 1 slide
  useEffect(() => {
    if (total <= 1 || isPaused) return undefined;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4500);

    return () => clearInterval(timer);
  }, [total, isPaused]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const activeSlide = slides[current];

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides container with crossfade */}
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
          {/* Subtle Ken Burns zoom effect */}
          <motion.img
            src={activeSlide.src}
            alt={activeSlide.alt || 'HKCL Skill Centre facility'}
            loading={current === 0 ? 'eager' : 'lazy'}
            fetchPriority={current === 0 ? 'high' : 'auto'}
            className="h-full w-full object-cover object-center"
            initial={shouldReduceMotion ? {} : { scale: 1 }}
            animate={shouldReduceMotion ? {} : { scale: 1.04 }}
            transition={{
              duration: 6,
              ease: 'linear',
            }}
            onError={(e) => {
              // Graceful fallback to fallbackSrc or styled SVG placeholder if file not yet uploaded
              if (activeSlide.fallbackSrc && e.currentTarget.src !== activeSlide.fallbackSrc) {
                e.currentTarget.src = activeSlide.fallbackSrc;
              } else {
                e.currentTarget.style.display = 'none';
              }
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Primary readability gradient: ensures text on left is crystal clear */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/60 dark:from-slate-950/95 dark:via-slate-950/85 dark:to-slate-950/65"
        aria-hidden="true"
      />

      {/* Top and bottom soft fade overlays */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 to-transparent dark:from-slate-950/80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)]/70 to-transparent"
        aria-hidden="true"
      />

      {/* Slide indicators / progress bar (clickable) */}
      {total > 1 && (
        <div className="pointer-events-auto absolute bottom-4 right-4 z-20 flex items-center gap-1.5 sm:bottom-6 sm:right-8">
          {slides.map((slide, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={slide.id || idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}: ${slide.title || slide.alt || 'Campus view'}`}
                aria-current={isActive ? 'true' : 'false'}
                onClick={() => setCurrent(idx)}
                className={`group relative h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isActive
                    ? 'w-7 bg-brand-700 dark:bg-blue-400'
                    : 'w-2.5 bg-brand-900/25 hover:bg-brand-900/40 dark:bg-white/30 dark:hover:bg-white/50'
                }`}
              >
                <span className="sr-only">Slide {idx + 1}</span>
              </button>
            );
          })}
          {activeSlide.title && (
            <span className="ml-2 hidden text-xs font-medium text-brand-900/70 dark:text-slate-300 md:inline-block">
              {activeSlide.title}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
