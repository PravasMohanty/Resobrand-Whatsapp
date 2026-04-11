import FeatureGlyph from './FeatureGlyph';

export default function FeatureCard({ icon, title, text }) {
  return (
    <article className="feature-card">
      <span className="feature-icon">
        <FeatureGlyph icon={icon} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
