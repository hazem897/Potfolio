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
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <span className="experience-number">0{index + 1}</span>
            <div className="experience-period">{item.period}</div>
            <div className="experience-content">
              <h3>{item.title}</h3>
              <p className="company">
                <span className="company-badge">{item.company}</span>
                <span> · {item.place}</span>
              </p>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
