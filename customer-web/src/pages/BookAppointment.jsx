import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { format, addDays } from 'date-fns';

export default function BookAppointment() {
  const { salonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [salon, setSalon] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    API.get(`/salons/${salonId}`).then(res => { setSalon(res.data.salon); setLoading(false); });
  }, [salonId]);

  useEffect(() => {
    if (selectedStaff && selectedDate && selectedServices.length > 0) {
      const mainService = selectedServices[0];
      API.get(`/availability?staffId=${selectedStaff._id}&date=${format(selectedDate, 'yyyy-MM-dd')}&serviceId=${mainService._id}`)
        .then(res => setSlots(res.data.slots));
    }
  }, [selectedStaff, selectedDate, selectedServices]);

  const toggleService = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s._id === service._id);
      if (exists) return prev.filter(s => s._id !== service._id);
      return [...prev, service];
    });
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1));

  const handleBook = async () => {
    setBooking(true);
    try {
      await API.post('/appointments', {
        salon: salonId,
        staff: selectedStaff._id,
        services: selectedServices.map(s => s._id),
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      });
      toast.success('Appointment booked successfully!');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!salon) return null;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <span className={`badge ${step >= 1 ? 'badge-primary' : ''}`}>1. Services</span>
        <span style={{ color: 'var(--text-light)' }}>&rarr;</span>
        <span className={`badge ${step >= 2 ? 'badge-primary' : ''}`}>2. Stylist</span>
        <span style={{ color: 'var(--text-light)' }}>&rarr;</span>
        <span className={`badge ${step >= 3 ? 'badge-primary' : ''}`}>3. Date & Time</span>
        <span style={{ color: 'var(--text-light)' }}>&rarr;</span>
        <span className={`badge ${step >= 4 ? 'badge-primary' : ''}`}>4. Confirm</span>
      </div>

      <div className="salon-detail-grid">
        <div>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>{salon.name}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Step {step} of 4</p>

          {step === 1 && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 16, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Select Services</h3>
              <div className="service-list">
                {salon.serviceList?.map(service => (
                  <div
                    key={service._id}
                    className={`service-item ${selectedServices.find(s => s._id === service._id) ? 'selected' : ''}`}
                    onClick={() => toggleService(service)}
                  >
                    <div className="info">
                      <h4>{service.name}</h4>
                      <p>{service.description}</p>
                    </div>
                    <div className="meta">
                      <div className="price">${service.price}</div>
                      <div className="duration">{service.duration} min</div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedServices.length > 0 && (
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setStep(2)}>
                  Continue with {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}
                </button>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 16, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Choose Your Stylist</h3>
              <div className="staff-grid">
                {salon.staffList?.map(s => (
                  <div
                    key={s._id}
                    className={`staff-card ${selectedStaff?._id === s._id ? 'selected' : ''}`}
                    onClick={() => setSelectedStaff(s)}
                  >
                    <div className="avatar">{s.user?.name?.charAt(0)}</div>
                    <h4>{s.user?.name}</h4>
                    <div className="title">{s.title}</div>
                    <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                      {s.specialties?.slice(0, 2).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                {selectedStaff && <button className="btn btn-primary" onClick={() => setStep(3)}>Continue</button>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 16, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Pick a Date</h3>
              <div className="date-picker">
                {dates.map(date => {
                  const isSameDay = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                  return (
                    <div
                      key={date.toISOString()}
                      className={`date-btn ${isSameDay ? 'active' : ''}`}
                      onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                    >
                      <div className="day">{format(date, 'EEE')}</div>
                      <div className="date">{format(date, 'd')}</div>
                      <div className="month">{format(date, 'MMM')}</div>
                    </div>
                  );
                })}
              </div>

              {selectedDate && (
                <>
                  <h3 style={{ fontSize: 18, marginTop: 24, marginBottom: 16, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Pick a Time</h3>
                  {slots.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No available slots for this date.</p>
                  ) : (
                    <div className="time-slots">
                      {slots.map(slot => (
                        <div
                          key={slot.startTime}
                          className={`time-slot ${selectedSlot?.startTime === slot.startTime ? 'active' : ''} ${!slot.available ? 'booked' : ''}`}
                          onClick={() => slot.available && setSelectedSlot(slot)}
                        >
                          {slot.startTime}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
                {selectedDate && selectedSlot && <button className="btn btn-primary" onClick={() => setStep(4)}>Continue</button>}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 16, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Confirm Your Booking</h3>
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <strong>Salon:</strong> {salon.name}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong>Stylist:</strong> {selectedStaff?.user?.name}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong>Services:</strong>
                  {selectedServices.map(s => (
                    <div key={s._id} style={{ marginLeft: 12, marginTop: 4, fontSize: 14 }}>{s.name} - ${s.price}</div>
                  ))}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong>Date:</strong> {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </div>
                <div>
                  <strong>Time:</strong> {selectedSlot?.startTime} - {selectedSlot?.endTime}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-ghost" onClick={() => setStep(3)}>Back</button>
                <button className="btn btn-primary btn-lg" onClick={handleBook} disabled={booking}>
                  {booking ? 'Booking...' : `Confirm & Book - $${totalPrice}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            {selectedServices.length > 0 && (
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Services</p>
                {selectedServices.map(s => (
                  <div className="summary-row" key={s._id}>
                    <span>{s.name}</span>
                    <span>${s.price}</span>
                  </div>
                ))}
              </div>
            )}
            {selectedStaff && (
              <div className="summary-row">
                <span>Stylist</span>
                <span>{selectedStaff.user?.name}</span>
              </div>
            )}
            {selectedDate && (
              <div className="summary-row">
                <span>Date</span>
                <span>{format(selectedDate, 'MMM d')}</span>
              </div>
            )}
            {selectedSlot && (
              <div className="summary-row">
                <span>Time</span>
                <span>{selectedSlot.startTime}</span>
              </div>
            )}
            {selectedServices.length > 0 && (
              <>
                <div className="summary-row">
                  <span>Duration</span>
                  <span>{totalDuration} min</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span className="price">${totalPrice}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
