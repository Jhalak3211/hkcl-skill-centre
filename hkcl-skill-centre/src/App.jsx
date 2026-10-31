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

// Admission & Student Portal Pages
import Dashboard from './pages/admission/Dashboard.jsx';
import Login from './pages/admission/Login.jsx';
import Register from './pages/admission/Register.jsx';
import PersonalDetails from './pages/admission/PersonalDetails.jsx';
import EducationalDetails from './pages/admission/EducationalDetails.jsx';
import DocumentUpload from './pages/admission/DocumentUpload.jsx';
import ReviewApplication from './pages/admission/ReviewApplication.jsx';
import Payment from './pages/admission/Payment.jsx';
import Confirmation from './pages/admission/Confirmation.jsx';
import VerifyEmail from './pages/admission/VerifyEmail.jsx';
import { useAdmission } from './context/AdmissionContext.jsx';

// Staff & Admin Portals
import StaffDashboard from './pages/admin/StaffDashboard.jsx';
import StaffLogin from './pages/admin/StaffLogin.jsx';
import StaffAcceptInvite from './pages/admin/StaffAcceptInvite.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';

/**
 * Direct Admission Gateway: routes to Step 1 with any query parameters
 */
function ApplyGateway() {
  const location = useLocation();
  return <Navigate to={`/admission/personal-details${location.search}`} replace />;
}

/**
 * Protected Student Route Wrapper
 * Checks user authentication before granting access to dashboard or admission flow.
 */
function ProtectedStudentRoute({ children }) {
  const { user } = useAdmission();
  const location = useLocation();
  const token =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('hkcl_auth_token') || localStorage.getItem('hkcl_auth_token')
      : null;
  const isAuth = Boolean(user?.studentId || token);

  if (!isAuth) {
    return (
      <Navigate
        to={`/admission/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }
  return children;
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
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/secure-admin-portal';
  const isStaffRoute = location.pathname.startsWith('/staff');
  const isAuthPortal = isAdminRoute || isStaffRoute;

  // Header Selection: Portals render their own dedicated PortalLayout
  const renderHeader = () => {
    if (isAuthPortal) {
      return null;
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

              {/* Student Portal & Dashboard */}
              <Route
                path="/profile"
                element={
                  <ProtectedStudentRoute>
                    <Dashboard />
                  </ProtectedStudentRoute>
                }
              />
              <Route path="/admission" element={<Navigate to="/admission/dashboard" replace />} />
              <Route
                path="/admission/dashboard"
                element={
                  <ProtectedStudentRoute>
                    <Dashboard />
                  </ProtectedStudentRoute>
                }
              />
              <Route path="/admission/profile" element={<Navigate to="/admission/dashboard" replace />} />

              {/* Student Authentication */}
              <Route path="/admission/register" element={<Register />} />
              <Route path="/admission/login" element={<Login />} />
              <Route path="/admission/verify-email" element={<VerifyEmail />} />

              {/* Step 1: Course & Personal Details */}
              <Route
                path="/admission/personal-details"
                element={
                  <ProtectedStudentRoute>
                    <PersonalDetails />
                  </ProtectedStudentRoute>
                }
              />

              {/* Step 2: Educational Details */}
              <Route
                path="/admission/educational-details"
                element={
                  <ProtectedStudentRoute>
                    <EducationalDetails />
                  </ProtectedStudentRoute>
                }
              />

              {/* Step 3: Personal Documents Upload */}
              <Route
                path="/admission/documents"
                element={
                  <ProtectedStudentRoute>
                    <DocumentUpload />
                  </ProtectedStudentRoute>
                }
              />

              {/* Step 4: Review & Declaration */}
              <Route
                path="/admission/review"
                element={
                  <ProtectedStudentRoute>
                    <ReviewApplication />
                  </ProtectedStudentRoute>
                }
              />

              {/* Step 5: Fee Submission */}
              <Route
                path="/admission/payment"
                element={
                  <ProtectedStudentRoute>
                    <Payment />
                  </ProtectedStudentRoute>
                }
              />

              {/* Step 6: Confirmation & Official Receipt */}
              <Route
                path="/admission/confirmation"
                element={
                  <ProtectedStudentRoute>
                    <Confirmation />
                  </ProtectedStudentRoute>
                }
              />

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
              <Route path="/secure-admin-portal" element={<AdminLogin />} />
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

        {!isAuthPortal && <Footer />}
      </AdmissionProvider>
    </MotionConfig>
  );
}
