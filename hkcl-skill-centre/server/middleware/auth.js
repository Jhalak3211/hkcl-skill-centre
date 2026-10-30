import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import { isDbConnected } from '../config/db.js';
import { memoryStudents } from '../controllers/authController.js';

/**
 * JWT AUTHENTICATION MIDDLEWARE
 * ---------------------------------------------------------------------------
 * Protects endpoints requiring student session.
 * Decodes studentId from token and attaches to req.student.
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
    const secret = process.env.JWT_SECRET || 'hkcl_skill_centre_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);

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
 * REQUIRE VERIFIED EMAIL MIDDLEWARE (Requirement 6)
 * ---------------------------------------------------------------------------
 * Ensures unverified accounts cannot access protected student profiles,
 * admission applications, uploaded documents or payment receipts.
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

    // If student provided an email and it has not been verified yet, block access
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
 * ---------------------------------------------------------------------------
 * Protects manual payment verification endpoints against unauthorized student or public access.
 * Checks for either:
 * 1. `x-staff-key` header matching process.env.STAFF_API_KEY
 * 2. Valid Bearer JWT token with role === 'staff' or role === 'admin'
 * Rejects regular student tokens or missing keys with 403 Forbidden.
 */
export function requireStaffAuth(req, res, next) {
  try {
    const staffKeyHeader = req.headers['x-staff-key'];
    const configuredStaffKey = process.env.STAFF_API_KEY || 'hkcl_staff_secret_key_2026';

    if (staffKeyHeader && staffKeyHeader === configuredStaffKey) {
      req.staff = {
        role: 'staff',
        identifier: req.headers['x-staff-name'] || 'Admissions Staff',
      };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'hkcl_skill_centre_super_secret_jwt_key_2026';
      try {
        const decoded = jwt.verify(token, secret);
        if (decoded.role === 'staff' || decoded.role === 'admin') {
          req.staff = decoded;
          return next();
        }
      } catch {
        // Fall through to 403
      }
    }

    return res.status(403).json({
      success: false,
      error: 'Forbidden: Staff authorization key or admin credentials required to perform this action.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error checking staff authorization.',
    });
  }
}
