/**
 * CENTRAL COURSE DATA
 * ---------------------------------------------------------------------------
 * Every course on the website comes from this file: the cards, the filters,
 * the details pages (/courses/<slug>), the sitemap and the FAQ answers.
 *
 * HOW TO EDIT
 *  - Change a fee or duration: edit the course object below.
 *  - Add a course: copy an object from `featuredCourses` / `otherCourses`, give it
 *    a unique `slug` (lowercase, hyphens), and fill in what you know.
 *  - Remove a course: delete it, or set `published: false` to hide it.
 *  - Unknown values: leave them as `null`. The website then shows
 *    "Contact the centre for details" instead of inventing something.
 *
 * SOURCE: figures below were taken from the centre's existing public profile
 * (https://profile.nextapsolutions.com/HKCL-Skill-Centre). Re-confirm before
 * launch. Items under `confirm` are specifically unclear and need checking.
 *
 * KNOWN DISCREPANCY: that profile says "28 HCOC courses" but lists 30 course
 * names. All 30 are included below and no total is stated on the website.
 *
 * This file must stay free of imports (scripts/generate-seo-files.js reads it).
 */

export const CONTACT_FALLBACK = 'Contact the centre for details';

export const categories = [
  {
    id: 'hs-cit',
    label: 'HS-CIT programmes',
    description: 'Complete computer and digital skills programmes, offered in three lengths.',
  },
  {
    id: 'hcoc',
    label: 'HCOC career courses',
    description: 'HKCL career-oriented certificate courses, from accounting to programming.',
  },
  {
    id: 'short',
    label: 'Other courses',
    description: 'Typing and other standalone courses listed by the centre.',
  },
];

// The ten HCOC sectors named on the existing profile. The profile does not say
// which course belongs to which sector, so courses are not tagged by sector.
export const hcocSectors = [
  'Accounting',
  'Back Office',
  'Career Readiness',
  'Designing',
  'Digital Arts',
  'Digital Freelancing',
  'Hardware & Networking',
  'Management',
  'New Collar Jobs',
  'Programming',
];

const HKCL_HSBTE = 'HKCL and Haryana State Board of Technical Education (HSBTE)';

/* ------------------------------------------------------------------ */
/* HS-CIT programmes and other individually described courses          */
/* ------------------------------------------------------------------ */

const featuredCourses = [
  {
    slug: 'hs-cit',
    name: 'HS-CIT',
    subtitle: 'Computer and digital skills course',
    category: 'hs-cit',
    featured: true,
    summary:
      'A complete computer and digital skills course: MS Office 365 with 100+ AI tools, English and Hindi typing, and job-related skills.',
    description:
      'HS-CIT is designed to build practical, job-oriented computer knowledge. It covers MS Office 365 from basic to advanced level, the practical use of AI tools in daily work, typing in English and Hindi, and a wide range of job-related skills.',
    duration: '3 months',
    durationMonths: 3,
    fee: 4500,
    feeUnit: null,
    eligibility: null,
    audience: null,
    language: 'English and Hindi',
    mode: 'Online and offline batches available',
    certificate: HKCL_HSBTE,
    highlights: [
      'MS Office 365, basic to advanced, with 100+ AI tools',
      'Practical use of AI in daily work',
      'AI tools for office work, education and productivity',
      'English typing and Hindi typing',
      'Typing practice and speed improvement',
      '200+ job-related skills',
      'Smart classes with audio and video teaching',
    ],
    notes: null,
    published: true,
    confirm: [],
  },
  {
    slug: 'hs-cit-a',
    name: 'HS-CIT (A)',
    subtitle: 'Structured computer education programme',
    category: 'hs-cit',
    featured: true,
    summary:
      'A structured programme that builds essential IT knowledge and practical computer application skills over six months.',
    description:
      'HS-CIT (A) is a structured computer education programme designed to develop essential Information Technology knowledge and practical computer application skills. It is useful for students, job seekers, government employees and private-sector professionals who want to improve their digital literacy and career options.',
    duration: '6 months',
    durationMonths: 6,
    fee: 9000,
    feeUnit: 'total course fee',
    eligibility: null,
    audience: 'Students, job seekers, government employees and private-sector professionals',
    language: null,
    mode: null,
    certificate: HKCL_HSBTE,
    highlights: [
      'Essential Information Technology knowledge',
      'Practical computer application skills',
      'SETC Part-I exemption for eligible government employees',
    ],
    notes:
      'SETC Part-I exemption applies to eligible government employees, subject to Haryana Government rules and conditions. Check your own eligibility with the centre.',
    published: true,
    confirm: [],
  },
  {
    slug: 'hs-cit-a-plus',
    name: 'HS-CIT (A+)',
    subtitle: 'Advanced computer education programme',
    category: 'hs-cit',
    featured: true,
    summary:
      'The advanced one-year programme for IT knowledge, practical application skills and digital proficiency.',
    description:
      'HS-CIT (A+) is a professionally structured, advanced computer education programme. It develops essential IT knowledge, practical computer application skills and digital proficiency, and prepares learners for the technology demands of modern workplaces.',
    duration: '1 year',
    durationMonths: 12,
    fee: 18000,
    feeUnit: 'total course fee',
    eligibility: null,
    audience: 'Students, job seekers, government employees and private-sector professionals',
    language: null,
    mode: null,
    certificate: HKCL_HSBTE,
    highlights: [
      'Essential Information Technology knowledge',
      'Practical computer application skills',
      'Digital proficiency for modern workplaces',
    ],
    notes: null,
    published: true,
    confirm: [],
  },
];

const otherCourses = [
  {
    slug: 'typing-skills',
    name: 'Typing Skills',
    subtitle: null,
    category: 'short',
    featured: false,
    summary: 'A typing skills course. Ask the centre about language options, batches and duration.',
    description:
      'Typing Skills is listed as a separate course on the centre\'s profile. Details such as typing language, duration and batch timings were not published, so please ask the centre.',
    duration: null,
    durationMonths: null,
    fee: 1500,
    feeUnit: null,
    eligibility: null,
    audience: null,
    language: null,
    mode: null,
    certificate: null,
    highlights: [],
    notes: null,
    published: true,
    // The existing profile also shows a struck-through "net price" of 4,500.
    confirm: ['Is the current fee 1,500 (the listed selling price)?', 'Duration, language, certificate'],
  },
  {
    slug: 'htse',
    name: 'HTSE',
    subtitle: null,
    category: 'short',
    featured: false,
    summary: 'A short course listed by the centre. Ask what it covers and what the fee includes.',
    description:
      'HTSE appears on the centre\'s course flyer and profile with a listed price, but its full name and contents are not published there. Please contact the centre for details.',
    duration: null,
    durationMonths: null,
    fee: 150,
    feeUnit: null,
    eligibility: null,
    audience: null,
    language: null,
    mode: null,
    certificate: null,
    highlights: [],
    notes: null,
    published: true,
    confirm: ['Full name of HTSE', 'What the 150 fee covers', 'Duration, eligibility, certificate'],
  },
];

/* ------------------------------------------------------------------ */
/* HCOC (HKCL Career Oriented Course) series                           */
/* ------------------------------------------------------------------ */
/*
 * Verified at series level: HCOC courses run for 60 or 120 hours, the fee is
 * 4,500 per course, and 120-hour courses are certified by HKCL and HSBTE.
 * Which individual course is 60 or 120 hours was not published, so each course
 * shows that as a hint. When you learn the hours for a course, add
 * `duration: '120 hours'` to its entry below.
 *
 * To change one course, add fields to its entry, for example:
 *   { name: 'Advanced Excel', duration: '120 hours', summary: '...' }
 */
const hcocList = [
  { name: 'Financial Accounting' },
  { name: 'Advanced Accounting' },
  { name: 'Advanced Excel' },
  { name: 'Data Entry and Data Management' },
  { name: 'Office Assistance' },
  { name: 'Data Analytics and Visualization' },
  { name: 'DTP (Adobe)', slug: 'dtp-adobe' },
  { name: 'DTP (Corel Draw)', slug: 'dtp-corel-draw' },
  { name: 'Graphic Designing' },
  { name: 'Photo Editing' },
  { name: 'Video Editing' },
  { name: 'Web Designing' },
  { name: 'HTML with CSS' },
  { name: 'AutoCAD' },
  { name: 'Cyber Security' },
  { name: 'Desktop Support' },
  { name: 'IT Hardware Support' },
  { name: 'Network Support' },
  { name: 'BFSI' },
  { name: 'Retail Management' },
  { name: 'Java' },
  { name: 'Python' },
  { name: 'C & C++ Programming', slug: 'c-and-cpp-programming' },
  { name: 'PHP' },
  { name: 'C Sharp (C#)', slug: 'c-sharp' },
  { name: 'Data Structures using C and C++', slug: 'data-structures-using-c-and-cpp' },
  { name: 'Database Management System (DBMS)', slug: 'dbms' },
  { name: 'IoT', slug: 'iot' },
  { name: 'SCRATCH', slug: 'scratch' },
  { name: 'AI-ML', slug: 'ai-ml', officialTitle: 'HKCL Certificate Course in AI-ML' },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildHcocCourse(entry) {
  const officialTitle = entry.officialTitle ?? `HKCL Certificate in ${entry.name}`;
  return {
    slug: entry.slug ?? slugify(entry.name),
    name: entry.name,
    subtitle: officialTitle,
    category: 'hcoc',
    featured: false,
    summary:
      entry.summary ??
      'Part of the HCOC series of career-oriented certificate courses. Ask the centre for the syllabus and batch timings.',
    description:
      entry.description ??
      `${officialTitle} is part of HKCL's Career Oriented Course (HCOC) series, which acts as a bridge from college to careers by building employability skills. Detailed syllabus and batch information for this course were not published, so please ask the centre.`,
    duration: entry.duration ?? null,
    durationHint: '60 or 120 hours, depending on the course',
    durationMonths: null,
    fee: 4500,
    feeUnit: 'per course',
    eligibility: entry.eligibility ?? null,
    audience: null,
    language: null,
    mode: null,
    certificate: 'HKCL certificate. 120-hour HCOC courses are also certified by HSBTE.',
    highlights: entry.highlights ?? [],
    notes: null,
    published: true,
    confirm: ['Hours (60 or 120) for this course', 'Eligibility', 'Syllabus'],
  };
}

/* ------------------------------------------------------------------ */
/* Exports and helpers                                                 */
/* ------------------------------------------------------------------ */

const allCourses = [...featuredCourses, ...otherCourses, ...hcocList.map(buildHcocCourse)];

export const courses = allCourses.filter((course) => course.published !== false);

// Catch duplicate slugs early (shows in the terminal / browser console).
{
  const seen = new Set();
  for (const course of courses) {
    if (seen.has(course.slug)) {
      console.warn(`[courses.js] Duplicate slug "${course.slug}". Slugs must be unique.`);
    }
    seen.add(course.slug);
  }
}

export const getCourseBySlug = (slug) => courses.find((course) => course.slug === slug) ?? null;

export const getCategory = (id) => categories.find((category) => category.id === id) ?? null;

export const getCoursesByCategory = (id) => courses.filter((course) => course.category === id);

export const getFeaturedCourses = () => courses.filter((course) => course.featured);

export const getRelatedCourses = (course, limit = 3) =>
  courses.filter((c) => c.category === course.category && c.slug !== course.slug).slice(0, limit);


export const displayGroups = [
  {
    id: 'hs-cit',
    label: 'HS-CIT Programmes',
    description: 'Structured computer education and digital skills programmes.',
    courseSlugs: ['hs-cit', 'hs-cit-a', 'hs-cit-a-plus'],
  },
  {
    id: 'accounting-office',
    label: 'Accounting & Office Administration',
    description: 'Accounting, spreadsheets, data entry and office administration.',
    courseSlugs: [
      'financial-accounting',
      'advanced-accounting',
      'advanced-excel',
      'data-entry-and-data-management',
      'office-assistance',
    ],
  },
  {
    id: 'data-analytics',
    label: 'Data Analytics & Databases',
    description: 'Data analysis, visualization and database fundamentals.',
    courseSlugs: [
      'data-analytics-and-visualization',
      'dbms',
    ],
  },
  {
    id: 'design-media',
    label: 'Graphic Design & Digital Media',
    description: 'Graphic design, desktop publishing and media editing.',
    courseSlugs: [
      'dtp-adobe',
      'dtp-corel-draw',
      'graphic-designing',
      'photo-editing',
      'video-editing',
    ],
  },
  {
    id: 'web-development',
    label: 'Web Design & Development',
    description: 'Website design and web development technologies.',
    courseSlugs: [
      'web-designing',
      'html-with-css',
      'php',
    ],
  },
  {
    id: 'programming',
    label: 'Programming & Software Development',
    description: 'Programming languages and data structures.',
    courseSlugs: [
      'java',
      'python',
      'c-and-cpp-programming',
      'c-sharp',
      'data-structures-using-c-and-cpp',
    ],
  },
  {
    id: 'hardware-security',
    label: 'Hardware, Networking & Cybersecurity',
    description: 'Computer hardware, technical support, networking and security.',
    courseSlugs: [
      'cyber-security',
      'desktop-support',
      'it-hardware-support',
      'network-support',
    ],
  },
  {
    id: 'emerging-tech',
    label: 'AI & Emerging Technologies',
    description: 'AI-ML, Internet of Things and introductory programming concepts.',
    courseSlugs: [
      'ai-ml',
      'iot',
      'scratch',
    ],
  },
  {
    id: 'business-management',
    label: 'Business & Management',
    description: 'Business-sector knowledge and retail management.',
    courseSlugs: [
      'bfsi',
      'retail-management',
    ],
  },
  {
  id: 'design-media',
  label: 'Design, Media & Technical Tools',
  description: 'Graphic design, desktop publishing, media editing and technical drafting.',
  courseSlugs: [
    'dtp-adobe',
    'dtp-corel-draw',
    'graphic-designing',
    'photo-editing',
    'video-editing',
    'autocad',
  ],
},
  {
    id: 'other',
    label: 'Typing & Other Courses',
    description: 'Additional courses listed by the centre.',
    courseSlugs: [
      'typing-skills',
      'htse',
    ],
  },
];
