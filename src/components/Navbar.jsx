import { useEffect, useState } from 'react';
import { Menu, X, Download } from 'lucide-react';

const navLinks = [
  ['accueil', 'Accueil'],
  ['profil', 'Profil'],
  ['experience', 'Expérience'],
  ['projets', 'Projets'],
  ['competences', 'Compétences'],
  ['certifications', 'Certifications']
];

export default function Navbar({ menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
      <a className="brand" href="#accueil" onClick={closeMenu}>
        <span className="brand-bracket">&lt;&nbsp;</span>HK<span className="brand-bracket">&nbsp;/&gt;</span>
      </a>

      <nav className={menuOpen ? 'nav open' : 'nav'}>
        {navLinks.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={closeMenu}>
            {label}
          </a>
        ))}
        <a
          className="nav-resume-btn mobile-only"
          href="/CV_Hazem.pdf"
          download="CV_Hazem_Khaled.pdf"
          target="_blank"
          rel="noreferrer"
          onClick={closeMenu}
        >
          <Download size={14} /> Resume
        </a>
      </nav>

      <div className="nav-actions">
        <a
          className="nav-resume-btn desktop-only"
          href="/CV_Hazem.pdf"
          download="CV_Hazem_Khaled.pdf"
          target="_blank"
          rel="noreferrer"
        >
          <Download size={14} /> Resume
        </a>

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
