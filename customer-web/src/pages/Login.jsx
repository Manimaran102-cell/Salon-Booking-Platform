import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success('Welcome back!');
      const dashboardUrls = {
        salon_owner: `${import.meta.env.VITE_SALON_DASHBOARD_URL || 'http://localhost:3001'}/services`,
        staff: `${import.meta.env.VITE_SALON_DASHBOARD_URL || 'http://localhost:3001'}/appointments`,
        admin: `${import.meta.env.VITE_ADMIN_DASHBOARD_URL || 'http://localhost:3002'}/`
      };
      const dashboardUrl = dashboardUrls[data.user.role];
      if (dashboardUrl) {
        window.location.assign(`${dashboardUrl}?token=${encodeURIComponent(data.token)}`);
        return;
      }

      const destination = location.state?.from;
      navigate(destination ? `${destination.pathname}${destination.search}${destination.hash}` : '/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="form-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
        <div style={{ marginTop: 20, padding: 16, background: 'var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--text-secondary)' }}>
          <strong>Demo Accounts:</strong><br />
          Customer: sarah@demo.com / demo123<br />
          Owner: jessica@demo.com / demo123<br />
          Admin: admin@glowup.com / admin123
        </div>
      </div>
    </div>
  );
}
