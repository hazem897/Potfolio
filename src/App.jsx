import { useState, useCallback } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import useScrollReveal from './hooks/useScrollReveal';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('data');
  const [selectedProject, setSelectedProject] = useState(null);
  const [videoProject, setVideoProject] = useState(null);

  // Activate scroll-reveal animations
  useScrollReveal();

  const handleCloseModals = useCallback(() => {
    setSelectedProject(null);
    setVideoProject(null);
  }, []);

  const handleOpenDetails = useCallback((project) => {
    setSelectedProject(project);
    setVideoProject(null);
  }, []);

  const handleOpenVideo = useCallback((project) => {
    setVideoProject(project);
    setSelectedProject(null);
  }, []);

  const handleSwitchToVideo = useCallback((project) => {
    setSelectedProject(null);
    setVideoProject(project);
  }, []);

  return (
    <LanguageProvider>
      <ScrollProgress />
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main>
        <Hero />
        <About />
        <Experience />
        <Projects
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenDetails={handleOpenDetails}
          onOpenVideo={handleOpenVideo}
        />
        <Skills />
        <Certifications />
        <Education />
        <Contact />
      </main>

      <Footer />

      <ProjectModal
        selectedProject={selectedProject}
        videoProject={videoProject}
        onClose={handleCloseModals}
        onSwitchToVideo={handleSwitchToVideo}
      />
    </LanguageProvider>
  );
}
