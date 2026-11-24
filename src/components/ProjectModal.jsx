import { useEffect } from 'react';
import { ArrowUpRight, Play, X } from 'lucide-react';
import CustomVideoPlayer from './CustomVideoPlayer';
import { useLanguage } from '../context/LanguageContext';

export default function ProjectModal({
  selectedProject,
  videoProject,
  onClose,
  onSwitchToVideo
}) {
  const { dict } = useLanguage();
  const isOpen = Boolean(selectedProject || videoProject);

  // Close on Escape & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // If fullscreen is active, let browser exit fullscreen first
      if (document.fullscreenElement) return;
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const posterPath = videoProject
    ? `/videos/posters/${videoProject.video.replace('.mp4', '.jpg')}`
    : '';

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-label={
          videoProject
            ? `Vidéo ${videoProject.title}`
            : `Détails ${selectedProject?.title ?? 'Projet'}`
        }
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Fermer la modal"
          type="button"
        >
          <X size={20} />
        </button>

        {videoProject ? (
          <>
            <p className="section-kicker">{dict.modal.videoKicker}</p>
            <h2>{videoProject.title}</h2>

            <div style={{ marginTop: '20px' }}>
              <CustomVideoPlayer
                src={`/videos/${videoProject.video}`}
                poster={posterPath}
                title={videoProject.title}
              />
            </div>

            <div style={{ marginTop: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                className="button button-quiet"
                href={`/videos/${videoProject.video}`}
                target="_blank"
                rel="noreferrer"
              >
                {dict.modal.openTab} <ArrowUpRight size={15} />
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="section-kicker">{dict.modal.detailsKicker}</p>
            <h2>{selectedProject.title}</h2>
            <p className="project-modal-meta">{selectedProject.meta}</p>

            {selectedProject.details ? (
              selectedProject.details
            ) : (
              <p>{selectedProject.description}</p>
            )}

            <div className="tags">
              {selectedProject.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            {selectedProject.video && (
              <button
                className="button button-primary modal-video-button"
                onClick={() => onSwitchToVideo(selectedProject)}
                type="button"
              >
                <Play size={15} /> {dict.projects.watchVideo}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
