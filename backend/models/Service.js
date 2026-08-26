const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  duration: {
    type: Number,
    required: [true, 'Duration in minutes is required'],
    min: 15,
    max: 480
  },
  image: String,
  isActive: { type: Boolean, default: true },
  staff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
