import { NavLink } from 'react-router-dom';

const preFooterPoints = [
  'Meta Official Partner',
  'UAE Business Compliant',
  'GDPR & PDPA Ready',
  'Arabic Language Support',
  'Green Tick Assistance',
  '99.9% Uptime SLA',
];

const footerGroups = [
  {
    title: 'Product',
    links: [
      ['Features', '/features/ban-proof-api'],
      ['Pricing', '/pricing'],
      ['How It Works', '/#'],
      ['Integrations', '/features/webhooks-integrations'],
      ['API Documentation', '/contact'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About Us', '/about'],
      ['Case Studies', '/case-studies'],
      ['Blog', '/blog'],
      ['Contact', '/contact'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Help Center', '/contact'],
      ['Community', '/blog'],
      ['Tutorials', '/blog'],
      ['Webinars', '/contact'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Privacy Policy', '/contact'],
      ['Terms of Service', '/contact'],
      ['Cookie Policy', '/contact'],
      ['GDPR', '/contact'],
    ],
  },
];

export default function Footer() {
  return (
    <>
      <section className="pre-footer pre-footer-centered">
        <div className="shell">
          <div className="pre-footer-card">
            <div className="pre-footer-stack">
              <h3>Ready to scale your UAE business?</h3>
              <p>
                Join 200+ UAE companies using Resobrand to automate WhatsApp. 14-day free trial,
                no credit card needed.
              </p>
              <div className="pre-footer-actions">
                <NavLink className="button hero-primary-button" to="/contact">
                  Start Free Trial Today
                </NavLink>
                <NavLink className="button button-outline hero-secondary-button" to="/pricing">
                  See All Plans →
                </NavLink>
              </div>
            </div>
          </div>

          <div className="pre-footer-chip-row">
            {preFooterPoints.map((item) => (
              <span className="pre-footer-chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer footer-expanded">
        <div className="shell footer-top-grid">
          <div className="footer-brand-panel">
            <NavLink className="brand footer-brand-link" to="/">
              <img className="brand-logo footer-brand-logo" src="/logo-no-background.png" alt="Resobrand" />
            </NavLink>
            <p>
              Transform your WhatsApp into a powerful sales and conversion machine. Automate,
              engage, and grow with one clean platform.
            </p>
            <a className="footer-contact-line" href="mailto:hello@resobrand.com">
              hello@resobrand.com
            </a>
            <a className="footer-contact-line" href="tel:+918181010404">
              +91 81810 10404
            </a>
          </div>

          {footerGroups.map((group) => (
            <div className="footer-column" key={group.title}>
              <h4>{group.title}</h4>
              {group.links.map(([label, to]) => (
                <NavLink key={label} to={to}>
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        <div className="shell footer-bottom">
          <p>© 2026 Resobrand. All rights reserved.</p>
          <p>Meta conversation charges apply separately based on usage and region.</p>
        </div>
      </footer>
    </>
  )
}
