import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // sends/receives cookies (refresh token)
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed. Please try again.');
        return;
      }

      // Persist access token in memory / localStorage
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirect to dashboard (adjust route as needed)
      // navigate('/dashboard');
      window.location.href = '/#/';
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell muted">
      <div className="shell">

        <div className="page-hero">
          <h2>Welcome Back</h2>
          <p>Log in to access your dashboard.</p>
        </div>

        <div style={{ maxWidth: '450px', margin: '0 auto', paddingBottom: '80px' }}>
          <form className="contact-form" onSubmit={handleSubmit}>

            {error && (
              <div style={{
                background: 'rgba(255, 80, 80, 0.1)',
                border: '1px solid rgba(255, 80, 80, 0.4)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#ff6b6b',
                fontSize: '14px',
                marginBottom: '4px',
              }}>
                {error}
              </div>
            )}

            <label>
              Email Address
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </label>

            <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '8px' }}>
              <Link
                to="/forgot-password"
                style={{ color: 'var(--brand)', textDecoration: 'none', fontSize: '13px' }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="button form-button"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '10px' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 'bold' }}>
                Sign up
              </Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
