export default function SectionHeading({ tag, title, description, centered = false }) {
  return (
    <div className={`section-heading${centered ? ' centered' : ''}`}>
      <span className="section-tag">{tag}</span>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  )
}
