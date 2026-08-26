import { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function ManageAppointments() {
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
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try { await API.put(`/appointments/${id}/status`, { status }); toast.success(`Appointment ${status}`); fetchAppointments(); }
    catch (err) { toast.error('Failed to update'); }
  };

  const statusColor = (s) => ({ pending: 'badge-warning', confirmed: 'badge-primary', completed: 'badge-success', cancelled: 'badge-danger', in_progress: 'badge-primary', no_show: 'badge-danger' }[s] || '');

  return (
    <div>
      <h1 className="page-title">Appointments</h1>
      <p className="page-subtitle">View and manage all appointments</p>

      <div className="tabs">
        {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Customer</th><th>Service</th><th>Stylist</th><th>Date & Time</th><th>Status</th><th>Amount</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt._id}>
                    <td><strong>{apt.customer?.name}</strong><br /><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{apt.customer?.email}</span></td>
                    <td>{apt.services?.map(s => s.service?.name).join(', ')}</td>
                    <td>{apt.staff?.user?.name}</td>
                    <td>{format(new Date(apt.date), 'MMM d')}<br /><span style={{ fontSize: 12 }}>{apt.startTime} - {apt.endTime}</span></td>
                    <td><span className={`badge ${statusColor(apt.status)}`}>{apt.status}</span></td>
                    <td style={{ fontWeight: 600 }}>${apt.totalPrice}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {apt.status === 'pending' && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => updateStatus(apt._id, 'confirmed')}>Confirm</button>
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => updateStatus(apt._id, 'cancelled')}>Decline</button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <button className="btn btn-primary btn-sm" onClick={() => updateStatus(apt._id, 'in_progress')}>Start</button>
                        )}
                        {apt.status === 'in_progress' && (
                          <button className="btn btn-success btn-sm" onClick={() => updateStatus(apt._id, 'completed')}>Complete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>No appointments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
