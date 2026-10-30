import { Router } from 'express';
import {
  register,
  verifyEmail,
  resendVerification,
  findReferenceId,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/find-id', findReferenceId);

export default router;
