import { GraduationCap, Award, BookOpen } from 'lucide-react';
import { educationList } from '../data/education';
import { useLanguage } from '../context/LanguageContext';

const eduIcons = [GraduationCap, Award, BookOpen];

export default function Education() {
  const { dict } = useLanguage();
  const items = dict.education.items || educationList;

  return (
    <section className="education section" id="formation">
      <div className="education-copy reveal-left">
        <div className="section-kicker">{dict.education.kicker}</div>
        <h2>
          {dict.education.titleLine1}<br />
          <em>{dict.education.titleLine2}</em>
        </h2>
        <p className="education-lead">
          {dict.education.lead}
        </p>
      </div>

      <div className="education-list reveal-stagger">
        {items.map((item, index) => {
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
