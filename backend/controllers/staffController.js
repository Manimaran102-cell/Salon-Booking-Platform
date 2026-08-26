const Staff = require('../models/Staff');
const User = require('../models/User');
const Salon = require('../models/Salon');

exports.getStaff = async (req, res) => {
  try {
    const { salon } = req.query;
    const query = { isActive: true };
    if (salon) query.salon = salon;
    const staff = await Staff.find(query).populate('user', 'name email phone avatar').populate('salon', 'name');
    res.json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStaffMember = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('user', 'name email phone avatar').populate('salon', 'name');
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const salon = await Salon.findOne({ owner: req.user.id });
    if (!salon) return res.status(404).json({ success: false, message: 'No salon found' });

    const { email, name, password, title, bio, specialties, experience, workingHours } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: password || 'staff123', phone: req.body.phone, role: 'staff' });
    }

    const staff = await Staff.create({
      user: user._id,
      salon: salon._id,
      title: title || 'Stylist',
      bio,
      specialties,
      experience,
      workingHours
    });

    await User.findByIdAndUpdate(user._id, { salon: salon._id });
    res.status(201).json({ success: true, staff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    let staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    const salon = await Salon.findById(staff.salon);
    if (salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, staff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    let staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    const salon = await Salon.findById(staff.salon);
    if (salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await Staff.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Staff deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWorkingHours = async (req, res) => {
  try {
    let staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    staff = await Staff.findByIdAndUpdate(req.params.id, { workingHours: req.body.workingHours }, { new: true });
    res.json({ success: true, staff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.requestLeave = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    staff.leave.push({ startDate: req.body.startDate, endDate: req.body.endDate, reason: req.body.reason });
    await staff.save();
    res.json({ success: true, staff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.manageLeave = async (req, res) => {
  try {
    const { staffId, leaveId } = req.params;
    const { status } = req.body;
    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    const leaveRecord = staff.leave.id(leaveId);
    if (!leaveRecord) return res.status(404).json({ success: false, message: 'Leave record not found' });
    leaveRecord.status = status;
    await staff.save();
    res.json({ success: true, staff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
