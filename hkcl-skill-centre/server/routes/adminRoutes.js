import { Router } from 'express';
import {
  adminLogin,
  staffLogin,
  acceptStaffInvitation,
  getStaffInvitation,
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
import advertisementRoutes from './advertisementRoutes.js';
import { requireAdminAuth, requireStaffAuth } from '../middleware/auth.js';
import { adminLoginRateLimiter } from '../middleware/rateLimiter.js';
import { verifySmtpConnection, getEmailDiagnostics } from '../services/emailService.js';

const router = Router();

// Public Authentication Endpoints
router.post('/login', adminLoginRateLimiter, adminLogin);
router.post('/staff-login', staffLogin);
router.get('/accept-invite', getStaffInvitation);
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

// Advertisements Management (CRUD)
router.use('/advertisements', advertisementRoutes);

// Email Service Diagnostic & SMTP Verification
router.get('/email/diagnostics', (req, res) => {
  return res.status(200).json({ success: true, diagnostics: getEmailDiagnostics() });
});

router.post('/email/verify-smtp', async (req, res) => {
  const result = await verifySmtpConnection();
  return res.status(result.success ? 200 : 400).json(result);
});

// Activity Logs / Audit Trail
router.get('/activity-logs', getActivityLogs);

// Application Staff Assignment
router.patch('/applications/:id/assign', assignApplicationStaff);

export default router;
