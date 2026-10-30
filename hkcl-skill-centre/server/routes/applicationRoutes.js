import { Router } from 'express';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
} from '../controllers/applicationController.js';
import { requireAuth, requireVerifiedEmail } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, requireVerifiedEmail, getApplications);
router.get('/:id', requireAuth, requireVerifiedEmail, getApplicationById);
router.post('/', requireAuth, requireVerifiedEmail, createApplication);
router.put('/:id', requireAuth, requireVerifiedEmail, updateApplication);

export default router;
