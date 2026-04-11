export default function SectionHeading({ tag, title, description, centered = false, fullWidth = false }) {
  return (
    <div className={`section-heading${centered ? ' centered' : ''}${fullWidth ? ' full-width' : ''}`}>
      <span className="section-tag">{tag}</span>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  )
}
