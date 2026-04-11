import PageHero from '../components/PageHero';
import { cases } from '../data/siteData';

function CaseIcon({ item }) {
  const shared = {
    className: 'case-icon-svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }

  if (item.includes('Property')) {
    return (
      <svg {...shared}>
        <path d="M3 10.5 12 4l9 6.5" />
        <path d="M5 9.5V20h14V9.5" />
        <path d="M10 20v-5h4v5" />
      </svg>
    )
  }

  if (item.includes('Restaurant')) {
    return (
      <svg {...shared}>
        <path d="M7 4v8" />
        <path d="M10 4v8" />
        <path d="M7 8h3" />
        <path d="M10 12v8" />
        <path d="M15 4c2 2 2 6 0 8v8" />
      </svg>
    )
  }

  if (item.includes('E-commerce') || item.includes('D2C')) {
    return (
      <svg {...shared}>
        <path d="M4 7h16l-2 10H6L4 7Z" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      </svg>
    )
  }

  if (item.includes('Healthcare')) {
    return (
      <svg {...shared}>
        <path d="M12 4v16" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h8" />
        <path d="M6 7h1M17 7h1" />
      </svg>
    )
  }

  if (item.includes('Education')) {
    return (
      <svg {...shared}>
        <path d="m3 8 9-4 9 4-9 4-9-4Z" />
        <path d="M7 10.5V15c0 1.7 2.2 3 5 3s5-1.3 5-3v-4.5" />
      </svg>
    )
  }

  if (item.includes('Travel')) {
    return (
      <svg {...shared}>
        <path d="m3 16 18-8" />
        <path d="m3 8 7 3 3 7 8-15-15 8-3 5Z" />
      </svg>
    )
  }

  if (item.includes('Automotive')) {
    return (
      <svg {...shared}>
        <path d="M5 16l1.5-5h11L19 16" />
        <path d="M7 11l2-4h6l2 4" />
        <path d="M6 16h.01M18 16h.01" />
      </svg>
    )
  }

  if (item.includes('Service-business')) {
    return (
      <svg {...shared}>
        <path d="M6 8h12v8H6z" />
        <path d="M9 20h6" />
        <path d="M12 16v4" />
      </svg>
    )
  }

  return (
    <svg {...shared}>
      <path d="M12 3v18" />
      <path d="M3 12h18" />
    </svg>
  )
}

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
          {cases.map((item) => (
            <article className="case-card" key={item}>
              <span className="case-icon">
                <CaseIcon item={item} />
              </span>
              <h3>{item}</h3>
              <p>Campaign strategy, automation, handoff logic, and reporting mapped to business outcomes.</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
