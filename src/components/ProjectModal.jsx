import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ExternalLink, Play, Maximize2, X } from 'lucide-react';

export default function ProjectModal({
  selectedProject,
  videoProject,
  onClose,
  onSwitchToVideo
}) {
  const isOpen = Boolean(selectedProject || videoProject);
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Close on Escape & lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    setIsVideoReady(false);
    setIsPlaying(false);

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
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay policy prevented; controls still available
          });
      }
    }
  }, [videoProject]);

  if (!isOpen) return null;

  const isVideoMode = Boolean(videoProject);

  return (
    <div
      className={`modal-backdrop${isVideoMode ? ' modal-backdrop--video' : ''}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`project-modal${isVideoMode ? ' project-modal--video' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={
          videoProject
            ? `Vidéo ${videoProject.title}`
            : `Détails ${selectedProject?.title ?? 'Projet'}`
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Fermer la modal"
          type="button"
        >
          <X size={18} />
        </button>

        {isVideoMode ? (
          <div className="video-modal-layout">
            {/* Left sidebar — meta */}
            <div className="video-modal-sidebar">
              <span className="video-modal-eyebrow">
                <span className="video-eyebrow-dot" />
                Démonstration
              </span>

              <h2 className="video-modal-title">{videoProject.title}</h2>

              <div className="video-modal-tags">
                {videoProject.tags?.map((tag) => (
                  <span key={tag} className="video-modal-tag">{tag}</span>
                ))}
              </div>

              <div className="video-modal-actions">
                <a
                  className="video-modal-open-btn"
                  href={`/videos/${videoProject.video}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={14} />
                  Plein écran
                </a>
              </div>
            </div>

            {/* Right — video player */}
            <div className="video-modal-player">
              <div className="video-player-frame">
                <div className="video-player-glow" />
                <video
                  ref={videoRef}
                  className="project-video"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  key={videoProject.video}
                  src={`/videos/${videoProject.video}`}
                  onCanPlay={() => setIsVideoReady(true)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={`/videos/${videoProject.video}`} type="video/mp4" />
                </video>

                {!isVideoReady && (
                  <div className="video-loading-overlay">
                    <div className="video-loading-spinner" />
                    <span>Chargement…</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="details-modal-layout">
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
          </div>
        )}
      </div>
    </div>
  );
}
