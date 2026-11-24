import { FileText, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export default function Footer() {
  const { lang, dict } = useLanguage();
  const currentYear = new Date().getFullYear();

  const cvHref = lang === 'en' ? '/CV_Hazem_EN.pdf' : '/CV_Hazem_FR.pdf';
  const cvDownload = lang === 'en' ? 'CV_Hazem_Khaled_EN.pdf' : 'CV_Hazem_Khaled_FR.pdf';

  return (
    <footer>
      <div>
        <a className="brand" href="#accueil">
          HK<span>.</span>
        </a>
        <p>Data Analyst · Business Intelligence</p>
      </div>

      <div className="footer-links">
        <a
          href={cvHref}
          download={cvDownload}
          target="_blank"
          rel="noreferrer"
        >
          <FileText size={16} /> {dict.hero.resumeBtn}
        </a>
        <a
          href="https://www.linkedin.com/in/hazem-khaled-data/"
          target="_blank"
          rel="noreferrer"
        >
          <span className="linkedin-mark">in</span> LinkedIn
        </a>
        <a
          href="https://github.com/hazem897"
          target="_blank"
          rel="noreferrer"
        >
          <GitHubIcon /> GitHub
        </a>
        <a href="mailto:hazemhazem9089@gmail.com">
          <Mail size={16} /> Email
        </a>
        <a href="tel:+21652416031">
          <Phone size={16} /> +216 52 416 031
        </a>
      </div>
    </footer>
  );
}
