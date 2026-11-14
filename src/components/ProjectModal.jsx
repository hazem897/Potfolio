import { useEffect } from 'react';
import { Play, X } from 'lucide-react';

export default function ProjectModal({
  selectedProject,
  videoProject,
  onClose,
  onSwitchToVideo
}) {
  const isOpen = Boolean(selectedProject || videoProject);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

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
        onClick={(event) => event.stopPropagation()}
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
            <video
              className="project-video"
              controls
              autoPlay
              playsInline
              key={videoProject.video}
            >
              <source src={`/videos/${videoProject.video}`} type="video/mp4" />
              Votre navigateur ne prend pas en charge la lecture de vidéos.
            </video>
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
                <Play size={16} /> Voir la vidéo
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
