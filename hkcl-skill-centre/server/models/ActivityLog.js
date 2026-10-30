import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['staff', 'application', 'payment', 'admission', 'advertisement', 'auth', 'system'],
      default: 'system',
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    performedBy: {
      id: { type: String, default: '' },
      name: { type: String, default: 'System' },
      email: { type: String, default: '' },
      role: { type: String, default: 'staff' },
    },
    targetId: {
      type: String,
      default: '',
      index: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ createdAt: -1 });

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
