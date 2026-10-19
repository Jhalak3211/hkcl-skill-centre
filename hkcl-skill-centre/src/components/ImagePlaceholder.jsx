import { Camera } from 'lucide-react';

/**
 * Clearly labelled, replaceable image area. Shown only where no real photo
 * has been added yet. To replace it, add photos in src/data/gallery.js.
 */
export default function ImagePlaceholder({ label = 'Centre photograph', className = '' }) {
  return (
    <div
      role="img"
      aria-label={`${label}: placeholder, photograph to be added`}
      className={`grid place-items-center rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-6 text-center text-brand-700 dark:border-white/20 dark:bg-slate-900/50 dark:text-slate-300 ${className}`}
    >
      <div>
        <Camera className="mx-auto h-7 w-7" aria-hidden="true" />
        <p className="mt-2 text-sm font-medium">{label}</p>
        <p className="text-xs text-muted dark:text-slate-500">Photograph to be added</p>
      </div>
    </div>
  );
}
