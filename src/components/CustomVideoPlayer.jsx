import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  Check,
  RotateCcw,
  RotateCw
} from 'lucide-react';
import '../assets/styles/custom-video-player.css';

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 10s Rewind Icon with embedded "10"
function Rewind10Icon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <text x="12" y="14.5" fontSize="6.2" fontWeight="700" fill="currentColor" stroke="none" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">
        10
      </text>
    </svg>
  );
}

// 10s Forward Icon with embedded "10"
function Forward10Icon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <text x="12" y="14.5" fontSize="6.2" fontWeight="700" fill="currentColor" stroke="none" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">
        10
      </text>
    </svg>
  );
}

export default function CustomVideoPlayer({ src, poster, title }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const timelineRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const flashTimeoutRef = useRef(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  // UI state
  const [showControls, setShowControls] = useState(true);
  const [isSpeedOpen, setIsSpeedOpen] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [centerFlash, setCenterFlash] = useState(null); // { icon: 'play'|'pause'|'forward'|'rewind'|'volume'|'mute', text?: string }

  // Trigger brief center feedback badge
  const triggerFlash = useCallback((type, text = '') => {
    setCenterFlash({ type, text });
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => {
      setCenterFlash(null);
    }, 600);
  }, []);

  // Controls visibility management
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying && !isScrubbing && !isSpeedOpen) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setIsSpeedOpen(false);
      }, 2500);
    }
  }, [isPlaying, isScrubbing, isSpeedOpen]);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        triggerFlash('play');
      }).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      triggerFlash('pause');
    }
    resetControlsTimer();
  }, [resetControlsTimer, triggerFlash]);

  // Jump 10 seconds forward / backward
  const seekRelative = useCallback((delta) => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const target = Math.min(Math.max(0, current + delta), videoRef.current.duration || 0);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    triggerFlash(delta > 0 ? 'forward' : 'rewind', delta > 0 ? '+10s' : '-10s');
    resetControlsTimer();
  }, [resetControlsTimer, triggerFlash]);

  // Volume change
  const handleVolumeChange = useCallback((newVol) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    if (!videoRef.current) return;
    videoRef.current.volume = clamped;
    setVolume(clamped);
    if (clamped === 0) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
    resetControlsTimer();
  }, [resetControlsTimer]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    if (isMuted || volume === 0) {
      const restoreVol = volume === 0 ? 0.8 : volume;
      videoRef.current.muted = false;
      videoRef.current.volume = restoreVol;
      setIsMuted(false);
      setVolume(restoreVol);
      triggerFlash('volume', `${Math.round(restoreVol * 100)}%`);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
      triggerFlash('mute', 'Muet');
    }
    resetControlsTimer();
  }, [isMuted, volume, resetControlsTimer, triggerFlash]);

  // Change playback speed
  const changeSpeed = useCallback((speed) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackRate(speed);
    setIsSpeedOpen(false);
    triggerFlash('speed', `${speed}x`);
    resetControlsTimer();
  }, [resetControlsTimer, triggerFlash]);

  // Toggle Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    resetControlsTimer();
  }, [resetControlsTimer]);

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'KeyJ':
          e.preventDefault();
          seekRelative(-10);
          break;
        case 'ArrowRight':
        case 'KeyL':
          e.preventDefault();
          seekRelative(10);
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(volume + 0.1);
          triggerFlash('volume', `${Math.min(100, Math.round((volume + 0.1) * 100))}%`);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(volume - 0.1);
          triggerFlash('volume', `${Math.max(0, Math.round((volume - 0.1) * 100))}%`);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seekRelative, toggleFullscreen, toggleMute, handleVolumeChange, volume, triggerFlash]);

  // Video event listeners
  const onTimeUpdate = () => {
    if (!videoRef.current || isScrubbing) return;
    setCurrentTime(videoRef.current.currentTime);

    // Update buffered progress
    if (videoRef.current.buffered.length > 0) {
      const end = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBufferedEnd(end);
    }
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const onCanPlay = () => {
    setIsBuffering(false);
  };

  const onWaiting = () => {
    setIsBuffering(true);
  };

  const onPlaying = () => {
    setIsBuffering(false);
    setIsPlaying(true);
  };

  const onEnded = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  // Timeline interaction (click & scrub drag)
  const computeTimeFromEvent = (e) => {
    if (!timelineRef.current || !duration) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return (offsetX / rect.width) * duration;
  };

  const handleTimelinePointerDown = (e) => {
    e.preventDefault();
    setIsScrubbing(true);
    const newTime = computeTimeFromEvent(e);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }

    const onPointerMove = (moveEvent) => {
      const scrubTime = computeTimeFromEvent(moveEvent);
      setCurrentTime(scrubTime);
      if (videoRef.current) {
        videoRef.current.currentTime = scrubTime;
      }
    };

    const onPointerUp = () => {
      setIsScrubbing(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Timeline hover preview
  const handleTimelineMouseMove = (e) => {
    if (!timelineRef.current || !duration) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = offsetX / rect.width;
    setHoverTime(pct * duration);
    setHoverPosition(offsetX);
  };

  const handleTimelineMouseLeave = () => {
    setHoverTime(null);
  };

  // Click on video to play/pause (with double-click for fullscreen)
  const clickTimerRef = useRef(null);
  const handleVideoAreaClick = (e) => {
    // If clicking directly on controls, ignore
    if (e.target.closest('.cvp-controls-bar') || e.target.closest('.cvp-top-bar')) return;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      toggleFullscreen();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
        togglePlay();
      }, 240);
    }
  };

  // Progress percentages
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (bufferedEnd / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`cvp-container ${isFullscreen ? 'cvp-fullscreen' : ''} ${!showControls && isPlaying ? 'cvp-hide-cursor' : ''}`}
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => {
        if (isPlaying && !isScrubbing && !isSpeedOpen) {
          setShowControls(false);
          setIsSpeedOpen(false);
        }
      }}
      onClick={handleVideoAreaClick}
      role="region"
      aria-label={`Lecteur vidéo : ${title || 'Démonstration'}`}
    >
      <video
        ref={videoRef}
        className="cvp-video-element"
        src={src}
        poster={poster}
        preload="auto"
        playsInline
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onCanPlay={onCanPlay}
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        onEnded={onEnded}
      />

      {/* Buffering spinner */}
      {isBuffering && (
        <div className="cvp-buffering-overlay">
          <div className="cvp-buffering-spinner" />
          <span className="cvp-buffering-text">Chargement instantané...</span>
        </div>
      )}

      {/* Center Action Ripple / Flash */}
      {centerFlash && (
        <div className="cvp-center-flash" key={Date.now()}>
          <div className="cvp-flash-badge">
            {centerFlash.type === 'play' && <Play size={32} fill="currentColor" />}
            {centerFlash.type === 'pause' && <Pause size={32} fill="currentColor" />}
            {centerFlash.type === 'forward' && <Forward10Icon size={32} />}
            {centerFlash.type === 'rewind' && <Rewind10Icon size={32} />}
            {centerFlash.type === 'mute' && <VolumeX size={30} />}
            {centerFlash.type === 'volume' && (volume > 0.5 ? <Volume2 size={30} /> : <Volume1 size={30} />)}
            {centerFlash.text && <span className="cvp-flash-text">{centerFlash.text}</span>}
          </div>
        </div>
      )}

      {/* Big Initial Play Button */}
      {!isPlaying && !isBuffering && (
        <button
          className="cvp-big-play-btn"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          aria-label="Lire la vidéo"
          type="button"
        >
          <div className="cvp-big-play-glow" />
          <Play size={32} fill="currentColor" className="cvp-big-play-icon" />
        </button>
      )}

      {/* Top Bar (Fullscreen Title + Close/Escape hint) */}
      <div className={`cvp-top-bar ${showControls || !isPlaying ? 'cvp-visible' : ''}`}>
        <span className="cvp-title-text">{title}</span>
        {isFullscreen && (
          <span className="cvp-esc-hint">Appuyez sur Échap pour quitter</span>
        )}
      </div>

      {/* Floating Modern Controls Dock */}
      <div
        className={`cvp-controls-bar ${showControls || !isPlaying || isScrubbing || isSpeedOpen ? 'cvp-visible' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Interactive Progress Timeline */}
        <div
          ref={timelineRef}
          className="cvp-timeline-track-wrap"
          onPointerDown={handleTimelinePointerDown}
          onMouseMove={handleTimelineMouseMove}
          onMouseLeave={handleTimelineMouseLeave}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={duration || 0}
          aria-valuenow={currentTime}
          aria-label="Barre de progression"
          tabIndex={0}
        >
          <div className="cvp-timeline-rail">
            {/* Buffered track */}
            <div
              className="cvp-timeline-buffered"
              style={{ width: `${bufferedPercent}%` }}
            />
            {/* Active played progress */}
            <div
              className="cvp-timeline-progress"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="cvp-timeline-thumb" />
            </div>
          </div>

          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              className="cvp-timeline-tooltip"
              style={{ left: `${hoverPosition}px` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Controls Row */}
        <div className="cvp-controls-row">
          {/* Left Controls: Play, Rewind 10, Forward 10, Time */}
          <div className="cvp-controls-left">
            {/* Play / Pause Button */}
            <button
              className="cvp-btn cvp-btn-play"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause (Espace)' : 'Lecture (Espace)'}
              type="button"
            >
              {isPlaying ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
            </button>

            {/* Rewind 10 Seconds */}
            <button
              className="cvp-btn cvp-btn-skip"
              onClick={() => seekRelative(-10)}
              aria-label="Reculer de 10 secondes (Flèche gauche)"
              title="Reculer de 10s (←)"
              type="button"
            >
              <Rewind10Icon size={19} />
            </button>

            {/* Forward 10 Seconds */}
            <button
              className="cvp-btn cvp-btn-skip"
              onClick={() => seekRelative(10)}
              aria-label="Avancer de 10 secondes (Flèche droite)"
              title="Avancer de 10s (→)"
              type="button"
            >
              <Forward10Icon size={19} />
            </button>

            {/* Volume & Mute */}
            <div className="cvp-volume-group">
              <button
                className="cvp-btn"
                onClick={toggleMute}
                aria-label={isMuted ? 'Activer le son (M)' : 'Couper le son (M)'}
                type="button"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={19} />
                ) : volume > 0.5 ? (
                  <Volume2 size={19} />
                ) : (
                  <Volume1 size={19} />
                )}
              </button>
              <div className="cvp-volume-slider-wrap">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="cvp-volume-range"
                  aria-label="Contrôle du volume"
                  style={{
                    background: `linear-gradient(to right, #2dd4bf 0%, #2dd4bf ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
              </div>
            </div>

            {/* Current / Duration Time Display */}
            <div className="cvp-time-display">
              <span className="cvp-time-current">{formatTime(currentTime)}</span>
              <span className="cvp-time-sep">/</span>
              <span className="cvp-time-duration">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Speed Selector, Fullscreen */}
          <div className="cvp-controls-right">
            {/* Speed Popover Toggle */}
            <div className="cvp-speed-wrap">
              <button
                className={`cvp-btn cvp-btn-speed ${isSpeedOpen ? 'active' : ''}`}
                onClick={() => setIsSpeedOpen(!isSpeedOpen)}
                aria-label="Vitesse de lecture"
                aria-expanded={isSpeedOpen}
                type="button"
              >
                <span>{playbackRate === 1 ? '1x' : `${playbackRate}x`}</span>
              </button>

              {/* Speed Dropdown Menu */}
              {isSpeedOpen && (
                <div className="cvp-speed-popover" role="menu">
                  <div className="cvp-speed-header">Vitesse de lecture</div>
                  {SPEED_OPTIONS.map((speed) => (
                    <button
                      key={speed}
                      className={`cvp-speed-item ${playbackRate === speed ? 'selected' : ''}`}
                      onClick={() => changeSpeed(speed)}
                      role="menuitem"
                      type="button"
                    >
                      <span>{speed === 1 ? '1x (Normal)' : `${speed}x`}</span>
                      {playbackRate === speed && <Check size={14} className="cvp-speed-check" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <button
              className="cvp-btn cvp-btn-fullscreen"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Quitter le plein écran (F)' : 'Plein écran (F)'}
              title={isFullscreen ? 'Quitter plein écran (F)' : 'Plein écran (F)'}
              type="button"
            >
              {isFullscreen ? <Minimize size={19} /> : <Maximize size={19} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
