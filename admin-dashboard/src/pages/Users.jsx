import { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;
      const { data } = await API.get('/admin/users', { params });
      setUsers(data.users);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleActive = async (id) => {
    try { await API.put(`/admin/users/${id}/toggle-active`); toast.success('User updated'); fetchUsers(); }
    catch (err) { toast.error('Error'); }
  };

  const roleColor = (r) => ({ customer: 'badge-primary', salon_owner: 'badge-warning', staff: 'badge-success', admin: 'badge-danger' }[r] || '');

  return (
    <div>
      <h1 className="page-title">Users</h1>
      <p className="page-subtitle">Manage platform users</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchUsers()}
          style={{ padding: '10px 14px', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 14, minWidth: 250 }} />
        <div className="tabs" style={{ marginBottom: 0, border: 'none' }}>
          {['', 'customer', 'salon_owner', 'staff', 'admin'].map(r => (
            <button key={r} className={`tab ${roleFilter === r ? 'active' : ''}`} onClick={() => setRoleFilter(r)}>
              {r ? r.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${roleColor(u.role)}`}>{u.role?.replace('_', ' ')}</span></td>
                    <td>{u.phone || '-'}</td>
                    <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => toggleActive(u._id)}>{u.isActive ? 'Deactivate' : 'Activate'}</button></td>
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
