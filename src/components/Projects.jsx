import { ArrowUpRight, Play } from 'lucide-react';
import { projects } from '../data/projects';

const tabs = [
  ['data', 'Data'],
  ['academiques', 'Académiques'],
  ['personnels', 'Personnels']
];

export default function Projects({ activeTab, setActiveTab, onOpenDetails, onOpenVideo }) {
  const visibleProjects = projects[activeTab] ?? projects.data;

  return (
    <section className="projects section" id="projets">
      <div className="section-kicker reveal">03 — SÉLECTION</div>
      <div className="section-heading reveal">
        <h2>Projets</h2>
        <p>Quelques cas où la donnée devient une histoire compréhensible.</p>
      </div>

      <div className="tabs reveal" role="tablist">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            className={activeTab === id ? 'active' : ''}
            onClick={() => setActiveTab(id)}
            role="tab"
            aria-selected={activeTab === id}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="project-grid">
        {visibleProjects.map((project, index) => (
          <article
            className={`project-card reveal${index === 0 ? ' featured' : ''}`}
            key={`${activeTab}-${project.title}-${index}`}
            style={{ transitionDelay: `${index * 60}ms` }}
          >
            <div className="project-top">
              <span>0{index + 1}</span>
              <ArrowUpRight size={19} />
            </div>
            <p className="project-meta">{project.meta}</p>
            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <div className="tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="project-actions">
              <button
                className="project-action"
                onClick={() => onOpenDetails(project)}
                type="button"
              >
                Voir plus <ArrowUpRight size={15} />
              </button>
              {project.video && (
                <button
                  className="project-action project-action-video"
                  onClick={() => onOpenVideo(project)}
                  type="button"
                >
                  <Play size={14} /> Voir la vidéo
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
