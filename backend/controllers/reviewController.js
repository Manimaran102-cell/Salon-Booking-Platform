const Review = require('../models/Review');
const Salon = require('../models/Salon');
const Staff = require('../models/Staff');
const Appointment = require('../models/Appointment');

exports.getReviews = async (req, res) => {
  try {
    const { salon, staff: staffId, page = 1, limit = 20 } = req.query;
    const query = { isVisible: true };
    if (salon) query.salon = salon;
    if (staffId) query.staff = staffId;

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('customer', 'name avatar')
      .populate('salon', 'name')
      .populate({ path: 'staff', populate: { path: 'user', select: 'name' } });

    res.json({ success: true, reviews, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { salon, appointment: appointmentId, staff: staffId, rating, comment } = req.body;

    const existingReview = await Review.findOne({ customer: req.user.id, appointment: appointmentId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You already reviewed this appointment' });
    }

    const review = await Review.create({
      customer: req.user.id,
      salon,
      appointment: appointmentId,
      staff: staffId,
      rating,
      comment
    });

    await updateSalonRating(salon);
    if (staffId) await updateStaffRating(staffId);

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.replyToReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    review.reply = req.body.reply;
    review.replyDate = new Date();
    await review.save();

    res.json({ success: true, review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    review.isVisible = false;
    await review.save();
    res.json({ success: true, message: 'Review hidden' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

async function updateSalonRating(salonId) {
  const result = await Review.aggregate([
    { $match: { salon: salonId, isVisible: true } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (result.length > 0) {
    await Salon.findByIdAndUpdate(salonId, { rating: Math.round(result[0].avgRating * 10) / 10, totalReviews: result[0].count });
  }
}

async function updateStaffRating(staffId) {
  const result = await Review.aggregate([
    { $match: { staff: staffId, isVisible: true } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (result.length > 0) {
    await Staff.findByIdAndUpdate(staffId, { rating: Math.round(result[0].avgRating * 10) / 10, totalReviews: result[0].count });
  }
}
