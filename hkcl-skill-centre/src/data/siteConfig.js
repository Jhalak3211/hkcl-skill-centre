/**
 * CENTRAL SITE CONFIGURATION
 * ---------------------------------------------------------------------------
 * Edit this one file to change the centre name, contact details, opening
 * hours, social links and the student portal link across the whole website.
 *
 * Source of the values below: the centre's existing public profile at
 * https://profile.nextapsolutions.com/HKCL-Skill-Centre (checked when this
 * project was generated). Please re-confirm each value with the centre before
 * launch. Anything marked PLACEHOLDER must be replaced.
 *
 * To hide a contact method, set its value to '' (empty string). The website
 * will simply not show it.
 *
 * NOTE: this file must stay free of imports. It is also read by vite.config.js
 * and scripts/generate-seo-files.js.
 */

/**
 * STUDENT LOGIN DESTINATION  (single place to change it)
 * ---------------------------------------------------------------------------
 * TODO BEFORE LAUNCH: this is the HKCL homepage supplied by the site owner.
 * It has NOT been confirmed as the student-login page. Replace it with the
 * confirmed official student-login URL, then set `verified` to true below.
 */
export const STUDENT_PORTAL_URL = 'https://www.hkcl.in/';

export const siteConfig = {
  name: 'HKCL Skill Centre',
  locationName: 'Sirsa,Haryana',
  tagline: 'Computer and digital skills training in Sirsa',
  /** Short memorable tagline shown in the hero section. Edit here to change it site-wide. */
  heroTagline: 'Building Digital Skills. Shaping Brighter Futures.',
  description:
    'HKCL Skill Centre in Sirsa, Haryana offers HS-CIT computer courses, HCOC career-oriented certificate courses and typing training. View courses, fees and contact details.',

  // PLACEHOLDER: replace with your real domain (no trailing slash needed).
  // Used for canonical links, Open Graph tags, sitemap.xml and robots.txt.
  siteUrl: 'https://www.example.com',

  contact: {
    phoneDisplay: '+91 79889 19393',
    phoneE164: '+917988919393', // used for tel: links
    whatsappNumber: '917988919393', // digits only, with country code, no + sign
    email: 'achariyainstitute@gmail.com',
    address: {
      lines: ['1st Floor, Opposite Lenskart', 'Back Side of Canara Bank', 'Barnala Road'],
      city: 'Sirsa',
      state: 'Haryana',
      postalCode: '125055',
      country: 'India',
    },
  },

  // Listed on the existing profile. Confirm with the centre (including holidays).
  hours: [
    { days: 'Monday to Friday', time: '9:00 am to 6:00 pm' },
    { days: 'Saturday', time: '9:00 am to 2:00 pm' },
    { days: 'Sunday', time: 'Closed' },
  ],

  studentPortal: {
    url: STUDENT_PORTAL_URL,
    label: 'Student Login',
    // Set to true only after you have confirmed the URL is the real login page.
    verified: false,
  },

  // Logo: leave `src` empty to use the text-based brand mark.
  // To use an image, put it in /public/images and set e.g. '/images/logo.png'.
  logo: {
    src: "/images/hkcl-brand-logo.png",
    alt: 'HKCL Skill Centre logo',
  },

  // Official Social Media Links
  social: {
    facebook: 'https://www.facebook.com/share/14mYR96hFht/',
    instagram: 'https://www.instagram.com/hkclachariyainstitution',
    whatsappChannel: 'https://whatsapp.com/channel/0029VaMTqNI9RZAQAJluYW2x',
    youtube: '', // Official YouTube channel URL to be configured when available
  },

  // Google Reviews: link to official Google Maps listing or review page
  googleReviews: {
    url: 'https://maps.google.com/?q=HKCL+Skill+Centre+Barnala+Road+Sirsa+Haryana',
  },

  // Upcoming Batches & Centre Announcements
  // Easily editable here without modifying component templates
  announcements: [
    {
      id: 'batch-admissions',
      badge: 'Admissions Open',
      title: 'New Monthly Batches Commencing',
      description: 'Morning, afternoon and evening batches available for HS-CIT and HCOC programmes with smart classroom audio-visual training and personal practical lab systems.',
      actionText: 'Enquire for Batches',
      actionType: 'contact',
    },
    {
      id: 'typing-lab',
      badge: 'Skill Training',
      title: 'Bilingual Typing Lab (Hindi & English)',
      description: 'Dedicated computer lab slots with speed test tracking and bilingual practice for competitive government and office readiness.',
      actionText: 'View Typing Details',
      actionHref: '/courses/typing-skills',
    },
    {
      id: 'govt-setc',
      badge: 'Govt. Employees',
      title: 'HS-CIT (A) SETC Exemption Course',
      description: 'Structured 6-month programme eligible for SETC Part-I exemption for eligible Haryana Government employees subject to state rules.',
      actionText: 'Explore Programme',
      actionHref: '/courses/hs-cit-a',
    },
  ],

  // NOT SHOWN ON THE SITE. The existing profile describes the centre as
  // "Promoted By Government Of Haryana Computer Education & Training Centre
  // Achariya Educational Institution". That wording is unclear, so it is kept
  // here for you to verify instead of being published as a claim.
  unverifiedNotes: {
    operatorOrPromoterText:
      'Promoted By Government Of Haryana Computer Education & Training Centre Achariya Educational Institution',
  },
};
