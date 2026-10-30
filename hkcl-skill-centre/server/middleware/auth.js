import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import ActivityLog from '../models/ActivityLog.js';
import { isDbConnected } from '../config/db.js';
import { memoryStudents } from '../controllers/authController.js';

export function getJwtSecret() {
  return process.env.JWT_SECRET || 'hkcl_skill_centre_super_secret_jwt_key_2026';
}

/**
 * In-memory fallback logs for offline mode
 */
export const memoryActivityLogs = [];

/**
 * Log System Activity Helper
 */
export async function logActivity({
  action,
  category = 'system',
  description,
  performedBy = null,
  targetId = '',
  details = {},
  req = null,
}) {
  try {
    const actor = performedBy || {
      id: req?.user?.id || req?.staff?.id || '',
      name: req?.user?.name || req?.staff?.name || req?.staff?.identifier || 'System',
      email: req?.user?.email || req?.staff?.email || '',
      role: req?.user?.role || req?.staff?.role || 'staff',
    };

    const logEntry = {
      action,
      category,
      description,
      performedBy: actor,
      targetId: String(targetId || ''),
      details,
      createdAt: new Date(),
    };

    if (isDbConnected) {
      try {
        await ActivityLog.create(logEntry);
        return;
      } catch (err) {
        console.warn('[ActivityLog] Failed to persist log to MongoDB:', err.message);
      }
    }

    memoryActivityLogs.unshift(logEntry);
    if (memoryActivityLogs.length > 500) {
      memoryActivityLogs.pop();
    }
  } catch (error) {
    console.warn('[ActivityLog] Exception in logActivity:', error.message);
  }
}

/**
 * JWT AUTHENTICATION MIDDLEWARE FOR STUDENTS
 */
export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication token is missing.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret());

    req.student = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired session token.',
    });
  }
}

/**
 * REQUIRE VERIFIED EMAIL MIDDLEWARE
 */
export async function requireVerifiedEmail(req, res, next) {
  try {
    const studentId = req.student?.studentId;
    if (!studentId) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }

    let student = null;
    if (isDbConnected) {
      try {
        student = await Student.findOne({ studentId }).select('isEmailVerified email');
      } catch {
        // Fallback
      }
    }
    if (!student) {
      student = memoryStudents.find((s) => s.studentId === studentId);
    }

    if (student && student.email && !student.isEmailVerified) {
      return res.status(403).json({
        success: false,
        code: 'EMAIL_NOT_VERIFIED',
        error: 'Forbidden: Email verification is required before accessing protected admission records.',
        email: student.email,
        studentId: student.studentId,
        resendEndpoint: '/api/auth/resend-verification',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error checking verification status.',
    });
  }
}

/**
 * REQUIRE STAFF/ADMIN AUTHORIZATION MIDDLEWARE
 * Allows users with role === 'staff' OR role === 'admin' OR matching x-staff-key.
 */
export async function requireStaffAuth(req, res, next) {
  try {
    const staffKeyHeader = req.headers['x-staff-key'];
    const configuredStaffKey = process.env.STAFF_API_KEY || 'hkcl_staff_secret_key_2026';

    if (staffKeyHeader && staffKeyHeader === configuredStaffKey) {
      req.staff = {
        role: 'staff',
        name: req.headers['x-staff-name'] || 'Admissions Staff',
        identifier: req.headers['x-staff-name'] || 'Admissions Staff',
      };
      req.user = req.staff;
      return next();
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, getJwtSecret());
        if (decoded.role === 'staff' || decoded.role === 'admin') {
          // If role is staff, verify they are still active in database
          if (decoded.role === 'staff' && isDbConnected && decoded.id) {
            try {
              const staffDoc = await Staff.findById(decoded.id).select('status permissions');
              if (staffDoc && staffDoc.status !== 'active') {
                return res.status(403).json({
                  success: false,
                  error: 'Forbidden: Staff account is no longer active.',
                });
              }
              decoded.permissions = staffDoc?.permissions || decoded.permissions;
            } catch {
              // Proceed with token payload if db lookup fails
            }
          }

          req.staff = decoded;
          req.user = decoded;
          return next();
        }
      } catch {
        // Fall through to 403
      }
    }

    return res.status(403).json({
      success: false,
      error: 'Forbidden: Staff authorization key or staff credentials required to perform this action.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error checking staff authorization.',
    });
  }
}

/**
 * REQUIRE STRICT ADMIN AUTHORIZATION MIDDLEWARE
 * Rejects staff, students, and unauthenticated visitors.
 */
export async function requireAdminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Admin authentication token is required.',
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, getJwtSecret());
    } catch {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or expired admin session token.',
      });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Only administrators have permission to access this resource.',
      });
    }

    // Verify admin is active in DB if connected
    if (isDbConnected && decoded.id) {
      try {
        const adminDoc = await Staff.findById(decoded.id).select('status role');
        if (adminDoc && (adminDoc.role !== 'admin' || adminDoc.status !== 'active')) {
          return res.status(403).json({
            success: false,
            error: 'Forbidden: Admin account is not authorized or deactivated.',
          });
        }
      } catch {
        // Fallback
      }
    }

    req.admin = decoded;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error checking admin authorization.',
    });
  }
}
