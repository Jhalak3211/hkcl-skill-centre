import Application from '../models/Application.js';
import Student from '../models/Student.js';
import { isDbConnected } from '../config/db.js';

export function generateApplicationId() {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `APP-2026-${rand}`;
}

export const memoryApplications = new Map();

/**
 * Validate document uploads (MIME type, size, and structure)
 * Allowed formats: JPEG, PNG, WEBP, PDF
 * Individual file max: 5MB
 */
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'application/pdf',
]);

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateDocumentFile(doc, fieldName) {
  if (!doc) return { valid: true };

  const dataUrl = typeof doc === 'string' ? doc : doc.dataUrl || doc.url || '';
  const declaredSize = (typeof doc === 'object' && doc.size) ? doc.size : 0;

  if (!dataUrl) {
    return { valid: true };
  }

  // Check data URL format
  if (dataUrl.startsWith('data:')) {
    const match = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/s);
    if (!match) {
      return {
        valid: false,
        error: `Invalid file format for ${fieldName}. Document must be a valid base64 data URI.`,
      };
    }
    const mimeType = match[1].toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return {
        valid: false,
        error: `Invalid file type '${mimeType}' for ${fieldName}. Allowed types: JPG, PNG, WEBP, PDF.`,
      };
    }
    const base64Data = match[2];
    const padding = (base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0);
    const approximateBytes = Math.floor((base64Data.length * 3) / 4) - padding;

    if (approximateBytes > MAX_FILE_BYTES || declaredSize > MAX_FILE_BYTES) {
      return {
        valid: false,
        error: `File size for ${fieldName} exceeds the maximum allowed limit of 5MB.`,
      };
    }
  } else if (!dataUrl.startsWith('/uploads/') && !dataUrl.startsWith('http://') && !dataUrl.startsWith('https://')) {
    return {
      valid: false,
      error: `Invalid document reference for ${fieldName}.`,
    };
  }

  return { valid: true };
}

export function normalizeDocuments(documents, education) {
  const docs = documents ? { ...documents } : {};
  const photoData = docs.photo?.dataUrl || (typeof docs.photo === 'string' ? docs.photo : docs.photoUrl);
  const sigData = docs.signature?.dataUrl || (typeof docs.signature === 'string' ? docs.signature : docs.signatureUrl);
  const idData = docs.idProof?.dataUrl || (typeof docs.idProof === 'string' ? docs.idProof : docs.idProofUrl);

  const normalized = {
    ...docs,
    photoUrl: photoData || null,
    signatureUrl: sigData || null,
    idProofUrl: idData || null,
  };

  const edu = education ? { ...education } : {};
  if (edu.tenth?.marksheet?.dataUrl) {
    edu.tenth.marksheetUrl = edu.tenth.marksheet.dataUrl;
  }
  if (edu.twelfth?.marksheet?.dataUrl) {
    edu.twelfth.marksheetUrl = edu.twelfth.marksheet.dataUrl;
  }

  return { normalizedDocs: normalized, normalizedEdu: edu };
}

/**
 * GET /api/applications
 * List all applications created by the authenticated student
 */
export async function getApplications(req, res) {
  try {
    const { studentId } = req.student;
    let apps = [];

    if (isDbConnected) {
      try {
        apps = await Application.find({ studentId }).sort({ updatedAt: -1 });
      } catch {
        // Fallback
      }
    }

    if (apps.length === 0) {
      for (const app of memoryApplications.values()) {
        if (app.studentId === studentId) apps.push(app);
      }
    }

    return res.status(200).json({
      success: true,
      count: apps.length,
      applications: apps,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch applications.',
    });
  }
}

/**
 * GET /api/applications/:id
 * Retrieve a specific application by applicationId.
 * ENFORCES SERVER-SIDE OWNERSHIP (Requirement 10).
 */
export async function getApplicationById(req, res) {
  try {
    const { id } = req.params;
    const { studentId } = req.student;
    let app = null;

    if (isDbConnected) {
      try {
        app = await Application.findOne({
          $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
        });
      } catch {
        // Fallback
      }
    }

    if (!app) {
      app = memoryApplications.get(id);
    }

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'Application not found.',
      });
    }

    // SERVER-SIDE OWNERSHIP CHECK: Student can only view their own application
    if (app.studentId !== studentId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to view another student\'s application.',
      });
    }

    return res.status(200).json({
      success: true,
      application: app,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch application details.',
    });
  }
}

/**
 * POST /api/applications
 * Create new course application with fresh snapshot of student profile.
 * - Generates separate Application ID (Requirement 8).
 * - Links strictly to studentId.
 * - Idempotent against duplicate requests for the same course draft (Requirement 11).
 */
export async function createApplication(req, res) {
  try {
    const { studentId } = req.student;
    const { course, personal, personalSnapshot, education, documents, status } = req.body;

    // Check for existing active draft for the same course to prevent duplicates upon retry
    const courseSlug = course?.slug || '';
    if (courseSlug) {
      let existingDraft = null;
      if (isDbConnected) {
        try {
          existingDraft = await Application.findOne({
            studentId,
            'course.slug': courseSlug,
            status: 'draft',
          });
        } catch {
          // Ignore
        }
      }
      if (!existingDraft) {
        for (const a of memoryApplications.values()) {
          if (a.studentId === studentId && a.course?.slug === courseSlug && a.status === 'draft') {
            existingDraft = a;
            break;
          }
        }
      }

      if (existingDraft) {
        return res.status(200).json({
          success: true,
          message: 'Active draft application for this course retrieved.',
          isIdempotent: true,
          application: existingDraft,
        });
      }
    }

    let student = null;
    if (isDbConnected) {
      try {
        student = await Student.findOne({ studentId });
      } catch {
        // Fallback
      }
    }

    // Validate documents if provided
    const docFields = [
      { doc: documents?.photo, name: 'Passport Photograph' },
      { doc: documents?.signature, name: 'Specimen Signature' },
      { doc: documents?.idProof, name: 'Identity Proof' },
      { doc: education?.tenth?.marksheet, name: '10th Marksheet' },
      { doc: education?.twelfth?.marksheet, name: '12th Marksheet' },
    ];
    for (const f of docFields) {
      const v = validateDocumentFile(f.doc, f.name);
      if (!v.valid) {
        return res.status(400).json({ success: false, error: v.error });
      }
    }

    const { normalizedDocs, normalizedEdu } = normalizeDocuments(documents, education);

    const applicationId = generateApplicationId();

    const snapshot = personalSnapshot || personal || {};
    const newApp = {
      applicationId,
      studentId,
      status: status || 'draft',
      currentStep: req.body.currentStep || 1,
      course: course || {},
      personalSnapshot: {
        fullName: snapshot.fullName || student?.fullName || '',
        phone: snapshot.phone || student?.phone || '',
        email: snapshot.email || student?.email || '',
        fatherName: snapshot.fatherName || student?.fatherName || '',
        motherName: snapshot.motherName || student?.motherName || '',
        dob: snapshot.dob || student?.dob || '',
        gender: snapshot.gender || student?.gender || 'Male',
        alternatePhone: snapshot.alternatePhone || student?.alternatePhone || '',
        address: snapshot.address || student?.address || {},
      },
      education: normalizedEdu || {
        tenth: {},
        hasTwelfth: true,
        twelfth: {},
      },
      documents: normalizedDocs || {},
      documentReview: {
        status: status === 'under_review' ? 'under_review' : 'pending',
        reviewedBy: '',
        reviewedAt: null,
        notes: '',
        correctionNotes: '',
        history: status === 'under_review' ? [{
          action: 'submitted',
          performedBy: snapshot.fullName || student?.fullName || 'Student Applicant',
          timestamp: new Date(),
          notes: 'Application submitted for document review.',
        }] : [],
      },
      payment: {
        registrationFee: 500,
        status: 'pending',
      },
      isLocked: status === 'under_review',
      submittedAt: status === 'under_review' ? new Date() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let savedApp = newApp;
    if (isDbConnected) {
      try {
        savedApp = await Application.create(newApp);
      } catch {
        // Fallback
      }
    }

    memoryApplications.set(applicationId, savedApp);

    return res.status(201).json({
      success: true,
      message: 'Course application created.',
      application: savedApp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create application.',
    });
  }
}

/**
 * PUT /api/applications/:id
 * Update application data.
 * - ENFORCES SERVER-SIDE OWNERSHIP (Requirement 10).
 * - ENFORCES STRICT APPLICATION LOCKING (Payment verification locks edits).
 */
export async function updateApplication(req, res) {
  try {
    const { id } = req.params;
    const { studentId } = req.student;
    let app = null;

    if (isDbConnected) {
      try {
        app = await Application.findOne({
          $or: [
            { applicationId: id },
            { studentId: id },
            { studentId },
            { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
          ],
        }).sort({ updatedAt: -1 });
      } catch {
        // Fallback
      }
    }

    if (!app) {
      app = memoryApplications.get(id);
      if (!app) {
        for (const a of memoryApplications.values()) {
          if (a.applicationId === id || a.studentId === id || a.studentId === studentId) {
            app = a;
            break;
          }
        }
      }
    }

    const updates = { ...req.body };
    delete updates.payment;
    delete updates.isLocked;
    delete updates.studentId;
    delete updates.applicationId;

    if (updates.personal && !updates.personalSnapshot) {
      updates.personalSnapshot = { ...updates.personal };
      delete updates.personal;
    }

    // Validate documents if present in updates
    if (updates.documents || updates.education) {
      const docFields = [
        { doc: updates.documents?.photo, name: 'Passport Photograph' },
        { doc: updates.documents?.signature, name: 'Specimen Signature' },
        { doc: updates.documents?.idProof, name: 'Identity Proof' },
        { doc: updates.education?.tenth?.marksheet, name: '10th Marksheet' },
        { doc: updates.education?.twelfth?.marksheet, name: '12th Marksheet' },
      ];
      for (const f of docFields) {
        const v = validateDocumentFile(f.doc, f.name);
        if (!v.valid) {
          return res.status(400).json({ success: false, error: v.error });
        }
      }
      const { normalizedDocs, normalizedEdu } = normalizeDocuments(
        updates.documents || app?.documents,
        updates.education || app?.education
      );
      if (updates.documents) updates.documents = normalizedDocs;
      if (updates.education) updates.education = normalizedEdu;
    }

    // If application does not exist yet for this student, initialize and save
    if (!app) {
      const applicationId = generateApplicationId();
      let student = null;
      if (isDbConnected) {
        try {
          student = await Student.findOne({ studentId });
        } catch {}
      }

      const snapshot = updates.personalSnapshot || {};
      const isSubmitting = updates.status === 'under_review' || updates.isSubmitForReview;
      const historyEntry = isSubmitting ? [{
        action: 'submitted',
        performedBy: snapshot.fullName || student?.fullName || 'Student Applicant',
        timestamp: new Date(),
        notes: 'Application submitted for document review.',
      }] : [];

      const newApp = {
        applicationId,
        studentId,
        status: isSubmitting ? 'under_review' : (updates.status || 'draft'),
        currentStep: updates.currentStep || 4,
        course: updates.course || {},
        personalSnapshot: {
          fullName: snapshot.fullName || student?.fullName || '',
          phone: snapshot.phone || student?.phone || '',
          email: snapshot.email || student?.email || '',
          dob: snapshot.dob || student?.dob || '',
          gender: snapshot.gender || student?.gender || 'Male',
          fatherName: snapshot.fatherName || student?.fatherName || '',
          motherName: snapshot.motherName || student?.motherName || '',
          alternatePhone: snapshot.alternatePhone || student?.alternatePhone || '',
          address: snapshot.address || student?.address || {},
        },
        education: updates.education || { tenth: {}, twelfth: {} },
        documents: updates.documents || {},
        documentReview: {
          status: isSubmitting ? 'under_review' : 'pending',
          history: historyEntry,
        },
        payment: { registrationFee: 500, status: 'pending' },
        isLocked: isSubmitting,
        submittedAt: isSubmitting ? new Date() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isDbConnected) {
        try {
          await Application.create(newApp);
        } catch {}
      }
      memoryApplications.set(applicationId, newApp);

      return res.status(200).json({
        success: true,
        message: 'Application created and updated successfully.',
        application: newApp,
      });
    }

    // SERVER-SIDE OWNERSHIP CHECK: Student can only modify their own application
    if (app.studentId !== studentId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to modify another student\'s application.',
      });
    }

    // Verify locking guard:
    const isCorrectionMode =
      app.status === 'corrections_required' ||
      app.documentReview?.status === 'corrections_required';

    if (!isCorrectionMode) {
      if (app.status === 'under_review' && !req.body.isSubmitForReview) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Application is currently under review by admissions staff.',
        });
      }
      if (
        app.isLocked ||
        app.status === 'admitted' ||
        app.finalAdmission?.status === 'admitted' ||
        app.payment?.status === 'verified' ||
        app.payment?.status === 'paid'
      ) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: This admission application is permanently locked against further edits.',
        });
      }
    }

    let historyEntry = null;
    if (updates.status === 'under_review' || updates.isSubmitForReview) {
      const isResubmit = isCorrectionMode;
      updates.status = 'under_review';
      updates.submittedAt = new Date();
      updates['documentReview.status'] = 'under_review';
      updates['documentReview.correctionNotes'] = '';
      delete updates.isSubmitForReview;

      historyEntry = {
        action: isResubmit ? 'resubmitted' : 'submitted',
        performedBy: updates.personalSnapshot?.fullName || req.student?.fullName || 'Student Applicant',
        timestamp: new Date(),
        notes: isResubmit
          ? 'Corrections resubmitted for document re-review.'
          : 'Application submitted for document review.',
      };
    }

    let updated = null;
    if (isDbConnected) {
      try {
        const mongoUpdate = { $set: updates };
        if (historyEntry) {
          mongoUpdate.$push = { 'documentReview.history': historyEntry };
        }
        updated = await Application.findOneAndUpdate(
          { $or: [{ applicationId: app.applicationId || id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
          mongoUpdate,
          { new: true }
        );
      } catch {
        // Fallback
      }
    }

    if (!updated) {
      updated = {
        ...(app || {}),
        ...updates,
        documentReview: {
          ...(app.documentReview || {}),
          ...(updates['documentReview.status'] ? { status: updates['documentReview.status'] } : {}),
          history: [
            ...(app.documentReview?.history || []),
            ...(historyEntry ? [historyEntry] : []),
          ],
        },
        updatedAt: new Date().toISOString(),
      };
    }

    memoryApplications.set(app.applicationId || id, updated);

    return res.status(200).json({
      success: true,
      message: 'Application updated successfully.',
      application: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update application.',
    });
  }
}
