import { NavLink } from 'react-router-dom';

import PageHero from '../components/PageHero';
import PricingCard from '../components/PricingCard';
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
        description="Start free, upgrade as you grow. No hidden charges."
        actions={
          <>
            <NavLink className="button" to="/contact">Start Free Trial</NavLink>
            <NavLink className="button button-outline" to="/contact">Talk to Sales</NavLink>
          </>
        }
      />

      <section className="section-block">
        <div className="shell">
          <div className="pricing-grid">
            {pricing.map((card) => (
              <PricingCard card={card} key={card.name} />
            ))}
          </div>
          <div className="addons-row">
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
