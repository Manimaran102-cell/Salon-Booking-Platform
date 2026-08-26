import { useState, useEffect } from 'react';
import API from '../utils/api';
import { format } from 'date-fns';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchAppointments(); }, [filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try { const params = {}; if (filter) params.status = filter; const { data } = await API.get('/admin/appointments', { params }); setAppointments(data.appointments); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const statusColor = (s) => ({ pending: 'badge-warning', confirmed: 'badge-primary', completed: 'badge-success', cancelled: 'badge-danger', in_progress: 'badge-primary', no_show: 'badge-danger' }[s] || '');

  return (
    <div>
      <h1 className="page-title">Appointments</h1>
      <p className="page-subtitle">All platform appointments</p>

      <div className="tabs">
        {['', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f ? f.charAt(0).toUpperCase() + f.slice(1) : 'All'}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>Customer</th><th>Salon</th><th>Stylist</th><th>Services</th><th>Date</th><th>Time</th><th>Status</th><th>Amount</th></tr></thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt._id}>
                    <td>{apt.customer?.name}</td>
                    <td>{apt.salon?.name}</td>
                    <td>{apt.staff?.user?.name}</td>
                    <td>{apt.services?.map(s => s.service?.name).join(', ')}</td>
                    <td>{format(new Date(apt.date), 'MMM d, yyyy')}</td>
                    <td>{apt.startTime} - {apt.endTime}</td>
                    <td><span className={`badge ${statusColor(apt.status)}`}>{apt.status}</span></td>
                    <td style={{ fontWeight: 600 }}>${apt.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
