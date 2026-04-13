import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { navLinks } from '../data/siteData';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hashActive, setHashActive] = useState(null) // tracks which hash section is in view
  const location = useLocation()
  const navigate = useNavigate()
  const observerRef = useRef(null)

  function closeAll() {
    setMenuOpen(false)
  }

  // Collect all hash-based nav targets and observe them
  const hashTargets = navLinks
    .filter(([, to]) => to.startsWith('/#'))
    .map(([, to]) => to.slice(1)) // e.g. '#features' → '#features'

  const updateHashActive = useCallback(() => {
    // Only track hash sections when on the home page
    if (location.pathname !== '/') {
      setHashActive(null)
      return
    }

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const hash = `#${entry.target.id}`
          if (entry.isIntersecting) {
            setHashActive(hash)
          } else {
            setHashActive((prev) => (prev === hash ? null : prev))
          }
        })
      },
      { threshold: 0.15 }
    )

    hashTargets.forEach((hash) => {
      const el = document.querySelector(hash)
      if (el) observer.observe(el)
    })

    observerRef.current = observer
  }, [location.pathname, hashTargets.join(',')])

  useEffect(() => {
    updateHashActive()
    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [updateHashActive])

  // Handle scrolling to hash on initial load or navigation
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }, [location])

  function handleNavClick(e, to) {
    closeAll()

    // Check if this is a hash link (e.g. /#features)
    if (to.startsWith('/#')) {
      e.preventDefault()
      const hash = to.slice(1) // '#features'

      if (location.pathname === '/') {
        // Already on home page — just scroll
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      } else {
        // Navigate to home, then scroll after page renders
        navigate('/' + hash)
      }
      return
    }

    // Home link — scroll to top if already on home page
    if (to === '/' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function getLinkClassName(to, isRouteActive) {
    // For hash links: active only when that section is in view
    if (to.startsWith('/#')) {
      const hash = to.slice(1)
      return `nav-link${hashActive === hash ? ' active' : ''}`
    }

    // For the Home link: active only when on "/" AND no hash section is in view
    if (to === '/') {
      const isHome = isRouteActive && !hashActive
      return `nav-link${isHome ? ' active' : ''}`
    }

    // All other links: default NavLink isActive behaviour
    return `nav-link${isRouteActive ? ' active' : ''}`
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
                to={to.startsWith('/#') ? '/' : to}
                onClick={(e) => handleNavClick(e, to)}
                className={({ isActive }) => getLinkClassName(to, isActive)}
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

