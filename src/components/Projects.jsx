import { useEffect } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { projects } from '../data/projects';
import { useLanguage } from '../context/LanguageContext';

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
  const { dict } = useLanguage();
  const visibleProjects = projects[activeTab] ?? projects.data;

  const tabs = [
    ['data', dict.projects.tabs.data || 'Data'],
    ['academiques', dict.projects.tabs.academiques || 'Académiques'],
    ['personnels', dict.projects.tabs.personnels || 'Personnels']
  ];

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
      <div className="section-kicker reveal">{dict.projects.kicker}</div>
      <div className="section-heading reveal">
        <h2>{dict.projects.title}</h2>
        <p>{dict.projects.subtitle}</p>
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
                {dict.projects.seeMore} <ArrowUpRight size={15} />
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
                  <Play size={14} /> {dict.projects.watchVideo}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
