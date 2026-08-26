import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.user.role !== 'admin') { toast.error('Admin access required'); return; }
      navigate('/');
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 style={{ textAlign: 'center', marginBottom: 8, fontFamily: "'Playfair Display', serif", fontSize: 28 }}>
          <span style={{ color: 'var(--primary)' }}>Glow</span><span>Up</span> Admin
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>Platform Administration</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div className="input-group"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div className="demo"><strong>Demo:</strong> admin@glowup.com / admin123</div>
      </div>
    </div>
  );
}
