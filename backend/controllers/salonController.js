const Salon = require('../models/Salon');
const Staff = require('../models/Staff');
const Service = require('../models/Service');
const Review = require('../models/Review');

exports.getSalons = async (req, res) => {
  try {
    const { search, category, city, page = 1, limit = 12, sort = '-createdAt', minRating, isFeatured } = req.query;
    const query = { isActive: true };
    if (search) query.$text = { $search: search };
    if (category) query.categories = { $in: Array.isArray(category) ? category : [category] };
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    if (isFeatured === 'true') query.isFeatured = true;

    const total = await Salon.countDocuments(query);
    const salons = await Salon.find(query).sort(sort).skip((page - 1) * limit).limit(parseInt(limit)).populate('owner', 'name email');

    res.json({ success: true, salons, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSalon = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id).populate('owner', 'name email');
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });

    const staff = await Staff.find({ salon: salon._id, isActive: true }).populate('user', 'name avatar');
    const services = await Service.find({ salon: salon._id, isActive: true });
    const reviews = await Review.find({ salon: salon._id, isVisible: true }).populate('customer', 'name avatar').sort('-createdAt').limit(5);

    res.json({ success: true, salon: { ...salon.toObject(), staffList: staff, serviceList: services, recentReviews: reviews } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSalonBySlug = async (req, res) => {
  try {
    const salon = await Salon.findOne({ slug: req.params.slug }).populate('owner', 'name email');
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });
    const staff = await Staff.find({ salon: salon._id, isActive: true }).populate('user', 'name avatar');
    const services = await Service.find({ salon: salon._id, isActive: true });
    res.json({ success: true, salon: { ...salon.toObject(), staffList: staff, serviceList: services } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSalon = async (req, res) => {
  try {
    req.body.owner = req.user.id;
    const salon = await Salon.create(req.body);
    res.status(201).json({ success: true, salon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateSalon = async (req, res) => {
  try {
    let salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });
    if (salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    salon = await Salon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, salon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteSalon = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });
    if (salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await Salon.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Salon deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMySalon = async (req, res) => {
  try {
    const salon = await Salon.findOne({ owner: req.user.id });
    if (!salon) return res.status(404).json({ success: false, message: 'No salon found for this owner' });
    res.json({ success: true, salon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
