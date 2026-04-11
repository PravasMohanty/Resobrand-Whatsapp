export default function TestimonialCard({ name, role, quote }) {
  return (
    <article className="testimonial-card">
      <p className="testimonial-quote">"{quote}"</p>
      <div className="testimonial-meta">
        <strong>{name}</strong>
        <br />
        <span>{role}</span>
      </div>
    </article>
  );
}
