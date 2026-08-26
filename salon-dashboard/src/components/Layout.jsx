import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>Glow</span><span>Up</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">&#9632;</span> Dashboard
          </NavLink>
          <NavLink to="/appointments" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">&#128197;</span> Appointments
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">&#9733;</span> Services
          </NavLink>
          <NavLink to="/staff" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">&#9786;</span> Staff
          </NavLink>
          <NavLink to="/salon-settings" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">&#9881;</span> Salon Settings
          </NavLink>
        </nav>
        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, padding: '0 24px' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{user?.name}</div>
          <button className="btn btn-ghost btn-sm" style={{ color: 'rgba(255,255,255,0.6)', width: '100%' }}
            onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
