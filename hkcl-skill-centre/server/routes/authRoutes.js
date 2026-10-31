import { Router } from 'express';
import {
  register,
  verifyEmail,
  resendVerification,
  findReferenceId,
  studentLogin,
  getStudentMe,
} from '../controllers/authController.js';
import {
  adminLogin,
  staffLogin,
  acceptStaffInvitation,
  getStaffInvitation,
  getMe,
} from '../controllers/adminController.js';
import { requireAuth, requireStaffAuth } from '../middleware/auth.js';
import { adminLoginRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Student passwordless registration and authentication
router.post('/register', register);
router.post('/login', studentLogin);
router.post('/student-login', studentLogin);
router.get('/student-me', requireAuth, getStudentMe);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/find-id', findReferenceId);

// Admin & Staff Authentication
router.post('/admin/login', adminLoginRateLimiter, adminLogin);
router.post('/staff/login', staffLogin);
router.get('/staff/accept-invite', getStaffInvitation);
router.post('/staff/accept-invite', acceptStaffInvitation);
router.get('/me', requireStaffAuth, getMe);

export default router;
