import { Router } from 'express';
import {
  adminLogin,
  staffLogin,
  acceptStaffInvitation,
  getMe,
  getAdminOverview,
  getAllStaff,
  inviteStaff,
  updateStaff,
  toggleStaffStatus,
  resendStaffInvitation,
  revokeStaffInvitation,
  getActivityLogs,
  assignApplicationStaff,
} from '../controllers/adminController.js';
import { requireAdminAuth, requireStaffAuth } from '../middleware/auth.js';

const router = Router();

// Public Authentication Endpoints
router.post('/login', adminLogin);
router.post('/staff-login', staffLogin);
router.post('/accept-invite', acceptStaffInvitation);

// Authenticated session check (Staff or Admin)
router.get('/me', requireStaffAuth, getMe);

// ── PROTECTED ADMIN ROUTES (STRICTLY REQUIRE ADMIN ROLE) ─────────────────
router.use(requireAdminAuth);

// Overview metrics & real database statistics
router.get('/overview', getAdminOverview);

// Staff Management
router.get('/staff', getAllStaff);
router.post('/staff/invite', inviteStaff);
router.put('/staff/:id', updateStaff);
router.patch('/staff/:id/status', toggleStaffStatus);
router.post('/staff/:id/resend-invite', resendStaffInvitation);
router.delete('/staff/:id/revoke-invite', revokeStaffInvitation);

// Activity Logs / Audit Trail
router.get('/activity-logs', getActivityLogs);

// Application Staff Assignment
router.patch('/applications/:id/assign', assignApplicationStaff);

export default router;
