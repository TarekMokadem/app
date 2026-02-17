# ShareMatos Landing Page - PRD

## Original Problem Statement
Créer une landing page moderne, claire et crédible pour ShareMatos - startup française de location d'outils entre voisins.

**Style**: Design moderne startup tech, couleurs bleu/vert équilibrées, mobile-first, look marketplace (Airbnb/Leboncoin)

## User Choices
- MongoDB simple pour stockage des inscriptions
- Photos professionnelles
- Combinaison équilibrée bleu/vert
- Témoignages des deux types (locataire + propriétaire)
- Full-stack complet

## Architecture
- **Frontend**: React + Shadcn UI + Tailwind CSS
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB (collection: waitlist)

## Core Requirements (Static)

### Hero Section
- Titre impactant sur la location d'outils entre voisins
- Sous-titre avec exemples concrets (perceuse, tondeuse, etc.)
- 2 CTAs (liste d'attente + louer un objet)
- Image de fond avec gradient bleu-vert

### Comment ça marche (3 étapes)
1. Trouvez un outil près de chez vous
2. Réservez facilement
3. Récupérez et utilisez

### Pourquoi ShareMatos (4 bénéfices)
- Plus économique que l'achat
- Entre voisins
- Écologique
- Gagnez de l'argent

### Formulaire Inscription
**Champs**:
- Prénom (texte, requis)
- Email (email, requis, unique)
- Ville (texte, requis)
- Type utilisateur (checkboxes, au moins 1 requis):
  - Je veux louer
  - Je veux proposer mes objets
  - Les deux

### Section Preuve Sociale
- Compteur "127+ personnes intéressées"
- 2 témoignages fictifs avec photos (locataire + propriétaire)

### Footer
- Mentions légales, Contact, CGU
- Réseaux sociaux
- Email de contact

## API Contracts

### POST /api/waitlist
**Request Body**:
```json
{
  "prenom": "string",
  "email": "string (EmailStr)",
  "ville": "string",
  "userType": {
    "louer": boolean,
    "proposer": boolean
  }
}
```

**Response 200**:
```json
{
  "id": "uuid",
  "prenom": "string",
  "email": "string",
  "ville": "string",
  "userType": {"louer": bool, "proposer": bool},
  "timestamp": "datetime"
}
```

**Error 400**: Email déjà inscrit
**Error 422**: Validation échouée

### GET /api/waitlist
**Response 200**: Array of waitlist entries

### GET /api/waitlist/count
**Response 200**: `{"count": number}`

## Implemented Features (December 2024)

### ✅ Phase 1 - Full-Stack Landing Page
- [x] Hero section avec gradient bleu-vert et image professionnelle
- [x] Header fixed avec logo et CTA
- [x] Section "Comment ça marche" (3 cartes avec icônes)
- [x] Section "Pourquoi ShareMatos" (4 bénéfices)
- [x] Formulaire d'inscription complet avec validation
- [x] Section témoignages avec 2 utilisateurs
- [x] Footer avec liens et contact
- [x] Backend API MongoDB pour liste d'attente
- [x] Validation email unique
- [x] Toast notifications (Sonner)
- [x] Scroll smooth vers formulaire
- [x] Design responsive
- [x] Animations hover sur éléments interactifs

### Testing Results
- Backend: 100% (10/10 tests passed)
- Frontend: UI verified, all sections loading correctly
- APIs fully functional and tested

## Prioritized Backlog

### P0 Features (Core - COMPLETED)
✅ All core features implemented

### P1 Features (High Priority)
- [ ] Analytics tracking (Google Analytics ou Plausible)
- [ ] Admin dashboard pour voir les inscriptions
- [ ] Export CSV des inscriptions
- [ ] Email de confirmation automatique après inscription

### P2 Features (Nice to Have)
- [ ] Animations d'entrée pour les sections (AOS library)
- [ ] Optimisation SEO (meta tags, Open Graph)
- [ ] A/B testing sur CTAs
- [ ] Integration avec service emailing (Mailchimp/SendGrid)
- [ ] Carte interactive pour visualiser les villes d'inscription

## Next Tasks
1. Optional: Add admin dashboard to view waitlist entries
2. Optional: Send confirmation emails to new subscribers
3. Optional: Add analytics tracking
4. Optional: Implement A/B testing on CTAs to optimize conversion
