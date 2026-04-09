import { useState } from 'react';

import { NavLink } from 'react-router-dom';

import { navLinks } from '../data/siteData';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeAll() {
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="shell header-shell header-row">
        <NavLink className="brand" to="/" onClick={closeAll}>
          <img className="brand-logo" src="/logo-no-background.png" alt="Resobrand" />
        </NavLink>

        <nav className={`main-nav${menuOpen ? ' open' : ''}`}>
          <div className="nav-links">
            {navLinks.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeAll}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="header-end">
          <NavLink className="button nav-button cta-button nav-cta-desktop" to="/contact" onClick={closeAll}>
            Get Free Demo
          </NavLink>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  )
}
