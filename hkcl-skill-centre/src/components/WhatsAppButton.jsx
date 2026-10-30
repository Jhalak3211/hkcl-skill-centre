import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWhatsAppHref } from '../utils/contact.js';

export default function WhatsAppButton() {
  const whatsappHref = getWhatsAppHref(
    'Hi! I would like to enquire about courses and admissions at HKCL Skill Centre.'
  );

  if (!whatsappHref) return null;

  return (
    <motion.aside
      aria-label="Direct WhatsApp Contact"
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.3, ease: 'easeOut' }}
    >
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with HKCL Skill Centre on WhatsApp (opens in new tab)"
        className="group flex items-center gap-2.5 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition-all duration-300 hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 active:scale-95"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>
        <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
        <span className="hidden sm:inline font-medium">WhatsApp Us</span>
      </a>
    </motion.aside>
  );
}
