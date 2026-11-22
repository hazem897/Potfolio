import { useEffect, useRef } from 'react';
import { ArrowUpRight, Play, X } from 'lucide-react';

export default function ProjectModal({
  selectedProject,
  videoProject,
  onClose,
  onSwitchToVideo
}) {
  const isOpen = Boolean(selectedProject || videoProject);
  const videoRef = useRef(null);

  // Close on Escape & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Autoplay video on open (fast-start MP4)
  useEffect(() => {
    if (videoProject && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy prevented automatic playback; controls remain available
        });
      }
    }
  }, [videoProject]);

  if (!isOpen) return null;

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
            <p className="section-kicker">DÉMONSTRATION VIDÉO</p>
            <h2>{videoProject.title}</h2>

            <div className="video-wrapper">
              <video
                ref={videoRef}
                className="project-video"
                controls
                autoPlay
                playsInline
                preload="metadata"
                key={videoProject.video}
                src={`/videos/${videoProject.video}`}
              >
                <source src={`/videos/${videoProject.video}`} type="video/mp4" />
                Votre navigateur ne prend pas en charge la lecture de vidéos.
              </video>
            </div>

            <div style={{ marginTop: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                className="button button-quiet"
                href={`/videos/${videoProject.video}`}
                target="_blank"
                rel="noreferrer"
              >
                Ouvrir dans un nouvel onglet <ArrowUpRight size={15} />
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="section-kicker">DÉTAILS DU PROJET</p>
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
                <Play size={15} /> Voir la vidéo
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
