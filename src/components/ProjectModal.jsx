import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ExternalLink, Maximize2, Play, X, Film } from 'lucide-react';

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
          .catch(() => {});
      }
    }
  }, [videoProject]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`project-modal${videoProject ? ' project-modal--video' : ''}`}
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

        {videoProject ? (
          /* ── VIDEO MODAL ── */
          <div className="video-modal-layout">

            {/* Left sidebar: metadata */}
            <div className="video-modal-sidebar">
              <span className="video-modal-eyebrow">
                <Film size={12} />
                DÉMONSTRATION
              </span>

              <h2 className="video-modal-title">{videoProject.title}</h2>

              {videoProject.meta && (
                <span className="video-modal-category">{videoProject.meta}</span>
              )}

              <div className="video-modal-divider" />

              {videoProject.tags && videoProject.tags.length > 0 && (
                <div className="video-modal-tags">
                  <p className="video-modal-tags-label">STACK</p>
                  <div className="tags tags--compact">
                    {videoProject.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="video-modal-actions">
                <a
                  className="button button-quiet video-modal-open-btn"
                  href={`/videos/${videoProject.video}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Ouvrir en plein écran"
                >
                  <ExternalLink size={14} />
                  Plein écran
                </a>
              </div>
            </div>

            {/* Right: video player */}
            <div className="video-modal-player">
              <div className="video-player-frame">
                <div className={`video-ready-overlay${isVideoReady ? ' hidden' : ''}`}>
                  <div className="video-spinner" />
                </div>
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
                {/* Coral accent bar under video */}
                <div className="video-accent-bar" />
              </div>
            </div>
          </div>

        ) : (
          /* ── DETAILS MODAL ── */
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
