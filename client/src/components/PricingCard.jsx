import { NavLink } from 'react-router-dom';

export default function PricingCard({ card }) {
  return (
    <article className={`pricing-card pricing-compare-card${card.featured ? ' featured' : ''}`}>
      <div className="pricing-card-head">
        <p className="pricing-name">{card.name}</p>
        <p className="pricing-subtext">{card.subtext}</p>
      </div>

      <div className="pricing-price-panel">
        <div className="pricing-price-line">
          <span className="pricing-currency">$</span>
          <span className="pricing-amount">{card.price.replace('$', '')}</span>
          {card.name === 'Free' ? (
            <span className="pricing-period">/14 days</span>
          ) : (
            <span className="pricing-period">/month</span>
          )}
        </div>

        <p className="pricing-detail">{card.detail}</p>
        {card.monthly ? <p className="pricing-monthly">or {card.monthly}</p> : null}
      </div>

      <div className="pricing-card-body">
        <div className="pricing-billing-row">
          <span className="pricing-billing-icon">#</span>
          <p>{card.name === 'Free' ? 'Free for 14 days' : card.detail}</p>
        </div>

        <div className="pricing-divider" />

        <div className="pricing-features">
          {card.items.map(([allowed, text]) => (
            <div className={`pricing-feature${allowed ? '' : ' off'}`} key={text}>
              <span className="pricing-feature-icon">{allowed ? '✓' : '–'}</span>
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
