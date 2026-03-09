# TESTING.md | DataShare Frontend

## Stratégie de tests frontend

Pour le front j'ai choisi de mettre en place des tests **end-to-end avec Cypress**. L'objectif est de tester les flux utilisateur complets plutôt que des composants isolés, ce qui apporte le plus de valeur sur une application comme DataShare.

La couverture de code est générée via `@cypress/code-coverage` et `vite-plugin-istanbul` les tests E2E instrumentent le code source directement.

**Point important :** je ne fais pas de tests unitaires sur les composants React car la logique métier est gérée côté backend. Les tests E2E couvrent les fonctionnalités critiques de bout en bout.

---

## Exécution des tests

```bash
# Interface graphique Cypress
npm run cy:open

# Mode headless (terminal / CI) + génération du rapport de couverture
npm run cy:run
```

Le rapport de couverture est généré dans `coverage/` après chaque exécution.

---

## Plan de tests E2E

### Authentification (auth.cy.ts)

| Test | Scénario | Résultat attendu |
|---|---|---|
| Register | Création d'un compte avec email et mot de passe valides | Compte créé, redirection vers le dashboard |
| Register | Mots de passe différents | Affichage du Callout erreur |
| Register | Mot de passe trop court (< 8 caractères) | Formulaire bloqué par la validation HTML |
| Login | Connexion avec identifiants valides | Token JWT sauvegardé, redirection vers le dashboard |
| Login | Identifiants incorrects | Affichage du Callout erreur |
| Login | Champs vides | Formulaire bloqué par la validation HTML |

### Téléchargement (download.cy.ts)

| Test | Scénario | Résultat attendu |
|---|---|---|
| Download | Accès via un token valide (mocké) | Affichage du nom et de la taille du fichier |
| Download | Fichier expirant dans 3 jours | Affichage du Callout info |
| Download | Token inexistant (404 mocké) | Affichage du Callout erreur |
| Download | Fichier expiré (mocké) | Bouton télécharger absent |

### Upload (upload.cy.ts)

| Test | Scénario | Résultat attendu |
|---|---|---|
| Upload | Arrivée sur la page | Card "Ajouter un fichier" visible |
| Upload | Sélection d'un fichier valide | Affichage du nom du fichier |
| Upload | Soumission du formulaire (mocké) | Message de succès et lien affiché |
| Upload | Sans être connecté | Redirection vers la page de login |

### Dashboard (dashboard.cy.ts)

| Test | Scénario | Résultat attendu |
|---|---|---|
| Historique | Affichage de la liste des fichiers | 3 fichiers listés |
| Historique | Filtre "Actifs" | 2 fichiers affichés |
| Historique | Filtre "Expiré" | 1 fichier affiché |
| Suppression | Clic sur "Supprimer" | Le fichier disparaît de la liste |
| Sans être connecté | Accès direct à /dashboard | Redirection vers la page de login |

---

## Rapport de couverture

> Généré le 08/03/2026 via `npm run cy:run`

```
-------------------------------|---------|----------|---------|---------|
Fichier                        | % Lines | % Stmts  | % Funcs | % Branch|
-------------------------------|---------|----------|---------|---------|
All files                      |   78.80 |    78.63 |   81.52 |   65.95 |
 App.tsx                       |  100.00 |   100.00 |  100.00 |  100.00 |
 main.tsx                      |  100.00 |   100.00 |  100.00 |  100.00 |
 components/Button             |  100.00 |   100.00 |  100.00 |  100.00 |
 components/Callout            |  100.00 |   100.00 |  100.00 |  100.00 |
 components/Guards/AuthGuards  |  100.00 |   100.00 |  100.00 |  100.00 |
 components/Guards/GuestGuards |   83.33 |    83.33 |  100.00 |    0.00 |
 components/Header             |  100.00 |    90.00 |  100.00 |   62.50 |
 components/Input              |  100.00 |   100.00 |  100.00 |    0.00 |
 pages/Dashboard               |   63.88 |    69.04 |   47.61 |   76.66 |
 pages/Download                |   75.00 |    69.23 |   71.42 |   70.58 |
 pages/Home                    |   82.35 |    79.31 |   70.00 |   42.85 |
 pages/Login                   |  100.00 |   100.00 |  100.00 |  100.00 |
 pages/Register                |  100.00 |   100.00 |  100.00 |  100.00 |
 pages/Upload                  |   89.79 |    79.01 |  100.00 |   59.09 |
 services/Auth                 |   37.50 |    33.33 |  100.00 |   40.00 |
 services/Files                |   33.33 |    33.33 |   50.00 |   28.57 |
 utils/files.utils             |   71.42 |    70.00 |  100.00 |   66.66 |
-------------------------------|---------|----------|---------|---------|
```

**Seuil requis : 70% — Seuil atteint : 78.80%**

---

## Axes d'amélioration futurs

- Ajouter des tests pour le menu mobile du dashboard
- Tester les branches d'erreur des services Auth et Files
- Mettre en place une GitHub Action pour lancer les tests E2E en mode headless avant chaque merge sur `main`