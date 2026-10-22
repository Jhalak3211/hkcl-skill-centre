import { Link } from 'react-router-dom';

const base =
  'group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-out text-center active:scale-[0.98] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-500 focus-visible:ring-offset-2 select-none';

const variants = {
  primary:
    'bg-brand-700 text-white shadow-xs hover:bg-brand-800 hover:shadow-md hover:shadow-brand-700/25 active:bg-brand-900',
  accent:
    'bg-accent-500 text-brand-950 shadow-xs hover:bg-accent-400 hover:shadow-md hover:shadow-accent-500/25 active:bg-accent-600',
  secondary:
    'border border-brand-200/90 bg-white/90 text-brand-800 hover:border-brand-400 hover:bg-white hover:shadow-xs active:bg-brand-100 backdrop-blur-xs',
  onDark:
    'bg-white text-brand-900 shadow-sm hover:bg-brand-50 hover:shadow-md hover:shadow-black/15 active:bg-brand-100',
  outlineOnDark:
    'border border-white/40 text-white hover:bg-white/10 hover:border-white/80 active:bg-white/20',
};

const sizes = {
  sm: 'min-h-11 px-4 py-2 text-sm',
  md: 'min-h-11 px-5 py-2.5 text-sm sm:text-base',
  lg: 'min-h-12 px-6 py-3 text-base',
};

/**
 * One button for every case:
 *  - `to`   : internal route (React Router <Link>)
 *  - `href` : normal link. http(s) links open in a new tab with safe rel attributes.
 *  - neither: a real <button> (pass onClick)
 */
export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  external,
  children,
  ...rest
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    const isExternal = external ?? /^https?:/i.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
        {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
