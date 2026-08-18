import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../utils/api';
import toast from 'react-hot-toast';
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await adminLogin(username.trim(), password);
      if (res && res.success) {
        toast.success(res.message || 'Authenticated successfully.');
        navigate('/admin/dashboard');
        // Trigger a custom event to notify Navigation header of auth changes
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err) {
      toast.error(err.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Locked vault theme ambient glowing background */}
      <div className="login-backdrop">
        <div className="vault-glow"></div>
        <div className="accent-glow"></div>
      </div>

      <div className="login-card glass animate-slide-in-up">
        <div className="login-card-header">
          <span className="lock-icon">🔒</span>
          <h2>Admin Gate</h2>
          <p>Unlocking the archives of My Diary</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login-username">Username</label>
            <input
              type="text"
              id="login-username"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Unlocking Vault...' : 'Unlock Diary 🔓'}
          </button>
        </form>
      </div>
    </div>
  );
}
