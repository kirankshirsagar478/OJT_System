const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  enrollmentNo: {
    type: String,
    trim: true,
    default: ''
  },
  department: {
    type: String,
    trim: true,
    default: ''
  },
  year: {
    type: String,
    trim: true,
    default: ''
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  skills: {
    type: [String],
    default: []
  },
  resumeLink: {
    type: String,
    default: ''
  },
  ojtStatus: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
