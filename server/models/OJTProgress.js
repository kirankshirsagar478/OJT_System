const mongoose = require('mongoose');

const ojtProgressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  mentor: {
    type: String,
    default: ''
  },
  attendance: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  performanceStatus: {
    type: String,
    enum: ['excellent', 'good', 'average', 'poor', 'pending'],
    default: 'pending'
  },
  certificate: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OJTProgress', ojtProgressSchema);
