import mongoose from 'mongoose';

/**
 * COURSE APPLICATION MODEL
 * ---------------------------------------------------------------------------
 * Educational qualifications, marks, and uploaded documents belong strictly
 * to this model, NEVER to the reusable student profile.
 * Once payment is verified (`status: 'paid'` / `'approved'`), this record is locked permanently.
 */
const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    studentId: {
      type: String,
      required: true,
      ref: 'Student',
      index: true,
    },
    status: {
      type: String,
      enum: [
        'draft',
        'under_review',
        'corrections_required',
        'documents_approved',
        'payment_pending',
        'payment_submitted',
        'payment_verified',
        'admitted',
        'rejected',
        'submitted',
        'approved',
      ],
      default: 'draft',
      index: true,
    },
    documentReview: {
      status: {
        type: String,
        enum: ['pending', 'under_review', 'corrections_required', 'approved', 'rejected'],
        default: 'pending',
        index: true,
      },
      reviewedBy: { type: String, default: '' },
      reviewedAt: { type: Date, default: null },
      notes: { type: String, default: '' },
      correctionNotes: { type: String, default: '' },
      rejectionReason: { type: String, default: '' },
      history: [
        {
          action: { type: String, required: true },
          performedBy: { type: String, default: 'Admissions Staff' },
          timestamp: { type: Date, default: Date.now },
          notes: { type: String, default: '' },
        },
      ],
    },
    finalAdmission: {
      status: {
        type: String,
        enum: ['pending', 'admitted', 'rejected'],
        default: 'pending',
        index: true,
      },
      decisionBy: { type: String, default: '' },
      decisionAt: { type: Date, default: null },
      notes: { type: String, default: '' },
      rejectionReason: { type: String, default: '' },
      enrollmentNo: { type: String, default: '' },
      admittedBatch: { type: String, default: '' },
    },
    currentStep: {
      type: Number,
      default: 1,
      min: 1,
      max: 6,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    course: {
      slug: { type: String, default: '' },
      name: { type: String, default: '' },
      batch: { type: String, default: '' },
      duration: { type: String, default: '' },
      fee: { type: Number, default: null },
    },
    personalSnapshot: {
      fullName: { type: String, default: '' },
      dob: { type: String, default: '' },
      gender: { type: String, default: 'Male' },
      fatherName: { type: String, default: '' },
      motherName: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      alternatePhone: { type: String, default: '' },
      address: {
        house: { type: String, default: '' },
        locality: { type: String, default: '' },
        city: { type: String, default: 'Sirsa' },
        district: { type: String, default: 'Sirsa' },
        state: { type: String, default: 'Haryana' },
        pincode: { type: String, default: '' },
      },
    },
    education: {
      tenth: {
        board: { type: String, default: '' },
        school: { type: String, default: '' },
        passingYear: { type: String, default: '' },
        rollNo: { type: String, default: '' },
        marksObtained: { type: String, default: '' },
        maxMarks: { type: String, default: '500' },
        percentage: { type: String, default: '' },
        marksheetUrl: { type: String, default: null },
      },
      hasTwelfth: { type: Boolean, default: true },
      twelfth: {
        board: { type: String, default: '' },
        stream: { type: String, default: 'Science' },
        school: { type: String, default: '' },
        passingYear: { type: String, default: '' },
        rollNo: { type: String, default: '' },
        marksObtained: { type: String, default: '' },
        maxMarks: { type: String, default: '500' },
        percentage: { type: String, default: '' },
        marksheetUrl: { type: String, default: null },
      },
      higherEducation: { type: String, default: '' },
    },
    documents: {
      photoUrl: { type: String, default: null },
      signatureUrl: { type: String, default: null },
      idProofUrl: { type: String, default: null },
      photo: {
        name: { type: String, default: '' },
        size: { type: Number, default: 0 },
        type: { type: String, default: '' },
        dataUrl: { type: String, default: '' },
      },
      signature: {
        name: { type: String, default: '' },
        size: { type: Number, default: 0 },
        type: { type: String, default: '' },
        dataUrl: { type: String, default: '' },
      },
      idProof: {
        name: { type: String, default: '' },
        size: { type: Number, default: 0 },
        type: { type: String, default: '' },
        dataUrl: { type: String, default: '' },
      },
    },
    payment: {
      registrationFee: {
        type: Number,
        default: 500, // Fixed registration fee ₹500
        immutable: true,
      },
      currency: {
        type: String,
        default: 'INR',
      },
      status: {
        type: String,
        enum: ['pending', 'submitted', 'verified', 'rejected', 'unpaid', 'paid', 'failed'],
        default: 'pending',
        index: true,
      },
      method: {
        type: String,
        default: 'Manual UPI QR',
      },
      // Manual UPI reference fields
      utr: {
        type: String,
        default: '',
        trim: true,
      },
      payerUpiId: {
        type: String,
        default: '',
        trim: true,
      },
      paymentDate: {
        type: String,
        default: '',
        trim: true,
      },
      screenshotUrl: {
        type: String,
        default: '',
      },
      submittedAt: {
        type: Date,
        default: null,
      },
      // Staff verification metadata
      verifiedBy: {
        type: String,
        default: '',
      },
      verifiedAt: {
        type: Date,
        default: null,
      },
      verifierNotes: {
        type: String,
        default: '',
      },
      rejectionReason: {
        type: String,
        default: '',
      },
      rejectedAt: {
        type: Date,
        default: null,
      },
      rejectedBy: {
        type: String,
        default: '',
      },
      receiptNo: {
        type: String,
        default: '',
      },
      // Legacy / gateway fields
      orderId: { type: String, default: '' },
      transactionId: { type: String, default: '' },
      paidAt: { type: Date, default: null },
    },
    declarationAccepted: {
      type: Boolean,
      default: false,
    },
    assignedStaff: {
      staffId: { type: String, default: '' },
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      assignedAt: { type: Date, default: null },
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Partial unique index to prevent duplicate UTR submissions across active/verified applications
applicationSchema.index(
  { 'payment.utr': 1 },
  {
    unique: true,
    partialFilterExpression: {
      'payment.utr': { $type: 'string', $gt: '' },
      'payment.status': { $in: ['submitted', 'verified'] },
    },
    background: true,
  }
);

// Method to verify if application is locked against student edits
applicationSchema.methods.checkIsLocked = function () {
  // If corrections are requested, student is expressly unlocked to correct details/docs
  if (
    this.status === 'corrections_required' ||
    this.documentReview?.status === 'corrections_required'
  ) {
    return false;
  }
  return (
    this.isLocked ||
    this.status === 'under_review' ||
    this.status === 'admitted' ||
    this.finalAdmission?.status === 'admitted' ||
    this.payment?.status === 'verified' ||
    this.payment?.status === 'paid' ||
    this.status === 'approved'
  );
};

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
