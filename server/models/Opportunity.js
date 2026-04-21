const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  requiredSkills: {
    type: [String],
    default: []
  },
  stipend: {
    type: String,
    default: 'Unpaid'
  },
  duration: {
    type: String,
    default: ''
  },
  deadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'filled'],
    default: 'open'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
