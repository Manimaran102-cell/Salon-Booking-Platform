const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  services: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    price: Number,
    duration: Number
  }],
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  totalDuration: {
    type: Number,
    required: true
  },
  notes: String,
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['customer', 'salon', 'admin']
  }
}, { timestamps: true });

appointmentSchema.index({ salon: 1, date: 1, staff: 1, startTime: 1 });
appointmentSchema.index({ customer: 1, date: 1 });
appointmentSchema.index({ staff: 1, date: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
