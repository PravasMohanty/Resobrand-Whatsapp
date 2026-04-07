import PageHero from '../components/PageHero';

export default function BlogPage() {
  return (
    <>
      <PageHero
        tag="Blog"
        title="Content hub is on the way"
        description="You asked for Blog: Coming Soon, so this page is intentionally simple."
      />
      <section className="section-block">
        <div className="shell coming-soon-card">
          <span className="mini-tag">Coming Soon</span>
          <h3>Guides, feature updates, case breakdowns, and WhatsApp playbooks</h3>
          <p>This area can grow into article cards and single-post routes later without changing the app structure.</p>
        </div>
      </section>
    </>
  )
}
