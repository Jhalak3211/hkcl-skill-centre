import { Router } from 'express';
import {
  register,
  verifyEmail,
  resendVerification,
  findReferenceId,
} from '../controllers/authController.js';
import {
  adminLogin,
  staffLogin,
  acceptStaffInvitation,
  getMe,
} from '../controllers/adminController.js';
import { requireStaffAuth } from '../middleware/auth.js';

const router = Router();

// Student passwordless registration and authentication
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/find-id', findReferenceId);

// Admin & Staff Authentication
router.post('/admin/login', adminLogin);
router.post('/staff/login', staffLogin);
router.post('/staff/accept-invite', acceptStaffInvitation);
router.get('/me', requireStaffAuth, getMe);

export default router;
