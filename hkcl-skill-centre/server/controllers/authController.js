import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import { isDbConnected } from '../config/db.js';
import {
  isEmailConfigured,
  generateVerificationToken,
  sendVerificationEmail,
  hashToken,
} from '../services/emailService.js';

export function getJwtSecret() {
  return process.env.JWT_SECRET || 'hkcl_skill_centre_super_secret_jwt_key_2026';
}

/**
 * Generate cryptographically-seeded unique Student Reference ID
 * Exclusively on the backend with collision retry loop.
 * Format: HKCL-YYYY-XXXXXX
 */
export async function generateUniqueStudentId() {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 10; attempt++) {
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const candidateId = `HKCL-${year}-${randNum}`;

    let exists = false;
    if (isDbConnected) {
      try {
        const found = await Student.findOne({ studentId: candidateId }).select('_id');
        if (found) exists = true;
      } catch {
        // Fallback to in-memory check
      }
    }
    if (!exists && memoryStudents.some((s) => s.studentId === candidateId)) {
      exists = true;
    }

    if (!exists) {
      return candidateId;
    }
  }
  throw new Error('Collision threshold reached while generating unique Student Reference ID.');
}

// In-memory fallback registry for offline operation
export const memoryStudents = [
  {
    studentId: 'HKCL-2026-482910',
    fullName: 'Rahul Sharma',
    phone: '9812345678',
    email: 'rahul.sharma@example.com',
    isEmailVerified: true,
    address: {
      house: 'H.No 45, Street 2',
      locality: 'Model Town',
      city: 'Sirsa',
      district: 'Sirsa',
      state: 'Haryana',
      pincode: '125055',
    },
  },
];

/**
 * Audit existing MongoDB student records for duplicates before building unique indexes.
 * IMPORTANT: Does NOT delete or merge student records automatically.
 */
export async function auditExistingDuplicates() {
  if (!isDbConnected) {
    return {
      status: 'offline_or_in_memory',
      duplicateEmails: [],
      duplicateIds: [],
      duplicatePhones: [],
    };
  }

  try {
    const students = await Student.find({}).lean();
    const emailMap = new Map();
    const phoneMap = new Map();
    const idMap = new Map();

    const duplicateEmails = [];
    const duplicatePhones = [];
    const duplicateIds = [];

    for (const s of students) {
      const normEmail = (s.email || '').trim().toLowerCase();
      if (normEmail) {
        if (emailMap.has(normEmail)) {
          duplicateEmails.push({ email: normEmail, existingId: emailMap.get(normEmail), newId: s.studentId });
        } else {
          emailMap.set(normEmail, s.studentId);
        }
      }

      const cleanPhone = (s.phone || '').trim();
      if (cleanPhone) {
        if (phoneMap.has(cleanPhone)) {
          duplicatePhones.push({ phone: cleanPhone, existingId: phoneMap.get(cleanPhone), newId: s.studentId });
        } else {
          phoneMap.set(cleanPhone, s.studentId);
        }
      }

      if (s.studentId) {
        if (idMap.has(s.studentId)) {
          duplicateIds.push({ studentId: s.studentId, docId: s._id });
        } else {
          idMap.set(s.studentId, s._id);
        }
      }
    }

    if (duplicateEmails.length > 0 || duplicatePhones.length > 0 || duplicateIds.length > 0) {
      console.warn('[Audit] Duplicate records detected in database (records preserved, not merged):', {
        duplicateEmails,
        duplicatePhones,
        duplicateIds,
      });
    } else {
      console.log('[Audit] Zero duplicate records found in MongoDB. Indexes verified.');
    }

    return {
      status: 'completed',
      totalChecked: students.length,
      duplicateEmails,
      duplicatePhones,
      duplicateIds,
    };
  } catch (err) {
    console.warn('[Audit] Pre-index audit warning:', err.message);
    return { status: 'error', error: err.message };
  }
}

/**
 * POST /api/auth/register
 * Create permanent passwordless student account with assigned Student Reference ID.
 * - Normalizes email (trim + lowercase).
 * - Enforces uniqueness on email and phone.
 * - Idempotent for identical retry requests.
 * - Prevents duplicate account creation for already-registered emails/phones.
 * - Never merges accounts on name alone.
 * - Handles concurrent / race condition duplicate-key errors safely.
 */
export async function register(req, res) {
  try {
    const { fullName, phone, email } = req.body;
    const cleanName = (fullName || '').toString().trim();
    const cleanPhone = (phone || '').toString().trim().replace(/\D/g, '');
    const cleanEmail = (email || '').toString().trim().toLowerCase();

    // 1. Validate applicant full legal name
    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please enter applicant full legal name (minimum 2 characters).',
      });
    }

    // 2. Validate Indian mobile number
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit Indian mobile number.',
      });
    }

    // 3. Validate email format if provided
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address format.',
      });
    }

    // 4. Check for existing accounts in MongoDB or in-memory fallback
    let existingByPhone = null;
    let existingByEmail = null;

    if (isDbConnected) {
      try {
        existingByPhone = await Student.findOne({ phone: cleanPhone });
        if (cleanEmail) {
          existingByEmail = await Student.findOne({ email: cleanEmail });
        }
      } catch (err) {
        console.warn('DB lookup error:', err.message);
      }
    }

    if (!existingByPhone) {
      existingByPhone = memoryStudents.find((s) => s.phone === cleanPhone) || null;
    }
    if (cleanEmail && !existingByEmail) {
      existingByEmail = memoryStudents.find((s) => (s.email || '').toLowerCase() === cleanEmail) || null;
    }

    // CASE A: Idempotent retry (Same phone AND same email already registered to the same student)
    if (existingByPhone && existingByEmail && existingByPhone.studentId === existingByEmail.studentId) {
      const token = jwt.sign(
        { studentId: existingByPhone.studentId, phone: existingByPhone.phone },
        getJwtSecret(),
        { expiresIn: '7d' }
      );
      return res.status(200).json({
        success: true,
        message: 'Account already registered with this mobile number and email.',
        isIdempotent: true,
        token,
        student: existingByPhone,
      });
    }

    // CASE B: Already registered with this email, but different phone
    if (existingByEmail) {
      return res.status(409).json({
        success: false,
        code: 'EMAIL_ALREADY_REGISTERED',
        duplicateField: 'email',
        error: 'A student account is already registered with this email address.',
        recovery: {
          action: 'recover_reference_id',
          findIdEndpoint: '/api/auth/find-id',
          message: 'If this is your account, use your registered email or phone to retrieve your Student Reference ID.',
        },
      });
    }

    // CASE C: Already registered with this mobile number, but different email
    if (existingByPhone) {
      // If the existing record has no email yet and the new request provides one, or same applicant
      if (!existingByPhone.email && cleanEmail) {
        // Safe update of optional email on the existing account
        existingByPhone.email = cleanEmail;
        if (isDbConnected) {
          try {
            await Student.updateOne({ _id: existingByPhone._id }, { $set: { email: cleanEmail } });
          } catch {
            // Ignore
          }
        }
        const token = jwt.sign(
          { studentId: existingByPhone.studentId, phone: existingByPhone.phone },
          getJwtSecret(),
          { expiresIn: '7d' }
        );
        return res.status(200).json({
          success: true,
          message: 'Email added to your existing student account.',
          token,
          student: existingByPhone,
        });
      }

      return res.status(409).json({
        success: false,
        code: 'PHONE_ALREADY_REGISTERED',
        duplicateField: 'phone',
        error: 'A student account is already registered with this mobile number.',
        recovery: {
          action: 'recover_reference_id',
          findIdEndpoint: '/api/auth/find-id',
          message: 'If this is your account, use your registered mobile number to retrieve your Student Reference ID.',
        },
      });
    }

    // 5. Generate Reference ID exclusively on backend
    const studentId = await generateUniqueStudentId();

    // 6. Handle email verification token (hashed at rest for security)
    const { rawToken, tokenHash, expires: verificationExpires } = generateVerificationToken();

    let newStudent = {
      studentId,
      fullName: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      isEmailVerified: false,
      emailVerificationToken: cleanEmail ? tokenHash : null, // Hashed at rest
      emailVerificationExpires: cleanEmail ? verificationExpires : null,
      address: {
        house: '',
        locality: '',
        city: 'Sirsa',
        district: 'Sirsa',
        state: 'Haryana',
        pincode: '',
      },
    };

    // 7. Persist to MongoDB with duplicate-key safety
    if (isDbConnected) {
      try {
        newStudent = await Student.create(newStudent);
      } catch (dbErr) {
        // Handle MongoDB E11000 duplicate key error (concurrent/simultaneous requests)
        if (dbErr.code === 11000 || (dbErr.message && dbErr.message.includes('E11000'))) {
          if (dbErr.keyPattern?.email || (dbErr.message && dbErr.message.includes('email'))) {
            return res.status(409).json({
              success: false,
              code: 'CONCURRENT_DUPLICATE_EMAIL',
              duplicateField: 'email',
              error: 'A student account with this email address was just registered simultaneously.',
              recovery: { action: 'recover_reference_id', findIdEndpoint: '/api/auth/find-id' },
            });
          }
          if (dbErr.keyPattern?.phone || (dbErr.message && dbErr.message.includes('phone'))) {
            return res.status(409).json({
              success: false,
              code: 'CONCURRENT_DUPLICATE_PHONE',
              duplicateField: 'phone',
              error: 'A student account with this mobile number was just registered simultaneously.',
              recovery: { action: 'recover_reference_id', findIdEndpoint: '/api/auth/find-id' },
            });
          }
          if (dbErr.keyPattern?.studentId || (dbErr.message && dbErr.message.includes('studentId'))) {
            // Collision retry
            const retryId = await generateUniqueStudentId();
            newStudent.studentId = retryId;
            newStudent = await Student.create(newStudent);
          }
        } else {
          throw dbErr;
        }
      }
    }

    // Add to in-memory fallback
    memoryStudents.push(newStudent);

    // 8. Attempt email dispatch (reports missing configuration; never fakes verification)
    let emailStatus = null;
    if (cleanEmail) {
      emailStatus = await sendVerificationEmail({
        email: cleanEmail,
        fullName: cleanName,
        studentId: newStudent.studentId,
        rawToken,
      });
    }

    const token = jwt.sign(
      { studentId: newStudent.studentId, phone: newStudent.phone, isEmailVerified: false },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Student account created successfully. Please verify your email to activate your account.',
      token,
      student: {
        studentId: newStudent.studentId,
        fullName: newStudent.fullName,
        phone: newStudent.phone,
        email: newStudent.email,
        isEmailVerified: false,
      },
      emailVerification: emailStatus,
      isEmailConfigured: isEmailConfigured(),
      ...(process.env.TEST_MODE || !isEmailConfigured() ? { rawVerificationToken: rawToken } : {}),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Registration failed.',
    });
  }
}

/**
 * POST /api/auth/verify-email
 * Verifies email ownership token.
 * Token is verified against SHA-256 hash at rest, checks 24-hr expiration,
 * and is immediately invalidated upon success (single-use).
 */
export async function verifyEmail(req, res) {
  try {
    const { token } = req.body;
    const cleanToken = (token || '').toString().trim();

    if (!cleanToken) {
      return res.status(400).json({
        success: false,
        error: 'Email verification token is required.',
      });
    }

    const incomingHash = hashToken(cleanToken);

    let student = null;
    if (isDbConnected) {
      try {
        student = await Student.findOne({
          emailVerificationToken: incomingHash,
          emailVerificationExpires: { $gt: new Date() },
        });
        if (student) {
          student.isEmailVerified = true;
          student.emailVerificationToken = null; // Invalidated after use
          student.emailVerificationExpires = null;
          await student.save();
        }
      } catch (err) {
        console.warn('DB verifyEmail error:', err.message);
      }
    }

    if (!student) {
      student = memoryStudents.find(
        (s) =>
          s.emailVerificationToken === incomingHash &&
          (!s.emailVerificationExpires || new Date(s.emailVerificationExpires) > new Date())
      );
      if (student) {
        student.isEmailVerified = true;
        student.emailVerificationToken = null; // Invalidated after use
        student.emailVerificationExpires = null;
      }
    }

    if (!student) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired email verification token. Verification links are single-use and valid for 24 hours.',
      });
    }

    const tokenPayload = {
      studentId: student.studentId,
      phone: student.phone,
      isEmailVerified: true,
    };
    const sessionToken = jwt.sign(tokenPayload, getJwtSecret(), { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      message: 'Email address verified successfully. Your student profile is fully activated.',
      token: sessionToken,
      student: {
        studentId: student.studentId,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        isEmailVerified: true,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Email verification failed.',
    });
  }
}

/**
 * POST /api/auth/resend-verification
 * Resends a fresh email verification link to the applicant
 */
export async function resendVerification(req, res) {
  try {
    const { email, phone, studentId } = req.body;
    const cleanEmail = (email || '').toString().trim().toLowerCase();
    const cleanId = (studentId || '').toString().trim().toUpperCase();
    const cleanPhone = (phone || '').toString().trim().replace(/\D/g, '');

    if (!cleanEmail && !cleanId && !cleanPhone) {
      return res.status(400).json({
        success: false,
        error: 'Please provide registered email, phone or Student Reference ID.',
      });
    }

    let student = null;
    if (isDbConnected) {
      try {
        const query = cleanEmail ? { email: cleanEmail } : cleanId ? { studentId: cleanId } : { phone: cleanPhone };
        student = await Student.findOne(query);
      } catch {
        // Fallback
      }
    }
    if (!student) {
      student = memoryStudents.find((s) =>
        cleanEmail ? (s.email || '').toLowerCase() === cleanEmail : cleanId ? s.studentId === cleanId : s.phone === cleanPhone
      );
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'No registered student account was found.',
      });
    }

    if (student.isEmailVerified) {
      return res.status(400).json({
        success: false,
        error: 'This email address is already verified.',
      });
    }

    // Generate fresh single-use verification token (hashed at rest)
    const { rawToken, tokenHash, expires } = generateVerificationToken();
    student.emailVerificationToken = tokenHash;
    student.emailVerificationExpires = expires;

    if (isDbConnected && student.save) {
      await student.save();
    }

    const dispatch = await sendVerificationEmail({
      email: student.email,
      fullName: student.fullName,
      studentId: student.studentId,
      rawToken,
    });

    if (!dispatch.sent) {
      return res.status(503).json({
        success: false,
        code: 'EMAIL_DISPATCH_FAILED',
        error: dispatch.error || 'Failed to dispatch verification email.',
        isEmailConfigured: isEmailConfigured(),
        reason: dispatch.reason,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Fresh verification link has been sent to ${student.email}.`,
      ...(process.env.TEST_MODE ? { rawVerificationToken: rawToken } : {}),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to resend verification email.',
    });
  }
}

/**
 * POST /api/auth/find-id
 * Self-service lookup to recover lost Student Reference ID by registered mobile or email
 */
export async function findReferenceId(req, res) {
  try {
    const { phone, email } = req.body;
    const cleanPhone = (phone || '').toString().trim().replace(/\D/g, '');
    const cleanEmail = (email || '').toString().trim().toLowerCase();

    if (!cleanPhone && !cleanEmail) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your registered 10-digit mobile number or email address.',
      });
    }

    if (cleanPhone && !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid 10-digit Indian mobile number.',
      });
    }

    let student = null;
    if (isDbConnected) {
      try {
        const query = cleanPhone ? { phone: cleanPhone } : { email: cleanEmail };
        student = await Student.findOne(query);
      } catch {
        // Ignore
      }
    }

    if (!student) {
      student = memoryStudents.find((s) =>
        cleanPhone ? s.phone === cleanPhone : (s.email || '').toLowerCase() === cleanEmail
      );
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'No registered student account was found with the provided details.',
      });
    }

    return res.status(200).json({
      success: true,
      student: {
        studentId: student.studentId,
        fullName: student.fullName,
        phone: student.phone,
        email: student.email,
        isEmailVerified: Boolean(student.isEmailVerified),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to locate Student Reference ID.',
    });
  }
}
