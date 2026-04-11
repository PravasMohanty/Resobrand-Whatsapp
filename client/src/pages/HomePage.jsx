import { NavLink } from 'react-router-dom';

import BenefitCard from '../components/BenefitCard';
import FeatureCard from '../components/FeatureCard';
import SectionHeading from '../components/SectionHeading';
import StatCard from '../components/StatCard';
import TestimonialCard from '../components/TestimonialCard';
import TimelineCard from '../components/TimelineCard';
import {
  dashboardHighlights,
  features,
  heroMessages,
  heroMetrics,
  heroStats,
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
              <span>
                Chats into <span className="hero-highlight">Sales Immediately</span>
              </span>
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

        <div className="shell">
          <div className="hero-finish-line" aria-hidden="true" />
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
            <StatCard key={label} value={value} label={label} />
          ))}
        </div>
      </section>

      <section id="features" className="section-block">
        <SectionHeading
          tag="Features"
          title="Everything your team needs to manage WhatsApp seamlessly"
          description="A cleaner, more visual product grid that highlights campaigns, inbox workflows, AI automation, and reporting."
          fullWidth={true}
          centered={true}
        />
        <div className="shell">
          <div className="feature-grid">
            {features.map(([icon, title, text]) => (
              <FeatureCard key={title} icon={icon} title={title} text={text} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <SectionHeading
          tag="How It Works"
          title="Launch in a simple guided flow"
          description="Connect your number, shape your automation, launch campaigns, and scale with live reporting."
          fullWidth={true}
          centered={true}
        />
        <div className="shell">
          <div className="timeline-grid timeline-flow">
            <div className="timeline-track" aria-hidden="true">
              <span className="timeline-track-line" />
              <span className="timeline-track-glow" />
            </div>
            {steps.map(([, title, text], index) => (
              <TimelineCard key={title} title={title} text={text} index={index} />
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
        <SectionHeading
          tag="Why Choose Us"
          title="Built for teams that want speed, clarity, and a better looking workflow"
          description="The product combines official setup, polished inbox design, automation, and practical analytics in one experience."
          fullWidth={true}
          centered={true}
        />
        <div className="shell">
          <div className="benefit-grid">
            {whyChooseUs.map((item) => (
              <BenefitCard key={item} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <SectionHeading
          tag="Testimonials"
          title="Your team notices the upgrade instantly"
          description="From cleaner routing to faster replies, the value shows up in both sales and support workflows."
          fullWidth={true}
          centered={true}
        />
        <div className="shell">
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
              <TestimonialCard key={name} name={name} role={role} quote={quote} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
