import { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

export default function Salons() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSalons(); }, []);

  const fetchSalons = async () => {
    try { const { data } = await API.get('/admin/salons'); setSalons(data.salons); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleActive = async (id) => {
    try { await API.put(`/admin/salons/${id}/toggle-active`); toast.success('Salon updated'); fetchSalons(); }
    catch (err) { toast.error('Error'); }
  };

  const toggleFeatured = async (id) => {
    try { await API.put(`/admin/salons/${id}/toggle-featured`); toast.success('Salon updated'); fetchSalons(); }
    catch (err) { toast.error('Error'); }
  };

  return (
    <div>
      <h1 className="page-title">Salons</h1>
      <p className="page-subtitle">Manage all salons on the platform</p>

      <div className="card">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>Salon</th><th>Owner</th><th>Location</th><th>Rating</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>
                {salons.map(s => (
                  <tr key={s._id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.owner?.name}</td>
                    <td>{s.address?.city}, {s.address?.state}</td>
                    <td>{s.rating} ({s.totalReviews})</td>
                    <td><span className={`badge ${s.isActive ? 'badge-success' : 'badge-danger'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td><span className={`badge ${s.isFeatured ? 'badge-warning' : ''}`}>{s.isFeatured ? 'Featured' : '-'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(s._id)}>{s.isActive ? 'Disable' : 'Enable'}</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => toggleFeatured(s._id)}>{s.isFeatured ? 'Unfeature' : 'Feature'}</button>
                      </div>
                    </td>
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
