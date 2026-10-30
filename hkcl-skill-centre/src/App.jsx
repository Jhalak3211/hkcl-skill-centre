import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import StaffHeader from './components/admin/StaffHeader.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import AmbientBackground from './components/AmbientBackground.jsx';
import { AdmissionProvider } from './context/AdmissionContext.jsx';
import { isAdminAuthenticated, isStaffAuthenticated } from './utils/auth.js';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import Gallery from './pages/Gallery.jsx';
import ApplyAdmission from './pages/ApplyAdmission.jsx';

// Admission & User Profile Pages (Passwordless Student Flow)
import Profile from './pages/admission/Profile.jsx';
import PersonalDetails from './pages/admission/PersonalDetails.jsx';
import EducationalDetails from './pages/admission/EducationalDetails.jsx';
import DocumentUpload from './pages/admission/DocumentUpload.jsx';
import ReviewApplication from './pages/admission/ReviewApplication.jsx';
import Payment from './pages/admission/Payment.jsx';
import Confirmation from './pages/admission/Confirmation.jsx';
import VerifyEmail from './pages/admission/VerifyEmail.jsx';

// Staff & Admin Portals
import StaffDashboard from './pages/admin/StaffDashboard.jsx';
import StaffLogin from './pages/admin/StaffLogin.jsx';
import StaffAcceptInvite from './pages/admin/StaffAcceptInvite.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';

/**
 * Direct Admission Gateway: routes directly to Step 1 (Personal Details) with any query parameters
 */
function ApplyGateway() {
  const location = useLocation();
  return <Navigate to={`/admission/personal-details${location.search}`} replace />;
}

/**
 * Protected Admin Route Wrapper
 */
function ProtectedAdminRoute({ children }) {
  const isAuth = isAdminAuthenticated();
  const location = useLocation();
  if (!isAuth) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

/**
 * Protected Staff Route Wrapper
 */
function ProtectedStaffRoute({ children }) {
  const isAuth = isStaffAuthenticated();
  const location = useLocation();
  if (!isAuth) {
    return <Navigate to="/staff/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStaffRoute = location.pathname.startsWith('/staff');
  const isAuthPortal = isAdminRoute || isStaffRoute;

  // Header Selection
  const renderHeader = () => {
    // AdminDashboard renders its own dedicated AdminHeader
    if (isAdminRoute) {
      return null;
    }
    // Staff routes use StaffHeader (except pure login/invite screens where appropriate)
    if (isStaffRoute) {
      if (location.pathname === '/staff/login' || location.pathname === '/staff/accept-invite') {
        return null;
      }
      return <StaffHeader />;
    }
    return <Navbar />;
  };

  return (
    <MotionConfig reducedMotion="user">
      <AdmissionProvider>
        <AmbientBackground />
        <ScrollToTop />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>

        {renderHeader()}

        <main id="main" tabIndex={-1} className="outline-none">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />

              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetails />} />
              <Route path="/contact" element={<Contact />} />

              {/* Apply Gateway */}
              <Route path="/apply" element={<ApplyGateway />} />
              <Route path="/enquiry" element={<ApplyAdmission />} />

              {/* User Profile Section (Passwordless student experience preserved) */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/admission" element={<Navigate to="/profile" replace />} />
              <Route path="/admission/dashboard" element={<Navigate to="/profile" replace />} />
              <Route path="/admission/profile" element={<Navigate to="/profile" replace />} />

              {/* Direct Admission: Registration & Login pages redirect directly to application form */}
              <Route path="/admission/register" element={<Navigate to="/admission/personal-details" replace />} />
              <Route path="/admission/login" element={<Navigate to="/admission/personal-details" replace />} />
              <Route path="/admission/verify-email" element={<VerifyEmail />} />

              {/* Step 1: Course & Personal Details */}
              <Route path="/admission/personal-details" element={<PersonalDetails />} />

              {/* Step 3: Educational Details */}
              <Route path="/admission/educational-details" element={<EducationalDetails />} />

              {/* Step 4: Personal Documents Upload */}
              <Route path="/admission/documents" element={<DocumentUpload />} />

              {/* Step 5: Review & Submission */}
              <Route path="/admission/review" element={<ReviewApplication />} />

              {/* Step 6: Fee Submission */}
              <Route path="/admission/payment" element={<Payment />} />

              {/* Step 7: Confirmation & Receipt */}
              <Route path="/admission/confirmation" element={<Confirmation />} />

              {/* Staff Portal Routes */}
              <Route path="/staff/login" element={<StaffLogin />} />
              <Route path="/staff/accept-invite" element={<StaffAcceptInvite />} />
              <Route
                path="/staff/dashboard"
                element={
                  <ProtectedStaffRoute>
                    <StaffDashboard />
                  </ProtectedStaffRoute>
                }
              />
              <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />

              {/* Admin Portal Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </main>

        {isAuthPortal ? (
          <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 print:hidden">
            &copy; {new Date().getFullYear()} HKCL Skill Centre • Institutional Portal (Barnala Road, Sirsa)
          </footer>
        ) : (
          <Footer />
        )}
      </AdmissionProvider>
    </MotionConfig>
  );
}
