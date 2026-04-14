export default function TestimonialCard({ name, role, company, quote }) {
  return (
    <article className="testimonial-card">
      <p className="testimonial-quote">"{quote}"</p>

      <div className="testimonial-meta">
        <strong>{name}</strong>
        <br />
        <span>{role},&nbsp;{company}</span>
      </div>

    </article>
  );
}