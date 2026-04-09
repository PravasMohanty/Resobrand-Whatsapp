import { useState } from 'react';

import { NavLink } from 'react-router-dom';

import {
  featurePages,
  navLinks,
} from '../data/siteData';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)

  function closeAll() {
    setMenuOpen(false)
    setFeaturesOpen(false)
  }

  return (
    <header className="site-header">
      <div className="shell header-row">
        <NavLink className="brand" to="/" onClick={closeAll}>
          <img className="brand-logo" src="/logo-no-background.png" alt="Resobrand" />
        </NavLink>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => {
            setMenuOpen((open) => !open)
            setFeaturesOpen(false)
          }}
        >
          <span className="hamburger-icon" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

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
            <div className={`feature-dropdown${featuresOpen ? ' open' : ''}`}>
              <button
                className="feature-dropdown-button"
                type="button"
                aria-expanded={featuresOpen}
                onClick={() => setFeaturesOpen((open) => !open)}
              >
                Features
                <span className="dropdown-arrow">▾</span>
              </button>
              <div className="feature-dropdown-menu">
                {featurePages.map((item) => (
                  <NavLink
                    key={item.slug}
                    className="dropdown-link"
                    to={`/features/${item.slug}`}
                    onClick={closeAll}
                  >
                    {item.nav}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <NavLink className="button nav-button" to="/contact" onClick={closeAll}>
            Book Demo
          </NavLink>
          <NavLink className="button nav-button" to="/login" onClick={closeAll}>
            Login
          </NavLink>

          <NavLink className="button nav-button" to="/register" onClick={closeAll}>
           Registration
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
