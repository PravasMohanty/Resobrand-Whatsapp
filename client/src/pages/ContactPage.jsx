import PageHero from '../components/PageHero';

export default function ContactPage() {
  return (
    <>
      <PageHero
        tag="Contact"
        title="Tell us what you want to build on WhatsApp"
        description="A contact section with form elements, supporting company details, and next-step guidance."
      />

      <section className="section-block" id="contact">
        <div className="shell contact-layout">
          <form className="contact-form">
            <label>
              Full Name
              <input type="text" placeholder="Your name" />
            </label>
            <label>
              Business Email
              <input type="email" placeholder="name@company.com" />
            </label>
            <label>
              WhatsApp Number
              <input type="tel" placeholder="+91 / +971" />
            </label>
            <label>
              Company Name
              <input type="text" placeholder="Your company" />
            </label>
            <label>
              Service Interested In
              <select defaultValue="WhatsApp API">
                <option>WhatsApp API</option>
                <option>Bulk Campaigns</option>
                <option>Chatbot + AI Agent</option>
                <option>Integrations</option>
              </select>
            </label>
            <label>
              Project Brief
              <textarea placeholder="Tell us about your use case, team, and goals." />
            </label>
            <button className="button form-button" type="button">Book Free Demo</button>
          </form>

          <div className="contact-side">
            <article className="contact-info-card">
              <span>Email:&nbsp;</span>
              <strong>hello@resobrand.com</strong>
            </article>
            <article className="contact-info-card">
              <span>Support Window:&nbsp;</span>
              <strong>24/7 rollout assistance</strong>
            </article>
            <article className="contact-info-card">
              <span>Markets:&nbsp;</span>
              <strong>India / UAE / Remote-first delivery</strong>
            </article>
            <div className="contact-promise">
              <span className="mini-tag">What happens next</span>
              <p>
                We review your use case, suggest the right setup, and map the fastest route from demo to launch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
