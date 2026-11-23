import { useEffect } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { projects } from '../data/projects';

const tabs = [
  ['data', 'Data'],
  ['academiques', 'Académiques'],
  ['personnels', 'Personnels']
];

// In-memory set to ensure each video/poster is prefetched only once per session
const prefetchedUrls = new Set();
function prefetchVideoResource(videoName) {
  if (!videoName || prefetchedUrls.has(videoName)) return;
  prefetchedUrls.add(videoName);

  try {
    // 1. Prefetch poster image (instant visual frame)
    const pLink = document.createElement('link');
    pLink.rel = 'prefetch';
    pLink.as = 'image';
    pLink.href = `/videos/posters/${videoName.replace('.mp4', '.jpg')}`;
    document.head.appendChild(pLink);

    // 2. Prefetch video file (warm browser/CDN cache)
    const vLink = document.createElement('link');
    vLink.rel = 'prefetch';
    vLink.as = 'video';
    vLink.href = `/videos/${videoName}`;
    document.head.appendChild(vLink);
  } catch {
    // Graceful fallback if prefetch not allowed
  }
}

export default function Projects({ activeTab, setActiveTab, onOpenDetails, onOpenVideo }) {
  const visibleProjects = projects[activeTab] ?? projects.data;

  // Preload poster images on mount so they are cached in advance
  useEffect(() => {
    Object.values(projects).flat().forEach((proj) => {
      if (proj.video) {
        const posterImg = new Image();
        posterImg.src = `/videos/posters/${proj.video.replace('.mp4', '.jpg')}`;
      }
    });
  }, []);

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
            className="project-card reveal"
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
                  onMouseEnter={() => prefetchVideoResource(project.video)}
                  onTouchStart={() => prefetchVideoResource(project.video)}
                  onFocus={() => prefetchVideoResource(project.video)}
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
