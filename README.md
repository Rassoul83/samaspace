# SamaSpace — Plateforme sénégalaise de réservation d'espaces

Scaffold MVP généré à partir du cahier des charges (recherche → matching → comparaison → disponibilité → réservation).
Stack : React + Vite + Tailwind + React Router + Firebase (Firestore, Auth, Storage) — même écosystème que Keurou Sénégal.

## Démarrer en local

```
npm install
npm run dev
```

L'app tourne avec des données de démonstration (`src/data/mockSpaces.js`) tant que Firestore est vide, donc tu peux naviguer sans configurer Firebase tout de suite.

## Connecter Firebase

1. Crée un projet Firebase (ou réutilise celui de Keurou si tu préfères séparer les environnements).
2. Active **Firestore**, **Authentication (Email/Password)** et **Storage**.
3. Remplace les valeurs dans `src/firebase/config.js` par celles de ton projet.
4. Déploie les règles de sécurité : `firebase deploy --only firestore:rules` (fichier `firestore.rules` fourni).

## Structure des données Firestore

- `utilisateurs/{uid}` — nom, email, role (`client` | `proprietaire`)
- `espaces/{id}` — fiche espace complète (voir `AjouterEspace.jsx` pour les champs)
- `reservations/{id}` — demandes de réservation, statut : `en_attente` | `confirmee` | `refusee` | `annulee`
- `avis/{id}` — avis liés à un espace (`espaceId`)

## Ce qui est couvert (périmètre MVP du cahier des charges, section 31)

Accueil avec moteur de recherche · résultats filtrables · fiche espace transactionnelle · fonction "Trouvez-moi une salle" avec score de matching · comparateur (jusqu'à 4 espaces) · inscription/connexion client & propriétaire · espace client (demandes, favoris à implémenter) · espace propriétaire (ajout d'espace, gestion des demandes) · admin basique (vérification "Salle vérifiée") · pages : comment ça marche, devenir propriétaire, à propos, contact, FAQ.

## Ce qui reste à construire (versions 2 et 3 du cahier des charges)

- **Paiement** : intégration Wave / Orange Money / Free Money / cartes (section 13)
- **Notifications** : email transactionnel, puis WhatsApp Business et SMS (section 19)
- **Favoris** : collection `favoris/{uid}` à créer (bouton déjà en place dans la fiche espace)
- **Upload de photos/vidéos** réel via Firebase Storage (actuellement placeholders visuels)
- **SEO local** : pages villes/quartiers/activités indexables, données structurées, sitemap (section 23)
- **Recherche en langage naturel** pour "Trouvez-moi une salle" (actuellement formulaire structuré — le calcul de score est déjà fonctionnel)
- **Rôles admin avancés** : gestionnaire de contenu, support, vérificateur terrain
- **Application mobile** — après validation du modèle économique (section 34)

## Design

Palette et typographie pensées pour se différencier des templates génériques : bleu nuit (`#14213D`), ocre sahélien (`#E8A33D`), teal atlantique (`#0F6E6E`) sur fond sable chaud. Typographie Fraunces (display) + Inter (texte) + IBM Plex Mono (prix, données). Élément signature : le cadran de compatibilité (`MatchScore.jsx`), inspiré des bandes tissées du pagne, utilisé pour visualiser le score de matching sur les fiches et résultats.

## Déploiement

Comme pour Keurou, le plus simple est Firebase Hosting :

```
npm run build
firebase deploy --only hosting
```
