import Seo from '../components/Seo.jsx';
import Gallery from '../components/Gallery.jsx';
import { siteConfig } from '../data/siteConfig.js';

export default function GalleryPage() {
  return (
    <>
      <Seo
        title="Gallery"
        path="/gallery"
        description={`Explore photographs of classrooms, computer laboratories and facilities at ${siteConfig.name}, Sirsa.`}
      />
      <div className="pb-16 sm:pb-24">
        <Gallery />
      </div>
    </>
  );
}
