# TESTING.md | DataShare

## Stratégie de tests backend

Les unitaires mis en place dans le projet servent à garantir une fiabilité et une sécurité du code métier que j'ai implémenté.

**Point important :** je ne teste que le code appliqué et non pas le code provenant d'autres librairies (ex: Passport).

---

## Exécution des tests

```bash
# Tests unitaires
npm run test

# Tests avec rapport de couverture
npm run test:cov

# Tests en watch mode (développement)
npm run test:watch
```

---

## Plan de tests

### AuthService

| Test | Scénario | Résultat attendu |
|---|---|---|
| `register` | Email et mot de passe valides | Retourne un `access_token` JWT |
| `register` | Erreur BDD (email existant) | Lève `UnauthorizedException` |
| `login` | Identifiants valides | Retourne un `access_token` JWT |
| `login` | Utilisateur introuvable | Lève `UnauthorizedException` |
| `login` | Mot de passe incorrect | Lève `UnauthorizedException` |

### AuthController

| Test | Scénario | Résultat attendu |
|---|---|---|
| `POST /auth/register` | DTO valide | Appelle `authService.register` et retourne le token |
| `POST /auth/login` | DTO valide | Appelle `authService.login` et retourne le token |

### UsersService

| Test | Scénario | Résultat attendu |
|---|---|---|
| `create` | Email et mot de passe valides | Crée l'utilisateur et retourne ses données |
| `create` | Vérification du hashage | Le mot de passe stocké est différent du mot de passe en clair |
| `findByEmail` | Email existant | Retourne l'utilisateur |
| `findByEmail` | Email inexistant | Retourne `null` |

### FilesService

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

### FilesController

| Test | Scénario | Résultat attendu |
|---|---|---|
| `POST /files/upload` | Fichier fourni | Appelle `filesService.uploadFile` et retourne le résultat |
| `POST /files/upload` | Aucun fichier | Lève `BadRequestException` |
| `DELETE /files/:token` | Token valide | Appelle `filesService.deleteFile` et retourne le résultat |

---

## Rapport de couverture

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

---

## Fichiers exclus de la couverture

| Fichier | Raison |
|---|---|
| `jwt.strategy.ts` | Code d'infrastructure Passport — ne contient pas de logique métier. Tester ce fichier reviendrait à tester la librairie `passport-jwt` elle-même. |
| `*.module.ts` | Fichiers de configuration NestJS sans logique métier. |

---

## Axes d'amélioration futurs

- Mettre en place des tests d'intégration afin de compléter la suite de test
- Mettre en place des tests end-to-end
- Améliorer la couverture du files.controller.ts une fois les features MVP terminées
- Ajouter des Github Action afin d'autoriser le merge sur la branche **main** si les test couvrent au minimum 70% du code