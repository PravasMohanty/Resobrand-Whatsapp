import { NavLink } from 'react-router-dom';

import SectionHeading from '../components/SectionHeading';
import {
  features,
  stats,
  steps,
  testimonials,
  whyChooseUs,
} from '../data/siteData';

const featureIcons = ['📢', '🤖', '⚡', '🧠', '📥', '📋', '🔗', '📊', '✅'];
const benefitIcons = ['🛡️', '🌍', '🚀', '📬', '💬', '🤖', '🔗', '🎯', '📈'];

export default function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="hero-badge">Meta Approved WhatsApp API</span>
            <h1>
              Scale customer conversations with a smarter
              <span> WhatsApp growth engine</span>
            </h1>
            <p>
              Launch campaigns, automate replies, manage team conversations, and track outcomes
              from one WhatsApp API workspace built for India and the UAE.
            </p>
            <div className="hero-actions">
              <NavLink className="button" to="/pricing">
                Start Free Trial
              </NavLink>
              <NavLink className="button button-outline" to="/contact">
                Book Demo
              </NavLink>
            </div>
            <div className="hero-flags">
              <span>UAE</span>
              <strong>+</strong>
              <span>India</span>
              <p>Built for cross-market teams who need compliant growth and dependable support.</p>
            </div>
          </div>
          <div className="hero-visual">
            <div className="device-frame">
              <div className="device-top">
                <div className="avatar">R</div>
                <div>
                  <strong>Resobrand Inbox</strong>
                  <span>Live / AI assisted</span>
                </div>
              </div>
              <div className="chat-stack">
                <div className="bubble bubble-left">New lead from Ramadan campaign. Interested in enterprise onboarding.</div>
                <div className="bubble bubble-right">AI summary ready. Suggested next step: schedule demo with pricing context.</div>
                <div className="bubble bubble-left">Agent Priya picked this up from the shared inbox.</div>
              </div>
            </div>
            <div className="floating-card floating-top"><strong>98.4%</strong><span>delivery quality</span></div>
            <div className="floating-card floating-left"><strong>24/7</strong><span>AI + human cover</span></div>
            <div className="floating-card floating-bottom"><strong>12M+</strong><span>messages processed</span></div>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="shell stats-grid">
          {stats.map(([value, label]) => (
            <article className="stat-card" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="shell">
          <SectionHeading
            tag="Features"
            title="Everything your team needs to run WhatsApp at scale"
            description="Bulk campaigns, AI agents, shared inbox, analytics, and integrations in one platform."
          />
          <div className="feature-grid">
            {features.map(([, title, text], index) => (
              <article className="feature-card" key={title}>
                <span className="feature-icon">{featureIcons[index] || '⭐'}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <div className="shell">
          <SectionHeading
            tag="How To Get Started"
            title="Go live in four simple steps"
            description="Connect, configure, launch, and scale — with hands-on support at every step."
          />
          <div className="timeline-grid">
            {steps.map(([step, title, text]) => (
              <article className="timeline-card" key={step}>
                <span className="timeline-step">{step}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="shell analytics-grid">
          <div>
            <SectionHeading
              tag="Realtime Analytical Dashboard"
              title="See campaigns, replies, and team performance in one view"
              description="Track delivery, response times, team load, and conversion — all from a single dashboard."
            />
            <p className="supporting-copy">
              Monitor campaign delivery, response windows, team occupancy, conversion trends, and
              message outcomes without jumping across tools.
            </p>
          </div>
          <div className="video-panel">
            <div className="video-screen">
              <span>Dashboard Preview</span>
              <strong>Campaign ROI / Agent Load / Live Replies</strong>
              <p>Video placeholder — coming soon.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <div className="shell">
          <SectionHeading
            tag="Why Choose Us"
            title="Reasons teams choose Resobrand to power WhatsApp growth"
            description="Built for compliance, speed, and real business outcomes."
          />
          <div className="benefit-grid">
            {whyChooseUs.map((item, index) => (
              <article className="benefit-card" key={item}>
                <span className="benefit-icon">{benefitIcons[index] || '✓'}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="shell">
          <SectionHeading
            tag="Testimonials"
            title="Proof from teams already running WhatsApp with us"
            description="Real results from clients in real estate, healthcare, e-commerce, and more."
          />
          <div className="testimonial-lead">
            <div>
              <span className="mini-tag">Customer Story Video</span>
              <h3>How teams move from scattered replies to one high-converting inbox</h3>
              <p>Watch how teams have transformed their WhatsApp workflows with Resobrand.</p>
            </div>
            <div className="video-mini">Play Demo Story</div>
          </div>
          <div className="testimonial-grid">
            {testimonials.map(([name, role, quote]) => (
              <article className="testimonial-card" key={name}>
                <p className="testimonial-quote">"{quote}"</p>
                <div className="testimonial-meta">
                  <strong>{name}</strong>
                  <span>{role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="shell cta-panel">
          <div>
            <span className="section-tag">Ready To Scale</span>
            <h2>Build your next WhatsApp revenue channel with confidence</h2>
          </div>
          <div className="cta-actions">
            <NavLink className="button" to="/contact">Start Free Trial</NavLink>
            <NavLink className="button button-outline" to="/contact">Book Demo</NavLink>
          </div>
        </div>
      </section>
    </>
  )
}
