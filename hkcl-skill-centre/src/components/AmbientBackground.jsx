import { motion, useReducedMotion } from 'framer-motion';

/**
 * Ambient background with soft floating gradient orbs that shine through
 * the frosted-glass cards and panels across light and dark themes.
 */
export default function AmbientBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Orb 1: Top Left - Azure / Sky */}
      <motion.div
        className="absolute -top-32 -left-32 h-[32rem] w-[32rem] rounded-full blur-[100px] transition-colors duration-700 bg-brand-300/25"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, 30, 0],
                y: [0, -25, 0],
                scale: [1, 1.08, 1],
              }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Orb 2: Center Right - Indigo / Violet */}
      <motion.div
        className="absolute top-1/4 -right-32 h-[34rem] w-[34rem] rounded-full blur-[110px] transition-colors duration-700 bg-brand-200/30"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, -35, 0],
                y: [0, 30, 0],
                scale: [1, 1.06, 1],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Orb 3: Bottom Left - Cyan / Amber accent */}
      <motion.div
        className="absolute bottom-10 left-1/4 h-[30rem] w-[30rem] rounded-full blur-[100px] transition-colors duration-700 bg-accent-400/10"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, 25, 0],
                y: [0, -20, 0],
                scale: [1, 1.05, 1],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
