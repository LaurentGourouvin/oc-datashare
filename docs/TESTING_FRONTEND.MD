# TESTING.md | DataShare Frontend

## Stratégie de tests frontend

Pour le front j'ai choisi de mettre en place des tests **end-to-end avec Cypress**. L'objectif est de tester les flux utilisateur complets plutôt que des composants isolés — c'est ce qui apporte le plus de valeur sur une application comme DataShare.

**Point important :** je ne fais pas de tests unitaires sur les composants React car la logique métier est gérée côté backend. Les tests E2E couvrent les fonctionnalités critiques de bout en bout.

---

## Exécution des tests

```bash
# Interface graphique Cypress
npm run cy:open

# Mode headless (terminal / CI)
npm run cy:run
```

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

### Téléchargement (download.cy.ts) — à implémenter

| Test | Scénario | Résultat attendu |
|---|---|---|
| Download | Accès via un lien valide | Affichage des métadonnées du fichier |
| Download | Lien expiré | Affichage d'un message d'erreur 410 |
| Download | Token inexistant | Affichage d'un message d'erreur 404 |

---

## Axes d'amélioration futurs

- Implémenter les tests upload, dashboard et download au fur et à mesure des pages
- Ajouter des fixtures Cypress pour ne pas dépendre de données réelles en base
- Mettre en place une GitHub Action pour lancer les tests E2E en mode headless avant chaque merge sur `main`