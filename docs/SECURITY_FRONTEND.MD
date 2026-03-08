# SECURITY.md | DataShare Frontend

## Scan de sécurité

### npm audit

```bash
cd frontend && npm audit
```

> Résultat au 08/03/2026 : **0 vulnérabilité détectée**

```
found 0 vulnerabilities
```

---

## Mesures de sécurité mises en place

### Authentification

- Le token JWT est stocké dans le `localStorage` sous la clé `auth_token`
- Toutes les routes protégées sont gardées par un `AuthGuard` , une redirection vers `/login` est effectuée si aucun token n'est présent
- Les pages `/login` et `/register` sont gardées par un `GuestGuard` , un utilisateur déjà connecté est redirigé vers `/dashboard`

### Formulaires

- Validation HTML native sur tous les formulaires (`required`, `type="email"`, `minLength`)
- Validation manuelle supplémentaire côté JS (ex: vérification que les mots de passe correspondent sur le register)
- Les messages d'erreur sont génériques pour éviter de donner des informations sur l'existence d'un compte

### Upload de fichiers

- La taille maximale est vérifiée côté frontend avant l'envoi (1 Go)
- Le token JWT est envoyé dans le header `Authorization` pour chaque requête authentifiée
- Le mot de passe de fichier est optionnel et n'est jamais affiché en clair

### Appels API

- Toutes les requêtes utilisent `fetch` avec les headers appropriés
- Les erreurs HTTP sont catchées et affichées via le composant `Callout` sans exposer les détails techniques
- L'URL de l'API est stockée dans une variable d'environnement `VITE_API_URL` , jamais en dur dans le code

### Variables d'environnement

- Le fichier `.env` est listé dans `.gitignore` et n'est jamais commité
- Seules les variables préfixées `VITE_` sont exposées au navigateur , pas de secrets côté frontend

---

## Axes d'amélioration futurs

- Remplacer le `localStorage` par un cookie `httpOnly` pour le stockage du token JWT , plus sécurisé contre les attaques XSS