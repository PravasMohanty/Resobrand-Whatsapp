export default function TimelineCard({ title, text, index }) {
  return (
    <article className="timeline-card timeline-flow-card" style={{ paddingTop: '20px' }}>
      <div className="timeline-node-wrap">
        <span className="timeline-step">{index + 1}</span>
        <span className="timeline-node-glow" aria-hidden="true" />
      </div>
      <div className="timeline-copy">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  )
}