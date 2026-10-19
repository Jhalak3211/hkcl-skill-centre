/**
 * FREQUENTLY ASKED QUESTIONS
 * ---------------------------------------------------------------------------
 * Answers are built from the same data files as the rest of the site, so fees,
 * hours and addresses stay in sync when you edit courses.js or siteConfig.js.
 * `preview: true` shows the question in the short list on the home page.
 */
import { getCourseBySlug } from './courses.js';
import { siteConfig } from './siteConfig.js';

const rupees = (amount) => `₹${amount.toLocaleString('en-IN')}`;

const hsCit = ['hs-cit', 'hs-cit-a', 'hs-cit-a-plus'].map(getCourseBySlug).filter(Boolean);
const hsCitSummary = hsCit
  .map((c) => `${c.name}: ${c.duration}, ${rupees(c.fee)}`)
  .join('. ');

const { address } = siteConfig.contact;
const addressText = [...address.lines, `${address.city} ${address.postalCode}`, address.state].join(', ');
const hoursText = siteConfig.hours.map((h) => `${h.days}, ${h.time}`).join('. ');

export const faqs = [
  {
    id: 'what-is-hs-cit',
    question: 'What is HS-CIT?',
    answer:
      'HS-CIT is a computer and digital skills course. It covers MS Office 365 from basic to advanced level with 100+ AI tools, typing in English and Hindi, and job-related skills. HS-CIT (A) and HS-CIT (A+) are longer programmes with a wider scope.',
    preview: true,
  },
  {
    id: 'hs-cit-duration-fees',
    question: 'How long are the HS-CIT programmes and what do they cost?',
    answer: `${hsCitSummary}. Fees are as listed by the centre, so please confirm the current fee before you enrol.`,
    preview: true,
  },
  {
    id: 'what-is-hcoc',
    question: 'What is HCOC?',
    answer:
      'HCOC stands for HKCL\'s Career Oriented Course. The series acts as a bridge from college to careers. HCOC courses run for 60 or 120 hours, and the listed fee is ₹4,500 per course.',
    preview: true,
  },
  {
    id: 'certificates',
    question: 'Which certificate will I receive?',
    answer:
      'HS-CIT programmes carry a certificate from HKCL and the Haryana State Board of Technical Education (HSBTE). The same applies to 120-hour HCOC courses. Ask the centre about certificates for any other course.',
    preview: false,
  },
  {
    id: 'online-classes',
    question: 'Are online classes available?',
    answer:
      'For HS-CIT, online and offline batches are listed, along with smart classes that use audio and video. For other courses, please ask the centre which batches are available.',
    preview: false,
  },
  {
    id: 'location-hours',
    question: 'Where is the centre and when is it open?',
    answer: `The centre is at ${addressText}. Hours as listed by the centre: ${hoursText}.`,
    preview: true,
  },
  {
    id: 'how-to-enquire',
    question: 'How do I enquire or enrol?',
    answer:
      'Call or message the centre on WhatsApp, or visit during opening hours. An online enquiry form is not available on this website yet. Ask the centre about admission steps and what to bring.',
    preview: false,
  },
  {
    id: 'student-login',
    question: 'Where do I log in as an HKCL student?',
    answer:
      'Use the Student Login button. It takes you to the official HKCL website, where you sign in. This website never asks for or stores your HKCL username or password.',
    preview: false,
  },
];

export const previewFaqs = faqs.filter((faq) => faq.preview);
