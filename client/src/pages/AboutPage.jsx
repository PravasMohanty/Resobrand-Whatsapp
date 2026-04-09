import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import { team } from '../data/siteData';

export default function AboutPage() {
  return (
    <>
      <PageHero
        tag="About"
        title="A WhatsApp API team built for fast-moving brands"
        description="We combine campaign thinking, automation, support operations, and product design to help businesses scale on WhatsApp."
      />

      <section className="section-block">
        <div className="shell about-layout">
          <div className="about-panel">
            <span className="mini-tag">India x UAE Union</span>
            <h3>Regional understanding with execution depth</h3>
            <p>
              The experience is designed around cross-border teams, regional campaigns, dependable
              support, and rollout systems that can grow from pilot to enterprise.
            </p>
            <div className="union-strip"><span>UAE</span><strong>{'<->'}</strong><span>INDIA</span></div>
          </div>
          <div className="about-points">
            <article>
              <strong>Launch Faster</strong>
              <p>From Meta setup to inbox routing without a bloated implementation cycle.</p>
            </article>
            <article>
              <strong>Design Better Flows</strong>
              <p>Messaging journeys and chatbot logic tailored to your funnel.</p>
            </article>
            <article>
              <strong>Operate With Clarity</strong>
              <p>Analytics, ownership, and cleaner accountability across conversations.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <div className="shell">
          <SectionHeading
            tag="Team"
            title="Meet the people behind the platform"
            description="A 3 by 3 team grid, just like your notes requested."
          />
          <div className="team-grid">
            {team.map((role) => (
              <article className="team-card" key={role}>
                <div className="team-avatar" aria-hidden="true" />
                <h3>{role}</h3>
                <p>Focused on building a smoother WhatsApp growth experience for every client.</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
