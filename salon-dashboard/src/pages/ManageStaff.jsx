import { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

export default function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', title: 'Stylist', bio: '', specialties: '', experience: '' });

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      const salonRes = await API.get('/salons/my-salon');
      const { data } = await API.get(`/staff?salon=${salonRes.data.salon._id}`);
      setStaff(data.staff);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/staff', { ...form, specialties: form.specialties.split(',').map(s => s.trim()), experience: Number(form.experience) });
      toast.success('Staff member added');
      setShowModal(false);
      setForm({ name: '', email: '', phone: '', title: 'Stylist', bio: '', specialties: '', experience: '' });
      fetchStaff();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this staff member?')) return;
    try { await API.delete(`/staff/${id}`); toast.success('Staff removed'); fetchStaff(); }
    catch (err) { toast.error('Error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Staff</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Manage your team members</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Staff</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {staff.map(s => (
          <div className="card" key={s._id}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
                {s.user?.name?.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{s.user?.name}</h4>
                <p style={{ fontSize: 13, color: 'var(--primary)' }}>{s.title}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.user?.email}</p>
                {s.specialties?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                    {s.specialties.map(sp => <span key={sp} className="badge badge-primary">{sp}</span>)}
                  </div>
                )}
                <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  {s.experience} years exp. &middot; Rating: {s.rating} ({s.totalReviews} reviews)
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-light)', display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleRemove(s._id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Staff Member</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Title</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
              </div>
              <div className="input-group">
                <label>Bio</label>
                <textarea rows={2} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Specialties (comma separated)</label>
                  <input value={form.specialties} onChange={e => setForm({ ...form, specialties: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Experience (years)</label>
                  <input type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} min="0" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
