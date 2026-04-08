import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="app-shell muted">
      <div className="shell">
        
        {/* Page Header */}
        <div className="page-hero">
          <h2>Welcome Back</h2>
          <p>Log in to access your dashboard.</p>
        </div>

        {/* Centered Form Container */}
        <div style={{ maxWidth: '450px', margin: '0 auto', paddingBottom: '80px' }}>
          <form className="contact-form">
            <label>
              Email Address
              <input type="email" placeholder="name@example.com" required />
            </label>

            <label>
              Password
              <input type="password" placeholder="••••••••" required />
            </label>

            <button type="submit" className="button form-button">
              Log In
            </button>

            {/* Link to Registration */}
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