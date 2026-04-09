import { NavLink } from 'react-router-dom';

import SectionHeading from '../components/SectionHeading';
import {
  features,
  stats,
  steps,
  testimonials,
  whyChooseUs,
} from '../data/siteData';

function FeatureGlyph({ icon }) {
  const shared = {
    className: 'feature-glyph',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }

  switch (icon) {
    case 'campaigns':
      return (
        <svg {...shared}>
          <path d="M4 14V6l11-2v16L4 18v-4Z" />
          <path d="M15 8h3a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-3" />
          <path d="M7 18v2a2 2 0 0 0 2 2h1" />
        </svg>
      )
    case 'chatbot':
      return (
        <svg {...shared}>
          <rect x="4" y="5" width="16" height="12" rx="4" />
          <path d="M9 11h.01M15 11h.01" />
          <path d="M9 17v2l3-2h4" />
        </svg>
      )
    case 'replies':
      return (
        <svg {...shared}>
          <path d="M7 8h10a3 3 0 0 1 0 6H9" />
          <path d="m12 5-5 3 5 3" />
          <path d="m12 13 5 3-5 3" />
        </svg>
      )
    case 'ai':
      return (
        <svg {...shared}>
          <path d="M12 3a5 5 0 0 0-5 5c0 1.6.7 3 1.8 3.9.8.7 1.2 1.5 1.2 2.4V16h4v-1.7c0-.9.4-1.7 1.2-2.4A4.98 4.98 0 0 0 17 8a5 5 0 0 0-5-5Z" />
          <path d="M10 20h4M10.5 16h3" />
        </svg>
      )
    case 'inbox':
      return (
        <svg {...shared}>
          <path d="M4 7h16v10H4z" />
          <path d="M4 13h4l2 3h4l2-3h4" />
        </svg>
      )
    case 'imports':
      return (
        <svg {...shared}>
          <path d="M12 4v11" />
          <path d="m8 11 4 4 4-4" />
          <path d="M5 19h14" />
        </svg>
      )
    case 'integrations':
      return (
        <svg {...shared}>
          <path d="M9 7V5a2 2 0 1 0-4 0v2" />
          <path d="M15 17v2a2 2 0 1 0 4 0v-2" />
          <path d="M9 12h6" />
          <path d="M7 9h4v6H7zM13 9h4v6h-4z" />
        </svg>
      )
    case 'analytics':
      return (
        <svg {...shared}>
          <path d="M5 19V9" />
          <path d="M12 19V5" />
          <path d="M19 19v-8" />
        </svg>
      )
    case 'approved':
      return (
        <svg {...shared}>
          <path d="M12 3 6 5.5v5.8c0 4 2.6 7.7 6 8.7 3.4-1 6-4.7 6-8.7V5.5L12 3Z" />
          <path d="m9.5 12 1.8 1.8 3.7-4" />
        </svg>
      )
    default:
      return null
  }
}

const heroMetrics = [
  ['3x', 'Higher Conversions'],
  ['24/7', 'Automated Replies'],
  ['90%', 'Time Saved'],
];

const heroMessages = [
  ['left', 'Hi! How can I help your UAE business today?', '10:02 AM'],
  ['right', 'I need bulk marketing for Ramadan offers', '10:02 AM'],
  ['left', 'Perfect! Our campaigns reach 10,000+ customers instantly. Book a free demo?', '10:02 AM'],
];

const heroStats = [
  ['200+', 'UAE Clients', 'floating-left'],
  ['98%', 'Message Open Rate', 'floating-top'],
  ['3x', 'Revenue Growth', 'floating-bottom'],
];

const dashboardHighlights = [
  'Quick product walkthrough',
  'Optimized for desktop and mobile',
  'Ready to swap with your real demo',
];

export default function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-orb hero-orb-three" />

        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="hero-badge-row">
              <span className="hero-badge hero-badge-pill">Meta Approved WhatsApp API</span>
            </div>
            <h1>
              <span>Turn WhatsApp</span>
              <span>Chats into</span>
              <span className="hero-highlight">Sales —</span>
              <span className="hero-highlight">Automatically</span>
            </h1>
            <p>
              Resobrand brings battle-tested Indian tech excellence to the UAE. Automate sales,
              support, and marketing through WhatsApp with a setup trusted by growing businesses.
            </p>
            <div className="hero-actions">
              <NavLink className="button hero-primary-button" to="/pricing">
                Start Free Trial
              </NavLink>
              <NavLink className="button button-outline hero-secondary-button" to="/pricing">
                View Pricing →
              </NavLink>
            </div>
            <div className="hero-benefits">
              {heroMetrics.map(([value, title]) => (
                <article className="hero-benefit-card" key={title}>
                  <strong>{value}</strong>
                  <span>{title}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="device-frame">
              <div className="device-shell-topbar">
                <span />
                <span />
                <span />
              </div>

              <div className="device-top">
                <div className="avatar">🤖</div>
                <div className="device-title-block">
                  <strong>Resobrand Bot</strong>
                  <span>
                    <i className="status-dot" />
                    Online
                  </span>
                </div>
              </div>

              <div className="chat-stack">
                {heroMessages.map(([side, text, time]) => (
                  <div
                    className={`message-row ${side === 'right' ? 'is-outbound' : 'is-inbound'}`}
                    key={`${time}-${text}`}
                  >
                    <div className={`bubble bubble-${side}`}>{text}</div>
                    <span className="bubble-meta">{time}</span>
                  </div>
                ))}
              </div>

              <div className="typing-row">
                <div className="typing-pill" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>

            {heroStats.map(([value, label, className]) => (
              <div className={`floating-card floating-stat ${className}`} key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-strip">
          <div className="strip-marquee">
            <div className="strip-track">
              {[0, 1].map((copy) => (
                <div className="strip-grid" key={copy}>
                  <div className="strip-item">
                    <strong>1000+</strong>
                    <span>Growing businesses</span>
                  </div>
                  <div className="strip-item">
                    <strong>99%</strong>
                    <span>Delivery reliability</span>
                  </div>
                  <div className="strip-item">
                    <strong>Live</strong>
                    <span>Sales and support automations</span>
                  </div>
                  <div className="strip-item">
                    <strong>Responsive</strong>
                    <span>Designed for desktop and mobile teams</span>
                  </div>
                </div>
              ))}
            </div>
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
            title="Everything your team needs to manage WhatsApp beautifully"
            description="A cleaner, more visual product grid that highlights campaigns, inbox workflows, AI automation, and reporting."
          />
          <div className="feature-grid">
            {features.map(([icon, title, text]) => (
              <article className="feature-card" key={title}>
                <span className="feature-icon">
                  <FeatureGlyph icon={icon} />
                </span>
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
            tag="How It Works"
            title="Launch in a simple guided flow"
            description="Connect your number, shape your automation, launch campaigns, and scale with live reporting."
          />
          <div className="timeline-grid timeline-flow">
            <div className="timeline-track" aria-hidden="true">
              <span className="timeline-track-line" />
              <span className="timeline-track-glow" />
            </div>
            {steps.map(([, title, text], index) => (
              <article className="timeline-card timeline-flow-card" key={title}>
                <div className="timeline-node-wrap">
                  <span className="timeline-step">{index + 1}</span>
                  <span className="timeline-node-glow" aria-hidden="true" />
                </div>
                <div className="timeline-copy">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="shell analytics-grid analytics-showcase">
          <div className="analytics-copy">
            <SectionHeading
              tag="Live Dashboard"
              title="Monitor campaigns, replies, and team load in one elegant workspace"
              description="Your operators should be able to understand momentum at a glance, without opening five different tools."
            />
            <p className="supporting-copy">
              Track lead volume, response speed, conversion trends, active agents, and campaign
              performance with a layout built for focus.
            </p>
            <div className="analytics-highlight-row">
              {dashboardHighlights.map((item) => (
                <span className="analytics-highlight-pill" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="video-panel">
            <div className="video-screen video-demo-shell">
              <div className="video-demo-copy">
                <span>Sample Product Demo</span>
                <strong>See the dashboard box turn into your product walkthrough</strong>
                <p>
                  A looping placeholder video is live here for now, so we can shape the spacing,
                  animation, and responsive behavior before your final demo is added.
                </p>
              </div>

              <div className="video-stage">
                <div className="video-stage-glow" aria-hidden="true" />
                <div className="video-badge">Looping sample video</div>
                <video
                  className="video-media"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                >
                  <source
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>

              <div className="video-metrics">
                <article className="dashboard-stat">
                  <span>Media Ready</span>
                  <strong>1080p</strong>
                </article>
                <article className="dashboard-stat">
                  <span>Loads Smoothly</span>
                  <strong>Auto</strong>
                </article>
                <article className="dashboard-stat">
                  <span>Swap Time</span>
                  <strong>1 file</strong>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <div className="shell">
          <SectionHeading
            tag="Why Choose Us"
            title="Built for teams that want speed, clarity, and a better looking workflow"
            description="The product combines official setup, polished inbox design, automation, and practical analytics in one experience."
          />
          <div className="benefit-grid">
            {whyChooseUs.map((item, index) => (
              <article className="benefit-card" key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
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
            title="Teams already using the platform feel the difference quickly"
            description="From cleaner routing to faster replies, the value shows up in both sales and support workflows."
          />
          <div className="testimonial-lead">
            <div>
              <span className="mini-tag">Featured Story</span>
              <h3>From scattered chats to one organized conversion engine</h3>
              <p>
                Use this space for your strongest customer proof, founder walkthrough, or product
                story video.
              </p>
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
    </>
  )
}
