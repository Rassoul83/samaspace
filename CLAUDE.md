# CLAUDE.md — SamaSpace

Contexte pour Claude Code. Lis ce fichier avant de commencer à modifier le projet.

## Le projet

SamaSpace est une marketplace sénégalaise de recherche, matching et réservation d espaces (salles de réunion, formation, séminaire, événementiel). Lancement pilote : Dakar et Saly, cible 50-100 espaces vérifiés.

Positionnement : pas un annuaire. Le parcours cœur est Besoin → Recherche → Matching → Filtrage → Comparaison → Vérification → Disponibilité → Réservation → Paiement → Confirmation → Avis. Chaque fiche espace doit rester une page transactionnelle, pas une fiche d annuaire.

Le cahier des charges complet (40 sections) a servi de brief. Ce scaffold couvre le périmètre MVP (section 31). Les sections "Version 2" et "Version 3" du cahier des charges sont la roadmap post-MVP — voir plus bas.

Projet développé par Rassoul / Dalitech (Dakar). Autre projet actif dans le même écosystème : Keurou Sénégal (keurou-senegal.web.app), plateforme immobilière Firebase PWA — même stack, mêmes réflexes de déploiement.

## Stack

React 18 + Vite + Tailwind CSS 3 + React Router 6 + Firebase (Firestore, Auth, Storage) + lucide-react (icônes).

Pas de state manager externe (Redux/Zustand) — le state reste local aux pages ou dans AuthContext. Ne pas en introduire un sans besoin réel identifié.

## Commandes

```
npm install
npm run dev       # serveur local
npm run build     # build de prod (déjà testé, passe sans erreur)
npm run preview   # prévisualiser le build
```

Déploiement (comme Keurou) :
```
firebase deploy --only hosting
firebase deploy --only firestore:rules
```

## Configuration Firebase requise avant de coder des features qui touchent aux données

1. Créer un projet Firebase (ou réutiliser celui de Keurou en environnement séparé si préféré).
2. Activer Firestore, Authentication (Email/Password), Storage.
3. Remplacer les valeurs placeholder dans `src/firebase/config.js`.
4. Déployer `firestore.rules` (déjà écrit et fonctionnel pour le MVP : lecture publique des espaces, écriture réservée au propriétaire de la fiche, réservations visibles par client + propriétaire concernés).

Tant que Firestore est vide ou non configuré, l app retombe automatiquement sur `src/data/mockSpaces.js` pour rester navigable — ce comportement de fallback est voulu, ne pas le supprimer sans le remplacer par un vrai état de chargement/vide.

## Conventions de code

- **UI et contenu métier en français** (labels, routes, messages) — c est un produit sénégalais francophone. Pas de traduction anglaise à prévoir.
- **Noms de fichiers/composants en anglais** (convention React standard : `SpaceCard.jsx`, `FilterSidebar.jsx`), mais **champs Firestore et variables métier en français** (`nom`, `ville`, `capacite`, `prixHeure`, `equipements`, `proprietaireId`) pour rester lisible par toute personne qui reprend le projet côté métier.
- Un fichier = un composant ou une page. Pas de fichiers fourre-tout.
- Tailwind uniquement, pas de CSS module ni styled-components. Les classes utilitaires custom (`btn-primary`, `card`, `input`, `label`, `eyebrow`) sont définies dans `src/index.css` via `@layer components` — les réutiliser plutôt que dupliquer les classes Tailwind brutes.
- Prix affichés en FCFA, formatés avec `Intl.NumberFormat("fr-FR")` (voir `formatFCFA` dans `EspaceDetail.jsx` / `SpaceCard.jsx` — à terme, extraire dans un utilitaire partagé `src/lib/format.js` si ça se duplique encore).
- Firestore : helpers CRUD centralisés dans `src/firebase/spaces.js` et `src/firebase/auth.js`. Ne pas appeler `firestore` directement depuis les pages, sauf `Admin.jsx` qui est volontairement simplifié (à refactorer si l admin s étoffe).

## Design system

Palette : bleu nuit `#14213D` (nuit), sable chaud `#F6F1E7` (sable), ocre sahélien `#E8A33D` (ocre), teal atlantique `#0F6E6E` (atlan). Tokens complets dans `tailwind.config.js`.

Typographie : Fraunces (display, titres — `font-display`), Inter (texte courant — `font-sans`), IBM Plex Mono (prix, données chiffrées, scores — `font-mono`).

Élément signature : le cadran de compatibilité `src/components/MatchScore.jsx`, inspiré des bandes tissées du pagne — utilisé pour visualiser le score de matching. Le garder comme élément distinctif du produit ; éviter d ajouter d autres motifs décoratifs concurrents (le studio a fait un choix, un seul risque esthétique par page).

Motif de fond `bg-loom` (losanges superposés, très discret) réservé au hero de la page d accueil. Ne pas le généraliser à d autres sections.

## État du projet — ce qui est fait

Accueil (recherche), page résultats + filtres, fiche espace transactionnelle, "Trouvez-moi une salle" (matching avec score calculé côté client dans `TrouvezMoi.jsx` — voir `computeScore`), comparateur (4 espaces max), auth client/propriétaire (Firebase Auth + doc `utilisateurs/{uid}`), espace client (mes demandes), espace propriétaire (ajout d espace, gestion des demandes), admin basique (vérification), pages statiques (comment ça marche, devenir propriétaire, à propos, contact, FAQ).

## État du projet — ce qui reste (roadmap V2/V3 du cahier des charges)

Prioriser dans cet ordre si pas d indication contraire :

1. **Favoris** — collection `favoris/{uid}` à créer, le bouton existe déjà dans `EspaceDetail.jsx` mais n est pas branché.
2. **Upload photos/vidéos réel** via Firebase Storage — actuellement les cartes/fiches affichent des dégradés de couleur en placeholder (`PLACEHOLDER_GRADIENTS` dans `SpaceCard.jsx`).
3. **Paiement** — Wave, Orange Money, Free Money, cartes. Le cahier des charges autorise explicitement à le repousser en phase 2 : le MVP doit prouver que les clients trouvent une salle et que les propriétaires reçoivent des demandes qualifiées, pas générer de revenu tout de suite.
4. **Notifications** — email transactionnel d abord (confirmation de demande, réponse propriétaire), puis WhatsApp Business et SMS.
5. **SEO local** — pages villes/quartiers/activités indexables séparément, données structurées (schema.org LocalBusiness/Event), sitemap, maillage interne. Les routes actuelles (`/recherche?ville=Dakar`) ne sont pas indexables individuellement — à revoir avec du SSR/prerendering si le SEO devient prioritaire (Vite seul ne suffira pas, envisager Next.js ou un prerendering statique par ville/activité).
6. **Recherche en langage naturel** pour "Trouvez-moi une salle" — le formulaire structuré actuel calcule déjà un score fonctionnel (`computeScore`), il s agit d ajouter une étape de parsing du texte libre vers les mêmes critères, pas de refaire le scoring.
7. **Rôles admin avancés** — gestionnaire de contenu, support, vérificateur terrain (actuellement un seul rôle admin implicite, pas de vraie gestion de rôles).
8. **App mobile** — à ne pas commencer avant validation du modèle économique côté web, comme précisé dans le cahier des charges.

## Limitations connues à ne pas "corriger" sans discussion

- Le calcul de matching est fait côté client (pas de Cloud Function) — volontaire pour le MVP, à déplacer côté serveur seulement si le volume d espaces le justifie.
- Pas de pagination sur `listSpaces()` au-delà de `limit(60)` — suffisant pour l objectif pilote de 50-100 espaces.
- L espace admin n a pas de contrôle d accès par rôle (`ProtectedRoute` vérifie juste qu on est connecté) — à durcir avant toute mise en production réelle avec de vrais comptes propriétaires.

## Habitudes de travail à respecter

Corrections directes et ciblées fichier par fichier plutôt que de grosses réécritures. Tester visuellement dans le navigateur après chaque changement significatif. Commits fréquents.
