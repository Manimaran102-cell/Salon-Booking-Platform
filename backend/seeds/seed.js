const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Salon = require('../models/Salon');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000, tls: true });
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Salon.deleteMany({});
    await Service.deleteMany({});
    await Staff.deleteMany({});
    await Appointment.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    const admin = await User.create({ name: 'Admin User', email: 'admin@glowup.com', password: 'admin123', role: 'admin', phone: '555-000-0001' });
    const customer1 = await User.create({ name: 'Sarah Johnson', email: 'sarah@demo.com', password: 'demo123', role: 'customer', phone: '555-100-0001' });
    const customer2 = await User.create({ name: 'Mike Chen', email: 'mike@demo.com', password: 'demo123', role: 'customer', phone: '555-100-0002' });
    const customer3 = await User.create({ name: 'Emily Davis', email: 'emily@demo.com', password: 'demo123', role: 'customer', phone: '555-100-0003' });
    const owner1 = await User.create({ name: 'Jessica Park', email: 'jessica@demo.com', password: 'demo123', role: 'salon_owner', phone: '555-200-0001' });
    const owner2 = await User.create({ name: 'David Kim', email: 'david@demo.com', password: 'demo123', role: 'salon_owner', phone: '555-200-0002' });

    const salon1 = await Salon.create({
      name: 'GlowUp Beauty Studio',
      description: 'A premium beauty destination offering world-class hair styling, skincare, and nail services. Our team of expert stylists brings creativity and precision to every appointment.',
      owner: owner1._id,
      address: { street: '123 Beauty Lane', city: 'New York', state: 'NY', zipCode: '10001' },
      phone: '212-555-0101',
      email: 'info@glowupstudio.com',
      categories: ['Hair', 'Skincare', 'Nails', 'Makeup'],
      rating: 4.8,
      totalReviews: 124,
      isFeatured: true,
      openingHours: {
        monday: { open: '09:00', close: '19:00', isClosed: false },
        tuesday: { open: '09:00', close: '19:00', isClosed: false },
        wednesday: { open: '09:00', close: '19:00', isClosed: false },
        thursday: { open: '09:00', close: '20:00', isClosed: false },
        friday: { open: '09:00', close: '20:00', isClosed: false },
        saturday: { open: '10:00', close: '18:00', isClosed: false },
        sunday: { open: '10:00', close: '16:00', isClosed: false }
      }
    });

    const salon2 = await Salon.create({
      name: 'Luxe Hair Lounge',
      description: 'Where style meets sophistication. Specializing in cutting-edge hair transformations, color artistry, and luxury treatments.',
      owner: owner2._id,
      address: { street: '456 Fashion Ave', city: 'New York', state: 'NY', zipCode: '10002' },
      phone: '212-555-0202',
      email: 'hello@luxehairlounge.com',
      categories: ['Hair', 'Color', 'Treatments'],
      rating: 4.6,
      totalReviews: 89,
      isFeatured: true,
      openingHours: {
        monday: { open: '10:00', close: '20:00', isClosed: false },
        tuesday: { open: '10:00', close: '20:00', isClosed: false },
        wednesday: { open: '10:00', close: '20:00', isClosed: false },
        thursday: { open: '10:00', close: '21:00', isClosed: false },
        friday: { open: '10:00', close: '21:00', isClosed: false },
        saturday: { open: '09:00', close: '19:00', isClosed: false },
        sunday: { open: '00:00', close: '00:00', isClosed: true }
      }
    });

    await User.findByIdAndUpdate(owner1._id, { salon: salon1._id });
    await User.findByIdAndUpdate(owner2._id, { salon: salon2._id });

    const staffUser1 = await User.create({ name: 'Anna Smith', email: 'anna@demo.com', password: 'demo123', role: 'staff', phone: '555-300-0001', salon: salon1._id });
    const staffUser2 = await User.create({ name: 'Chris Lee', email: 'chris@demo.com', password: 'demo123', role: 'staff', phone: '555-300-0002', salon: salon1._id });
    const staffUser3 = await User.create({ name: 'Mia Wong', email: 'mia@demo.com', password: 'demo123', role: 'staff', phone: '555-300-0003', salon: salon1._id });
    const staffUser4 = await User.create({ name: 'Ryan Patel', email: 'ryan@demo.com', password: 'demo123', role: 'staff', phone: '555-300-0004', salon: salon2._id });

    const staff1 = await Staff.create({
      user: staffUser1._id, salon: salon1._id, title: 'Senior Stylist', bio: 'Award-winning stylist with 10+ years of experience in precision cutting and creative styling.',
      specialties: ['Balayage', 'Precision Cuts', 'Bridal Styling'], experience: 10, rating: 4.9, totalReviews: 56,
      workingHours: {
        monday: { start: '09:00', end: '17:00', isOff: false },
        tuesday: { start: '09:00', end: '17:00', isOff: false },
        wednesday: { start: '09:00', end: '17:00', isOff: false },
        thursday: { start: '09:00', end: '19:00', isOff: false },
        friday: { start: '09:00', end: '19:00', isOff: false },
        saturday: { start: '10:00', end: '16:00', isOff: false },
        sunday: { start: '00:00', end: '00:00', isOff: true }
      }
    });

    const staff2 = await Staff.create({
      user: staffUser2._id, salon: salon1._id, title: 'Color Specialist', bio: 'Passionate about creating stunning color transformations and maintaining hair health.',
      specialties: ['Color Correction', 'Highlights', 'Fashion Colors'], experience: 7, rating: 4.7, totalReviews: 42,
      workingHours: {
        monday: { start: '10:00', end: '18:00', isOff: false },
        tuesday: { start: '10:00', end: '18:00', isOff: false },
        wednesday: { start: '10:00', end: '18:00', isOff: false },
        thursday: { start: '10:00', end: '20:00', isOff: false },
        friday: { start: '10:00', end: '20:00', isOff: false },
        saturday: { start: '10:00', end: '18:00', isOff: false },
        sunday: { start: '00:00', end: '00:00', isOff: true }
      }
    });

    const staff3 = await Staff.create({
      user: staffUser3._id, salon: salon1._id, title: 'Nail Artist', bio: 'Creative nail artist specializing in intricate nail art and luxurious spa manicures.',
      specialties: ['Gel Nails', 'Nail Art', 'Spa Manicure'], experience: 5, rating: 4.8, totalReviews: 38,
      workingHours: {
        monday: { start: '09:00', end: '17:00', isOff: false },
        tuesday: { start: '09:00', end: '17:00', isOff: false },
        wednesday: { start: '00:00', end: '00:00', isOff: true },
        thursday: { start: '09:00', end: '17:00', isOff: false },
        friday: { start: '09:00', end: '17:00', isOff: false },
        saturday: { start: '10:00', end: '18:00', isOff: false },
        sunday: { start: '00:00', end: '00:00', isOff: true }
      }
    });

    const staff4 = await Staff.create({
      user: staffUser4._id, salon: salon2._id, title: 'Master Stylist', bio: 'Trendsetter known for edgy, modern cuts and editorial styling.',
      specialties: ['Edgy Cuts', 'Texture Work', 'Editorial'], experience: 12, rating: 4.6, totalReviews: 67,
      workingHours: {
        monday: { start: '10:00', end: '20:00', isOff: false },
        tuesday: { start: '10:00', end: '20:00', isOff: false },
        wednesday: { start: '10:00', end: '20:00', isOff: false },
        thursday: { start: '10:00', end: '21:00', isOff: false },
        friday: { start: '10:00', end: '21:00', isOff: false },
        saturday: { start: '09:00', end: '19:00', isOff: false },
        sunday: { start: '00:00', end: '00:00', isOff: true }
      }
    });

    const services = await Service.insertMany([
      { name: 'Women\'s Haircut', salon: salon1._id, category: 'Hair', price: 85, duration: 60, staff: [staff1._id, staff2._id], description: 'Precision cut tailored to your face shape and lifestyle.' },
      { name: 'Men\'s Haircut', salon: salon1._id, category: 'Hair', price: 45, duration: 30, staff: [staff1._id], description: 'Classic or modern cut with expert styling.' },
      { name: 'Blowout & Style', salon: salon1._id, category: 'Hair', price: 55, duration: 45, staff: [staff1._id, staff2._id], description: 'Professional blowout for a flawless finish.' },
      { name: 'Balayage', salon: salon1._id, category: 'Color', price: 200, duration: 150, staff: [staff1._id, staff2._id], description: 'Hand-painted highlights for a natural, sun-kissed look.' },
      { name: 'Full Color', salon: salon1._id, category: 'Color', price: 150, duration: 120, staff: [staff2._id], description: 'All-over color transformation.' },
      { name: 'Highlights', salon: salon1._id, category: 'Color', price: 180, duration: 120, staff: [staff2._id], description: 'Traditional foil highlights for dimension and depth.' },
      { name: 'Gel Manicure', salon: salon1._id, category: 'Nails', price: 40, duration: 45, staff: [staff3._id], description: 'Long-lasting gel polish with nail care.' },
      { name: 'Spa Pedicure', salon: salon1._id, category: 'Nails', price: 55, duration: 60, staff: [staff3._id], description: 'Relaxing pedicure with exfoliation and massage.' },
      { name: 'Nail Art', salon: salon1._id, category: 'Nails', price: 30, duration: 30, staff: [staff3._id], description: 'Custom nail art designs.' },
      { name: 'Bridal Makeup', salon: salon1._id, category: 'Makeup', price: 150, duration: 90, staff: [staff1._id], description: 'Professional bridal makeup for your special day.' },
      { name: 'Haircut & Style', salon: salon2._id, category: 'Hair', price: 95, duration: 60, staff: [staff4._id], description: 'Expert cut with personalized styling.' },
      { name: 'Creative Color', salon: salon2._id, category: 'Color', price: 220, duration: 150, staff: [staff4._id], description: 'Bold, fashion-forward color creations.' },
      { name: 'Deep Conditioning Treatment', salon: salon2._id, category: 'Treatments', price: 75, duration: 45, staff: [staff4._id], description: 'Intensive moisture treatment for damaged hair.' },
      { name: 'Keratin Treatment', salon: salon2._id, category: 'Treatments', price: 350, duration: 180, staff: [staff4._id], description: 'Smoothing treatment for frizz-free, shiny hair.' }
    ]);

    console.log('Seed data created successfully!');
    console.log('\n--- DEMO CREDENTIALS ---');
    console.log('Admin:      admin@glowup.com / admin123');
    console.log('Owner 1:    jessica@demo.com / demo123');
    console.log('Owner 2:    david@demo.com / demo123');
    console.log('Customer 1: sarah@demo.com / demo123');
    console.log('Customer 2: mike@demo.com / demo123');
    console.log('Staff 1:    anna@demo.com / demo123');
    console.log('Staff 2:    chris@demo.com / demo123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
