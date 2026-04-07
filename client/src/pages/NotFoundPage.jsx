import { NavLink } from 'react-router-dom';

import PageHero from '../components/PageHero';

export default function NotFoundPage() {
  return (
    <>
      <PageHero
        tag="Page Not Found"
        title="We couldn't find that page"
        description="Use the navigation above to return to a valid section of the site."
      />
      <section className="section-block">
        <div className="shell coming-soon-card">
          <h3>Looks like this route does not exist yet.</h3>
          <p>Use the available pages or go back home.</p>
          <NavLink className="button" to="/">Go Home</NavLink>
        </div>
      </section>
    </>
  )
}
