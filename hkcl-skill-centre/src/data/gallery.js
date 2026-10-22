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
    id: "lab",
    src: "/images/lab1.jpeg",
    title: "Computer Laboratory",
    alt: "Computer laboratory at HKCL Skill Centre, Sirsa",
  },
  {
    id: "reception",
    src: "/images/reception.jpeg",
    title: "Admissions & Reception",
    alt: "Reception area at HKCL Skill Centre, Sirsa",
  },
  {
    id: "classroom",
    src: "/images/student%20lab.jpeg",
    title: "Smart Classrooms",
    alt: "Students working in the computer lab",
  },
  {
    id: "director",
    src: "/images/recep.jpeg",
    title: "Centre Facilities",
    alt: "Facilities at HKCL Skill Centre, Sirsa",
  },
  {
    id: "facility",
    src: "/images/entrance.jpeg",
    title: "Our Centre",
    alt: "Entrance of HKCL Skill Centre, Sirsa",
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
    id: "lab-1",
    src: "/images/lab1.jpeg",
    title: "Computer Laboratory 1",
    caption: "Our computer lab and student workstations",
    alt: "Computer laboratory at HKCL Skill Centre",
  },
  {
    id: "reception-1",
    src: "/images/recep.jpeg",
    title: "Reception & Enquiry",
    caption: "Welcome desk and student enquiry area",
    alt: "Reception area at HKCL Skill Centre",
  },
  {
    id: "reception-2",
    src: "/images/reception.jpeg",
    title: "Student Support",
    caption: "Reception and student counselling facilities",
    alt: "Student support area at HKCL Skill Centre",
  },
 
  {
    id: "staff-students",
    src: "/images/staff%20nd%20student.jpeg",
    title: "Staff & Students",
    caption: "Our learning community",
    alt: "Staff and students at HKCL Skill Centre",
  },
  {
    id: "student-lab",
    src: "/images/student%20lab.jpeg",
    title: " Computer Laboratory 2",
    caption: "Hands-on computer training",
    alt: "Students learning in the computer lab",
  },
  {
    id: "our campus",
    src: "/images/WhatsApp%20Image%202026-10-19%20at%206.10.01%20PM%20(1).jpeg",
    title: "Modern Technologies",
    caption: "Explore our training centre",
    alt: "HKCL Skill Centre campus",
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
