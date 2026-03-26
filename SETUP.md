# ShareMatos - Actions à réaliser de votre côté

Ce document liste tout ce que vous devez configurer ou compléter pour que la landing page soit 100 % opérationnelle.

---

## 1. Pages légales (obligatoire avant mise en production)

Les pages **Mentions légales**, **CGU** et **Politique de confidentialité** contiennent des zones `[À REMPLIR]`. Vous devez les compléter avec vos informations réelles.

### Mentions légales (`/mentions-legales`)
- **Éditeur du site** : Raison sociale, forme juridique, capital social, siège social, numéro SIRET
- **Hébergeur** : Nom, adresse et coordonnées de votre hébergeur (ex. Emergent, OVH, etc.)
- **Directeur de la publication** : Nom du responsable

### CGU (`/cgu`)
- **Date de dernière mise à jour** : Remplacez `[À REMPLIR - Date]` par la date du jour (ex. 17 février 2025)

### Politique de confidentialité (`/politique-confidentialite`)
- **Responsable du traitement** : Raison sociale et coordonnées
- **Date de dernière mise à jour** : Remplacez `[À REMPLIR - Date]`
- **Cookies** : Si vous ajoutez Google Analytics ou Plausible, décrivez les cookies utilisés

---

## 2. Réseaux sociaux

Les liens du footer pointent vers des URLs par défaut. Mettez à jour dans `frontend/src/pages/Landing.jsx` (section Footer) :

```jsx
// Remplacez par vos vraies URLs quand vos pages existent
<a href="https://facebook.com/VOTRE_PAGE" ...>Facebook</a>
<a href="https://instagram.com/VOTRE_COMPTE" ...>Instagram</a>
<a href="https://linkedin.com/company/VOTRE_ENTREPRISE" ...>LinkedIn</a>
```

Si vous n'avez pas encore de pages, vous pouvez temporairement retirer ces liens ou les remplacer par `#`.

---

## 3. Variables d'environnement

### Backend (`backend/.env`)
Vérifiez que ces variables sont définies :
- `MONGO_URL` : URL de connexion MongoDB
- `DB_NAME` : Nom de la base de données
- `CORS_ORIGINS` : Origines autorisées (ex. `https://votredomaine.fr,https://www.votredomaine.fr`)

### Frontend (`frontend/.env`)
- `REACT_APP_BACKEND_URL` : URL de votre API (ex. `https://api.sharematos.fr` ou l'URL de déploiement)

---

## 4. Email de contact

L'email `contact@sharematos.fr` est utilisé dans le footer et les pages légales. Assurez-vous que :
- Cette adresse existe et est consultée régulièrement
- Ou remplacez-la par votre vraie adresse dans tous les fichiers

---

## 5. Analytics (recommandé)

Un script PostHog est déjà présent dans `index.html`. Pour d'autres outils :

- **Google Analytics** : Ajoutez le script GA4 dans `frontend/public/index.html` (avant `</head>`)
- **Plausible** : Plus respectueux de la vie privée, script minimal à ajouter

---

## 6. Sécurité API (recommandé pour la production)

L'endpoint `GET /api/waitlist` retourne toutes les inscriptions. En production, vous devriez :
- Le protéger par authentification (token, API key)
- Ou le désactiver et créer un dashboard admin séparé

---

## 7. Emails de confirmation (optionnel)

Pour envoyer un email de confirmation après inscription :
- Intégrez SendGrid, Mailchimp ou Resend côté backend
- Déclenchez l'envoi dans la route `POST /api/waitlist` après insertion en base

---

## 8. Favicon

Remplacez le favicon par défaut par votre logo ShareMatos dans `frontend/public/`.

---

## Récapitulatif des modifications effectuées

| Élément | Statut |
|---------|--------|
| Compteur dynamique (API) | ✅ Corrigé |
| Validation backend userType | ✅ Corrigé |
| Pages légales (Mentions, CGU, Confidentialité) | ✅ Créées (à compléter) |
| Liens footer | ✅ Fonctionnels |
| SEO (meta tags, Open Graph) | ✅ Ajouté |
| Année footer | ✅ 2025 |
