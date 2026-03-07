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

### Upload (upload.cy.ts) — à implémenter

| Test | Scénario | Résultat attendu |
|---|---|---|
| Upload | Sélection d'un fichier valide | Affichage du nom et de la taille du fichier |
| Upload | Soumission du formulaire | Lien de partage généré et affiché |
| Upload | Fichier trop lourd (> 1 Go) | Affichage d'un message d'erreur |
| Upload | Sans être connecté | Redirection vers la page de login |

### Dashboard (dashboard.cy.ts) — à implémenter

| Test | Scénario | Résultat attendu |
|---|---|---|
| Historique | Affichage de la liste des fichiers | Les fichiers de l'utilisateur sont listés |
| Historique | Filtre "Actifs" | Seuls les fichiers non expirés sont affichés |
| Historique | Filtre "Expiré" | Seuls les fichiers expirés sont affichés |
| Suppression | Clic sur "Supprimer" | Le fichier disparaît de la liste |
| Sans être connecté | Accès direct à /dashboard | Redirection vers la page de login |

---

## Rapport de couverture

> Généré le 07/03/2026 — `npm run cy:run`

```
-----------------------------|---------|----------|---------|---------|
Fichier                      | % Lines | % Stmts  | % Funcs | % Branch|
-----------------------------|---------|----------|---------|---------|
All files                    |   73.63 |    73.17 |   86.20 |   62.79 |
 App.tsx                     |  100.00 |   100.00 |  100.00 |  100.00 |
 main.tsx                    |  100.00 |   100.00 |  100.00 |  100.00 |
 components/Button           |  100.00 |   100.00 |  100.00 |  100.00 |
 components/Callout          |  100.00 |   100.00 |  100.00 |  100.00 |
 components/Header           |  100.00 |   100.00 |  100.00 |   33.33 |
 components/Input            |  100.00 |   100.00 |  100.00 |    0.00 |
 pages/Download              |   75.00 |    69.23 |   71.42 |   70.58 |
 pages/Login                 |   93.33 |    94.11 |  100.00 |  100.00 |
 pages/Register              |   90.00 |    90.90 |  100.00 |  100.00 |
 services/Auth               |   50.00 |    50.00 |   66.66 |   50.00 |
 services/Files              |   33.33 |    33.33 |   50.00 |   28.57 |
 utils/files.utils           |   71.42 |    70.00 |  100.00 |   66.66 |
-----------------------------|---------|----------|---------|---------|
```

**Seuil requis : 70% — Seuil atteint : 73.63%**

### Points faibles identifiés

| Fichier | Couverture | Raison |
|---|---|---|
| `services/Files/files.service.ts` | 33% | `downloadFile` non testée — déclenchement d'un téléchargement natif difficile à tester en E2E |
| `services/Auth/auth.service.ts` | 50% | `register` non testée — à compléter avec les tests dashboard |
| `components/Header` branches | 33% | Variante `dashboard` non visitée — couverte quand les pages dashboard/upload seront testées |

---

## Axes d'amélioration futurs

- Implémenter les tests upload et dashboard pour augmenter la couverture des services
- Ajouter des fixtures Cypress pour ne pas dépendre de données réelles en base
- Mettre en place une GitHub Action pour lancer les tests E2E en mode headless avant chaque merge sur `main`