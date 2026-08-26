import { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const defaultHours = {
  monday: { open: '09:00', close: '17:00', isClosed: false },
  tuesday: { open: '09:00', close: '17:00', isClosed: false },
  wednesday: { open: '09:00', close: '17:00', isClosed: false },
  thursday: { open: '09:00', close: '17:00', isClosed: false },
  friday: { open: '09:00', close: '17:00', isClosed: false },
  saturday: { open: '10:00', close: '16:00', isClosed: false },
  sunday: { open: '00:00', close: '00:00', isClosed: true }
};

export default function SalonSettings() {
  const [salon, setSalon] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/salons/my-salon').then(res => {
      setSalon(res.data.salon);
      setForm(res.data.salon);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put(`/salons/${salon._id}`, form);
      toast.success('Salon updated successfully');
    } catch (err) {
      toast.error('Failed to update salon');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!salon) return <div className="empty-state">No salon found. Create one first.</div>;

  return (
    <div>
      <h1 className="page-title">Salon Settings</h1>
      <p className="page-subtitle">Manage your salon details and opening hours</p>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Basic Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label>Salon Name</label>
              <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Website</label>
              <input value={form.website || ''} onChange={e => setForm({ ...form, website: e.target.value })} />
            </div>
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea rows={3} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Categories (comma separated)</label>
            <input value={(form.categories || []).join(', ')} onChange={e => setForm({ ...form, categories: e.target.value.split(',').map(c => c.trim()) })} />
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Address</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label>Street</label>
              <input value={form.address?.street || ''} onChange={e => setForm({ ...form, address: { ...form.address, street: e.target.value } })} />
            </div>
            <div className="input-group">
              <label>City</label>
              <input value={form.address?.city || ''} onChange={e => setForm({ ...form, address: { ...form.address, city: e.target.value } })} />
            </div>
            <div className="input-group">
              <label>State</label>
              <input value={form.address?.state || ''} onChange={e => setForm({ ...form, address: { ...form.address, state: e.target.value } })} />
            </div>
            <div className="input-group">
              <label>Zip Code</label>
              <input value={form.address?.zipCode || ''} onChange={e => setForm({ ...form, address: { ...form.address, zipCode: e.target.value } })} />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Opening Hours</h3>
          {Object.keys(defaultHours).map(day => (
            <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, textTransform: 'capitalize' }}>
              <span style={{ width: 100, fontWeight: 500, fontSize: 14 }}>{day}</span>
              <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="checkbox"
                  checked={!(form.openingHours?.[day]?.isClosed ?? defaultHours[day].isClosed)}
                  onChange={e => setForm({
                    ...form,
                    openingHours: {
                      ...form.openingHours,
                      [day]: { ...(form.openingHours?.[day] || defaultHours[day]), isClosed: !e.target.checked }
                    }
                  })}
                />
                Open
              </label>
              {!(form.openingHours?.[day]?.isClosed ?? defaultHours[day].isClosed) && (
                <>
                  <input type="time" value={form.openingHours?.[day]?.open || defaultHours[day].open}
                    onChange={e => setForm({ ...form, openingHours: { ...form.openingHours, [day]: { ...(form.openingHours?.[day] || {}), open: e.target.value } } })}
                    style={{ padding: '6px 10px', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13 }} />
                  <span style={{ color: 'var(--text-secondary)' }}>to</span>
                  <input type="time" value={form.openingHours?.[day]?.close || defaultHours[day].close}
                    onChange={e => setForm({ ...form, openingHours: { ...form.openingHours, [day]: { ...(form.openingHours?.[day] || {}), close: e.target.value } } })}
                    style={{ padding: '6px 10px', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13 }} />
                </>
              )}
            </div>
          ))}
        </div>

        <button className="btn btn-primary" disabled={saving} style={{ marginTop: 8 }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
