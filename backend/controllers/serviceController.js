const Service = require('../models/Service');
const Salon = require('../models/Salon');

exports.getServices = async (req, res) => {
  try {
    const { salon, category, page = 1, limit = 50 } = req.query;
    const query = { isActive: true };
    if (salon) query.salon = salon;
    if (category) query.category = category;

    const total = await Service.countDocuments(query);
    const services = await Service.find(query).sort('name').skip((page - 1) * limit).limit(parseInt(limit)).populate('salon', 'name');
    res.json({ success: true, services, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('salon', 'name address').populate('staff', 'user title');
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const salon = await Salon.findOne({ owner: req.user.id });
    if (!salon) return res.status(404).json({ success: false, message: 'No salon found' });
    req.body.salon = salon._id;
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    const salon = await Salon.findById(service.salon);
    if (salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    const salon = await Salon.findById(service.salon);
    if (salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await Service.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Service deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Service.distinct('category', { isActive: true });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
