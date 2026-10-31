import { Router } from 'express';
import {
  getStaffOverview,
  getStaffApplications,
  getStaffApplicationById,
  approveDocuments,
  requestDocumentCorrections,
  rejectDocumentApplication,
  finalAdmitApplication,
  finalRejectApplication,
} from '../controllers/staffController.js';
import {
  getStaffSubmissions,
  verifyStaffPayment,
  rejectStaffPayment,
} from '../controllers/paymentController.js';
import { requireStaffAuth } from '../middleware/auth.js';

const router = Router();

// Protect ALL staff routes strictly with requireStaffAuth
router.use(requireStaffAuth);

// Overview metrics & application listing
router.get('/overview', getStaffOverview);
router.get('/applications', getStaffApplications);
router.get('/applications/:id', getStaffApplicationById);

// Document review decisions
router.post('/documents/approve', approveDocuments);
router.post('/documents/request-corrections', requestDocumentCorrections);
router.post('/documents/reject', rejectDocumentApplication);

// Payment review decisions (conveniently accessible via /api/staff as well)
router.get('/payments', getStaffSubmissions);
router.post('/payments/verify', verifyStaffPayment);
router.post('/payments/reject', rejectStaffPayment);

// Final admission decisions (strictly separate from document and payment decisions)
router.post('/admission/admit', finalAdmitApplication);
router.post('/admission/reject', finalRejectApplication);

export default router;
