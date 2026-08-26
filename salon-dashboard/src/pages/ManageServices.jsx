import { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', duration: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const salonRes = await API.get('/salons/my-salon');
      setSalon(salonRes.data.salon);
      const { data } = await API.get(`/services?salon=${salonRes.data.salon._id}`);
      setServices(data.services);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditing(service);
      setForm({ name: service.name, description: service.description, category: service.category, price: service.price, duration: service.duration });
    } else {
      setEditing(null);
      setForm({ name: '', description: '', category: '', price: '', duration: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/services/${editing._id}`, form);
        toast.success('Service updated');
      } else {
        await API.post('/services', form);
        toast.success('Service created');
      }
      setShowModal(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this service?')) return;
    try { await API.delete(`/services/${id}`); toast.success('Service removed'); fetchData(); }
    catch (err) { toast.error('Error removing service'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Services</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Manage your service offerings</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>+ Add Service</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Service</th><th>Category</th><th>Duration</th><th>Price</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s._id}>
                  <td><strong>{s.name}</strong><br /><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.description?.slice(0, 50)}</span></td>
                  <td><span className="badge badge-primary">{s.category}</span></td>
                  <td>{s.duration} min</td>
                  <td style={{ fontWeight: 600 }}>${s.price}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => openModal(s)}>Edit</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(s._id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editing ? 'Edit Service' : 'Add New Service'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Category</label>
                  <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Hair" required />
                </div>
                <div className="input-group">
                  <label>Price ($)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} min="0" required />
                </div>
                <div className="input-group">
                  <label>Duration (min)</label>
                  <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} min="15" required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
