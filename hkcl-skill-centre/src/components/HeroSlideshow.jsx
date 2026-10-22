
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
    }, 4500);

    return () => clearInterval(timer);
  }, [total, isPaused]);

  if (total === 0) return null;

  const activeSlide = slides[current];

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
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
            transition={{ duration: 6, ease: 'linear' }}
            onError={(e) => {
              if (
                activeSlide.fallbackSrc &&
                e.currentTarget.src !== activeSlide.fallbackSrc
              ) {
                e.currentTarget.src = activeSlide.fallbackSrc;
              } else {
                e.currentTarget.style.display = 'none';
              }
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Light overlay: keep photos visible in light mode */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-white/65 via-white/35 to-white/10 dark:from-slate-950/75 dark:via-slate-950/40 dark:to-slate-950/15"
        aria-hidden="true"
      />

      {/* Subtle top fade
      <div
        className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/35 to-transparent dark:from-slate-950/45"
        aria-hidden="true"
      /> */}

      {/* Bottom fade
      <div
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg-page)]/75 to-transparent"
        aria-hidden="true"
      /> */}

      {/* Slide indicators */}
      {/* {total > 1 && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/45 to-slate-950/10">
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
                    : 'w-2.5 bg-brand-900/30 hover:bg-brand-900/50 dark:bg-white/30 dark:hover:bg-white/50'
                }`}
              >
                <span className="sr-only">Slide {idx + 1}</span>
              </button>
            );
          })}

          {activeSlide.title && (
            <span className="ml-2 hidden text-xs font-medium text-brand-900/80 dark:text-slate-200 md:inline-block">
              {activeSlide.title}
            </span>
          )}
        </div>
      )} */}
    </div>
  );
}
