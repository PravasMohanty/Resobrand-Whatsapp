import PageHero from '../components/PageHero';

export default function FeaturePage({ feature }) {
  return (
    <>
      <PageHero tag={feature.eyebrow} title={feature.title} description={feature.description} />

      <section className="section-block">
        <div className="shell feature-page-layout">
          <div className="feature-page-panel">
            <span className="mini-tag">What you get</span>
            <h3>Built as a focused product layer, not a generic checkbox</h3>
            <p>Each feature has its own page and room for screenshots, walkthroughs, pricing nudges, or videos later.</p>
          </div>
          <div className="feature-bullet-list">
            {feature.bullets.map((item) => (
              <article className="feature-bullet" key={item}>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
