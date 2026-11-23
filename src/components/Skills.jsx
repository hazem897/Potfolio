import {
  Workflow,
  Database,
  Cpu,
  Users,
  MessageSquare,
  Layers,
  Sparkles
} from 'lucide-react';
import { skillGroups, skillLogos } from '../data/skills';
import {
  PythonIcon,
  JavaScriptIcon,
  TypeScriptIcon,
  HTMLIcon,
  CSSIcon,
  ReactIcon,
  NodeIcon,
  GitIcon,
  GitHubIcon,
  DockerIcon,
  PostgresIcon,
  MysqlIcon,
  PowerBiIcon,
  ExcelIcon,
  SqlIcon,
  JavaIcon,
  PhpIcon,
  AngularIcon,
  PandasIcon,
  NumpyIcon,
  TalendIcon
} from './TechIcons';

const techSvgIcons = {
  Python: PythonIcon,
  JavaScript: JavaScriptIcon,
  TypeScript: TypeScriptIcon,
  HTML: HTMLIcon,
  CSS: CSSIcon,
  'React.js': ReactIcon,
  React: ReactIcon,
  'Node.js': NodeIcon,
  Node: NodeIcon,
  Git: GitIcon,
  GitHub: GitHubIcon,
  Docker: DockerIcon,
  PostgreSQL: PostgresIcon,
  MySQL: MysqlIcon,
  'Power BI': PowerBiIcon,
  'Excel 2019 certifié': ExcelIcon,
  Excel: ExcelIcon,
  SQL: SqlIcon,
  'SQL Server': SqlIcon,
  Java: JavaIcon,
  PHP: PhpIcon,
  Angular: AngularIcon,
  Pandas: PandasIcon,
  NumPy: NumpyIcon,
  Talend: TalendIcon
};

const fallbackIcons = {
  ETL: Workflow,
  'Data Warehouse': Database,
  XGBoost: Cpu,
  Communication: MessageSquare,
  'Travail d’équipe': Users,
  'Modélisation de données': Layers
};

const languageMonograms = {
  'Arabe · maternelle': { code: 'AR', label: 'Arabe · Maternelle', accent: '#22c55e' },
  'Français · courant': { code: 'FR', label: 'Français · Courant', accent: '#60a5fa' },
  'Anglais · intermédiaire': { code: 'EN', label: 'Anglais · Intermédiaire', accent: '#f87171' }
};

function SkillTile({ item, index, groupIndex }) {
  const SvgComponent = techSvgIcons[item] || techSvgIcons[Object.keys(techSvgIcons).find((k) => item.startsWith(k))];
  const langInfo = languageMonograms[item];
  const FallbackIcon = fallbackIcons[item] || Sparkles;
  const delay = (groupIndex * 0.12 + index * 0.035).toFixed(3);

  return (
    <div
      className="skill-tile"
      style={{ animationDelay: `${delay}s` }}
      tabIndex={0}
      role="button"
      aria-label={item}
    >
      <div className="skill-tile-body">
        {SvgComponent ? (
          <SvgComponent size={34} />
        ) : langInfo ? (
          <div className="skill-lang-monogram" style={{ color: langInfo.accent }}>
            <span>{langInfo.code}</span>
          </div>
        ) : (
          <FallbackIcon size={26} className="skill-tile-icon-svg" />
        )}
      </div>

      <div className="skill-tooltip" role="tooltip">
        {langInfo ? langInfo.label : item}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section className="skills section" id="competences">
      <div className="section-kicker reveal">04 — EXPERTISE</div>
      <div className="section-heading reveal">
        <h2>Compétences &amp; Technologies</h2>
        <p>Une boîte à outils pensée pour passer de la donnée brute à l'insight et aux applications décisionnelles.</p>
      </div>

      <div className="skills-container reveal">
        {skillGroups.map(([title, items], groupIndex) => (
          <div className="skills-category-block" key={title}>
            <div className="skills-category-header">
              <span className="skills-category-prefix">//</span>
              <span className="skills-category-title">{title.toUpperCase()}</span>
              <span className="skills-category-badge">{items.length}</span>
            </div>

            <div className="skills-tiles-row">
              {items.map((item, itemIndex) => (
                <SkillTile
                  item={item}
                  key={item}
                  index={itemIndex}
                  groupIndex={groupIndex}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
