import { Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import Contact from './pages/Contact.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    // reducedMotion="user": Framer Motion animations switch off automatically
    // for visitors who have "reduce motion" enabled in their system settings.
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </MotionConfig>
  );
}
