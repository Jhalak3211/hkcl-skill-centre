import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import AmbientBackground from './components/AmbientBackground.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import FloatingSocialBar from './components/FloatingSocialBar.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import Contact from './pages/Contact.jsx';
import ComingSoon from './pages/ComingSoon.jsx';
import NotFound from './pages/NotFound.jsx';
import Gallery from './pages/Gallery.jsx';

export default function App() {
  const location = useLocation();

  return (
    // reducedMotion="user": Framer Motion animations switch off automatically
    // for visitors who have "reduce motion" enabled in their system settings.
    <MotionConfig reducedMotion="user">
      <AmbientBackground />
      <ScrollToTop />
      <WhatsAppButton />
      <FloatingSocialBar />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            {/* Core Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetails />} />
            <Route path="/contact" element={<Contact />} />

            {/* Task 9 & 12: Redirect every Apply Now, Admission & Payment CTA to Contact */}
            <Route path="/admission" element={<Navigate to="/contact" replace />} />
            <Route path="/admissions" element={<Navigate to="/contact" replace />} />
            <Route path="/admission/*" element={<Navigate to="/contact" replace />} />
            <Route path="/apply" element={<Navigate to="/contact" replace />} />
            <Route path="/apply/*" element={<Navigate to="/contact" replace />} />
            <Route path="/enquiry" element={<Navigate to="/contact" replace />} />
            <Route path="/payment" element={<Navigate to="/contact" replace />} />
            <Route path="/pay" element={<Navigate to="/contact" replace />} />

            {/* Task 11: Redirect unfinished student login to Coming Soon */}
            <Route path="/student-login" element={<ComingSoon />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/login" element={<Navigate to="/coming-soon" replace />} />
            <Route path="/portal" element={<Navigate to="/coming-soon" replace />} />
            <Route path="/student/login" element={<Navigate to="/coming-soon" replace />} />
            <Route path="/student-portal" element={<Navigate to="/coming-soon" replace />} />

            {/* Task 13: Keep admin / staff functionality strictly inaccessible to public */}
            <Route path="/admin" element={<NotFound />} />
            <Route path="/admin/*" element={<NotFound />} />
            <Route path="/staff" element={<NotFound />} />
            <Route path="/staff/*" element={<NotFound />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </main>
      <Footer />
    </MotionConfig>
  );
}
