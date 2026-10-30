import mongoose from 'mongoose';

/**
 * STUDENT MODEL (Permanent Reusable Profile)
 * ---------------------------------------------------------------------------
 * Contains ONLY basic identity and contact/address fields.
 * Educational qualifications, marks, and document uploads belong strictly
 * to individual course applications (Application model), NEVER here.
 * Authentication is passwordless (Student Reference ID / Mobile).
 */
const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      match: /^HKCL-\d{4}-\d{6}$/,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: 2,
    },
    phone: {
      type: String,
      required: [true, '10-digit mobile number is required'],
      unique: true,
      trim: true,
      match: /^[6-9]\d{9}$/,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
      index: true,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    fatherName: {
      type: String,
      trim: true,
      default: '',
    },
    motherName: {
      type: String,
      trim: true,
      default: '',
    },
    dob: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    address: {
      house: { type: String, default: '' },
      locality: { type: String, default: '' },
      city: { type: String, default: 'Sirsa' },
      district: { type: String, default: 'Sirsa' },
      state: { type: String, default: 'Haryana' },
      pincode: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Normalize email before saving
studentSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.trim().toLowerCase();
  }
  next();
});

// Explicit unique index for normalized email (phone and studentId defined in schema)
studentSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $exists: true, $type: 'string', $gt: '' },
    },
  }
);

// Compound index for fast lookup
studentSchema.index({ phone: 1, studentId: 1 });

export default mongoose.models.Student || mongoose.model('Student', studentSchema);
