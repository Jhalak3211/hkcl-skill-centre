import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { requireAuth, requireVerifiedEmail } from '../middleware/auth.js';

const router = Router();

// Reusable profile endpoints protected by authentication & email verification
router.get('/', requireAuth, requireVerifiedEmail, getProfile);
router.put('/', requireAuth, requireVerifiedEmail, updateProfile);

export default router;
