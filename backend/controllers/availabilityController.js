const Staff = require('../models/Staff');
const Appointment = require('../models/Appointment');

exports.getAvailability = async (req, res) => {
  try {
    const { staffId, date, serviceId } = req.query;
    if (!staffId || !date) {
      return res.status(400).json({ success: false, message: 'Staff ID and date are required' });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

    const appointmentDate = new Date(date);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[appointmentDate.getDay()];
    const dayHours = staff.workingHours[dayName];

    if (!dayHours || dayHours.isOff) {
      return res.json({ success: true, slots: [], message: 'Staff is not working on this day' });
    }

    const isOnLeave = staff.leave.some(leave =>
      leave.status === 'approved' &&
      appointmentDate >= new Date(leave.startDate) &&
      appointmentDate <= new Date(leave.endDate)
    );
    if (isOnLeave) {
      return res.json({ success: true, slots: [], message: 'Staff is on leave' });
    }

    let serviceDuration = 60;
    if (serviceId) {
      const Service = require('../models/Service');
      const service = await Service.findById(serviceId);
      if (service) serviceDuration = service.duration;
    }

    const existingAppointments = await Appointment.find({
      staff: staffId,
      date: { $gte: new Date(date + 'T00:00:00'), $lt: new Date(date + 'T23:59:59') },
      status: { $in: ['pending', 'confirmed', 'in_progress'] }
    }).select('startTime endTime');

    const slots = generateTimeSlots(dayHours.start, dayHours.end, serviceDuration, existingAppointments);
    res.json({ success: true, slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function generateTimeSlots(openTime, closeTime, serviceDuration, existingAppointments) {
  const slots = [];
  const [openH, openM] = openTime.split(':').map(Number);
  const [closeH, closeM] = closeTime.split(':').map(Number);
  let currentMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  while (currentMinutes + serviceDuration <= closeMinutes) {
    const startH = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
    const startM = (currentMinutes % 60).toString().padStart(2, '0');
    const endMinutes = currentMinutes + serviceDuration;
    const endH = Math.floor(endMinutes / 60).toString().padStart(2, '0');
    const endM = (endMinutes % 60).toString().padStart(2, '0');
    const startTime = `${startH}:${startM}`;
    const endTime = `${endH}:${endM}`;

    const isBooked = existingAppointments.some(apt => {
      const aptStart = timeToMinutes(apt.startTime);
      const aptEnd = timeToMinutes(apt.endTime);
      return currentMinutes < aptEnd && (currentMinutes + serviceDuration) > aptStart;
    });

    slots.push({ startTime, endTime, available: !isBooked });
    currentMinutes += 30;
  }

  return slots;
}

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
