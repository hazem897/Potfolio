import { Menu, X } from 'lucide-react';

const navLinks = [
  ['accueil', 'Accueil'],
  ['profil', 'Profil'],
  ['experience', 'Expérience'],
  ['projets', 'Projets'],
  ['competences', 'Compétences']
];

export default function Navbar({ menuOpen, setMenuOpen }) {
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="topbar">
      <a className="brand" href="#accueil" onClick={closeMenu}>
        HK<span>.</span>
      </a>

      <nav className={menuOpen ? 'nav open' : 'nav'}>
        {navLinks.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={closeMenu}>
            {label}
          </a>
        ))}
      </nav>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}
