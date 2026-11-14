import { skillGroups, skillLogos } from '../data/skills';

function SkillTag({ item }) {
  const logoKey = Object.keys(skillLogos).find((key) => item.startsWith(key));
  return (
    <span className="skill-tag">
      {logoKey && <img src={skillLogos[logoKey]} alt="" aria-hidden="true" />}
      {item}
    </span>
  );
}

export default function Skills() {
  return (
    <section className="skills section" id="competences">
      <div className="section-kicker">04 — EXPERTISE</div>
      <div className="section-heading">
        <h2>Compétences</h2>
        <p>Une boîte à outils pensée pour passer de la donnée brute à l’insight.</p>
      </div>

      <div className="skills-grid">
        {skillGroups.map(([title, items]) => (
          <article className="skill-group" key={title}>
            <h3>{title}</h3>
            <div className="tags">
              {items.map((item) => (
                <SkillTag item={item} key={item} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
