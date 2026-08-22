// Portfolio de Hazem Khaled - Script JavaScript Professionnel

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== ÉLÉMENTS DOM ==========
    const elements = {
        nav: document.querySelector('.navbar'),
        hamburger: document.getElementById('hamburger'),
        navLinks: document.querySelector('.nav-links'),
        backToTop: document.getElementById('backToTop'),
        tabButtons: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        currentYear: document.getElementById('current-year'),
        profileImage: document.getElementById('profile-image'),
        githubLink: document.getElementById('github-link')
    };
    
    // ========== FONCTIONS D'INITIALISATION ==========
    
    // Initialiser l'année actuelle dans le footer
    function initCurrentYear() {
        if (elements.currentYear) {
            elements.currentYear.textContent = new Date().getFullYear();
        }
    }
    
    // Initialiser les onglets de projets
    function initProjectTabs() {
        if (elements.tabButtons && elements.tabContents) {
            elements.tabButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // Mettre à jour les boutons actifs
                    elements.tabButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Mettre à jour les contenus actifs
                    elements.tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === tabId) {
                            content.classList.add('active');
                        }
                    });
                    
                    // Réinitialiser les animations
                    setTimeout(() => {
                        initScrollAnimations();
                    }, 300);
                });
            });
        }
    }
    
    // Initialiser la navigation mobile
    function initMobileNavigation() {
        if (elements.hamburger) {
            elements.hamburger.addEventListener('click', function() {
                this.classList.toggle('active');
                elements.navLinks.classList.toggle('active');
            });
        }
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                elements.hamburger.classList.remove('active');
                elements.navLinks.classList.remove('active');
            });
        });
    }
    
    // Initialiser le bouton retour en haut
    function initBackToTop() {
        if (elements.backToTop) {
            elements.backToTop.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // Initialiser la navigation active
    function initActiveNavigation() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }
    
    // Initialiser les liens GitHub
    function initGitHubLinks() {
        if (elements.githubLink) {
            elements.githubLink.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Mon profil GitHub sera bientôt disponible !');
            });
        }
        
        const heroGithubLink = document.querySelector('.social-icons a[title="GitHub"]');
        if (heroGithubLink) {
            heroGithubLink.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Mon profil GitHub sera bientôt disponible !');
            });
        }
    }
    
    // ========== FONCTIONS D'ANIMATION ==========
    
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.highlight-card, .timeline-item, .experience-card, .club-card, .project-card, .skills-category'
        );
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // ========== ÉVÉNEMENTS GLOBAUX ==========
    
    function handleScroll() {
        if (elements.nav) {
            if (window.scrollY > 50) {
                elements.nav.classList.add('scrolled');
            } else {
                elements.nav.classList.remove('scrolled');
            }
        }
        
        if (elements.backToTop) {
            if (window.scrollY > 300) {
                elements.backToTop.style.display = 'block';
            } else {
                elements.backToTop.style.display = 'none';
            }
        }
    }
    
    // ========== INITIALISATION ==========
    function init() {
        initCurrentYear();
        initProjectTabs();
        initMobileNavigation();
        initBackToTop();
        initActiveNavigation();
        initGitHubLinks();
        initScrollAnimations();
        
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        
        if (elements.profileImage) {
            elements.profileImage.onerror = function() {
                this.src = 'https://via.placeholder.com/350x350/3498db/ffffff?text=Hazem+Khaled';
                this.alt = 'Photo de profil par défaut';
            };
        }
        
        console.log('Portfolio de Hazem Khaled initialisé avec succès!');
        console.log('Contact: hazemhazem9089@gmail.com | LinkedIn: linkedin.com/in/hazem-khaled-data');
    }
    
    init();
});