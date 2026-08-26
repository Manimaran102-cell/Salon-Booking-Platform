const Appointment = require('../models/Appointment');
const Staff = require('../models/Staff');
const Service = require('../models/Service');
const Salon = require('../models/Salon');

exports.createAppointment = async (req, res) => {
  try {
    const { salon, staff, services, date, startTime, endTime, notes } = req.body;

    const staffMember = await Staff.findById(staff);
    if (!staffMember) return res.status(404).json({ success: false, message: 'Staff not found' });

    const existingConflict = await Appointment.findOne({
      staff,
      date: new Date(date),
      status: { $in: ['pending', 'confirmed', 'in_progress'] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });
    if (existingConflict) {
      return res.status(409).json({ success: false, message: 'Time slot is already booked' });
    }

    let totalPrice = 0;
    let totalDuration = 0;
    const serviceDetails = [];

    for (const s of services) {
      const service = await Service.findById(s.service || s);
      if (service) {
        totalPrice += service.price;
        totalDuration += service.duration;
        serviceDetails.push({ service: service._id, price: service.price, duration: service.duration });
      }
    }

    const appointment = await Appointment.create({
      customer: req.user.id,
      salon,
      staff,
      services: serviceDetails,
      date: new Date(date),
      startTime,
      endTime,
      totalPrice,
      totalDuration,
      notes
    });

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, salon: salonId, staff: staffId, from, to } = req.query;
    const query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'staff') {
      const staffMember = await Staff.findOne({ user: req.user.id });
      if (staffMember) query.staff = staffMember._id;
    } else if (req.user.role === 'salon_owner') {
      const ownedSalon = await Salon.findOne({ owner: req.user.id });
      if (ownedSalon) query.salon = ownedSalon._id;
    }

    if (salonId && ['admin', 'salon_owner'].includes(req.user.role)) query.salon = salonId;
    if (staffId) query.staff = staffId;
    if (status) query.status = status;
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .sort('date startTime')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('customer', 'name email phone')
      .populate('staff', 'user title')
      .populate({ path: 'staff', populate: { path: 'user', select: 'name avatar' } })
      .populate('salon', 'name address')
      .populate('services.service', 'name price duration');

    res.json({ success: true, appointments, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate({ path: 'staff', populate: { path: 'user', select: 'name avatar' } })
      .populate('salon', 'name address phone')
      .populate('services.service', 'name price duration');
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    appointment.status = status;
    await appointment.save();
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Appointment already cancelled' });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = req.body.reason;
    appointment.cancelledBy = req.user.role === 'customer' ? 'customer' : req.user.role === 'admin' ? 'admin' : 'salon';
    await appointment.save();

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
