const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  title: {
    type: String,
    trim: true,
    default: 'Stylist'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  avatar: String,
  specialties: [String],
  experience: {
    type: Number,
    default: 0
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  workingHours: {
    monday: { start: String, end: String, isOff: { type: Boolean, default: false } },
    tuesday: { start: String, end: String, isOff: { type: Boolean, default: false } },
    wednesday: { start: String, end: String, isOff: { type: Boolean, default: false } },
    thursday: { start: String, end: String, isOff: { type: Boolean, default: false } },
    friday: { start: String, end: String, isOff: { type: Boolean, default: false } },
    saturday: { start: String, end: String, isOff: { type: Boolean, default: false } },
    sunday: { start: String, end: String, isOff: { type: Boolean, default: true } }
  },
  leave: [{
    startDate: Date,
    endDate: Date,
    reason: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
