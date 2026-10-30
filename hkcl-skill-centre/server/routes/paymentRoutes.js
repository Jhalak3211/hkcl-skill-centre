import { Router } from 'express';
import {
  getPaymentConfig,
  submitUpiPayment,
  getPaymentStatus,
  getStaffSubmissions,
  verifyStaffPayment,
  rejectStaffPayment,
  createOrder,
  verifySignature,
  handleWebhook,
} from '../controllers/paymentController.js';
import { requireAuth, requireVerifiedEmail, requireStaffAuth } from '../middleware/auth.js';

const router = Router();

// Public / student config
router.get('/config', getPaymentConfig);

// Student protected endpoints
router.post('/submit-upi', requireAuth, requireVerifiedEmail, submitUpiPayment);
router.get('/status/:applicationId', requireAuth, requireVerifiedEmail, getPaymentStatus);

// Staff verification protected endpoints (Never accessible to regular students)
router.get('/staff/submissions', requireStaffAuth, getStaffSubmissions);
router.post('/staff/verify', requireStaffAuth, verifyStaffPayment);
router.post('/staff/reject', requireStaffAuth, rejectStaffPayment);

// Legacy Razorpay / gateway endpoints (preserved for existing tests and webhooks)
router.post('/create-order', createOrder);
router.post('/verify-signature', verifySignature);
router.post('/webhook', handleWebhook);

export default router;
