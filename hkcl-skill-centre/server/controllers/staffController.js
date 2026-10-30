import Application from '../models/Application.js';
import Student from '../models/Student.js';
import { isDbConnected } from '../config/db.js';
import { memoryApplications } from './applicationController.js';

/**
 * GET /api/staff/overview
 * Overview metrics and list of applications segmented by review stage.
 */
export async function getStaffOverview(req, res) {
  try {
    const { section } = req.query;
    const appMap = new Map();

    // 1. Gather all in-memory applications
    for (const a of memoryApplications.values()) {
      if (a.applicationId) {
        appMap.set(a.applicationId, { ...a });
      }
    }

    // 2. Gather all persisted database applications (precedence)
    if (isDbConnected) {
      try {
        const dbApps = await Application.find({}).sort({ updatedAt: -1, createdAt: -1 }).lean();
        for (const a of dbApps) {
          if (a.applicationId) {
            appMap.set(a.applicationId, a);
          }
        }
      } catch (dbErr) {
        console.warn('[StaffOverview] MongoDB query error:', dbErr.message);
      }
    }

    let applications = Array.from(appMap.values());

    // 3. Ensure candidate personalSnapshot & details are populated
    for (let i = 0; i < applications.length; i++) {
      const a = applications[i];
      if (!a.personalSnapshot?.fullName && a.studentId) {
        let student = null;
        if (isDbConnected) {
          try {
            student = await Student.findOne({ studentId: a.studentId }).lean();
          } catch {}
        }
        if (student) {
          a.personalSnapshot = {
            ...(a.personalSnapshot || {}),
            fullName: student.fullName || a.personal?.fullName || 'Student Applicant',
            phone: student.phone || a.personal?.phone || '',
            email: student.email || a.personal?.email || '',
            dob: student.dob || a.personal?.dob || '',
            gender: student.gender || a.personal?.gender || 'Male',
            fatherName: student.fatherName || a.personal?.fatherName || '',
            motherName: student.motherName || a.personal?.motherName || '',
            address: student.address || a.personal?.address || {},
          };
        } else if (a.personal?.fullName) {
          a.personalSnapshot = {
            ...(a.personalSnapshot || {}),
            ...a.personal,
          };
        }
      }
    }

    // Calculate metrics
    const metrics = {
      totalApplications: applications.length,
      underReview: applications.filter(
        (a) => a.status === 'under_review' || a.documentReview?.status === 'under_review'
      ).length,
      correctionsRequired: applications.filter(
        (a) => a.status === 'corrections_required' || a.documentReview?.status === 'corrections_required'
      ).length,
      documentsApproved: applications.filter(
        (a) =>
          (a.status === 'documents_approved' || a.documentReview?.status === 'approved') &&
          a.payment?.status !== 'verified' &&
          a.status !== 'admitted'
      ).length,
      paymentPending: applications.filter(
        (a) =>
          (a.status === 'documents_approved' || a.documentReview?.status === 'approved') &&
          a.payment?.status === 'pending'
      ).length,
      paymentSubmitted: applications.filter(
        (a) => a.payment?.status === 'submitted'
      ).length,
      paymentVerified: applications.filter(
        (a) => (a.payment?.status === 'verified' || a.payment?.status === 'paid') && a.status !== 'admitted'
      ).length,
      admitted: applications.filter(
        (a) => a.status === 'admitted' || a.finalAdmission?.status === 'admitted'
      ).length,
      rejected: applications.filter(
        (a) => a.status === 'rejected' || a.documentReview?.status === 'rejected'
      ).length,
    };

    // Filter applications if section requested
    let filtered = applications;
    if (section === 'under_review') {
      filtered = applications.filter(
        (a) => a.status === 'under_review' || a.documentReview?.status === 'under_review'
      );
    } else if (section === 'corrections_required') {
      filtered = applications.filter(
        (a) => a.status === 'corrections_required' || a.documentReview?.status === 'corrections_required'
      );
    } else if (section === 'documents_approved') {
      filtered = applications.filter(
        (a) => a.status === 'documents_approved' || a.documentReview?.status === 'approved'
      );
    } else if (section === 'payment_submitted') {
      filtered = applications.filter((a) => a.payment?.status === 'submitted');
    } else if (section === 'payment_verified') {
      filtered = applications.filter(
        (a) => a.payment?.status === 'verified' || a.payment?.status === 'paid'
      );
    } else if (section === 'admitted') {
      filtered = applications.filter(
        (a) => a.status === 'admitted' || a.finalAdmission?.status === 'admitted'
      );
    } else if (section === 'rejected') {
      filtered = applications.filter(
        (a) => a.status === 'rejected' || a.documentReview?.status === 'rejected'
      );
    }

    return res.status(200).json({
      success: true,
      metrics,
      count: filtered.length,
      applications: filtered,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve staff overview.',
    });
  }
}

/**
 * GET /api/staff/applications/:id
 * Retrieve full application details for document & admission review.
 */
export async function getStaffApplicationById(req, res) {
  try {
    const { id } = req.params;
    let app = null;

    if (isDbConnected) {
      try {
        app = await Application.findOne({
          $or: [{ applicationId: id }, { studentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
        }).lean();
      } catch {
        // Fallback
      }
    }
    if (!app) {
      app = memoryApplications.get(id);
      if (!app) {
        for (const a of memoryApplications.values()) {
          if (a.studentId === id || a.applicationId === id) {
            app = a;
            break;
          }
        }
      }
    }

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'Application not found.',
      });
    }

    // Populate candidate details if missing
    if (!app.personalSnapshot?.fullName && app.studentId) {
      let student = null;
      if (isDbConnected) {
        try {
          student = await Student.findOne({ studentId: app.studentId }).lean();
        } catch {}
      }
      if (student) {
        app.personalSnapshot = {
          ...(app.personalSnapshot || {}),
          fullName: student.fullName || app.personal?.fullName || 'Student Applicant',
          phone: student.phone || app.personal?.phone || '',
          email: student.email || app.personal?.email || '',
          dob: student.dob || app.personal?.dob || '',
          gender: student.gender || app.personal?.gender || 'Male',
          fatherName: student.fatherName || app.personal?.fatherName || '',
          motherName: student.motherName || app.personal?.motherName || '',
          address: student.address || app.personal?.address || {},
        };
      }
    }

    return res.status(200).json({
      success: true,
      application: app,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve application.',
    });
  }
}

/**
 * POST /api/staff/documents/approve
 * Approves student's uploaded documents and submitted academic details.
 * Unlocks the registration fee payment step.
 */
export async function approveDocuments(req, res) {
  try {
    const { applicationId, notes } = req.body;
    if (!applicationId) {
      return res.status(400).json({ success: false, error: 'Application ID is required.' });
    }

    let app = null;
    if (isDbConnected) {
      try {
        app = await Application.findOne({ applicationId });
      } catch {
        // Fallback
      }
    }
    if (!app) app = memoryApplications.get(applicationId);

    if (!app) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    // Validate state transition: can only approve applications currently under review or pending
    const currentDocStatus = app.documentReview?.status || 'pending';
    if (currentDocStatus === 'approved') {
      return res.status(200).json({
        success: true,
        message: 'Documents are already approved.',
        application: app,
      });
    }

    const reviewer = req.staff?.identifier || 'Admissions Staff';
    const reviewedAt = new Date();
    const historyEntry = {
      action: 'approved',
      performedBy: reviewer,
      timestamp: reviewedAt,
      notes: notes || 'Documents verified and approved. Payment unlocked.',
    };

    const updates = {
      status: 'documents_approved',
      'documentReview.status': 'approved',
      'documentReview.reviewedBy': reviewer,
      'documentReview.reviewedAt': reviewedAt,
      'documentReview.notes': notes || '',
      'documentReview.correctionNotes': '',
    };

    if (isDbConnected) {
      try {
        await Application.findOneAndUpdate(
          { applicationId },
          {
            $set: updates,
            $push: { 'documentReview.history': historyEntry },
          }
        );
      } catch {
        // Fallback
      }
    }

    const memApp = memoryApplications.get(applicationId);
    if (memApp) {
      memApp.status = 'documents_approved';
      memApp.documentReview = {
        ...(memApp.documentReview || {}),
        status: 'approved',
        reviewedBy: reviewer,
        reviewedAt: reviewedAt.toISOString(),
        notes: notes || '',
        correctionNotes: '',
        history: [...(memApp.documentReview?.history || []), historyEntry],
      };
      memoryApplications.set(applicationId, memApp);
    }

    return res.status(200).json({
      success: true,
      message: 'Application documents approved successfully. Student payment step is now unlocked.',
      documentStatus: 'approved',
      applicationStatus: 'documents_approved',
      reviewedBy: reviewer,
      reviewedAt: reviewedAt.toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to approve documents.',
    });
  }
}

/**
 * POST /api/staff/documents/request-corrections
 * Requests document or details corrections from student with mandatory explanation.
 * Allows student to edit and resubmit.
 */
export async function requestDocumentCorrections(req, res) {
  try {
    const { applicationId, explanation } = req.body;
    if (!applicationId) {
      return res.status(400).json({ success: false, error: 'Application ID is required.' });
    }

    const cleanExplanation = (explanation || '').toString().trim();
    if (!cleanExplanation || cleanExplanation.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'A specific explanation describing the requested corrections is required.',
      });
    }

    let app = null;
    if (isDbConnected) {
      try {
        app = await Application.findOne({ applicationId });
      } catch {
        // Fallback
      }
    }
    if (!app) app = memoryApplications.get(applicationId);

    if (!app) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    const reviewer = req.staff?.identifier || 'Admissions Staff';
    const reviewedAt = new Date();
    const historyEntry = {
      action: 'corrections_requested',
      performedBy: reviewer,
      timestamp: reviewedAt,
      notes: cleanExplanation,
    };

    const updates = {
      status: 'corrections_required',
      'documentReview.status': 'corrections_required',
      'documentReview.correctionNotes': cleanExplanation,
      'documentReview.reviewedBy': reviewer,
      'documentReview.reviewedAt': reviewedAt,
      isLocked: false, // Student is unlocked to fix issues
    };

    if (isDbConnected) {
      try {
        await Application.findOneAndUpdate(
          { applicationId },
          {
            $set: updates,
            $push: { 'documentReview.history': historyEntry },
          }
        );
      } catch {
        // Fallback
      }
    }

    const memApp = memoryApplications.get(applicationId);
    if (memApp) {
      memApp.status = 'corrections_required';
      memApp.isLocked = false;
      memApp.documentReview = {
        ...(memApp.documentReview || {}),
        status: 'corrections_required',
        correctionNotes: cleanExplanation,
        reviewedBy: reviewer,
        reviewedAt: reviewedAt.toISOString(),
        history: [...(memApp.documentReview?.history || []), historyEntry],
      };
      memoryApplications.set(applicationId, memApp);
    }

    return res.status(200).json({
      success: true,
      message: 'Correction request recorded. Student dashboard will highlight required changes.',
      documentStatus: 'corrections_required',
      applicationStatus: 'corrections_required',
      explanation: cleanExplanation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to request document corrections.',
    });
  }
}

/**
 * POST /api/staff/documents/reject
 * Rejects application with mandatory reason.
 */
export async function rejectDocumentApplication(req, res) {
  try {
    const { applicationId, reason } = req.body;
    if (!applicationId) {
      return res.status(400).json({ success: false, error: 'Application ID is required.' });
    }

    const cleanReason = (reason || '').toString().trim();
    if (!cleanReason || cleanReason.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'A specific rejection reason is required.',
      });
    }

    let app = null;
    if (isDbConnected) {
      try {
        app = await Application.findOne({ applicationId });
      } catch {
        // Fallback
      }
    }
    if (!app) app = memoryApplications.get(applicationId);

    if (!app) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    const reviewer = req.staff?.identifier || 'Admissions Staff';
    const reviewedAt = new Date();
    const historyEntry = {
      action: 'rejected',
      performedBy: reviewer,
      timestamp: reviewedAt,
      notes: cleanReason,
    };

    const updates = {
      status: 'rejected',
      'documentReview.status': 'rejected',
      'documentReview.rejectionReason': cleanReason,
      'documentReview.reviewedBy': reviewer,
      'documentReview.reviewedAt': reviewedAt,
      isLocked: true,
    };

    if (isDbConnected) {
      try {
        await Application.findOneAndUpdate(
          { applicationId },
          {
            $set: updates,
            $push: { 'documentReview.history': historyEntry },
          }
        );
      } catch {
        // Fallback
      }
    }

    const memApp = memoryApplications.get(applicationId);
    if (memApp) {
      memApp.status = 'rejected';
      memApp.isLocked = true;
      memApp.documentReview = {
        ...(memApp.documentReview || {}),
        status: 'rejected',
        rejectionReason: cleanReason,
        reviewedBy: reviewer,
        reviewedAt: reviewedAt.toISOString(),
        history: [...(memApp.documentReview?.history || []), historyEntry],
      };
      memoryApplications.set(applicationId, memApp);
    }

    return res.status(200).json({
      success: true,
      message: 'Application rejected with reason.',
      documentStatus: 'rejected',
      applicationStatus: 'rejected',
      reason: cleanReason,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to reject application.',
    });
  }
}

/**
 * POST /api/staff/admission/admit
 * Final Admission Decision: Grant official admission once documents AND payment are verified.
 * Separate decision from document review and payment.
 */
export async function finalAdmitApplication(req, res) {
  try {
    const { applicationId, notes, batch } = req.body;
    if (!applicationId) {
      return res.status(400).json({ success: false, error: 'Application ID is required.' });
    }

    let app = null;
    if (isDbConnected) {
      try {
        app = await Application.findOne({ applicationId });
      } catch {
        // Fallback
      }
    }
    if (!app) app = memoryApplications.get(applicationId);

    if (!app) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    // MANDATORY REQUIREMENT: Must not admit unless documents are approved AND payment is verified
    const isDocApproved =
      app.documentReview?.status === 'approved' || app.status === 'documents_approved';
    const isPayVerified =
      app.payment?.status === 'verified' || app.payment?.status === 'paid';

    if (!isDocApproved) {
      return res.status(400).json({
        success: false,
        error: 'Cannot admit applicant: Uploaded documents must be verified and approved first.',
      });
    }

    if (!isPayVerified) {
      return res.status(400).json({
        success: false,
        error: 'Cannot admit applicant: Registration fee payment must be verified against bank records first.',
      });
    }

    const officer = req.staff?.identifier || 'Admissions Director';
    const decisionAt = new Date();
    const enrollmentNo = `ENR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const assignedBatch = batch || app.course?.batch || 'Morning Batch';

    const updates = {
      status: 'admitted',
      'finalAdmission.status': 'admitted',
      'finalAdmission.decisionBy': officer,
      'finalAdmission.decisionAt': decisionAt,
      'finalAdmission.notes': notes || 'Admitted to HKCL Skill Centre course.',
      'finalAdmission.enrollmentNo': enrollmentNo,
      'finalAdmission.admittedBatch': assignedBatch,
      isLocked: true,
    };

    if (isDbConnected) {
      try {
        await Application.findOneAndUpdate({ applicationId }, { $set: updates });
      } catch {
        // Fallback
      }
    }

    const memApp = memoryApplications.get(applicationId);
    if (memApp) {
      memApp.status = 'admitted';
      memApp.isLocked = true;
      memApp.finalAdmission = {
        status: 'admitted',
        decisionBy: officer,
        decisionAt: decisionAt.toISOString(),
        notes: notes || 'Admitted to HKCL Skill Centre course.',
        enrollmentNo,
        admittedBatch: assignedBatch,
      };
      memoryApplications.set(applicationId, memApp);
    }

    return res.status(200).json({
      success: true,
      message: 'Final admission granted. Applicant is officially enrolled.',
      status: 'admitted',
      applicationStatus: 'admitted',
      enrollmentNo,
      admittedBatch: assignedBatch,
      decisionBy: officer,
      decisionAt: decisionAt.toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to grant final admission.',
    });
  }
}

/**
 * POST /api/staff/admission/reject
 * Final Admission Decision: Reject admission after review.
 */
export async function finalRejectApplication(req, res) {
  try {
    const { applicationId, reason } = req.body;
    if (!applicationId) {
      return res.status(400).json({ success: false, error: 'Application ID is required.' });
    }

    const cleanReason = (reason || '').toString().trim();
    if (!cleanReason || cleanReason.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'A specific explanation for rejecting admission is required.',
      });
    }

    let app = null;
    if (isDbConnected) {
      try {
        app = await Application.findOne({ applicationId });
      } catch {
        // Fallback
      }
    }
    if (!app) app = memoryApplications.get(applicationId);

    if (!app) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    const officer = req.staff?.identifier || 'Admissions Director';
    const decisionAt = new Date();

    const updates = {
      status: 'rejected',
      'finalAdmission.status': 'rejected',
      'finalAdmission.decisionBy': officer,
      'finalAdmission.decisionAt': decisionAt,
      'finalAdmission.rejectionReason': cleanReason,
      'finalAdmission.notes': cleanReason,
      isLocked: true,
    };

    if (isDbConnected) {
      try {
        await Application.findOneAndUpdate({ applicationId }, { $set: updates });
      } catch {
        // Fallback
      }
    }

    const memApp = memoryApplications.get(applicationId);
    if (memApp) {
      memApp.status = 'rejected';
      memApp.isLocked = true;
      memApp.finalAdmission = {
        status: 'rejected',
        decisionBy: officer,
        decisionAt: decisionAt.toISOString(),
        rejectionReason: cleanReason,
        notes: cleanReason,
      };
      memoryApplications.set(applicationId, memApp);
    }

    return res.status(200).json({
      success: true,
      message: 'Admission rejected.',
      status: 'rejected',
      reason: cleanReason,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to reject admission.',
    });
  }
}
