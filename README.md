# Sway Bureau

Application de référence de Sway pour ordinateur, dédiée au pilotage de la caisse, du stock, des commandes, des inventaires et de l'administration.

## Interface de référence

La branche `main` est l'unique interface de référence. Elle utilise la navigation horizontale supérieure et l'identité **Sway Bureau**.

Les branches `sway-classic`, `sway-liquid-glass`, `sway-main-preview` et `theme-emerald-champagne` sont des variantes historiques. Elles ne doivent plus servir de base à de nouvelles fonctionnalités ni être publiées comme version officielle.

Toute évolution d'interface doit passer par une pull request vers `main` et conserver la navigation de référence, sauf décision explicite documentée dans la pull request.

## Qualité et publication

Les contrôles locaux s'exécutent avec :

```sh
node --test tests/*.test.mjs
```

Le workflow GitHub Actions lance ces tests sur chaque pull request vers `main` et avant chaque publication GitHub Pages. Un échec bloque donc le déploiement.

## Structure du code

`index.html` contient uniquement le squelette de la page et un point d’entrée. Il reste sous 50 lignes.

## Démarrage

- `js/bootstrap.js` charge tous les modules dans le bon ordre.
- `css/sway.css` charge les styles dans le bon ordre.

## JavaScript

- `js/foundation/` : stockage local, traductions, données de départ, rôles et règles communes.
- `js/auth/` : comptes, session et connexion Supabase.
- `js/workspace/` : sauvegarde, restauration, import depuis un ancien logiciel.
- `js/stock/` : catalogue matière et mouvements de stock.
- `js/orders/` : commandes, fournisseurs et réceptions.
- `js/inventory/` : emplacements et comptage d’inventaire.
- `js/catalogue/` : fiches techniques et recettes.
- `js/sales/` : caisse et déclaration de sorties.
- `js/dashboard/` et `js/analytics/` : vue générale et analyses.
- `js/administration/` : documents, factures, contrats et suivi administratif.
- `js/scanner/` : préparation d’image, OCR, contrôle humain et validation.
- `js/interface/` : navigation, réglages, alertes et démarrage de l’application.

## Styles

Les styles suivent la même organisation : fondations, connexion, navigation, scanner, composants, écrans métier, réglages et adaptations téléphone/ordinateur. Ne pas ajouter de règles dans un fichier « fourre-tout » : la règle va dans le dossier de l’écran ou du composant concerné.

## Données partagées

- `assets/` : logos et ressources visuelles.
- `supabase/migrations/` : évolutions versionnées de la base de données.
- `tests/` : contrôles de syntaxe, architecture et règles métier.

La connexion e-mail / mot de passe utilise Supabase Auth. Les clés privilégiées ne sont jamais dans le navigateur ; seules les clés publiques et les règles RLS sont utilisées côté application.
