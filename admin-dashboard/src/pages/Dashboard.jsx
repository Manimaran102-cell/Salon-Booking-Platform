import { useState, useEffect } from 'react';
import API from '../utils/api';
import { format } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats').then(res => setStats(res.data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!stats) return null;

  return (
    <div>
      <h1 className="page-title">Platform Dashboard</h1>
      <p className="page-subtitle">Overview of your platform</p>

      <div className="stats-grid">
        <div className="stat-card"><div className="label">Total Customers</div><div className="value">{stats.totalCustomers}</div></div>
        <div className="stat-card"><div className="label">Active Salons</div><div className="value">{stats.totalSalons}</div></div>
        <div className="stat-card"><div className="label">Staff Members</div><div className="value">{stats.totalStaff}</div></div>
        <div className="stat-card"><div className="label">Services</div><div className="value">{stats.totalServices}</div></div>
        <div className="stat-card"><div className="label">Total Appointments</div><div className="value">{stats.totalAppointments}</div></div>
        <div className="stat-card"><div className="label">Total Reviews</div><div className="value">{stats.totalReviews}</div></div>
        <div className="stat-card"><div className="label">Total Revenue</div><div className="value" style={{ color: 'var(--success)' }}>${stats.totalRevenue}</div></div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Appointments by Status</h3></div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {Object.entries(stats.appointmentsByStatus || {}).map(([status, count]) => (
            <div key={status} style={{ padding: '12px 20px', background: 'var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{status.replace('_', ' ')}</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Recent Appointments</h3></div>
        <div className="table-container">
          <table>
            <thead><tr><th>Customer</th><th>Salon</th><th>Stylist</th><th>Date</th><th>Status</th><th>Amount</th></tr></thead>
            <tbody>
              {stats.recentAppointments?.map(apt => (
                <tr key={apt._id}>
                  <td>{apt.customer?.name}</td>
                  <td>{apt.salon?.name}</td>
                  <td>{apt.staff?.user?.name}</td>
                  <td>{format(new Date(apt.date), 'MMM d')}</td>
                  <td><span className={`badge badge-${apt.status === 'completed' ? 'success' : apt.status === 'cancelled' ? 'danger' : 'primary'}`}>{apt.status}</span></td>
                  <td style={{ fontWeight: 600 }}>${apt.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
