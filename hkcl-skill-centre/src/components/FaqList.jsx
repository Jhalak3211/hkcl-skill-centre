import { ChevronDown } from 'lucide-react';

/** Accessible accordion built on native <details>/<summary>: works with keyboard and screen readers. */
export default function FaqList({ items }) {
  return (
    <div className="divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white">
      {items.map((faq) => (
        <details key={faq.id} className="group">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-semibold text-brand-950 transition-colors hover:bg-brand-50 sm:px-6 sm:text-lg">
            {faq.question}
            <ChevronDown
              className="h-5 w-5 shrink-0 text-brand-600 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="px-5 pb-5 text-muted sm:px-6">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
