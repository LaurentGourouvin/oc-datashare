# TESTING.md | DataShare

---

## Backend

### Stratégie de tests

Les tests unitaires mis en place dans le projet servent à garantir une fiabilité et une sécurité du code métier que j'ai implémenté.

**Point important :** je ne teste que le code appliqué et non pas le code provenant d'autres librairies (ex: Passport).

### Exécution des tests

```bash
cd backend

# Tests unitaires
npm run test

# Tests avec rapport de couverture
npm run test:cov

# Tests en watch mode (développement)
npm run test:watch
```

### Plan de tests

#### AuthService

| Test | Scénario | Résultat attendu |
|---|---|---|
| `register` | Email et mot de passe valides | Retourne un `access_token` JWT |
| `register` | Erreur BDD (email existant) | Lève `UnauthorizedException` |
| `login` | Identifiants valides | Retourne un `access_token` JWT |
| `login` | Utilisateur introuvable | Lève `UnauthorizedException` |
| `login` | Mot de passe incorrect | Lève `UnauthorizedException` |

#### AuthController

| Test | Scénario | Résultat attendu |
|---|---|---|
| `POST /auth/register` | DTO valide | Appelle `authService.register` et retourne le token |
| `POST /auth/login` | DTO valide | Appelle `authService.login` et retourne le token |

#### UsersService

| Test | Scénario | Résultat attendu |
|---|---|---|
| `create` | Email et mot de passe valides | Crée l'utilisateur et retourne ses données |
| `create` | Vérification du hashage | Le mot de passe stocké est différent du mot de passe en clair |
| `findByEmail` | Email existant | Retourne l'utilisateur |
| `findByEmail` | Email inexistant | Retourne `null` |

#### FilesService

| Test | Scénario | Résultat attendu |
|---|---|---|
| `uploadFile` | Fichier valide | Retourne token, originalName, size, expiresAt |
| `uploadFile` | Fichier valide | `storagePath` absent de la réponse |
| `uploadFile` | Fichier trop lourd (> 1 Go) | Lève `BadRequestException` |
| `uploadFile` | Type MIME interdit | Lève `BadRequestException` |
| `uploadFile` | Extension interdite (.exe) | Lève `BadRequestException` |
| `uploadFile` | Sans date d'expiration | Expiration à 7 jours par défaut |
| `deleteFile` | Token valide + bon userId | Supprime en BDD et filesystem, retourne `originalName` |
| `deleteFile` | Token introuvable | Lève `NotFoundException` |
| `deleteFile` | Fichier appartenant à un autre user | Lève `ForbiddenException` |

#### FilesController

| Test | Scénario | Résultat attendu |
|---|---|---|
| `POST /files/upload` | Fichier fourni | Appelle `filesService.uploadFile` et retourne le résultat |
| `POST /files/upload` | Aucun fichier | Lève `BadRequestException` |
| `DELETE /files/:token` | Token valide | Appelle `filesService.deleteFile` et retourne le résultat |

### Rapport de couverture

> Généré le 28/02/2026 — `npm run test:cov`

```
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   89.20 |    70.88 |   85.71 |   89.43 |
 auth                 |  100.00 |    79.16 |  100.00 |  100.00 |
  auth.controller.ts  |  100.00 |    75.00 |  100.00 |  100.00 |
  auth.service.ts     |  100.00 |    83.33 |  100.00 |  100.00 |
 auth/jwt             |  100.00 |   100.00 |  100.00 |  100.00 |
  jwt.guard.ts        |  100.00 |   100.00 |  100.00 |  100.00 |
 files                |   81.08 |    66.66 |    80.0 |   82.35 |
  files.controller.ts |   76.92 |    66.66 |    60.0 |   75.00 |
  files.service.ts    |   83.33 |    66.66 |  100.00 |   86.36 |
 files/dto            |  100.00 |   100.00 |  100.00 |  100.00 |
  upload-file.dto.ts  |  100.00 |   100.00 |  100.00 |  100.00 |
 prisma               |   88.88 |   100.00 |    50.0 |   85.71 |
  prisma.service.ts   |   88.88 |   100.00 |    50.0 |   85.71 |
 users                |  100.00 |    75.00 |  100.00 |  100.00 |
  users.service.ts    |  100.00 |    75.00 |  100.00 |  100.00 |
----------------------|---------|----------|---------|---------|
Test Suites: 7 passed, 7 total
Tests:       26 passed, 26 total
```

**Seuil requis : 70% — Seuil atteint : 89%**

### Fichiers exclus de la couverture

| Fichier | Raison |
|---|---|
| `jwt.strategy.ts` | Code d'infrastructure Passport — ne contient pas de logique métier. Tester ce fichier reviendrait à tester la librairie `passport-jwt` elle-même. |
| `*.module.ts` | Fichiers de configuration NestJS sans logique métier. |

---

## Frontend

### Stratégie de tests

Pour le front j'ai choisi de mettre en place des tests **end-to-end avec Cypress**. L'objectif est de tester les flux utilisateur complets plutôt que des composants isolés, ce qui apporte le plus de valeur sur une application comme DataShare.

La couverture de code est générée via `@cypress/code-coverage` et `vite-plugin-istanbul` les tests E2E instrumentent le code source directement.

**Point important :** je ne fais pas de tests unitaires sur les composants React car la logique métier est gérée côté backend. Les tests E2E couvrent les fonctionnalités critiques de bout en bout.

### Exécution des tests

```bash
cd frontend

# Interface graphique Cypress
npm run cy:open

# Mode headless (terminal / CI) + génération du rapport de couverture
npm run cy:run
```

Le rapport de couverture est généré dans `coverage/` après chaque exécution.

### Plan de tests E2E

#### Authentification (auth.cy.ts)

| Test | Scénario | Résultat attendu |
|---|---|---|
| Register | Création d'un compte avec email et mot de passe valides | Compte créé, redirection vers le dashboard |
| Register | Mots de passe différents | Affichage du Callout erreur |
| Register | Mot de passe trop court (< 8 caractères) | Formulaire bloqué par la validation HTML |
| Login | Connexion avec identifiants valides | Token JWT sauvegardé, redirection vers le dashboard |
| Login | Identifiants incorrects | Affichage du Callout erreur |
| Login | Champs vides | Formulaire bloqué par la validation HTML |

#### Téléchargement (download.cy.ts)

| Test | Scénario | Résultat attendu |
|---|---|---|
| Download | Accès via un token valide (mocké) | Affichage du nom et de la taille du fichier |
| Download | Fichier expirant dans 3 jours | Affichage du Callout info |
| Download | Token inexistant (404 mocké) | Affichage du Callout erreur |
| Download | Fichier expiré (mocké) | Bouton télécharger absent |

#### Upload (upload.cy.ts)

| Test | Scénario | Résultat attendu |
|---|---|---|
| Upload | Arrivée sur la page | Card "Ajouter un fichier" visible |
| Upload | Sélection d'un fichier valide | Affichage du nom du fichier |
| Upload | Soumission du formulaire (mocké) | Message de succès et lien affiché |
| Upload | Sans être connecté | Redirection vers la page de login |

#### Dashboard (dashboard.cy.ts)

| Test | Scénario | Résultat attendu |
|---|---|---|
| Historique | Affichage de la liste des fichiers | 3 fichiers listés |
| Historique | Filtre "Actifs" | 2 fichiers affichés |
| Historique | Filtre "Expiré" | 1 fichier affiché |
| Suppression | Clic sur "Supprimer" | Le fichier disparaît de la liste |
| Sans être connecté | Accès direct à /dashboard | Redirection vers la page de login |

### Rapport de couverture

> Généré le 08/03/2026 — `npm run cy:run`

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
- Mettre en place une GitHub Action pour bloquer le merge sur `main` si la couverture est inférieure à 70%