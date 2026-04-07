import PageHero from '../components/PageHero';
import { cases } from '../data/siteData';

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        tag="Case Studies"
        title="Use cases that translate WhatsApp activity into growth"
        description="A reusable 3 x 3 case-study grid adapted from the source HTML."
      />

      <section className="section-block">
        <div className="shell case-grid">
          {cases.map((item, index) => (
            <article className="case-card" key={item}>
              <span className="case-index">0{index + 1}</span>
              <h3>{item}</h3>
              <p>Campaign strategy, automation, handoff logic, and reporting mapped to business outcomes.</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
