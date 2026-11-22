import { useEffect, useRef } from 'react';

function useCounter(target, duration = 1500) {
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Parse target: "04" → 4, "15+" → 15, "2026" → 2026
    const numericTarget = parseInt(target.replace(/\D/g, ''), 10);
    const suffix = target.replace(/[\d]/g, ''); // e.g. "+"

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * numericTarget);
            // Format with leading zero if original had one (e.g. "04")
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
      { threshold: 0.4 }
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
      <div className="intro-grid">
        <h2 className="reveal-left">
          Un regard analytique,<br />
          <span>une approche concrète.</span>
        </h2>
        <div className="reveal-right">
          <p>
            Étudiant en Mastère Informatique (ISIC) et diplômé en Informatique de Gestion
            (spécialité Business Intelligence). J'aime relier la technique aux enjeux réels
            d'une organisation.
          </p>
          <p>
            Mon objectif : concevoir des solutions data fiables, lisibles et directement
            utiles à la prise de décision.
          </p>
          <div className="metrics">
            <div>
              <strong ref={ref1}>04</strong>
              <span>expériences</span>
            </div>
            <div>
              <strong ref={ref2}>15+</strong>
              <span>technologies</span>
            </div>
            <div>
              <strong ref={ref3}>2026</strong>
              <span>année de spécialisation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
