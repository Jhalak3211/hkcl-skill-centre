import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Staff member name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    designation: {
      type: String,
      default: 'Admissions Officer',
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'staff'],
      default: 'staff',
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'deactivated'],
      default: 'pending',
      index: true,
    },
    password: {
      type: String,
      default: null, // Null while invitation is pending
    },
    invitationToken: {
      type: String,
      default: null,
      index: true,
    },
    invitationExpires: {
      type: Date,
      default: null,
    },
    permissions: {
      canReviewDocuments: { type: Boolean, default: true },
      canVerifyPayments: { type: Boolean, default: true },
      canProcessAdmissions: { type: Boolean, default: true },
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    invitedBy: {
      type: String,
      default: 'System Administrator',
    },
    invitedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password
staffSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Staff || mongoose.model('Staff', staffSchema);
