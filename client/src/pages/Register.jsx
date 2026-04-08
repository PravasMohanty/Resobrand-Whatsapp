import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Comprehensive array of world country codes
const countryCodes = [
  "+93 (AF)", "+358 (AX)", "+355 (AL)", "+213 (DZ)", "+1684 (AS)", "+376 (AD)", "+244 (AO)", "+1264 (AI)", "+672 (AQ)", "+1268 (AG)", "+54 (AR)", "+374 (AM)", "+297 (AW)", "+61 (AU)", "+43 (AT)", "+994 (AZ)", "+1242 (BS)", "+973 (BH)", "+880 (BD)", "+1246 (BB)", "+375 (BY)", "+32 (BE)", "+501 (BZ)", "+229 (BJ)", "+1441 (BM)", "+975 (BT)", "+591 (BO)", "+387 (BA)", "+267 (BW)", "+55 (BR)", "+246 (IO)", "+673 (BN)", "+359 (BG)", "+226 (BF)", "+257 (BI)", "+855 (KH)", "+237 (CM)", "+1 (CA)", "+238 (CV)", "+1345 (KY)", "+236 (CF)", "+235 (TD)", "+56 (CL)", "+86 (CN)", "+61 (CX)", "+61 (CC)", "+57 (CO)", "+269 (KM)", "+242 (CG)", "+243 (CD)", "+682 (CK)", "+506 (CR)", "+225 (CI)", "+385 (HR)", "+53 (CU)", "+357 (CY)", "+420 (CZ)", "+45 (DK)", "+253 (DJ)", "+1767 (DM)", "+1809 (DO)", "+593 (EC)", "+20 (EG)", "+503 (SV)", "+240 (GQ)", "+291 (ER)", "+372 (EE)", "+251 (ET)", "+500 (FK)", "+298 (FO)", "+679 (FJ)", "+358 (FI)", "+33 (FR)", "+594 (GF)", "+689 (PF)", "+241 (GA)", "+220 (GM)", "+995 (GE)", "+49 (DE)", "+233 (GH)", "+350 (GI)", "+30 (GR)", "+299 (GL)", "+1473 (GD)", "+590 (GP)", "+1671 (GU)", "+502 (GT)", "+44 (GG)", "+224 (GN)", "+245 (GW)", "+592 (GY)", "+509 (HT)", "+379 (VA)", "+504 (HN)", "+852 (HK)", "+36 (HU)", "+354 (IS)", "+91 (IN)", "+62 (ID)", "+98 (IR)", "+964 (IQ)", "+353 (IE)", "+44 (IM)", "+972 (IL)", "+39 (IT)", "+1876 (JM)", "+81 (JP)", "+44 (JE)", "+962 (JO)", "+7 (KZ)", "+254 (KE)", "+686 (KI)", "+850 (KP)", "+82 (KR)", "+965 (KW)", "+996 (KG)", "+856 (LA)", "+371 (LV)", "+961 (LB)", "+266 (LS)", "+231 (LR)", "+218 (LY)", "+423 (LI)", "+370 (LT)", "+352 (LU)", "+853 (MO)", "+389 (MK)", "+261 (MG)", "+265 (MW)", "+60 (MY)", "+960 (MV)", "+223 (ML)", "+356 (MT)", "+692 (MH)", "+596 (MQ)", "+222 (MR)", "+230 (MU)", "+262 (YT)", "+52 (MX)", "+691 (FM)", "+373 (MD)", "+377 (MC)", "+976 (MN)", "+382 (ME)", "+1664 (MS)", "+212 (MA)", "+258 (MZ)", "+95 (MM)", "+264 (NA)", "+674 (NR)", "+977 (NP)", "+31 (NL)", "+599 (AN)", "+687 (NC)", "+64 (NZ)", "+505 (NI)", "+227 (NE)", "+234 (NG)", "+683 (NU)", "+672 (NF)", "+1670 (MP)", "+47 (NO)", "+968 (OM)", "+92 (PK)", "+680 (PW)", "+970 (PS)", "+507 (PA)", "+675 (PG)", "+595 (PY)", "+51 (PE)", "+63 (PH)", "+48 (PL)", "+351 (PT)", "+1787 (PR)", "+974 (QA)", "+40 (RO)", "+7 (RU)", "+250 (RW)", "+262 (RE)", "+590 (BL)", "+290 (SH)", "+1869 (KN)", "+1758 (LC)", "+590 (MF)", "+508 (PM)", "+1784 (VC)", "+685 (WS)", "+378 (SM)", "+239 (ST)", "+966 (SA)", "+221 (SN)", "+381 (RS)", "+248 (SC)", "+232 (SL)", "+65 (SG)", "+421 (SK)", "+386 (SI)", "+677 (SB)", "+252 (SO)", "+27 (ZA)", "+500 (GS)", "+34 (ES)", "+94 (LK)", "+249 (SD)", "+597 (SR)", "+47 (SJ)", "+268 (SZ)", "+46 (SE)", "+41 (CH)", "+963 (SY)", "+886 (TW)", "+992 (TJ)", "+255 (TZ)", "+66 (TH)", "+670 (TL)", "+228 (TG)", "+690 (TK)", "+676 (TO)", "+1868 (TT)", "+216 (TN)", "+90 (TR)", "+993 (TM)", "+1649 (TC)", "+688 (TV)", "+256 (UG)", "+380 (UA)", "+971 (AE)", "+44 (GB)", "+1 (US)", "+598 (UY)", "+998 (UZ)", "+678 (VU)", "+58 (VE)", "+84 (VN)", "+1284 (VG)", "+1340 (VI)", "+681 (WF)", "+212 (EH)", "+967 (YE)", "+260 (ZM)", "+263 (ZW)"
];

const Register = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCode, setSelectedCode] = useState('+91 (IN)');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredCodes = countryCodes.filter(code =>
    code.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleSelectCode = (code) => {
    setSelectedCode(code);
    setSearchInput('');
    setDropdownOpen(false);
  };
  return (
    <div className="app-shell muted">
      <div className="shell">
        
        {/* Page Header */}
        <div className="page-hero">
          <h2>Create an Account</h2>
          <p>Join us today by filling out your details below.</p>
        </div>

        {/* Form Container */}
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingBottom: '80px' }}>
          <form className="contact-form">
            
            <label>
              Full Name
              <input type="text" placeholder="John Doe" required />
            </label>

            <label>
              Gmail (Email Address)
              <input type="email" placeholder="name@gmail.com" required />
            </label>

            {/* Age & Gender Side-by-Side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              <label>
                Age
                <input type="number" placeholder="e.g. 25" min="1" required />
              </label>

              {/* Gender Radio Buttons */}
              <div style={{ display: 'grid', gap: '8px', color: 'var(--text-main)', fontWeight: '500' }}>
                Gender
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  padding: '14px 16px',
                  borderRadius: '18px',
                  border: '1px solid var(--border-strong)',
                  background: 'rgba(255, 255, 255, 0.03)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '400', cursor: 'pointer', margin: 0 }}>
                    <input type="radio" name="gender" value="male" style={{ width: 'auto', padding: 0, margin: 0, accentColor: 'var(--brand)' }} required />
                    Male
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '400', cursor: 'pointer', margin: 0 }}>
                    <input type="radio" name="gender" value="female" style={{ width: 'auto', padding: 0, margin: 0, accentColor: 'var(--brand)' }} required />
                    Female
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '400', cursor: 'pointer', margin: 0 }}>
                    <input type="radio" name="gender" value="other" style={{ width: 'auto', padding: 0, margin: 0, accentColor: 'var(--brand)' }} required />
                    Other
                  </label>
                </div>
              </div>

            </div>

            {/* Changed from Dropdown to Text Input */}
            <label>
              Country
              <input type="text" placeholder="e.g. India" required />
            </label>

            <label>
              Contact Number
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Searchable Country Code Dropdown */}
                <div style={{ position: 'relative', width: '130px', flexShrink: 0 }}>
                  <input
                    type="text"
                    placeholder={selectedCode}
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    style={{
                      width: '100%',
                      color: '#ffffff',
                      backgroundColor: '#0a2d52',
                      border: '1px solid rgba(255, 255, 255, 0.24)',
                      borderRadius: '8px',
                      padding: '10px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  />
                  {dropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: '#0a2d52',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 10,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {filteredCodes.length > 0 ? (
                        filteredCodes.map((code, index) => (
                          <div
                            key={index}
                            onClick={() => handleSelectCode(code)}
                            style={{
                              padding: '10px',
                              cursor: 'pointer',
                              color: '#ffffff',
                              backgroundColor: selectedCode === code ? '#46a96f' : '#0a2d52',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                              transition: 'background-color 0.2s',
                              fontSize: '13px'
                            }}
                            onMouseEnter={(e) => {
                              if (selectedCode !== code) {
                                e.target.style.backgroundColor = 'rgba(70, 169, 111, 0.3)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedCode !== code) {
                                e.target.style.backgroundColor = '#0a2d52';
                              }
                            }}
                          >
                            {code}
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '10px', color: '#d4e3eb', fontSize: '13px' }}>
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <input 
                  type="tel" 
                  placeholder="00000 00000" 
                  style={{ flexGrow: 1 }} 
                  required 
                />
              </div>
              <input type="hidden" name="country_code" value={selectedCode.split(' ')[0]} />
            </label>

            <label>
              Full Address
              <textarea placeholder="Enter your complete address..." required></textarea>
            </label>

            <label>
              Password
              <input type="password" placeholder="Create a strong password" required />
            </label>

            <label>
              Confirm Password
              <input type="password" placeholder="Type your password again" required />
            </label>

            <button type="submit" className="button form-button" style={{ marginTop: '10px' }}>
              Create Account
            </button>

            {/* Link to Login */}
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