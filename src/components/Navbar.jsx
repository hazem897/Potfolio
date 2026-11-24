import { useEffect, useState, useRef } from 'react';
import { Menu, X, Download, Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const NAV_IDS = ['accueil', 'profil', 'experience', 'projets', 'competences', 'certifications', 'contact'];

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', short: 'FR' },
  { code: 'en', label: 'English', flag: '🇬🇧', short: 'EN' },
  { code: 'ar', label: 'العربية', flag: '🇹🇳', short: 'AR' }
];

export default function Navbar({ menuOpen, setMenuOpen }) {
  const { lang, setLang, dict } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [resumeMenuOpen, setResumeMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');

  const langRef = useRef(null);
  const resumeRef = useRef(null);

  const closeMenu = () => {
    setMenuOpen(false);
    setLangMenuOpen(false);
    setResumeMenuOpen(false);
  };

  // Handle body scroll lock and escape key when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    if (menuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('menu-open-lock');
    } else {
      document.body.classList.remove('menu-open-lock');
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('menu-open-lock');
    };
  }, [menuOpen]);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-15% 0px -55% 0px' }
    );

    NAV_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
      if (resumeRef.current && !resumeRef.current.contains(e.target)) {
        setResumeMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <>
      {/* Mobile background blur overlay */}
      <div
        className={`nav-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
        <a className="brand" href="#accueil" onClick={closeMenu}>
          <span className="brand-bracket">&lt;&nbsp;</span>HK<span className="brand-bracket">&nbsp;/&gt;</span>
        </a>

        {/* Navigation links */}
        <nav
          id="mobile-nav"
          className={menuOpen ? 'nav open' : 'nav'}
          aria-label="Navigation principale"
        >
          <div className="nav-links-wrap">
            {NAV_IDS.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className={`nav-link ${activeSection === id ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="nav-link-dot" aria-hidden="true" />
                <span>{dict.nav[id] || id}</span>
              </a>
            ))}
          </div>

          {/* Mobile-only language & resume buttons */}
          <div className="nav-mobile-extras mobile-only">
            <div className="nav-mobile-section-title">
              <span>Langue / Language</span>
            </div>
            <div className="nav-mobile-lang-row">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={`mobile-lang-pill ${lang === l.code ? 'active' : ''}`}
                  onClick={() => {
                    setLang(l.code);
                    closeMenu();
                  }}
                  aria-label={`Changer en ${l.label}`}
                >
                  <span className="mobile-lang-flag">{l.flag}</span>
                  <span className="mobile-lang-name">{l.label}</span>
                  <span className="mobile-lang-short">({l.short})</span>
                </button>
              ))}
            </div>

            <div className="nav-mobile-section-title" style={{ marginTop: '16px' }}>
              <span>Curriculum Vitae</span>
            </div>
            <div className="nav-mobile-resume-row">
              <a
                className="nav-mobile-resume-link"
                href="/CV_Hazem_EN.pdf"
                download="CV_Hazem_Khaled_EN.pdf"
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
              >
                <div className="nav-mobile-resume-left">
                  <span className="nav-mobile-resume-flag">🇺🇸</span>
                  <div className="nav-mobile-resume-meta">
                    <strong>English CV</strong>
                    <small>PDF · 2026</small>
                  </div>
                </div>
                <div className="nav-mobile-resume-action">
                  <Download size={15} />
                </div>
              </a>
              <a
                className="nav-mobile-resume-link"
                href="/CV_Hazem_FR.pdf"
                download="CV_Hazem_Khaled_FR.pdf"
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
              >
                <div className="nav-mobile-resume-left">
                  <span className="nav-mobile-resume-flag">🇫🇷</span>
                  <div className="nav-mobile-resume-meta">
                    <strong>French CV</strong>
                    <small>PDF · 2026</small>
                  </div>
                </div>
                <div className="nav-mobile-resume-action">
                  <Download size={15} />
                </div>
              </a>
            </div>
          </div>
        </nav>

        {/* Desktop action buttons */}
        <div className="nav-actions">
          {/* Quick language toggle for mobile/tablet right in topbar */}
          <button
            type="button"
            className="topbar-quick-lang mobile-only"
            onClick={() => {
              const nextIndex = (LANGUAGES.findIndex((l) => l.code === lang) + 1) % LANGUAGES.length;
              setLang(LANGUAGES[nextIndex].code);
            }}
            aria-label={`Langue actuelle : ${currentLangObj.label}. Cliquer pour changer.`}
          >
            <span>{currentLangObj.flag}</span>
            <span>{currentLangObj.short}</span>
          </button>

          {/* Language selector pill dropdown */}
          <div className="nav-dropdown-wrap desktop-only" ref={langRef}>
          <button
            type="button"
            className="nav-lang-btn"
            onClick={() => {
              setLangMenuOpen(!langMenuOpen);
              setResumeMenuOpen(false);
            }}
            aria-label="Changer de langue / Change language"
            aria-expanded={langMenuOpen}
          >
            <span className="nav-lang-code">{currentLangObj.short}</span>
            <Globe size={15} className="nav-lang-globe" />
          </button>

          {langMenuOpen && (
            <div className="nav-dropdown-popover nav-lang-popover" role="menu">
              <div className="nav-dropdown-title">Langue / Language</div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={`nav-dropdown-item ${lang === l.code ? 'selected' : ''}`}
                  onClick={() => {
                    setLang(l.code);
                    setLangMenuOpen(false);
                  }}
                  role="menuitem"
                >
                  <span className="nav-dropdown-item-left">
                    <span className="nav-item-flag">{l.flag}</span>
                    <span className="nav-item-name">{l.label}</span>
                    <span className="nav-item-code">({l.short})</span>
                  </span>
                  {lang === l.code && <Check size={14} className="nav-check-icon" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Resume Dropdown Menu */}
        <div className="nav-dropdown-wrap desktop-only" ref={resumeRef}>
          <button
            type="button"
            className={`nav-resume-btn ${resumeMenuOpen ? 'open' : ''}`}
            onClick={() => {
              setResumeMenuOpen(!resumeMenuOpen);
              setLangMenuOpen(false);
            }}
            aria-label="Télécharger le CV / Download Resume"
            aria-expanded={resumeMenuOpen}
          >
            <Download size={14} />
            <span>Resume</span>
            <ChevronDown size={14} className={`nav-chevron ${resumeMenuOpen ? 'rotated' : ''}`} />
          </button>

          {resumeMenuOpen && (
            <div className="nav-dropdown-popover nav-resume-popover" role="menu">
              <a
                href="/CV_Hazem_EN.pdf"
                download="CV_Hazem_Khaled_EN.pdf"
                target="_blank"
                rel="noreferrer"
                className="nav-dropdown-item"
                onClick={() => setResumeMenuOpen(false)}
                role="menuitem"
              >
                <span className="nav-dropdown-item-left">
                  <span className="nav-item-flag">🇺🇸</span>
                  <span className="nav-item-name">English CV</span>
                </span>
                <span className="nav-item-badge">EN</span>
              </a>

              <a
                href="/CV_Hazem_FR.pdf"
                download="CV_Hazem_Khaled_FR.pdf"
                target="_blank"
                rel="noreferrer"
                className="nav-dropdown-item"
                onClick={() => setResumeMenuOpen(false)}
                role="menuitem"
              >
                <span className="nav-dropdown-item-left">
                  <span className="nav-item-flag">🇫🇷</span>
                  <span className="nav-item-name">French CV</span>
                </span>
                <span className="nav-item-badge">FR</span>
              </a>
            </div>
          )}
        </div>

        {/* Mobile Hamburger toggle */}
        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {menuOpen ? <X size={22} className="menu-icon-spin" /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  </>
);
}
