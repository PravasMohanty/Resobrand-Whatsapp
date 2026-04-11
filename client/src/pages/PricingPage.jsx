import PageHero from '../components/PageHero';
import PricingCard from '../components/PricingCard';
import SectionHeading from '../components/SectionHeading';
import {
  addons,
  pricing,
} from '../data/siteData';

export default function PricingPage() {
  return (
    <>
      <PageHero
        tag="Pricing"
        title="Straightforward pricing for every stage of growth"
        description="Compare plans in a cleaner pricing table layout with clear monthly value, yearly billing context, and feature-by-feature visibility."
      />

      <section className="section-block muted">
        <div className="shell">
          <SectionHeading
            tag="Features"
            title="Want more detail?"
            description="Jump to the homepage features section for a closer look at what the product offers."
            fullWidth
          />
          <div className="page-actions">
            <a className="button hero-secondary-button" href="/#features">
              View Homepage Features
            </a>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="shell">
          <div className="pricing-grid pricing-compare-grid">
            {pricing.map((card) => (
              <PricingCard card={card} key={card.name} />
            ))}
          </div>
          <div className="addons-row pricing-addon-row">
            {addons.map(([name, price]) => (
              <article className="addon-card" key={name}>
                <span>{name}</span>
                <strong>{price}</strong>
              </article>
            ))}
          </div>
          <div className="note-card">
            <strong>Mandatory Note</strong>
            <p>
              Meta conversation charges are billed separately based on your WhatsApp usage category
              and region. Platform pricing above covers the Resobrand product layer only.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
