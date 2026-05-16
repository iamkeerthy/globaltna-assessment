const mongoose = require('mongoose');

// The technical structure required by the evaluation brief
const JobRequestSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Plumbing', 'Electrical', 'Painting', 'Joinery'] // Only allows these options
  },
  location: { 
    type: String, 
    required: true 
  },
  contactName: { 
    type: String, 
    required: true 
  },
  contactEmail: { 
    type: String, 
    required: true,
    // Regular expression to validate standard email string layouts
    match: [/^\s*[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}\s*$/, 'Please fill a valid email address']
  },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Closed'], 
    default: 'Open' // Defaults to "Open" automatically
  }
}, { 
  timestamps: true // This auto-manages "createdAt" and "updatedAt" tracking fields
});

module.exports = mongoose.model('JobRequest', JobRequestSchema);