# 📊 Système d'Analytics, Tracking des Visiteurs & Dashboard Admin

Système complet de suivi en temps réel et de notification instantanée pour le portfolio de **Hazem Khaled** :
`https://hazem-khaled-portfolio.vercel.app/`

---

## 🚀 Fonctionnalités implémentées

1. **🔔 Notification Email Instantanée à chaque nouvelle visite :**
   - Date et heure exacte (fuseau horaire **Afrique / Tunis**).
   - Pays (avec drapeau emoji), Ville et Région.
   - Type d'appareil (Desktop, Mobile, Tablette), Système d'exploitation (Windows, macOS, iOS, Android, Linux) et Navigateur.
   - Source du trafic (Referrer : LinkedIn, Google, GitHub, Direct, etc.).
   - Pages et sections consultées (`#projets`, `#competences`, `#contact`, etc.).
   - Filtrage anti-bot intelligent (moteurs de recherche, scrapers, crawlers).

2. **🔒 Tableau de Bord Administrateur Privé (`/admin` ou `#admin`) :**
   - Accès sécurisé par mot de passe avec jetons de session signés HMAC-SHA256 (7 jours) et protection anti force-brute.
   - Indicateur en direct des sessions actives (visiteurs en ligne dans les 15 dernières minutes).
   - Filtres temporels : *Aujourd'hui*, *7 derniers jours*, *30 derniers jours*, *Tout l'historique*.
   - Graphique interactif de l'évolution des visites jour par jour.
   - Répartition géographique détaillée par pays avec barres de progression.
   - Répartition des appareils, OS et navigateurs.
   - Tableau des **Leads Volontaires** : association du visiteur avec son nom et email **uniquement** s'il soumet le formulaire de contact.
   - Flux en temps réel des dernières sessions avec métadonnées complètes.
   - **Bouton d'exportation CSV** compatible Excel et Google Sheets (UTF-8 BOM).

3. **🛡️ Respect Strict de la Vie Privée (RGPD & Confidentialité) :**
   - Identifiant visiteur anonyme persistant (`v_xxxxxxxx`) sans empreinte digitale invasive.
   - Aucune adresse IP stockée en clair dans la base de données.
   - Jamais d'usurpation ou de devinette de l'identité : seules les personnes ayant soumis le formulaire de contact sont associées.

---

## 🛠️ Guide d'installation et de configuration en Production

### Étape 1 : Créer votre base de données Supabase gratuite
1. Rendez-vous sur [supabase.com](https://supabase.com/) et connectez-vous (gratuit).
2. Cliquez sur **New Project** (nommez-le par exemple `portfolio-analytics`).
3. Dans le menu de gauche, ouvrez **SQL Editor**.
4. Copiez l'intégralité du fichier [`supabase/schema.sql`](file:///d:/Portfolio/supabase/schema.sql) et cliquez sur **Run**.
   *(Les tables, index de performance, politiques de sécurité RLS et fonctions sont créés automatiquement).*
5. Allez dans **Project Settings** ➔ **API** :
   - Récupérez votre **Project URL** (`https://xxxxxxxxxxxx.supabase.co`).
   - Récupérez votre clé **`service_role` (secret)**.

---

### Étape 2 : Configurer les Variables d'Environnement sur Vercel
Dans votre tableau de bord **Vercel** (`https://vercel.com/` ➔ votre projet `hazem-khaled-portfolio` ➔ **Settings** ➔ **Environment Variables**), ajoutez :

| Variable | Valeur | Description |
| :--- | :--- | :--- |
| `SUPABASE_URL` | `https://votre-projet.supabase.co` | URL de votre base Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJh...` | Clé secrète `service_role` Supabase |
| `ADMIN_PASSWORD` | `votre_mot_de_passe_secret` | Mot de passe d'accès au dashboard (par défaut : `hazem2026admin`) |
| `ADMIN_NOTIFICATION_EMAIL` | `hazemhazem9089@gmail.com` | Email de réception des notifications |
| `RESEND_API_KEY` *(recommandé)* | `re_xxxxxxxxx` | Clé gratuite sur [resend.com](https://resend.com) pour des emails HTML instantanés |

> **Note :** Si vous n'avez pas de clé Resend, le système utilise automatiquement FormSubmit comme solution de secours pour vous envoyer les notifications.

---

### Étape 3 : Accéder au Tableau de Bord Admin
1. Ouvrez votre portfolio : [https://hazem-khaled-portfolio.vercel.app/admin](https://hazem-khaled-portfolio.vercel.app/admin) (ou ajoutez `#admin` à l'URL, ou cliquez sur le cadenas discret **Admin** tout en bas dans le pied de page).
2. Entrez votre mot de passe administrateur : `hazem2026admin` (ou celui que vous avez configuré dans `ADMIN_PASSWORD`).
3. Vous accédez instantanément à vos statistiques en temps réel !
