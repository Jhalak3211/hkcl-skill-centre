import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle({ className = '', size = 'md' }) {
  const { isDark, toggleTheme } = useTheme();

  const isSmall = size === 'sm';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`group relative inline-flex items-center justify-center rounded-full border transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 select-none ${
        isSmall ? 'h-9 w-9 p-1.5' : 'h-10 w-10 sm:h-11 sm:w-11 p-2'
      } ${
        isDark
          ? 'border-white/15 bg-slate-900/80 text-amber-300 shadow-sm hover:border-white/30 hover:bg-slate-800'
          : 'border-brand-200/90 bg-white/80 text-brand-900 shadow-xs hover:border-brand-400 hover:bg-white'
      } ${className}`}
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -45, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 45, scale: 0.6, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:rotate-45" aria-hidden="true" />
        ) : (
          <Moon className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:-rotate-12" aria-hidden="true" />
        )}
      </motion.div>
      <span className="sr-only">{label}</span>
    </button>
  );
}
