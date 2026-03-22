// Portfolio de Hazem Khaled - Script JavaScript Professionnel

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== CONFIGURATION ==========
    const config = {
        // Animation au scroll
        scrollAnimation: {
            enabled: true,
            offset: 100
        },
        
        // Données des projets
        projects: {
            data: [
                // PROJET STAGE OOREDOO (NOUVEAU)
                {
                    title: "Portail Web Décisionnel - Ooredoo Tunisie",
                    description: "Développement d'un portail web décisionnel intégrant des tableaux de bord interactifs Power BI pour l'analyse des données commerciales.",
                    technologies: ["PHP", "MVC", "Power BI", "Talend", "ETL", "Data Warehouse", "MySQL", "Authentification", "Schéma en étoile", "Sécurité"],
                    details: "Projet de stage réalisé chez Ooredoo Tunisie de Février 2026 à Mai 2026. Développement d'un portail web décisionnel complet permettant aux gestionnaires d'accéder à des analyses de données avancées.\n\n" +
                             "🔹 **Réalisations techniques :**\n" +
                             "• Conception et développement d'une application web en PHP suivant l'architecture MVC\n" +
                             "• Intégration de tableaux de bord interactifs Power BI pour l'analyse en temps réel des données commerciales\n" +
                             "• Mise en place d'un processus ETL complet avec Talend (extraction, nettoyage, transformation et chargement des données)\n" +
                             "• Modélisation d'un Data Warehouse selon un schéma en étoile pour optimiser les requêtes analytiques\n" +
                             "• Implémentation de fonctionnalités de sécurité avancées (authentification, gestion des rôles et permissions)\n" +
                             "• Analyse approfondie des données pour faciliter la prise de décision stratégique\n\n" +
                             "🔹 **Résultats :**\n" +
                             "• Portail web performant utilisé par plusieurs départements\n" +
                             "• Réduction du temps d'accès aux rapports de 70%\n" +
                             "• Tableaux de bord interactifs permettant une visualisation intuitive des KPI\n" +
                             "• Processus ETL automatisé garantissant la fraîcheur des données"
                },
                {
                    title: "Projet Power BI — Analyse décisionnelle",
                    description: "Création de tableaux de bord interactifs avec KPI, tendances et comparaisons pour aider à la prise de décision via des visualisations dynamiques.",
                    technologies: ["Power BI", "Data Visualization", "KPI", "Data Cleaning", "DAX", "Data Modeling"],
                    details: "Ce projet Power BI comprend le nettoyage, la préparation et la structuration des données. J'ai créé des tableaux de bord interactifs avec des indicateurs de performance clés (KPI), l'analyse des tendances et des comparaisons pour faciliter la prise de décision via des visualisations dynamiques. Le projet implique l'extraction, la transformation et le chargement (ETL) des données, la création de mesures personnalisées avec DAX, et la conception d'une interface utilisateur intuitive pour les décideurs."
                },
                {
                    title: "SQL — Analyse de données",
                    description: "Réalisation de requêtes complexes (SELECT, JOIN, GROUP BY, sous-requêtes) et création de vues pour l'analyse décisionnelle.",
                    technologies: ["SQL", "MySQL", "Data Analysis", "Database Views", "JOIN", "GROUP BY", "Subqueries"],
                    details: "Dans ce projet SQL, j'ai travaillé sur l'analyse de données avec des requêtes complexes incluant SELECT, JOIN, GROUP BY et des sous-requêtes. J'ai également créé des vues spécifiques pour faciliter l'analyse décisionnelle et l'extraction d'informations pertinentes. Le projet comprend l'optimisation des requêtes pour de meilleures performances, la création de procédures stockées, et la documentation complète du schéma de base de données pour une maintenance facile."
                }
            ],
            academiques: [
                {
                    title: "Application Web de gestion des employés (PHP MVC)",
                    description: "Développement d'une application complète avec authentification sécurisée, gestion CRUD via PDO (modèle Singleton) et interface HTML/CSS dynamique.",
                    technologies: ["PHP", "MySQL", "HTML/CSS", "MVC", "PDO", "Singleton Pattern"],
                    details: "Cette application permet de gérer les employés d'une entreprise avec un système d'authentification sécurisé. Elle inclut toutes les opérations CRUD (Create, Read, Update, Delete) et utilise l'architecture MVC pour une meilleure organisation du code. L'application implémente le modèle Singleton pour la connexion à la base de données via PDO, assurant une seule instance de connexion et améliorant les performances. L'interface utilisateur est responsive et intuitive."
                },
                {
                    title: "Mini-projet Java & MySQL",
                    description: "Conception d'une application CRUD pour gérer des données clients, avec interface graphique Java et base de données MySQL.",
                    technologies: ["Java", "MySQL", "Swing", "JDBC"],
                    details: "Application desktop développée en Java avec interface graphique Swing. Elle permet de gérer une base de données clients avec connexion directe à MySQL via JDBC. L'application inclut des fonctionnalités de recherche avancée, de tri des données, et de génération de rapports. L'architecture suit les principes de la programmation orientée objet avec une séparation claire entre la logique métier et l'interface utilisateur."
                }
            ],
            personnels: [
                {
                    title: "Application Web de gestion d'une bibliothèque (PHP MVC)",
                    description: "Conception et développement d'une application avec architecture MVC. Fonctionnalités : ajout, suppression, modification et affichage des livres avec authentification utilisateur. Utilisation de PDO (modèle Singleton) et interface HTML/CSS ergonomique.",
                    technologies: ["PHP", "MySQL", "HTML/CSS", "MVC", "PDO", "Singleton Pattern"],
                    details: "Système complet de gestion de bibliothèque permettant d'ajouter, modifier, supprimer et rechercher des livres. L'application inclut un système d'authentification utilisateur et une interface responsive. Elle permet également la gestion des emprunts, des retours et des notifications par email. Le système de recherche avancée permet de trouver des livres par titre, auteur, catégorie ou ISBN."
                },
                {
                    title: "Projet Power BI",
                    description: "Conception d'un tableau de bord interactif pour l'analyse et la visualisation de données afin d'aider à la prise de décision.",
                    technologies: ["Power BI", "Data Visualization", "DAX", "Data Modeling"],
                    details: "Tableau de bord interactif développé avec Power BI pour visualiser et analyser des données commerciales. Inclut des graphiques dynamiques, des filtres interactifs et des indicateurs de performance clés (KPI). Le projet comprend l'intégration de données provenant de multiples sources, la création de relations entre les tables, et le développement de mesures DAX personnalisées pour des analyses spécifiques."
                },
                {
                    title: "Python - Automatisation & Analyse",
                    description: "Création de scripts pour l'automatisation de tâches et l'analyse de données.",
                    technologies: ["Python", "Pandas", "NumPy", "Matplotlib", "Automation"],
                    details: "Collection de scripts Python pour automatiser des tâches répétitives et analyser des jeux de données. Inclut le nettoyage de données, l'analyse statistique et la génération de rapports automatisés. Les scripts utilisent Pandas pour la manipulation des données, NumPy pour les calculs numériques, et Matplotlib pour la visualisation. Un des scripts automatisés génère des rapports PDF quotidiens à partir de données Excel."
                }
            ],
            autres: [
                {
                    title: "Site Web Club OpenMic",
                    description: "Développement du site web officiel du club OpenMic en PHP, HTML et CSS.",
                    technologies: ["PHP", "HTML", "CSS", "JavaScript"],
                    details: "Site web développé pour le club OpenMic de la FSEGN. Présente les activités du club, les événements à venir et permet aux membres de s'inscrire aux différentes activités. Le site inclut un système d'administration pour la gestion du contenu, une galerie photo, et un calendrier des événements. L'interface est responsive et compatible avec tous les navigateurs modernes."
                }
            ]
        }
    };
    
    // ========== ÉLÉMENTS DOM ==========
    const elements = {
        nav: document.querySelector('.navbar'),
        hamburger: document.getElementById('hamburger'),
        navLinks: document.querySelector('.nav-links'),
        backToTop: document.getElementById('backToTop'),
        contactForm: document.getElementById('contactForm'),
        projectModal: document.getElementById('projectModal'),
        modalTitle: document.getElementById('modal-title'),
        modalDescription: document.getElementById('modal-description'),
        modalTechnologies: document.getElementById('modal-technologies'),
        closeModal: document.querySelector('.close-modal'),
        tabButtons: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        currentYear: document.getElementById('current-year'),
        profileImage: document.getElementById('profile-image'),
        githubLink: document.getElementById('github-link')
    };
    
    // ========== ÉTAT DE L'APPLICATION ==========
    const state = {
        currentProjectTab: 'data',
        activeSection: 'accueil'
    };
    
    // ========== FONCTIONS D'INITIALISATION ==========
    
    // Initialiser l'année actuelle dans le footer
    function initCurrentYear() {
        if (elements.currentYear) {
            elements.currentYear.textContent = new Date().getFullYear();
        }
    }
    
    // Initialiser les projets
    function initProjects() {
        // Ajouter les événements aux boutons de projet
        document.querySelectorAll('.btn-project-details').forEach((btn, index) => {
            btn.addEventListener('click', function() {
                const projectCard = this.closest('.project-card');
                const projectTitle = projectCard.querySelector('h3').textContent;
                const projectDescription = projectCard.querySelector('p:not(.project-period):not(.project-company):not(.project-description)')?.textContent || 
                                          projectCard.querySelector('.project-description')?.textContent;
                
                // Récupérer toutes les technologies
                const projectTech = Array.from(projectCard.querySelectorAll('.project-tech span')).map(span => span.textContent);
                
                // Trouver le projet correspondant dans les données
                let projectDetails = null;
                const category = state.currentProjectTab;
                
                // Chercher dans la catégorie correspondante
                if (config.projects[category]) {
                    // Chercher par titre (simplifié)
                    projectDetails = config.projects[category].find(p => 
                        p.title.toLowerCase().includes(projectTitle.toLowerCase()) ||
                        projectTitle.toLowerCase().includes(p.title.toLowerCase().substring(0, 15))
                    );
                }
                
                // Si pas trouvé, chercher dans toutes les catégories
                if (!projectDetails) {
                    for (const cat in config.projects) {
                        const found = config.projects[cat].find(p => 
                            p.title.toLowerCase().includes(projectTitle.toLowerCase()) ||
                            projectTitle.toLowerCase().includes(p.title.toLowerCase().substring(0, 15))
                        );
                        if (found) {
                            projectDetails = found;
                            break;
                        }
                    }
                }
                
                // Si toujours pas trouvé, créer un objet à partir des infos de la carte
                if (!projectDetails) {
                    projectDetails = {
                        title: projectTitle,
                        description: projectDescription || "Description détaillée du projet.",
                        technologies: projectTech,
                        details: projectDescription || "Description détaillée du projet."
                    };
                }
                
                openProjectModal(projectDetails);
            });
        });
    }
    
    // Initialiser les onglets de projets
    function initProjectTabs() {
        if (elements.tabButtons && elements.tabContents) {
            elements.tabButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // Mettre à jour l'état
                    state.currentProjectTab = tabId;
                    
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
                    
                    // Réinitialiser les animations des projets
                    setTimeout(() => {
                        initScrollAnimations();
                        initProjects(); // Réinitialiser les écouteurs de projet
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
        
        // Fermer le menu mobile en cliquant sur un lien
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                elements.hamburger.classList.remove('active');
                elements.navLinks.classList.remove('active');
            });
        });
    }
    
    // Initialiser le formulaire de contact
    function initContactForm() {
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Récupérer les valeurs du formulaire
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const subject = document.getElementById('subject').value;
                const message = document.getElementById('message').value;
                
                // Validation basique
                if (!name || !email || !message) {
                    showNotification('Veuillez remplir tous les champs obligatoires', 'error');
                    return;
                }
                
                // Validation d'email simple
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showNotification('Veuillez entrer une adresse email valide', 'error');
                    return;
                }
                
                // Simuler l'envoi du formulaire
                simulateFormSubmission(name, email, subject, message);
            });
        }
    }
    
    // Initialiser la modal de projet
    function initProjectModal() {
        if (elements.closeModal) {
            elements.closeModal.addEventListener('click', closeProjectModal);
        }
        
        // Fermer la modal en cliquant à l'extérieur
        elements.projectModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeProjectModal();
            }
        });
        
        // Fermer la modal avec la touche Échap
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && elements.projectModal.style.display === 'flex') {
                closeProjectModal();
            }
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
        // Observer les sections pour mettre à jour la navigation
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    state.activeSection = entry.target.id;
                    
                    // Mettre à jour les liens de navigation
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${state.activeSection}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        // Observer toutes les sections
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }
    
    // Initialiser les liens GitHub
    function initGitHubLinks() {
        if (elements.githubLink) {
            elements.githubLink.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Mon profil GitHub sera bientôt disponible !', 'info');
            });
        }
        
        // Lien GitHub dans la section hero
        const heroGithubLink = document.querySelector('.social-icons a[title="GitHub"]');
        if (heroGithubLink) {
            heroGithubLink.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Mon profil GitHub sera bientôt disponible !', 'info');
            });
        }
    }
    
    // ========== FONCTIONS D'ANIMATION ==========
    
    // Gérer les animations au scroll
    function initScrollAnimations() {
        if (!config.scrollAnimation.enabled) return;
        
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
            rootMargin: `0px 0px -${config.scrollAnimation.offset}px 0px`
        });
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // ========== FONCTIONS D'INTERACTION ==========
    
    // Ouvrir la modal de projet
    function openProjectModal(project) {
        if (!project || !elements.modalTitle) return;
        
        // Mettre à jour le contenu de la modal
        elements.modalTitle.textContent = project.title;
        
        // Formater la description avec les sauts de ligne
        let description = project.details || project.description;
        description = description.replace(/\n/g, '<br>');
        description = description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        description = description.replace(/🔹/g, '🔹');
        description = description.replace(/•/g, '•');
        
        elements.modalDescription.innerHTML = description;
        
        // Mettre à jour les technologies
        if (elements.modalTechnologies) {
            elements.modalTechnologies.innerHTML = '';
            if (project.technologies && project.technologies.length > 0) {
                project.technologies.forEach(tech => {
                    const techSpan = document.createElement('span');
                    techSpan.className = 'skill-tag';
                    techSpan.textContent = tech;
                    elements.modalTechnologies.appendChild(techSpan);
                });
            }
        }
        
        // Afficher la modal
        elements.projectModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Fermer la modal de projet
    function closeProjectModal() {
        elements.projectModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Simuler l'envoi du formulaire
    function simulateFormSubmission(name, email, subject, message) {
        // Afficher un indicateur de chargement
        const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simuler un délai d'envoi
        setTimeout(() => {
            // Réinitialiser le formulaire
            elements.contactForm.reset();
            
            // Restaurer le bouton
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Afficher une notification de succès
            showNotification('Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');
            
            // Simuler l'envoi par email (dans un environnement réel, ce serait une requête AJAX)
            console.log('Message envoyé:');
            console.log('De:', name);
            console.log('Email:', email);
            console.log('Sujet:', subject);
            console.log('Message:', message);
        }, 1500);
    }
    
    // Afficher une notification
    function showNotification(message, type = 'info') {
        // Supprimer les notifications existantes
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Créer la notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Ajouter au DOM
        document.body.appendChild(notification);
        
        // Afficher avec animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Fermer la notification
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Fermer automatiquement après 5 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
    
    // ========== ÉVÉNEMENTS GLOBAUX ==========
    
    // Gérer le défilement de la page
    function handleScroll() {
        // Gérer la navbar
        if (elements.nav) {
            if (window.scrollY > 50) {
                elements.nav.classList.add('scrolled');
            } else {
                elements.nav.classList.remove('scrolled');
            }
        }
        
        // Gérer le bouton retour en haut
        if (elements.backToTop) {
            if (window.scrollY > 300) {
                elements.backToTop.style.display = 'block';
            } else {
                elements.backToTop.style.display = 'none';
            }
        }
    }
    
    // ========== STYLES DYNAMIQUES POUR LES NOTIFICATIONS ==========
    function addNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                z-index: 9999;
                border-left: 4px solid #3498db;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left-color: #2ecc71;
            }
            
            .notification-error {
                border-left-color: #e74c3c;
            }
            
            .notification-info {
                border-left-color: #3498db;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification-success .notification-content i {
                color: #2ecc71;
            }
            
            .notification-error .notification-content i {
                color: #e74c3c;
            }
            
            .notification-info .notification-content i {
                color: #3498db;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                color: #7f8c8d;
                font-size: 1rem;
                margin-left: 10px;
                transition: color 0.2s;
            }
            
            .notification-close:hover {
                color: #2c3e50;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ========== INITIALISATION ==========
    function init() {
        // Ajouter les styles pour les notifications
        addNotificationStyles();
        
        // Initialiser les composants
        initCurrentYear();
        initProjectTabs();
        initMobileNavigation();
        initContactForm();
        initProjectModal();
        initBackToTop();
        initActiveNavigation();
        initProjects();
        initGitHubLinks();
        initScrollAnimations();
        
        // Écouter les événements globaux
        window.addEventListener('scroll', handleScroll);
        
        // Initialiser le scroll
        handleScroll();
        
        // Afficher une notification de bienvenue
        setTimeout(() => {
            showNotification('Bienvenue sur mon portfolio ! Explorez mes projets et compétences.', 'info');
        }, 1000);
        
        // Gérer les images manquantes
        if (elements.profileImage) {
            elements.profileImage.onerror = function() {
                this.src = 'https://via.placeholder.com/350x350/3498db/ffffff?text=Hazem+Khaled';
                this.alt = 'Photo de profil par défaut';
            };
        }
        
        // Log d'initialisation
        console.log('Portfolio de Hazem Khaled initialisé avec succès!');
        console.log('Contact: hazemhazem9089@gmail.com | LinkedIn: linkedin.com/in/khaled-hazem-9a323532a');
    }
    
    // Démarrer l'application
    init();
});