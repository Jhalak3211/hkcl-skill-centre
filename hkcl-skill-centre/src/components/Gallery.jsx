import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, Eye } from 'lucide-react';
import { FadeIn, FadeInStagger, FadeInItem } from './MotionReveal.jsx';
import SectionHeading from './SectionHeading.jsx';
import Container from './Container.jsx';
import { galleryImages, gallerySectionMeta } from '../data/gallery.js';

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const items = galleryImages;
  const isOpen = selectedIndex !== null;

  const handleOpen = (idx) => {
    setSelectedIndex(idx);
  };

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev + 1) % items.length);
  }, [selectedIndex, items.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [selectedIndex, items.length]);

  // Keyboard navigation & lock background scroll
  useEffect(() => {
    if (!isOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, handleClose, handleNext, handlePrev]);

  const activeItem = isOpen ? items[selectedIndex] : null;

  return (
    <section aria-labelledby="gallery-title" className="pt-12 sm:pt-16 lg:pt-20">
      <Container>
        <FadeIn>
          <SectionHeading
            id="gallery-title"
            title={gallerySectionMeta.title}
            intro={gallerySectionMeta.subtitle}
          />
        </FadeIn>

        {/* Responsive Gallery Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
        <FadeInStagger
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
          as="ul"
        >
          {items.map((item, idx) => (
            <FadeInItem key={item.id || item.src || idx} as="li" className="h-full">
              <button
                type="button"
                onClick={() => handleOpen(idx)}
                aria-label={`View photo in lightbox: ${item.title}`}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-brand-100/90 bg-white shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {/* Image Container with Consistent Aspect Ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-50">
                  <img
                    src={item.src}
                    alt={item.alt || item.title}
                    loading={idx < 2 ? 'eager' : 'lazy'}
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />

                  {/* Dark gradient overlay on hover for high contrast */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />

                  {/* Zoom Badge Indicator */}
                  <div
                    className="pointer-events-none absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-brand-900 shadow-md backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
                    aria-hidden="true"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </div>

                  {/* Hover Pill Indicator */}
                  <div
                    className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-950 shadow-sm opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    <Eye className="h-3.5 w-3.5 text-brand-700" />
                    <span>View photo</span>
                  </div>
                </div>

                {/* Typography Container with Clear Hierarchy & Internal Padding */}
                <div className="flex flex-1 flex-col justify-start p-5 text-left bg-white sm:p-6">
                  <h3 className="font-display text-base font-bold leading-snug text-brand-950 transition-colors group-hover:text-brand-700 sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                    {item.caption}
                  </p>
                </div>
              </button>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </Container>

      {/* Accessible Interactive Lightbox Modal */}
      <AnimatePresence>
        {isOpen && activeItem && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Photo viewer: ${activeItem.title}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
              aria-hidden="true"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-2xl backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header bar: title, counter, close button */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                <div>
                  <h3 className="font-display text-base font-semibold text-white sm:text-lg">
                    {activeItem.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Image {selectedIndex + 1} of {items.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close photo viewer (Press Escape)"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Main image container */}
              <div className="relative flex aspect-[16/10] sm:aspect-[16/9] w-full items-center justify-center overflow-hidden bg-black/60">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeItem.id || activeItem.src}
                    src={activeItem.src}
                    alt={activeItem.alt || activeItem.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="max-h-[62vh] w-full object-contain"
                  />
                </AnimatePresence>

                {/* Previous Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photo (Left arrow key)"
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-lg backdrop-blur-md transition-all hover:bg-brand-600 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next photo (Right arrow key)"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-lg backdrop-blur-md transition-all hover:bg-brand-600 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Footer description bar */}
              {activeItem.caption && (
                <div className="border-t border-white/10 px-5 py-3.5 sm:px-6 bg-slate-950/80 text-left">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeItem.caption}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
