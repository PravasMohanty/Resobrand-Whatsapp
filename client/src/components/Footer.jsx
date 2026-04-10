import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <section className="pre-footer">
        <div className="shell pre-footer-grid">
          <div>
            {/* <span className="mini-tag">Pre Footer</span> */}
            <h3>Need a tailored rollout plan for your team?</h3>
            <p>
              We can shape the inbox, campaigns, automations, and reporting around your exact
              sales or support process.
            </p>
          </div>
          <div className="triple-buttons">
            <NavLink className="button" to="/contact">Start Trial</NavLink>
            <NavLink className="button button-outline" to="/pricing">View Pricing</NavLink>
            <NavLink className="button button-outline" to="/case-studies">See Case Studies</NavLink>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <NavLink className="brand" to="/">
              <img className="brand-logo" src="/logo-no-background.png" alt="Resobrand" />
            </NavLink>
            <p>Scale your WhatsApp conversations with campaigns, AI, and a shared team inbox — built for India and the UAE.</p>
          </div>
          <div className="footer-column">
            <h4>Product</h4>
            <NavLink to="/features/bulk-messaging">WhatsApp Campaigns</NavLink>
            <NavLink to="/features/chatbox">Shared Inbox</NavLink>
            <NavLink to="/features/lead-imports">Lead Imports</NavLink>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <NavLink to="/case-studies">Case Studies</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/contact">Book Demo</NavLink>
          </div>
        </div>
        <div className="shell footer-bottom">
          <p>(c) 2026 Resobrand. All rights reserved.</p>
          <p>Meta charges apply separately where relevant.</p>
        </div>
      </footer>
    </>
  )
}
