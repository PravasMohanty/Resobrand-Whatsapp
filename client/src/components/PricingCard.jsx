import { NavLink } from 'react-router-dom';

export default function PricingCard({ card }) {
  return (
    <article className={`pricing-card${card.featured ? ' featured' : ''}`}>
      {card.featured && <span className="pricing-recommended">Recommended</span>}
      <p className="pricing-name">{card.name}</p>
      <p className="pricing-subtext">{card.subtext}</p>
      <p className="pricing-amount">{card.price}</p>
      <p className="pricing-detail">{card.detail}</p>
      {card.monthly ? <p className="pricing-monthly">{card.monthly}</p> : null}
      <div className="pricing-divider" />
      <div className="pricing-features">
        {card.items.map(([allowed, text]) => (
          <div className={`pricing-feature${allowed ? '' : ' off'}`} key={text}>
            <span className={`pricing-check ${allowed ? 'tick' : 'cross'}`}>
              {allowed ? '✓' : '✕'}
            </span>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <NavLink className={`button${card.featured ? '' : ' button-outline'}`} to="/contact">
        {card.cta}
      </NavLink>
    </article>
  )
}
