import SectionHeading from './SectionHeading';

export default function PageHero({ tag, title, description, actions }) {
  return (
    <section className="page-hero">
      <div className="shell">
        <SectionHeading tag={tag} title={title} description={description} centered />
        {actions ? <div className="page-actions">{actions}</div> : null}
      </div>
    </section>
  )
}
