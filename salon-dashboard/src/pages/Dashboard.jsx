import { useState, useEffect } from 'react';
import API from '../utils/api';
import { format } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState({ today: 0, week: 0, total: 0, revenue: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/appointments?limit=10'),
      API.get('/salons/my-salon')
    ]).then(([aptRes]) => {
      const apts = aptRes.data.appointments;
      setAppointments(apts);
      const today = format(new Date(), 'yyyy-MM-dd');
      setStats({
        today: apts.filter(a => format(new Date(a.date), 'yyyy-MM-dd') === today && !['cancelled', 'no_show'].includes(a.status)).length,
        week: apts.filter(a => { const d = new Date(a.date); const now = new Date(); return d >= now && d <= new Date(now.getTime() + 7 * 86400000) && !['cancelled', 'no_show'].includes(a.status); }).length,
        total: apts.length,
        revenue: apts.filter(a => ['completed', 'confirmed'].includes(a.status)).reduce((sum, a) => sum + a.totalPrice, 0)
      });
    }).finally(() => setLoading(false));
  }, []);

  const statusColor = (s) => ({ pending: 'badge-warning', confirmed: 'badge-primary', completed: 'badge-success', cancelled: 'badge-danger', in_progress: 'badge-primary', no_show: 'badge-danger' }[s] || '');

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome back! Here's your salon overview.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Today's Appointments</div>
          <div className="value">{stats.today}</div>
        </div>
        <div className="stat-card">
          <div className="label">This Week</div>
          <div className="value">{stats.week}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Bookings</div>
          <div className="value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="label">Revenue</div>
          <div className="value" style={{ color: 'var(--success)' }}>${stats.revenue}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Appointments</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Customer</th><th>Service</th><th>Stylist</th><th>Date</th><th>Time</th><th>Status</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt._id}>
                  <td>{apt.customer?.name}</td>
                  <td>{apt.services?.map(s => s.service?.name).join(', ')}</td>
                  <td>{apt.staff?.user?.name}</td>
                  <td>{format(new Date(apt.date), 'MMM d, yyyy')}</td>
                  <td>{apt.startTime}</td>
                  <td><span className={`badge ${statusColor(apt.status)}`}>{apt.status}</span></td>
                  <td style={{ fontWeight: 600 }}>${apt.totalPrice}</td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>No appointments yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
