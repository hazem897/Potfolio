import { useEffect, useRef } from 'react';
import { MapPin, GraduationCap, Target } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  const { dict } = useLanguage();
  const ref1 = useCounter('04');
  const ref2 = useCounter('15+');
  const ref3 = useCounter('2026', 1800);

  return (
    <section className="intro section" id="profil">
      <div className="section-kicker reveal">{dict.about.kicker}</div>

      <div className="about-wrapper">
        <div className="intro-grid">
          <div className="about-heading-col reveal-left">
            <h2>
              {dict.about.headingLine1}<br />
              <span className="accent-heading">{dict.about.headingLine2}</span>
            </h2>

            <div className="about-badges">
              <span className="about-badge">
                <MapPin size={14} /> {dict.about.badgeLocation}
              </span>
              <span className="about-badge">
                <GraduationCap size={14} /> {dict.about.badgeDegree}
              </span>
            </div>
          </div>

          <div className="about-content-col reveal-right">
            <p className="about-text-lead">
              {dict.about.lead}
            </p>

            {/* Objective callout box */}
            <div className="about-quote-box">
              <div className="about-quote-header">
                <Target size={15} className="quote-icon" />
                <span className="quote-label">{dict.about.objectiveHeader}</span>
              </div>
              <p className="about-quote-text">
                {dict.about.objectiveText}
              </p>
            </div>

            <div className="metrics">
              <div className="metric-card">
                <strong ref={ref1}>04</strong>
                <span>{dict.about.metrics.experiences}</span>
              </div>
              <div className="metric-card">
                <strong ref={ref2}>15+</strong>
                <span>{dict.about.metrics.technologies}</span>
              </div>
              <div className="metric-card">
                <strong ref={ref3}>2026</strong>
                <span>{dict.about.metrics.specialization}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
