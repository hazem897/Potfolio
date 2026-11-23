import { GraduationCap, Award, BookOpen } from 'lucide-react';
import { educationList } from '../data/education';

const eduIcons = [GraduationCap, Award, BookOpen];

export default function Education() {
  return (
    <section className="education section" id="formation">
      <div className="education-copy reveal-left">
        <div className="section-kicker">FORMATION ACADÉMIQUE</div>
        <h2>
          Construire le socle<br />
          <em>pour aller plus loin.</em>
        </h2>
        <p className="education-lead">
          Un parcours structuré alliant rigueur mathématique, ingénierie informatique et spécialisation décisionnelle.
        </p>
      </div>

      <div className="education-list reveal-stagger">
        {educationList.map((item, index) => {
          const Icon = eduIcons[index] || GraduationCap;
          return (
            <div
              className="education-card reveal"
              key={item.title + index}
              style={{ transitionDelay: `${index * 110}ms` }}
            >
              <div className="education-card-top">
                <span className="education-badge">
                  <Icon size={15} />
                  <span>{item.period}</span>
                </span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.details}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
