const User = require('../models/User');
const Salon = require('../models/Salon');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalCustomers, totalSalons, totalStaff, totalServices, totalAppointments, totalReviews] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Salon.countDocuments({ isActive: true }),
      Staff.countDocuments({ isActive: true }),
      Service.countDocuments({ isActive: true }),
      Appointment.countDocuments(),
      Review.countDocuments()
    ]);

    const recentAppointments = await Appointment.find().sort('-createdAt').limit(10)
      .populate('customer', 'name email')
      .populate('salon', 'name')
      .populate({ path: 'staff', populate: { path: 'user', select: 'name' } });

    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const revenue = await Appointment.aggregate([
      { $match: { status: { $in: ['completed', 'confirmed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalCustomers,
        totalSalons,
        totalStaff,
        totalServices,
        totalAppointments,
        totalReviews,
        totalRevenue: revenue.length > 0 ? revenue[0].total : 0,
        appointmentsByStatus: appointmentsByStatus.reduce((acc, item) => { acc[item._id] = item.count; return acc; }, {}),
        recentAppointments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];

    const total = await User.countDocuments(query);
    const users = await User.find(query).sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit));
    res.json({ success: true, users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllSalons = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) query.name = new RegExp(search, 'i');

    const total = await Salon.countDocuments(query);
    const salons = await Salon.find(query).sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit)).populate('owner', 'name email');
    res.json({ success: true, salons, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleSalonActive = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });
    salon.isActive = !salon.isActive;
    await salon.save();
    res.json({ success: true, salon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleSalonFeatured = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });
    salon.isFeatured = !salon.isFeatured;
    await salon.save();
    res.json({ success: true, salon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, from, to } = req.query;
    const query = {};
    if (status) query.status = status;
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query).sort('-date').skip((page - 1) * limit).limit(parseInt(limit))
      .populate('customer', 'name email')
      .populate('salon', 'name')
      .populate({ path: 'staff', populate: { path: 'user', select: 'name' } })
      .populate('services.service', 'name');

    res.json({ success: true, appointments, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await Review.countDocuments();
    const reviews = await Review.find().sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit))
      .populate('customer', 'name email')
      .populate('salon', 'name');
    res.json({ success: true, reviews, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
