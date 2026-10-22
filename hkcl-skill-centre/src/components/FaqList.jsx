import { ChevronDown } from 'lucide-react';

/** Accessible accordion built on native <details>/<summary>: works with keyboard and screen readers. */
export default function FaqList({ items }) {
  return (
    <div className="divide-y divide-brand-100/90 rounded-2xl border border-brand-100/90 bg-white/80 shadow-sm backdrop-blur-md overflow-hidden">
      {items.map((faq) => (
        <details key={faq.id} className="group transition-colors duration-200 open:bg-brand-50/50">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-semibold text-brand-950 transition-colors hover:bg-brand-50/70 sm:px-6 sm:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            <span className="transition-colors group-hover:text-brand-700">{faq.question}</span>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-brand-600 transition-transform duration-300 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="px-5 pb-5 text-slate-600 sm:px-6 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
