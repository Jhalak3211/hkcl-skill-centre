import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Staff from '../models/Staff.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import ActivityLog from '../models/ActivityLog.js';
import { isDbConnected } from '../config/db.js';
import { memoryStaff } from '../config/seedAdmin.js';
import { memoryApplications } from './applicationController.js';
import { memoryActivityLogs, logActivity, getJwtSecret } from '../middleware/auth.js';
import {
  generateStaffInvitationToken,
  sendStaffInvitationEmail,
  hashToken,
} from '../services/emailService.js';

/**
 * POST /api/auth/admin/login
 * Dedicated, protected admin login endpoint.
 * Requires email or username and password.
 */
export async function adminLogin(req, res) {
  try {
    const { identifier, password } = req.body;
    const cleanId = (identifier || '').toString().trim().toLowerCase();
    const cleanPass = (password || '').toString();

    if (!cleanId || !cleanPass) {
      return res.status(400).json({
        success: false,
        error: 'Please enter both your administrator email/username and password.',
      });
    }

    let admin = null;
    if (isDbConnected) {
      try {
        admin = await Staff.findOne({
          role: 'admin',
          $or: [{ email: cleanId }, { name: { $regex: new RegExp(`^${cleanId}$`, 'i') } }],
        });
      } catch (err) {
        console.warn('[AdminLogin] DB lookup notice:', err.message);
      }
    }

    if (!admin) {
      admin = memoryStaff.find(
        (s) =>
          s.role === 'admin' &&
          (s.email.toLowerCase() === cleanId || s.name.toLowerCase() === cleanId)
      );
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator credentials. Access restricted.',
      });
    }

    if (admin.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'This administrator account has been deactivated.',
      });
    }

    const isMatch = admin.comparePassword
      ? await admin.comparePassword(cleanPass)
      : await bcrypt.compare(cleanPass, admin.password || '');
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator credentials. Access restricted.',
      });
    }

    // Update lastLogin
    admin.lastLogin = new Date();
    if (isDbConnected && admin.save) {
      await admin.save().catch(() => {});
    }

    const payload = {
      id: admin._id || admin.id,
      name: admin.name,
      email: admin.email,
      role: 'admin',
      designation: admin.designation,
    };

    const token = jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });

    // Log Activity
    await logActivity({
      action: 'ADMIN_LOGIN',
      category: 'auth',
      description: `Administrator ${admin.name} (${admin.email}) logged in successfully.`,
      performedBy: payload,
    });

    return res.status(200).json({
      success: true,
      message: 'Administrator authentication successful.',
      token,
      admin: {
        id: admin._id || admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        designation: admin.designation,
        role: 'admin',
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Admin authentication failed.',
    });
  }
}

/**
 * POST /api/auth/staff/login
 * Dedicated staff login endpoint.
 * Requires registered Gmail address and password.
 * Rejects pending invitations and deactivated accounts.
 */
export async function staffLogin(req, res) {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toString().trim().toLowerCase();
    const cleanPass = (password || '').toString();

    if (!cleanEmail || !cleanPass) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your registered staff email and password.',
      });
    }

    let staff = null;
    if (isDbConnected) {
      try {
        staff = await Staff.findOne({ email: cleanEmail, role: 'staff' });
      } catch (err) {
        console.warn('[StaffLogin] DB lookup error:', err.message);
      }
    }

    if (!staff) {
      staff = memoryStaff.find((s) => s.email.toLowerCase() === cleanEmail && s.role === 'staff');
    }

    if (!staff) {
      return res.status(401).json({
        success: false,
        error: 'No staff account found with this email address.',
      });
    }

    // Check account status
    if (staff.status === 'pending') {
      return res.status(403).json({
        success: false,
        code: 'INVITATION_PENDING',
        error:
          'Your staff invitation is pending. Please click the invitation link sent to your email to accept and set your password.',
      });
    }

    if (staff.status === 'deactivated') {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_DEACTIVATED',
        error:
          'Your staff account has been deactivated. Please contact the Centre Administrator for assistance.',
      });
    }

    if (staff.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Your staff account is currently inactive.',
      });
    }

    const isMatch = staff.comparePassword
      ? await staff.comparePassword(cleanPass)
      : await bcrypt.compare(cleanPass, staff.password || '');
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password. Please check your credentials.',
      });
    }

    staff.lastLogin = new Date();
    if (isDbConnected && staff.save) {
      await staff.save().catch(() => {});
    }

    const payload = {
      id: staff._id || staff.id,
      name: staff.name,
      email: staff.email,
      role: 'staff',
      designation: staff.designation,
      permissions: staff.permissions || {
        canReviewDocuments: true,
        canVerifyPayments: true,
        canProcessAdmissions: true,
      },
    };

    const token = jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });

    // Log Activity
    await logActivity({
      action: 'STAFF_LOGIN',
      category: 'auth',
      description: `Staff member ${staff.name} (${staff.email}) logged in.`,
      performedBy: payload,
    });

    return res.status(200).json({
      success: true,
      message: 'Staff login successful.',
      token,
      staff: {
        id: staff._id || staff.id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        designation: staff.designation,
        role: 'staff',
        permissions: staff.permissions,
        lastLogin: staff.lastLogin,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Staff login failed.',
    });
  }
}

/**
 * GET /api/admin/accept-invite
 * Validates staff invitation token and returns non-sensitive invite details without consuming token.
 */
export async function getStaffInvitation(req, res) {
  try {
    const rawToken = req.query.token || req.params.token;
    const cleanToken = (rawToken || '').toString().trim();

    if (!cleanToken) {
      return res.status(400).json({
        success: false,
        error: 'Invitation token is required.',
      });
    }

    const incomingHash = hashToken(cleanToken);

    let staff = null;
    if (isDbConnected) {
      try {
        staff = await Staff.findOne({
          invitationToken: incomingHash,
        }).select('name email designation status invitationExpires');
      } catch (err) {
        console.warn('DB lookup error:', err.message);
      }
    }

    if (!staff) {
      staff = memoryStaff.find((s) => s.invitationToken === incomingHash);
    }

    if (!staff) {
      return res.status(404).json({
        success: false,
        error: 'This invitation token is invalid or has already been used.',
      });
    }

    if (staff.status === 'active') {
      return res.status(400).json({
        success: false,
        error: 'This invitation has already been accepted and the staff account is active.',
      });
    }

    if (staff.status === 'deactivated') {
      return res.status(403).json({
        success: false,
        error: 'This staff account has been deactivated. Please contact your administrator.',
      });
    }

    const isExpired = Boolean(
      staff.invitationExpires && new Date(staff.invitationExpires) <= new Date()
    );

    if (isExpired) {
      return res.status(410).json({
        success: false,
        isExpired: true,
        error: 'This invitation has expired. Please request a fresh invitation from your administrator.',
      });
    }

    return res.status(200).json({
      success: true,
      valid: true,
      staff: {
        name: staff.name,
        email: staff.email,
        designation: staff.designation,
        expiresAt: staff.invitationExpires,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify invitation token.',
    });
  }
}

/**
 * POST /api/auth/staff/accept-invite
 * Public endpoint for staff member to accept invitation and set their password.
 */
export async function acceptStaffInvitation(req, res) {
  try {
    const { token, password, confirmPassword } = req.body;
    const cleanToken = (token || '').toString().trim();
    const cleanPassword = (password || '').toString();

    if (!cleanToken) {
      return res.status(400).json({
        success: false,
        error: 'Invitation token is missing or invalid.',
      });
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters in length.',
      });
    }

    if (confirmPassword && cleanPassword !== confirmPassword.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Password and confirmation password do not match.',
      });
    }

    const incomingHash = hashToken(cleanToken);

    let staff = null;
    if (isDbConnected) {
      try {
        staff = await Staff.findOne({
          invitationToken: incomingHash,
          status: 'pending',
          invitationExpires: { $gt: new Date() },
        });
      } catch (err) {
        console.warn('DB lookup error:', err.message);
      }
    }

    if (!staff) {
      staff = memoryStaff.find(
        (s) =>
          s.invitationToken === incomingHash &&
          s.status === 'pending' &&
          new Date(s.invitationExpires) > new Date()
      );
    }

    if (!staff) {
      // Differentiate between expired token, used token, and invalid token
      let expiredCheck = null;
      if (isDbConnected) {
        try {
          expiredCheck = await Staff.findOne({ invitationToken: incomingHash });
        } catch {}
      }
      if (!expiredCheck) {
        expiredCheck = memoryStaff.find((s) => s.invitationToken === incomingHash);
      }

      if (expiredCheck) {
        if (expiredCheck.status === 'active') {
          return res.status(400).json({
            success: false,
            error: 'This invitation has already been accepted and your account is active. Please log in directly.',
          });
        }
        if (expiredCheck.invitationExpires && new Date(expiredCheck.invitationExpires) <= new Date()) {
          return res.status(410).json({
            success: false,
            isExpired: true,
            error: 'This invitation token has expired. Please request a fresh invitation from your administrator.',
          });
        }
      }

      return res.status(400).json({
        success: false,
        error:
          'This invitation token is invalid, expired, or has already been used. Please request a new invitation from your administrator.',
      });
    }

    // Hash password and activate staff account
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    staff.password = hashedPassword;
    staff.status = 'active';
    staff.invitationToken = null; // Single-use: immediately invalidated
    staff.invitationExpires = null;
    staff.acceptedAt = new Date();
    staff.lastLogin = new Date();

    if (isDbConnected && staff.save) {
      await staff.save();
    }

    const payload = {
      id: staff._id || staff.id,
      name: staff.name,
      email: staff.email,
      role: 'staff',
      designation: staff.designation,
      permissions: staff.permissions,
    };

    const sessionToken = jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });

    await logActivity({
      action: 'STAFF_INVITATION_ACCEPTED',
      category: 'staff',
      description: `Staff member ${staff.name} (${staff.email}) accepted invitation and activated account.`,
      targetId: String(staff._id || staff.id),
      performedBy: payload,
    });

    return res.status(200).json({
      success: true,
      message: 'Account activated successfully! You are now logged in.',
      token: sessionToken,
      staff: {
        id: staff._id || staff.id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        designation: staff.designation,
        role: 'staff',
        permissions: staff.permissions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to accept invitation.',
    });
  }
}

/**
 * GET /api/auth/me
 * Returns current authenticated user (Admin or Staff)
 */
export async function getMe(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, error: 'Not authenticated.' });
    }

    let profile = null;
    if (isDbConnected && user.id) {
      try {
        profile = await Staff.findById(user.id).select('-password -invitationToken').lean();
      } catch {}
    }

    if (!profile) {
      profile = user;
    }

    return res.status(200).json({
      success: true,
      user: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve profile.',
    });
  }
}

/**
 * GET /api/admin/overview
 * Real database statistics for the Admin Dashboard Overview.
 * Never uses hardcoded or dummy data.
 */
export async function getAdminOverview(req, res) {
  try {
    const appMap = new Map();

    // 1. Gather memory applications
    for (const a of memoryApplications.values()) {
      if (a.applicationId) appMap.set(a.applicationId, a);
    }

    // 2. Gather DB applications
    if (isDbConnected) {
      try {
        const dbApps = await Application.find({}).sort({ updatedAt: -1 }).lean();
        for (const a of dbApps) {
          if (a.applicationId) appMap.set(a.applicationId, a);
        }
      } catch (err) {
        console.warn('[AdminOverview] DB apps error:', err.message);
      }
    }

    const applications = Array.from(appMap.values());

    // Compute application stats
    const totalApplications = applications.length;
    let underReview = 0;
    let correctionsRequired = 0;
    let documentsApproved = 0;
    let paymentsSubmitted = 0;
    let paymentsVerified = 0;
    let admittedStudents = 0;
    let rejectedApplications = 0;

    for (const a of applications) {
      const docStatus = a.documentReview?.status || 'pending';
      const payStatus = a.payment?.status || 'pending';
      const admStatus = a.finalAdmission?.status || 'pending';

      if (admStatus === 'admitted' || a.status === 'admitted') {
        admittedStudents++;
      } else if (admStatus === 'rejected' || a.status === 'rejected') {
        rejectedApplications++;
      }

      if (docStatus === 'under_review' || a.status === 'under_review') underReview++;
      if (docStatus === 'corrections_required' || a.status === 'corrections_required')
        correctionsRequired++;
      if (docStatus === 'approved' || a.status === 'documents_approved') documentsApproved++;

      if (payStatus === 'submitted' || a.status === 'payment_submitted') paymentsSubmitted++;
      if (payStatus === 'verified' || payStatus === 'paid' || a.status === 'payment_verified')
        paymentsVerified++;
    }

    // Gather Staff stats
    let allStaff = [];
    if (isDbConnected) {
      try {
        allStaff = await Staff.find({ role: 'staff' }).lean();
      } catch {}
    }
    if (allStaff.length === 0) {
      allStaff = memoryStaff.filter((s) => s.role === 'staff');
    }

    const totalStaff = allStaff.length;
    const activeStaff = allStaff.filter((s) => s.status === 'active').length;
    const pendingStaffInvitations = allStaff.filter((s) => s.status === 'pending').length;

    // Recent applications (latest 5)
    const recentApplications = applications.slice(0, 5).map((a) => ({
      applicationId: a.applicationId,
      studentId: a.studentId,
      candidateName: a.personalSnapshot?.fullName || a.personal?.fullName || 'Student Applicant',
      courseName: a.course?.name || 'Computer Training',
      status: a.status,
      submittedAt: a.submittedAt || a.createdAt,
      documentStatus: a.documentReview?.status,
      paymentStatus: a.payment?.status,
      admissionStatus: a.finalAdmission?.status,
      assignedStaff: a.assignedStaff,
    }));

    // Recent activities (latest 8)
    let recentActivities = [];
    if (isDbConnected) {
      try {
        recentActivities = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(8).lean();
      } catch {}
    }
    if (recentActivities.length === 0) {
      recentActivities = memoryActivityLogs.slice(0, 8);
    }

    // Recent admission updates (latest admitted or verified)
    const recentAdmissionUpdates = applications
      .filter((a) => a.finalAdmission?.status === 'admitted' || a.payment?.status === 'verified')
      .slice(0, 5)
      .map((a) => ({
        applicationId: a.applicationId,
        candidateName: a.personalSnapshot?.fullName || a.personal?.fullName || 'Student Applicant',
        courseName: a.course?.name || 'Skill Course',
        enrollmentNo: a.finalAdmission?.enrollmentNo || '',
        status: a.status,
        decisionAt: a.finalAdmission?.decisionAt || a.payment?.verifiedAt,
      }));

    return res.status(200).json({
      success: true,
      statistics: {
        totalApplications,
        underReview,
        correctionsRequired,
        documentsApproved,
        paymentsSubmitted,
        paymentsVerified,
        admittedStudents,
        rejectedApplications,
        totalStaff,
        activeStaff,
        pendingStaffInvitations,
      },
      recentApplications,
      recentActivities,
      recentAdmissionUpdates,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve overview statistics.',
    });
  }
}

/**
 * GET /api/admin/staff
 * View all registered staff members with search and filter.
 */
export async function getAllStaff(req, res) {
  try {
    const { status, search } = req.query;
    let staffMembers = [];

    if (isDbConnected) {
      try {
        const query = { role: 'staff' };
        if (status && status !== 'all') {
          query.status = status;
        }
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { designation: { $regex: search, $options: 'i' } },
          ];
        }
        staffMembers = await Staff.find(query)
          .select('-password')
          .sort({ createdAt: -1 })
          .lean();
      } catch (err) {
        console.warn('DB getAllStaff error:', err.message);
      }
    }

    if (staffMembers.length === 0 && !isDbConnected) {
      staffMembers = memoryStaff
        .filter((s) => s.role === 'staff')
        .filter((s) => (!status || status === 'all' ? true : s.status === status))
        .filter((s) => {
          if (!search) return true;
          const q = search.toLowerCase();
          return (
            s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.phone.includes(q)
          );
        });
    }

    return res.status(200).json({
      success: true,
      staff: staffMembers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve staff members.',
    });
  }
}

/**
 * POST /api/admin/staff/invite
 * Register new staff member through Gmail invitation.
 */
export async function inviteStaff(req, res) {
  try {
    const { name, email, phone, designation, permissions } = req.body;
    const cleanName = (name || '').toString().trim();
    const cleanEmail = (email || '').toString().trim().toLowerCase();
    const cleanPhone = (phone || '').toString().trim().replace(/\D/g, '');
    const cleanDesignation = (designation || 'Admissions Officer').toString().trim();

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please enter staff member full name (at least 2 characters).',
      });
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid Gmail / email address.',
      });
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit Indian mobile number.',
      });
    }

    // Check for duplicate staff account
    let existing = null;
    if (isDbConnected) {
      try {
        existing = await Staff.findOne({ email: cleanEmail });
      } catch {}
    }
    if (!existing) {
      existing = memoryStaff.find((s) => s.email.toLowerCase() === cleanEmail);
    }

    if (existing) {
      // 1. If staff account is already active, reject duplicate with 409
      if (existing.status === 'active') {
        return res.status(409).json({
          success: false,
          code: 'STAFF_ALREADY_ACTIVE',
          error: `A staff member with email "${cleanEmail}" is already active and registered. Manage their profile or permissions in the staff list.`,
        });
      }

      // 2. If staff account is deactivated, reject with 409
      if (existing.status === 'deactivated') {
        return res.status(409).json({
          success: false,
          code: 'STAFF_DEACTIVATED',
          error: `A staff account with email "${cleanEmail}" exists but is currently deactivated. Please reactivate their account in the staff directory before re-issuing credentials.`,
        });
      }

      // 3. If staff invitation is pending or expired: renew invitation with fresh token
      if (existing.status === 'pending') {
        const isExpired = Boolean(
          existing.invitationExpires && new Date(existing.invitationExpires) <= new Date()
        );

        // Generate fresh single-use invitation token (hashed at rest with SHA-256)
        const { rawToken, tokenHash, expires } = generateStaffInvitationToken();

        existing.name = cleanName;
        existing.phone = cleanPhone;
        existing.designation = cleanDesignation;
        if (permissions) existing.permissions = permissions;
        existing.invitationToken = tokenHash;
        existing.invitationExpires = expires;
        existing.invitedBy = req.user?.name || req.admin?.name || 'Administrator';
        existing.invitedAt = new Date();

        if (isDbConnected && existing.save) {
          await existing.save();
        }

        // Dispatch invitation email
        const emailResult = await sendStaffInvitationEmail({
          email: cleanEmail,
          name: cleanName,
          rawToken,
          designation: cleanDesignation,
          invitedBy: existing.invitedBy,
        });

        await logActivity({
          action: isExpired ? 'STAFF_INVITATION_EXPIRED_RENEWED' : 'STAFF_INVITATION_UPDATED',
          category: 'staff',
          description: isExpired
            ? `Expired staff invitation for ${cleanName} (${cleanEmail}) renewed by ${existing.invitedBy}.`
            : `Pending staff invitation for ${cleanName} (${cleanEmail}) updated with fresh token by ${existing.invitedBy}.`,
          targetId: String(existing._id || existing.id),
          req,
          details: { emailResult, isExpired },
        });

        const statusMessage = emailResult.sent
          ? (isExpired
              ? `Expired invitation for ${cleanEmail} has been renewed and dispatched.`
              : `Pending invitation for ${cleanEmail} updated and a fresh invitation email dispatched.`)
          : `Staff invitation ${isExpired ? 'renewed' : 'updated'}. Email delivery could not be performed (${emailResult.error || 'email provider issue'}). Use the direct invitation link below.`;

        return res.status(200).json({
          success: true,
          isRenewed: true,
          isExpired,
          emailSent: Boolean(emailResult.sent),
          message: statusMessage,
          staff: {
            id: existing._id || existing.id,
            name: existing.name,
            email: existing.email,
            phone: existing.phone,
            designation: existing.designation,
            status: 'pending',
            invitedAt: existing.invitedAt,
          },
          emailDelivery: emailResult,
          invitationUrl: emailResult.inviteUrl,
        });
      }
    }

    // Generate single-use invitation token (hashed at rest)
    const { rawToken, tokenHash, expires } = generateStaffInvitationToken();

    const staffData = {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      designation: cleanDesignation,
      role: 'staff',
      status: 'pending',
      invitationToken: tokenHash,
      invitationExpires: expires,
      permissions: permissions || {
        canReviewDocuments: true,
        canVerifyPayments: true,
        canProcessAdmissions: true,
      },
      invitedBy: req.user?.name || req.admin?.name || 'Administrator',
      invitedAt: new Date(),
    };

    let newStaff = null;
    if (isDbConnected) {
      try {
        newStaff = await Staff.create(staffData);
      } catch (err) {
        if (err.code === 11000) {
          return res.status(409).json({
            success: false,
            code: 'STAFF_DUPLICATE_EMAIL',
            error: `A staff member with email "${cleanEmail}" already exists.`,
          });
        }
        throw err;
      }
    }

    if (!newStaff) {
      newStaff = {
        _id: `mem_staff_${Date.now()}`,
        ...staffData,
      };
      memoryStaff.push(newStaff);
    }

    // Dispatch invitation email
    const emailResult = await sendStaffInvitationEmail({
      email: cleanEmail,
      name: cleanName,
      rawToken,
      designation: cleanDesignation,
      invitedBy: staffData.invitedBy,
    });

    await logActivity({
      action: 'STAFF_INVITED',
      category: 'staff',
      description: `Staff member ${cleanName} (${cleanEmail}) invited as ${cleanDesignation}.`,
      targetId: String(newStaff._id || newStaff.id),
      req,
      details: { emailResult },
    });

    const statusMessage = emailResult.sent
      ? `Invitation email successfully dispatched to ${cleanEmail}.`
      : `Staff invitation created. Email delivery could not be performed (${emailResult.error || 'email provider issue'}). Use the direct invitation link below.`;

    return res.status(201).json({
      success: true,
      isRenewed: false,
      emailSent: Boolean(emailResult.sent),
      message: statusMessage,
      staff: {
        id: newStaff._id || newStaff.id,
        name: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone,
        designation: newStaff.designation,
        status: 'pending',
        invitedAt: newStaff.invitedAt,
      },
      emailDelivery: emailResult,
      invitationUrl: emailResult.inviteUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send staff invitation.',
    });
  }
}

/**
 * PUT /api/admin/staff/:id
 * Edit staff information (name, phone, designation, permissions)
 */
export async function updateStaff(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, designation, permissions } = req.body;

    let staff = null;
    if (isDbConnected) {
      staff = await Staff.findById(id);
    } else {
      staff = memoryStaff.find((s) => (s._id || s.id) === id);
    }

    if (!staff) {
      return res.status(404).json({ success: false, error: 'Staff member not found.' });
    }

    if (name) staff.name = name.trim();
    if (phone) staff.phone = phone.trim();
    if (designation) staff.designation = designation.trim();
    if (permissions) staff.permissions = permissions;

    if (isDbConnected && staff.save) {
      await staff.save();
    }

    await logActivity({
      action: 'STAFF_UPDATED',
      category: 'staff',
      description: `Staff profile for ${staff.name} (${staff.email}) updated.`,
      targetId: id,
      req,
    });

    return res.status(200).json({
      success: true,
      message: 'Staff details updated successfully.',
      staff,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update staff member.',
    });
  }
}

/**
 * PATCH /api/admin/staff/:id/status
 * Activate or Deactivate staff member
 */
export async function toggleStaffStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active' | 'deactivated'

    if (!['active', 'deactivated'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Status must be either 'active' or 'deactivated'.",
      });
    }

    let staff = null;
    if (isDbConnected) {
      staff = await Staff.findById(id);
    } else {
      staff = memoryStaff.find((s) => (s._id || s.id) === id);
    }

    if (!staff) {
      return res.status(404).json({ success: false, error: 'Staff member not found.' });
    }

    if (staff.role === 'admin' && status === 'deactivated') {
      return res.status(400).json({
        success: false,
        error: 'Cannot deactivate the primary administrator account.',
      });
    }

    staff.status = status;
    if (isDbConnected && staff.save) {
      await staff.save();
    }

    await logActivity({
      action: status === 'active' ? 'STAFF_ACTIVATED' : 'STAFF_DEACTIVATED',
      category: 'staff',
      description: `Staff member ${staff.name} (${staff.email}) marked as ${status}.`,
      targetId: id,
      req,
    });

    return res.status(200).json({
      success: true,
      message: `Staff member account is now ${status}.`,
      staff,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to change staff status.',
    });
  }
}

/**
 * POST /api/admin/staff/:id/resend-invite
 * Resend invitation email with fresh single-use token
 */
export async function resendStaffInvitation(req, res) {
  try {
    const { id } = req.params;

    let staff = null;
    if (isDbConnected) {
      staff = await Staff.findById(id);
    } else {
      staff = memoryStaff.find((s) => (s._id || s.id) === id);
    }

    if (!staff) {
      return res.status(404).json({ success: false, error: 'Staff member not found.' });
    }

    if (staff.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Cannot resend invitation: this account is already active or processed.',
      });
    }

    const { rawToken, tokenHash, expires } = generateStaffInvitationToken();
    staff.invitationToken = tokenHash;
    staff.invitationExpires = expires;

    if (isDbConnected && staff.save) {
      await staff.save();
    }

    const emailResult = await sendStaffInvitationEmail({
      email: staff.email,
      name: staff.name,
      rawToken,
      designation: staff.designation,
      invitedBy: req.user?.name || 'Administrator',
    });

    await logActivity({
      action: 'STAFF_INVITATION_RESENT',
      category: 'staff',
      description: `Invitation resent to ${staff.name} (${staff.email}).`,
      targetId: id,
      req,
    });

    const statusMessage = emailResult.sent
      ? `Fresh invitation email successfully dispatched to ${staff.email}.`
      : `Fresh invitation token generated, but email delivery could not be performed (${emailResult.error || 'provider issue'}). Copy the direct invitation link below.`;

    return res.status(200).json({
      success: true,
      emailSent: Boolean(emailResult.sent),
      message: statusMessage,
      invitationUrl: emailResult.inviteUrl,
      emailDelivery: emailResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to resend invitation.',
    });
  }
}

/**
 * DELETE /api/admin/staff/:id/revoke-invite
 * Revoke pending invitation
 */
export async function revokeStaffInvitation(req, res) {
  try {
    const { id } = req.params;

    let staff = null;
    if (isDbConnected) {
      staff = await Staff.findById(id);
      if (staff && staff.status === 'pending') {
        await Staff.findByIdAndDelete(id);
      }
    } else {
      const idx = memoryStaff.findIndex((s) => (s._id || s.id) === id && s.status === 'pending');
      if (idx !== -1) {
        staff = memoryStaff[idx];
        memoryStaff.splice(idx, 1);
      }
    }

    if (!staff) {
      return res.status(404).json({
        success: false,
        error: 'Pending staff invitation not found.',
      });
    }

    await logActivity({
      action: 'STAFF_INVITATION_REVOKED',
      category: 'staff',
      description: `Pending staff invitation for ${staff.name} (${staff.email}) revoked.`,
      targetId: id,
      req,
    });

    return res.status(200).json({
      success: true,
      message: `Staff invitation for ${staff.name} has been revoked.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to revoke invitation.',
    });
  }
}

/**
 * GET /api/admin/activity-logs
 * Filterable system audit trail
 */
export async function getActivityLogs(req, res) {
  try {
    const { category, action, search, page = 1, limit = 50 } = req.query;
    let logs = [];
    let total = 0;

    if (isDbConnected) {
      try {
        const query = {};
        if (category && category !== 'all') query.category = category;
        if (action && action !== 'all') query.action = action;
        if (search) {
          query.$or = [
            { description: { $regex: search, $options: 'i' } },
            { 'performedBy.name': { $regex: search, $options: 'i' } },
            { 'performedBy.email': { $regex: search, $options: 'i' } },
            { targetId: { $regex: search, $options: 'i' } },
          ];
        }

        total = await ActivityLog.countDocuments(query);
        logs = await ActivityLog.find(query)
          .sort({ createdAt: -1 })
          .skip((Number(page) - 1) * Number(limit))
          .limit(Number(limit))
          .lean();
      } catch (err) {
        console.warn('DB logs error:', err.message);
      }
    }

    if (logs.length === 0 && !isDbConnected) {
      let filtered = memoryActivityLogs;
      if (category && category !== 'all') filtered = filtered.filter((l) => l.category === category);
      if (action && action !== 'all') filtered = filtered.filter((l) => l.action === action);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l.description.toLowerCase().includes(q) ||
            l.performedBy?.name?.toLowerCase().includes(q) ||
            l.targetId?.toLowerCase().includes(q)
        );
      }
      total = filtered.length;
      logs = filtered.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));
    }

    return res.status(200).json({
      success: true,
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve activity logs.',
    });
  }
}

/**
 * PATCH /api/admin/applications/:id/assign
 * Assign application to a staff member
 */
export async function assignApplicationStaff(req, res) {
  try {
    const { id } = req.params;
    const { staffId } = req.body;

    let staff = null;
    if (staffId) {
      if (isDbConnected) {
        staff = await Staff.findById(staffId).select('name email');
      } else {
        staff = memoryStaff.find((s) => (s._id || s.id) === staffId);
      }
      if (!staff) {
        return res.status(404).json({ success: false, error: 'Selected staff member not found.' });
      }
    }

    let app = null;
    if (isDbConnected) {
      app = await Application.findOne({ applicationId: id });
    }
    if (!app) {
      app = memoryApplications.get(id);
    }

    if (!app) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    app.assignedStaff = staff
      ? {
          staffId: String(staff._id || staff.id),
          name: staff.name,
          email: staff.email,
          assignedAt: new Date(),
        }
      : { staffId: '', name: '', email: '', assignedAt: null };

    if (isDbConnected && app.save) {
      await app.save();
    }

    await logActivity({
      action: 'APPLICATION_ASSIGNED',
      category: 'application',
      description: staff
        ? `Application ${id} assigned to staff member ${staff.name}.`
        : `Assignment cleared for application ${id}.`,
      targetId: id,
      req,
    });

    return res.status(200).json({
      success: true,
      message: staff
        ? `Application assigned to ${staff.name}.`
        : 'Application assignment removed.',
      assignedStaff: app.assignedStaff,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to assign application.',
    });
  }
}
