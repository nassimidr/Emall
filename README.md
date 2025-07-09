# Emall

Emall est une plateforme web de découverte, recommandation et personnalisation autour des centres commerciaux, boutiques et produits. Elle permet aux utilisateurs de trouver des malls, des boutiques et des produits adaptés à leurs préférences, d'explorer des recommandations personnalisées, de participer à des quiz de style, et bien plus encore.

## Fonctionnalités principales

- **Découverte de centres commerciaux (malls)** : Liste et fiches détaillées des malls avec informations, boutiques associées, avis, etc.
- **Découverte de boutiques** : Parcours des boutiques par mall ou via la recherche, pages de détail pour chaque boutique.
- **Découverte de produits** : Catalogue de produits, filtres, pages de détail produit.
- **Recherche avancée** : Recherche multi-critères sur malls, boutiques et produits.
- **Quiz de style personnalisé** : Quiz interactif pour affiner les recommandations selon les goûts de l'utilisateur.
- **Recommandations personnalisées** : Suggestions de malls, boutiques et produits selon le profil et les préférences.
- **Gestion des utilisateurs** : Inscription, connexion, gestion du profil, favoris.
- **Avis et notations** : Les utilisateurs peuvent noter et commenter malls, boutiques et produits.
- **Blog, compétitions et activités** : Contenus éditoriaux, jeux et animations pour la communauté.
- **Interface moderne et responsive** : Navigation fluide, composants interactifs, design adaptatif.

## Architecture du projet

### Backend (`backend/`)
- **Node.js** avec **Express.js**
- Structure MVC :
  - `server.js` : point d'entrée du serveur
  - `routes/` : routes REST (malls, shops, products, auth, search...)
  - `models/` : schémas de données (Mall, Shop, Product, User, Review...)
  - `controllers/`, `middleware/`, `utils/`, `config/`
- (Base de données : MongoDB recommandée)

### Frontend (`front/`)
- **Next.js** (React) + **TypeScript**
- **Tailwind CSS** pour le style
- Structure par pages et composants :
  - `app/` : pages principales (malls, shops, products, style-quiz, blog, competition, profile, etc.)
  - `components/` : composants réutilisables (cards, navbar, quiz, map, etc.)
  - `public/`, `styles/`, `lib/`, `hooks/`

## Technologies utilisées

- **Frontend** : Next.js, React, TypeScript, Tailwind CSS
- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB (recommandé)
- **Autres** : JWT (authentification), REST API

## Lancer le projet

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd front
npm install
npm run dev
```

---

Pour toute question ou contribution, n'hésitez pas à ouvrir une issue ou une pull request ! 