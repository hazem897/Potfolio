import { experiences } from '../data/experiences';
import { useLanguage } from '../context/LanguageContext';

export default function Experience() {
  const { dict } = useLanguage();
  const items = dict.experience.items || experiences;

  return (
    <section className="experience section" id="experience">
      <div className="section-kicker reveal">{dict.experience.kicker}</div>
      <div className="section-heading reveal">
        <h2>{dict.experience.title}</h2>
        <p>{dict.experience.subtitle}</p>
      </div>

      <div className="experience-list">
        {items.map((item, index) => (
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
