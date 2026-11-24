import { useState, useEffect } from 'react';
import { Award, ExternalLink, Eye, X, CheckCircle2, Calendar, MapPin, ZoomIn } from 'lucide-react';
import { certificationsList } from '../data/certifications';
import { useLanguage } from '../context/LanguageContext';
import '../assets/styles/certifications.css';

export default function Certifications() {
  const { dict } = useLanguage();
  const [activeCert, setActiveCert] = useState(null);

  // Close lightbox on Escape & lock body scroll
  useEffect(() => {
    if (!activeCert) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveCert(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeCert]);

  return (
    <section className="certifications section" id="certifications">
      <div className="section-kicker reveal">{dict.certifications.kicker}</div>
      <div className="section-heading reveal">
        <h2>{dict.certifications.title}</h2>
        <p>{dict.certifications.subtitle}</p>
      </div>

      <div className="certifications-grid">
        {certificationsList.map((cert, index) => (
          <article
            className={`cert-card reveal${cert.featured ? ' featured-cert' : ''}`}
            key={cert.id}
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            {/* Top Bar with Number & Badge */}
            <div className="cert-top">
              <span className="cert-number">0{index + 1}</span>
              <span className="cert-badge">
                <Award size={14} className="cert-badge-icon" />
                <span>{cert.issuerBadge}</span>
              </span>
            </div>

            {/* Interactive Image Preview with Hover Overlay */}
            <div
              className="cert-media-wrap"
              onClick={() => setActiveCert(cert)}
              role="button"
              tabIndex={0}
              aria-label={`Agrandir le certificat ${cert.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveCert(cert);
                }
              }}
            >
              <img
                src={cert.image}
                alt={cert.title}
                className="cert-thumbnail"
                loading="lazy"
              />
              <div className="cert-media-overlay">
                <div className="cert-zoom-btn">
                  <ZoomIn size={18} />
                  <span>Aperçu HD</span>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="cert-content">
              <div className="cert-meta-row">
                <span className="cert-issuer">
                  <CheckCircle2 size={14} className="cert-check-icon" />
                  {cert.issuer}
                </span>
                <span className="cert-date">
                  <Calendar size={13} />
                  {cert.date}
                </span>
              </div>

              <h3 className="cert-title">{cert.title}</h3>

              {cert.credentialId && (
                <div className="cert-credential-box">
                  <span className="cert-credential-label">{dict.certifications.credentialLabel}</span>
                  <span className="cert-credential-id">{cert.credentialId}</span>
                </div>
              )}

              {cert.place && (
                <div className="cert-place-row">
                  <MapPin size={13} />
                  <span>{cert.place}</span>
                  {cert.instructor && (
                    <span className="cert-instructor">· Formateur : {cert.instructor}</span>
                  )}
                </div>
              )}

              <p className="cert-description">{cert.description}</p>

              {/* Tags */}
              <div className="tags">
                {cert.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              {/* Actions */}
              <div className="cert-actions">
                <button
                  type="button"
                  className="button button-primary cert-view-btn"
                  onClick={() => setActiveCert(cert)}
                >
                  <Eye size={15} /> {dict.certifications.viewBtn}
                </button>

                {cert.verifyUrl && (
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button button-quiet cert-verify-btn"
                  >
                    {dict.certifications.verifyBtn} <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox HD Modal */}
      {activeCert && (
        <div
          className="modal-backdrop cert-lightbox-backdrop"
          onClick={() => setActiveCert(null)}
          role="presentation"
        >
          <div
            className="cert-lightbox-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Certificat : ${activeCert.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setActiveCert(null)}
              aria-label="Fermer la modal"
              type="button"
            >
              <X size={20} />
            </button>

            <div className="cert-lightbox-header">
              <span className="section-kicker">{dict.certifications.modalKicker}</span>
              <h2>{activeCert.title}</h2>
              <div className="cert-lightbox-meta">
                <span>{activeCert.issuer}</span>
                <span>•</span>
                <span>{activeCert.date}</span>
                {activeCert.credentialId && (
                  <>
                    <span>•</span>
                    <span className="cert-id-tag">ID: {activeCert.credentialId}</span>
                  </>
                )}
              </div>
            </div>

            <div className="cert-lightbox-image-wrap">
              <img
                src={activeCert.image}
                alt={activeCert.title}
                className="cert-lightbox-image"
              />
            </div>

            <div className="cert-lightbox-footer">
              <a
                href={activeCert.image}
                target="_blank"
                rel="noreferrer"
                className="button button-quiet"
              >
                {dict.certifications.originalBtn} <ExternalLink size={14} />
              </a>

              {activeCert.verifyUrl && (
                <a
                  href={activeCert.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-primary"
                >
                  {dict.certifications.verifyExternalBtn} <ExternalLink size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
