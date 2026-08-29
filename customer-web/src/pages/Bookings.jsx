import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function Bookings() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchAppointments(); }, [filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (filter !== 'all') params.status = filter;
      const { data } = await API.get('/appointments', { params });
      setAppointments(data.appointments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await API.put(`/appointments/${id}/cancel`, { reason: 'Cancelled by customer' });
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  const statusColor = (status) => {
    const colors = { pending: 'badge-warning', confirmed: 'badge-primary', completed: 'badge-success', cancelled: 'badge-danger', in_progress: 'badge-primary', no_show: 'badge-danger' };
    return colors[status] || '';
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Manage your upcoming and past appointments</p>
      </div>

      <div className="tabs">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <div className="icon">&#128197;</div>
          <h3>No bookings found</h3>
          <p>{filter === 'all' ? "You haven't booked any appointments yet" : `No ${filter} appointments`}</p>
          {filter === 'all' && <Link to="/salons" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Salons</Link>}
        </div>
      ) : (
        <div className="booking-list">
          {appointments.map(apt => (
            <div className="booking-item" key={apt._id}>
              <div className="info">
                <h4>{apt.salon?.name}</h4>
                <p>
                  {apt.services?.map(s => s.service?.name).join(', ')} with {apt.staff?.user?.name}
                </p>
                <p>{format(new Date(apt.date), 'EEEE, MMM d, yyyy')} at {apt.startTime}</p>
                <div style={{ marginTop: 8 }}>
                  <span className={`badge ${statusColor(apt.status)}`}>{apt.status}</span>
                  <span style={{ marginLeft: 12, fontWeight: 600 }}>${apt.totalPrice}</span>
                </div>
              </div>
              <div className="actions">
                {['pending', 'confirmed'].includes(apt.status) && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleCancel(apt._id)}>Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
