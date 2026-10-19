/**
 * HERO SLIDESHOW IMAGES
 * ---------------------------------------------------------------------------
 * Background slideshow photographs of HKCL Skill Centre, Sirsa.
 * Slides auto-crossfade every 4.5 seconds with dark gradient readability overlay.
 *
 * TO USE YOUR OWN CAMERA PHOTOS:
 *  Simply copy your photos into /public/images/ with the filenames below
 *  (hero-lab.jpg, hero-reception.jpg, etc.). They will automatically display
 *  instead of the built-in SVG fallbacks!
 */
export const heroSlides = [
  {
    id: 'lab',
    src: '/images/hero-lab.jpg',
    fallbackSrc: '/images/hero-lab.svg',
    title: 'Computer Laboratory',
    alt: 'Students working at desktop computers in the HKCL Skill Centre computer laboratory, Sirsa',
  },
  {
    id: 'reception',
    src: '/images/hero-reception.jpg',
    fallbackSrc: '/images/hero-reception.svg',
    title: 'Admissions & Reception',
    alt: 'HKCL-branded reception area and counselling desk at HKCL Skill Centre, Sirsa',
  },
  {
    id: 'classroom',
    src: '/images/hero-classroom.jpg',
    fallbackSrc: '/images/hero-classroom.svg',
    title: 'Smart Classrooms',
    alt: 'Students attending a live training session in the HKCL Skill Centre classroom',
  },
  {
    id: 'director',
    src: '/images/hero-director.jpg',
    fallbackSrc: '/images/hero-director.svg',
    title: 'Director\'s Office',
    alt: 'Director\'s office and student counselling cabin at HKCL Skill Centre',
  },
  {
    id: 'facility',
    src: '/images/hero-facility.jpg',
    fallbackSrc: '/images/hero-facility.svg',
    title: 'Campus Facility',
    alt: 'Overview of the HKCL Skill Centre facility on Barnala Road, Sirsa',
  },
];

/**
 * GALLERY IMAGES & CAPTIONS
 * ---------------------------------------------------------------------------
 * Photos shown in the Gallery section on the homepage and the About page.
 * Clicking any photo opens the interactive Lightbox modal.
 *
 * TO USE YOUR OWN CAMERA PHOTOS:
 *  Place JPG/WebP files in /public/images/ with matching names or update the
 *  src paths below.
 */
export const galleryImages = [
  {
    id: 'lab-1',
    src: '/images/gallery-lab.jpg',
    fallbackSrc: '/images/hero-lab.svg',
    title: 'Computer Laboratory',
    caption: 'Modern computer lab with individual student workstations',
    alt: 'Students working at desktop computers in the HKCL Skill Centre computer laboratory',
  },
  {
    id: 'reception-1',
    src: '/images/gallery-reception.jpg',
    fallbackSrc: '/images/hero-reception.svg',
    title: 'Reception & Enquiry',
    caption: 'HKCL-branded welcome desk & student enquiry area',
    alt: 'HKCL-branded reception area of HKCL Skill Centre, Sirsa',
  },
  {
    id: 'class-1',
    src: '/images/gallery-classroom.jpg',
    fallbackSrc: '/images/hero-classroom.svg',
    title: 'Interactive Smart Class',
    caption: 'Audio-visual smart classroom for interactive IT lectures',
    alt: 'Students attending a live training session in the HKCL Skill Centre smart class',
  },
  {
    id: 'batch-1',
    src: '/images/gallery-batch.jpg',
    fallbackSrc: '/images/hero-classroom.svg',
    title: 'HS-CIT Learning Batch',
    caption: 'HS-CIT students during practical hands-on software training',
    alt: 'A student batch attending an HS-CIT class at HKCL Skill Centre',
  },
  {
    id: 'director-1',
    src: '/images/gallery-director.jpg',
    fallbackSrc: '/images/hero-director.svg',
    title: 'Academic Guidance & Director Desk',
    caption: 'Career guidance and counselling for prospective students',
    alt: 'Director\'s office at HKCL Skill Centre, Sirsa',
  },
  {
    id: 'facility-1',
    src: '/images/gallery-facility.jpg',
    fallbackSrc: '/images/hero-facility.svg',
    title: 'Campus Location on Barnala Road',
    caption: '1st Floor, RK Hotel Building, Opposite Lenskart, Sirsa',
    alt: 'Overview of the HKCL Skill Centre facility on Barnala Road, Sirsa',
  },
];

/**
 * Gallery section metadata shown on the homepage.
 */
export const gallerySectionMeta = {
  title: 'Explore Our Campus',
  subtitle:
    'Take a look inside our air-conditioned computer laboratories, interactive smart classrooms, and modern learning facilities on Barnala Road, Sirsa.',
};
