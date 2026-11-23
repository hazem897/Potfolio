import { useEffect, useRef } from 'react';
import { MapPin, GraduationCap, Sparkles, Target } from 'lucide-react';

function useCounter(target, duration = 1500) {
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const numericTarget = parseInt(target.replace(/\D/g, ''), 10);
    const suffix = target.replace(/[\d]/g, '');

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * numericTarget);
            const formatted =
              target.length === 2 && target.startsWith('0') && current < 10
                ? `0${current}`
                : `${current}`;
            el.textContent = formatted + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return ref;
}

export default function About() {
  const ref1 = useCounter('04');
  const ref2 = useCounter('15');
  const ref3 = useCounter('2026', 1800);

  return (
    <section className="intro section" id="profil">
      <div className="section-kicker reveal">01 — À PROPOS</div>

      <div className="about-wrapper">
        <div className="intro-grid">
          <div className="about-heading-col reveal-left">
            <h2>
              Un regard analytique,<br />
              <span className="accent-heading">une approche concrète.</span>
            </h2>

            <div className="about-badges">
              <span className="about-badge">
                <MapPin size={14} /> Médenine, Tunisie
              </span>
              <span className="about-badge">
                <GraduationCap size={14} /> Mastère Informatique (ISIC)
              </span>
            </div>
          </div>

          <div className="about-content-col reveal-right">
            <p className="about-text-lead">
              Étudiant en Mastère Informatique (ISIC) et diplômé en Informatique de Gestion
              (spécialité Business Intelligence). J'aime relier la technique aux enjeux réels
              d'une organisation.
            </p>

            {/* Objective callout box */}
            <div className="about-quote-box">
              <div className="about-quote-header">
                <Target size={15} className="quote-icon" />
                <span className="quote-label">// OBJECTIF PROFESSIONNEL</span>
              </div>
              <p className="about-quote-text">
                Mon objectif : concevoir des solutions data fiables, lisibles et directement
                utiles à la prise de décision.
              </p>
            </div>

            <div className="metrics">
              <div className="metric-card">
                <strong ref={ref1}>04</strong>
                <span>expériences</span>
              </div>
              <div className="metric-card">
                <strong ref={ref2}>15+</strong>
                <span>technologies</span>
              </div>
              <div className="metric-card">
                <strong ref={ref3}>2026</strong>
                <span>spécialisation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
