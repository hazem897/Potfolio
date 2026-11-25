import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  User,
  Tag,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { emailConfig } from '../config/emailConfig';
import { useVisitorTracker } from '../hooks/useVisitorTracker';
import '../assets/styles/contact.css';

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 0 0-1.66 1.65 1.65 1.65 0 0 0 1.66 1.65 1.66 1.65 0 0 0 1.66-1.65Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export default function Contact() {
  const { dict } = useLanguage();
  const { associateContact } = useVisitorTracker();

  // Form fields state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Validation & status state
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [copiedEmail, setCopiedEmail] = useState(false);

  const contactEmail = 'hazemhazem9089@gmail.com';
  const contactPhone = '+216 52 416 031';
  const contactLocation = 'Médenine, Tunisie';

  // Copy email to clipboard
  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(contactEmail).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    });
  };

  // Real-time field change & clear errors
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validation logic
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Veuillez saisir votre nom.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Veuillez saisir votre email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Format d’email invalide.';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Veuillez indiquer un sujet.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real email submission with custom template support (EmailJS + FormSubmit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');

    const formattedDate = new Date().toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    let sentSuccessfully = false;

    // 1. Try EmailJS if configured (delivers the custom Dark Navy & Turquoise HTML design)
    if (emailConfig.serviceId && emailConfig.templateId && emailConfig.publicKey) {
      try {
        const emailJsRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            service_id: emailConfig.serviceId,
            template_id: emailConfig.templateId,
            user_id: emailConfig.publicKey,
            template_params: {
              from_name: formData.name,
              from_email: formData.email,
              subject: formData.subject,
              message: formData.message,
              submitted_at: formattedDate
            }
          })
        });

        if (emailJsRes.ok) {
          sentSuccessfully = true;
        }
      } catch (err) {
        console.warn('EmailJS attempt failed, falling back to FormSubmit:', err);
      }
    }

    // 2. Fallback to FormSubmit (already active & delivers box card layout)
    if (!sentSuccessfully) {
      try {
        const response = await fetch(`https://formsubmit.co/ajax/${emailConfig.formSubmitEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            _subject: `New Portfolio Message | Hazem Khaled`,
            "🧑‍💼 Full Name": formData.name,
            "✉️ Email Address": formData.email,
            "🏷️ Subject": formData.subject,
            "📅 Submitted At": formattedDate,
            "💬 Message Content": formData.message,
            _captcha: 'false',
            _template: 'box'
          })
        });

        const result = await response.json();
        sentSuccessfully =
          response.ok &&
          (result.success === 'true' ||
            result.success === true ||
            (result.message && result.message.toLowerCase().includes('activation')));
      } catch {
        sentSuccessfully = false;
      }
    }

    if (sentSuccessfully) {
      setStatus('success');
      // Voluntarily associate name and email with the current visitor session
      associateContact(formData);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setStatus('error');
    }
  };

  return (
    <section className="contact-section section" id="contact">
      <div className="section-kicker reveal">{dict.contact.kicker}</div>
      <div className="section-heading reveal">
        <h2>{dict.contact.title}</h2>
        <p>{dict.contact.subtitle}</p>
      </div>

      <div className="contact-layout">
        {/* Left Column: Direct Info & Social Cards */}
        <div className="contact-info-card reveal-left">
          <div className="contact-status-badge">
            <span className="pulse-dot" />
            <span>{dict.contact.availability}</span>
          </div>

          <div className="contact-info-header">
            <h3>{dict.contact.infoTitle}</h3>
            <p>{dict.contact.infoDesc}</p>
          </div>

          <div className="contact-details-list">
            {/* Email item */}
            <a href={`mailto:${contactEmail}`} className="contact-detail-item">
              <div className="contact-detail-left">
                <div className="contact-icon-box">
                  <Mail size={17} />
                </div>
                <div className="contact-detail-text">
                  <span className="contact-detail-label">{dict.contact.emailLabel}</span>
                  <span className="contact-detail-value">{contactEmail}</span>
                </div>
              </div>
              <button
                type="button"
                className="contact-copy-btn"
                onClick={handleCopyEmail}
                title={copiedEmail ? dict.contact.copied : 'Copier l’adresse email'}
                aria-label="Copier l’adresse email"
              >
                {copiedEmail ? <Check size={16} color="#2dd4bf" /> : <Copy size={16} />}
              </button>
            </a>

            {/* Phone item */}
            <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="contact-detail-item">
              <div className="contact-detail-left">
                <div className="contact-icon-box">
                  <Phone size={17} />
                </div>
                <div className="contact-detail-text">
                  <span className="contact-detail-label">{dict.contact.phoneLabel}</span>
                  <span className="contact-detail-value">{contactPhone}</span>
                </div>
              </div>
              <ArrowUpRight size={16} className="contact-arrow" />
            </a>

            {/* Location item */}
            <div className="contact-detail-item">
              <div className="contact-detail-left">
                <div className="contact-icon-box">
                  <MapPin size={17} />
                </div>
                <div className="contact-detail-text">
                  <span className="contact-detail-label">{dict.contact.locationLabel}</span>
                  <span className="contact-detail-value">{contactLocation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Row */}
          <div className="contact-social-row">
            <a
              href="https://www.linkedin.com/in/hazem-khaled-data/"
              target="_blank"
              rel="noreferrer"
              className="contact-social-pill"
            >
              <LinkedInIcon /> LinkedIn
            </a>
            <a
              href="https://github.com/hazem897"
              target="_blank"
              rel="noreferrer"
              className="contact-social-pill"
            >
              <GitHubIcon /> GitHub
            </a>
          </div>
        </div>

        {/* Right Column: Functional Contact Form */}
        <div className="contact-form-card reveal-right">
          {status === 'success' ? (
            <div className="contact-feedback-success">
              <div className="contact-success-icon">
                <CheckCircle2 size={34} />
              </div>
              <h3>{dict.contact.successTitle}</h3>
              <p>{dict.contact.successDesc}</p>
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setStatus('idle')}
                style={{ marginTop: '14px' }}
              >
                {dict.contact.sendAnother}
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-form-row">
                {/* Name */}
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    <User size={13} className="form-label-icon" />
                    {dict.contact.nameLabel} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={dict.contact.namePlaceholder}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    required
                  />
                  {errors.name && <span className="form-error-text">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <Mail size={13} className="form-label-icon" />
                    {dict.contact.emailLabel} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={dict.contact.emailPlaceholder}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    required
                  />
                  {errors.email && <span className="form-error-text">{errors.email}</span>}
                </div>
              </div>

              {/* Subject */}
              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  <Tag size={13} className="form-label-icon" />
                  {dict.contact.subjectLabel} *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={dict.contact.subjectPlaceholder}
                  className={`form-input ${errors.subject ? 'error' : ''}`}
                  required
                />
                {errors.subject && <span className="form-error-text">{errors.subject}</span>}
              </div>

              {/* Message */}
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  <MessageSquare size={13} className="form-label-icon" />
                  {dict.contact.messageLabel} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={dict.contact.messagePlaceholder}
                  className={`form-textarea ${errors.message ? 'error' : ''}`}
                  required
                />
                {errors.message && <span className="form-error-text">{errors.message}</span>}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="contact-submit-btn"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <>
                    <span className="contact-spinner" />
                    <span>{dict.contact.sendingBtn}</span>
                  </>
                ) : (
                  <>
                    <span>{dict.contact.sendBtn}</span>
                    <Send size={16} />
                  </>
                )}
              </button>

              {/* Error feedback with direct mailto fallback */}
              {status === 'error' && (
                <div className="contact-feedback-error">
                  <AlertCircle size={18} />
                  <div>
                    <span>{dict.contact.errorMsg} </span>
                    <a
                      href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                        formData.subject || 'Contact Portfolio'
                      )}&body=${encodeURIComponent(
                        `Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
                      )}`}
                      style={{ color: '#2dd4bf', textDecoration: 'underline', fontWeight: 600, display: 'inline-block', marginTop: '4px' }}
                    >
                      {dict.contact.directEmailAction || "Cliquez ici pour m'envoyer un email direct."}
                    </a>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
