import { motion, useReducedMotion } from 'framer-motion';

/**
 * HeroVisual — animated brand "H" element.
 *
 * Decorative only (aria-hidden). Uses the same brand colours as the
 * favicon.svg but presented as a hero-scale visual with:
 * – Gentle floating motion
 * – A slow light-sweep shimmer across the H
 * – Ambient gradient glows in both light and dark themes
 * – Fully responsive via container sizing (fill its parent)
 * – Respects prefers-reduced-motion
 */
export default function HeroVisual() {
  const shouldReduceMotion = useReducedMotion();

  const floatTransition = shouldReduceMotion
    ? {}
    : {
        duration: 5,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      };

  const glowTransition = shouldReduceMotion
    ? {}
    : {
        duration: 8,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      };

  const sweepTransition = shouldReduceMotion
    ? {}
    : {
        duration: 3.5,
        repeat: Infinity,
        repeatDelay: 4,
        ease: [0.22, 1, 0.36, 1],
      };

  return (
    <motion.div
      aria-hidden="true"
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Ambient glow layers */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-brand-400/30 via-brand-200/20 to-transparent blur-3xl dark:from-blue-500/25 dark:via-indigo-500/15 dark:to-transparent"
        animate={shouldReduceMotion ? {} : { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={glowTransition}
      />
      <motion.div
        className="pointer-events-none absolute inset-[10%] -z-10 rounded-full bg-gradient-to-bl from-accent-400/20 via-transparent to-brand-300/15 blur-2xl dark:from-violet-500/20 dark:via-transparent dark:to-cyan-400/10"
        animate={shouldReduceMotion ? {} : { scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ ...glowTransition, duration: 9 }}
      />

      {/* Main floating card */}
      <motion.div
        className="relative flex h-64 w-64 items-center justify-center rounded-[2.5rem] border border-brand-200/80 bg-white/70 shadow-xl shadow-brand-900/10 backdrop-blur-2xl sm:h-72 sm:w-72 lg:h-80 lg:w-80 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/50"
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -10, 0],
                rotateX: [0, 2, 0],
                rotateY: [0, -3, 0],
              }
        }
        transition={floatTransition}
        style={{ transformStyle: 'preserve-3d', perspective: 800 }}
      >
        {/* Light sweep shimmer */}
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]"
          aria-hidden="true"
        >
          <motion.div
            className="absolute -inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/15"
            initial={{ left: '-40%' }}
            animate={shouldReduceMotion ? {} : { left: ['−40%', '140%'] }}
            transition={sweepTransition}
          />
        </motion.div>

        {/* Brand H letterform */}
        <svg
          viewBox="0 0 120 120"
          className="h-36 w-36 sm:h-40 sm:w-40 lg:h-44 lg:w-44"
          fill="none"
          aria-hidden="true"
        >
          {/* Subtle background circle */}
          <circle cx="60" cy="60" r="54" className="fill-brand-100/60 dark:fill-white/5" />

          {/* H strokes — matches favicon geometry, scaled up */}
          <path
            d="M30 24 L30 96 M90 24 L90 96 M30 60 L90 60"
            className="stroke-brand-800 dark:stroke-white"
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Accent rectangle (bottom-right, like the favicon's yellow accent) */}
          <rect
            x="72"
            y="82"
            width="26"
            height="10"
            rx="5"
            className="fill-accent-400"
          />
        </svg>

        {/* Corner badge: location */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-brand-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold text-brand-800 shadow-md backdrop-blur-md dark:border-white/15 dark:bg-slate-900/90 dark:text-slate-200 dark:shadow-black/40">
          Sirsa, Haryana
        </div>
      </motion.div>

      {/* Floating stat bubbles */}
      <motion.div
        className="absolute -right-2 top-8 rounded-xl border border-brand-200/80 bg-white/85 px-3 py-2 text-center shadow-md backdrop-blur-md dark:border-white/15 dark:bg-slate-900/85 dark:shadow-black/40 sm:-right-6"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-display text-lg font-bold leading-none text-brand-900 dark:text-white">HKCL</p>
        <p className="mt-0.5 text-xs text-muted dark:text-slate-400">Authorised</p>
      </motion.div>

      <motion.div
        className="absolute -left-2 bottom-12 rounded-xl border border-brand-200/80 bg-white/85 px-3 py-2 text-center shadow-md backdrop-blur-md dark:border-white/15 dark:bg-slate-900/85 dark:shadow-black/40 sm:-left-6"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-display text-lg font-bold leading-none text-brand-900 dark:text-white">HSBTE</p>
        <p className="mt-0.5 text-xs text-muted dark:text-slate-400">Certified</p>
      </motion.div>
    </motion.div>
  );
}
