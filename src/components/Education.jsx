import { educationList } from '../data/education';

export default function Education() {
  return (
    <section className="education section">
      <div className="education-copy">
        <div className="section-kicker">FORMATION</div>
        <h2>
          Construire le socle<br />
          <em>pour aller plus loin.</em>
        </h2>
      </div>

      <div className="education-list">
        {educationList.map((item, index) => (
          <div key={item.title + index}>
            <span>{item.period}</span>
            <h3>{item.title}</h3>
            <p>{item.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
