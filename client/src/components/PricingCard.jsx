import { NavLink } from 'react-router-dom';

export default function PricingCard({ card }) {
  return (
    <article className={`pricing-card pricing-compare-card${card.featured ? ' featured' : ''}`}>
      {card.featured && <span className="pricing-recommended">★ Recommended</span>}
      <div className="pricing-card-head">
        <p className="pricing-name">{card.name}</p>
        <p className="pricing-subtext">{card.subtext}</p>
      </div>

      <div className="pricing-card-body">
        <div className="pricing-billing-row">
          <p>{card.name === 'Free' ? 'Free for 14 days' : card.detail}</p>
        </div>

        <div className="pricing-divider" />

        <div className="pricing-features">
          {card.items.map(([allowed, text]) => (
            <div className={`pricing-feature${allowed ? '' : ' off'}`} key={text}>
              <span className="pricing-feature-icon">{allowed ? '\u2713' : '\u2715'}</span>
              <p>{text}</p>
            </div>
          ))}
        </div>

        <NavLink className={`button pricing-button${card.featured ? '' : ' button-outline'}`} to="/contact">
          {card.cta}
        </NavLink>
      </div>
    </article>
  )
}
