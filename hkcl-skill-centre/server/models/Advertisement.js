import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Advertisement title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Advertisement image URL or data is required'],
    },
    ctaText: {
      type: String,
      default: 'Learn More',
      trim: true,
    },
    ctaUrl: {
      type: String,
      default: '/courses',
      trim: true,
    },
    badge: {
      type: String,
      default: 'Featured Announcement',
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'expired'],
      default: 'published',
      index: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      default: 'Administrator',
    },
  },
  {
    timestamps: true,
  }
);

advertisementSchema.index({ status: 1, displayOrder: 1, startDate: 1, endDate: 1 });

export default mongoose.models.Advertisement || mongoose.model('Advertisement', advertisementSchema);
