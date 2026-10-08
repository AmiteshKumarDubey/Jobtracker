const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['Applied', 'Interview', 'Offer', 'Rejected'],
        message: 'Status must be one of: Applied, Interview, Offer, Rejected',
      },
      default: 'Applied',
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    jobLink: {
      type: String,
      trim: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    followUpDate: {
      type: Date,
    },
    interviewDate: {
      type: Date,
    },
    interviewNotes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Interview notes cannot exceed 2000 characters'],
    },
    interviewOutcome: {
      type: String,
      enum: ['Pending', 'Passed', 'Failed'],
      default: 'Pending',
    },
    preparationChecklist: {
      type: [
        {
          text: { type: String },
          done: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Index for faster user-based queries and search
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, company: 'text', role: 'text' });

module.exports = mongoose.model('Application', applicationSchema);
