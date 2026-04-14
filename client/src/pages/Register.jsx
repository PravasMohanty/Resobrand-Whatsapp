import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const countryCodes = [
  "+93 (AF)", "+355 (AL)", "+213 (DZ)", "+376 (AD)", "+244 (AO)", "+54 (AR)", "+374 (AM)",
  "+61 (AU)", "+43 (AT)", "+994 (AZ)", "+1242 (BS)", "+973 (BH)", "+880 (BD)", "+375 (BY)",
  "+32 (BE)", "+55 (BR)", "+673 (BN)", "+359 (BG)", "+855 (KH)", "+237 (CM)", "+1 (CA)",
  "+86 (CN)", "+57 (CO)", "+506 (CR)", "+385 (HR)", "+357 (CY)", "+420 (CZ)", "+45 (DK)",
  "+20 (EG)", "+372 (EE)", "+251 (ET)", "+358 (FI)", "+33 (FR)", "+995 (GE)", "+49 (DE)",
  "+233 (GH)", "+30 (GR)", "+502 (GT)", "+36 (HU)", "+354 (IS)", "+91 (IN)", "+62 (ID)",
  "+98 (IR)", "+964 (IQ)", "+353 (IE)", "+972 (IL)", "+39 (IT)", "+81 (JP)", "+962 (JO)",
  "+7 (KZ)", "+254 (KE)", "+82 (KR)", "+965 (KW)", "+371 (LV)", "+961 (LB)", "+218 (LY)",
  "+370 (LT)", "+60 (MY)", "+960 (MV)", "+52 (MX)", "+373 (MD)", "+212 (MA)", "+95 (MM)",
  "+977 (NP)", "+31 (NL)", "+64 (NZ)", "+234 (NG)", "+47 (NO)", "+92 (PK)", "+507 (PA)",
  "+63 (PH)", "+48 (PL)", "+351 (PT)", "+974 (QA)", "+40 (RO)", "+7 (RU)", "+250 (RW)",
  "+966 (SA)", "+221 (SN)", "+381 (RS)", "+65 (SG)", "+421 (SK)", "+27 (ZA)", "+34 (ES)",
  "+94 (LK)", "+46 (SE)", "+41 (CH)", "+963 (SY)", "+886 (TW)", "+66 (TH)", "+216 (TN)",
  "+90 (TR)", "+380 (UA)", "+971 (AE)", "+44 (GB)", "+1 (US)", "+598 (UY)", "+998 (UZ)",
  "+58 (VE)", "+84 (VN)", "+967 (YE)", "+260 (ZM)", "+263 (ZW)"
];

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', age: '', gender: '',
    country: '', phone: '', countryCode: '+91 (IN)',
    address: '', password: '', confirmPassword: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const filteredCodes = countryCodes.filter((c) =>
    c.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setError('');
  };

  const handleSelectCode = (code) => {
    setFormData((prev) => ({ ...prev, countryCode: code }));
    setSearchInput('');
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        age: formData.age,
        gender: formData.gender,
        country: formData.country,
        phone: formData.phone,
        countryCode: formData.countryCode.split(' ')[0],
        address: formData.address,
      };

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors?.length) {
          const errs = {};
          data.errors.forEach(({ field, message }) => { errs[field] = message; });
          setFieldErrors(errs);
        } else {
          setError(data.message || 'Registration failed.');
        }
        return;
      }

      navigate('/login', { state: { message: 'Account created! Please verify your email, then log in.' } });
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => fieldErrors[field]
    ? { border: '1px solid rgba(255, 80, 80, 0.6)' }
    : {};

  return (
    <div className="app-shell muted">
      <div className="shell">

        {/* Invisible overlay — closes dropdown when clicking outside */}
        {dropdownOpen && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9 }}
            onClick={() => setDropdownOpen(false)}
          />
        )}

        <div className="page-hero">
          <h2>Create an Account</h2>
          <p>Join us today by filling out your details below.</p>
        </div>

        <div style={{ maxWidth: '500px', margin: '0 auto', paddingBottom: '80px' }}>
          <form className="contact-form" onSubmit={handleSubmit}>

            {error && (
              <div style={{
                background: 'rgba(255, 80, 80, 0.1)',
                border: '1px solid rgba(255, 80, 80, 0.4)',
                borderRadius: '12px', padding: '12px 16px',
                color: '#ff6b6b', fontSize: '14px',
              }}>
                {error}
              </div>
            )}

            <label>
              Full Name
              <input type="text" name="fullName" placeholder="John Doe"
                value={formData.fullName} onChange={handleChange}
                style={inputStyle('fullName')} required />
              {fieldErrors.fullName && <span style={{ color: '#ff6b6b', fontSize: '12px' }}>{fieldErrors.fullName}</span>}
            </label>

            <label>
              Email Address
              <input type="email" name="email" placeholder="name@gmail.com"
                value={formData.email} onChange={handleChange}
                style={inputStyle('email')} required />
              {fieldErrors.email && <span style={{ color: '#ff6b6b', fontSize: '12px' }}>{fieldErrors.email}</span>}
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <label>
                Age
                <input type="number" name="age" placeholder="e.g. 25" min="1"
                  value={formData.age} onChange={handleChange} required />
              </label>

              <div style={{ display: 'grid', gap: '8px', color: 'var(--text-main)', fontWeight: '500' }}>
                Gender
                <div style={{
                  display: 'flex', gap: '16px', alignItems: 'center',
                  padding: '14px 16px', borderRadius: '18px',
                  border: '1px solid var(--border-strong)',
                  background: 'rgba(255, 255, 255, 0.03)',
                }}>
                  {['male', 'female', 'other'].map((g) => (
                    <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '400', cursor: 'pointer', margin: 0 }}>
                      <input type="radio" name="gender" value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                        style={{ width: 'auto', padding: 0, margin: 0, accentColor: 'var(--brand)' }} required />
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <label>
              Country
              <input type="text" name="country" placeholder="e.g. India"
                value={formData.country} onChange={handleChange} required />
            </label>

            <label>
              Contact Number
              <div style={{ display: 'flex', gap: '10px' }}>

                <div style={{ position: 'relative', width: '130px', flexShrink: 0, zIndex: 10 }}>
                  <input
                    type="text"
                    placeholder={formData.countryCode}
                    value={searchInput}
                    onChange={(e) => { setSearchInput(e.target.value); setDropdownOpen(true); }}
                    onFocus={() => setDropdownOpen(true)}
                    style={{
                      width: '100%', color: '#ffffff', backgroundColor: '#0a2d52',
                      border: '1px solid rgba(255,255,255,0.24)', borderRadius: '8px',
                      padding: '10px', fontSize: '14px', fontWeight: '500',
                      cursor: 'pointer', boxSizing: 'border-box',
                    }}
                  />
                  {dropdownOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      backgroundColor: '#0a2d52', border: '1px solid rgba(255,255,255,0.24)',
                      borderTop: 'none', borderRadius: '0 0 8px 8px',
                      maxHeight: '200px', overflowY: 'auto', zIndex: 11,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}>
                      {filteredCodes.map((code, i) => (
                        <div key={i} onClick={() => handleSelectCode(code)} style={{
                          padding: '10px', cursor: 'pointer', color: '#fff',
                          backgroundColor: formData.countryCode === code ? '#46a96f' : '#0a2d52',
                          borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '13px',
                        }}>
                          {code}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input type="tel" name="phone" placeholder="00000 00000"
                  value={formData.phone} onChange={handleChange}
                  style={{ flexGrow: 1 }} required />
              </div>
            </label>

            <label>
              Full Address
              <textarea name="address" placeholder="Enter your complete address..."
                value={formData.address} onChange={handleChange} required />
            </label>

            <label>
              Password
              <input type="password" name="password" placeholder="Create a strong password"
                value={formData.password} onChange={handleChange}
                style={inputStyle('password')} required />
              {fieldErrors.password && <span style={{ color: '#ff6b6b', fontSize: '12px' }}>{fieldErrors.password}</span>}
            </label>

            <label>
              Confirm Password
              <input type="password" name="confirmPassword" placeholder="Type your password again"
                value={formData.confirmPassword} onChange={handleChange}
                style={inputStyle('confirmPassword')} required />
              {fieldErrors.confirmPassword && <span style={{ color: '#ff6b6b', fontSize: '12px' }}>{fieldErrors.confirmPassword}</span>}
            </label>

            <button type="submit" className="button form-button"
              style={{ marginTop: '10px', opacity: loading ? 0.7 : 1 }}
              disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '10px' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 'bold' }}>
                Log in
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;