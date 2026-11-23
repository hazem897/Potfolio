import { experiences } from '../data/experiences';

export default function Experience() {
  return (
    <section className="experience section" id="experience">
      <div className="section-kicker reveal">02 — PARCOURS</div>
      <div className="section-heading reveal">
        <h2>Expérience</h2>
        <p>Des missions à l'intersection de la donnée, du produit et du métier.</p>
      </div>

      <div className="experience-list">
        {experiences.map((item, index) => (
          <article
            className="experience-item reveal"
            key={item.company + index}
            style={{ transitionDelay: `${index * 90}ms` }}
          >
            <div className="experience-timeline-col">
              <span className="experience-number">0{index + 1}</span>
              <div className="experience-dot" />
            </div>

            <div className="experience-content-card">
              <div className="experience-header">
                <span className="company-badge">{item.company}</span>
                <span className="experience-period">{item.period}</span>
                <span className="experience-place">· {item.place}</span>
              </div>

              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
