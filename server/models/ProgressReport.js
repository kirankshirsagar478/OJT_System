const mongoose = require('mongoose');

const progressReportSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required']
    },
    type: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: [true, 'Report type is required']
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, 'Date is required']
    },
    tasks: {
      type: String,
      required: [true, 'Tasks completed field is required'],
      trim: true,
      maxlength: 2000
    },
    learning: {
      type: String,
      required: [true, 'Learnings field is required'],
      trim: true,
      maxlength: 2000
    },
    hoursWorked: {
      type: Number,
      required: [true, 'Hours worked is required'],
      min: [0, 'Hours worked cannot be negative'],
      max: [24, 'Hours worked cannot exceed 24']
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProgressReport', progressReportSchema);
