import { useEffect, useState, useRef } from 'react';
import { Menu, X, Download, Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const NAV_IDS = ['accueil', 'profil', 'experience', 'projets', 'competences', 'certifications'];

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

  const langRef = useRef(null);
  const resumeRef = useRef(null);

  const closeMenu = () => {
    setMenuOpen(false);
    setLangMenuOpen(false);
    setResumeMenuOpen(false);
  };

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
    <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
      <a className="brand" href="#accueil" onClick={closeMenu}>
        <span className="brand-bracket">&lt;&nbsp;</span>HK<span className="brand-bracket">&nbsp;/&gt;</span>
      </a>

      {/* Navigation links */}
      <nav className={menuOpen ? 'nav open' : 'nav'}>
        {NAV_IDS.map((id) => (
          <a key={id} href={`#${id}`} onClick={closeMenu}>
            {dict.nav[id] || id}
          </a>
        ))}

        {/* Mobile-only language & resume buttons */}
        <div className="nav-mobile-extras mobile-only">
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
              >
                <span>{l.flag}</span> {l.short}
              </button>
            ))}
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
              <Download size={14} /> 🇺🇸 English CV
            </a>
            <a
              className="nav-mobile-resume-link"
              href="/CV_Hazem_FR.pdf"
              download="CV_Hazem_Khaled_FR.pdf"
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
            >
              <Download size={14} /> 🇫🇷 French CV
            </a>
          </div>
        </div>
      </nav>

      {/* Desktop action buttons */}
      <div className="nav-actions">
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
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
