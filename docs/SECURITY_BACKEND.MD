# SECURITY.md | DataShare

## Scan de sécurité

Outil utilisé : `npm audit`  
Date du scan : 28/02/2026  
Périmètre : `backend/`

---

## Résultats

```
25 vulnerabilities (13 moderate, 12 high)
```

---

## Critères de décision

Pour savoir si je dois mettre en place le fix de sécurité je me base sur deux facteurs :

- **Est-ce que le code est exécuté en PROD ?** Si la vulnérabilité concerne uniquement une dépendance de développement (outils de build, CLI, etc.), elle ne représente pas de risque pour les utilisateurs finaux et peut être ignorée.
- **Est-ce que le fix propose des breaking changes avec ma stack actuelle ?** Si oui, en terme de planning, la refactorisation est-elle acceptable ou non ?

---

## Analyse détaillée

### ✅ Ignorées: dépendances de développement uniquement

Ces vulnérabilités sont présentes dans des outils qui ne sont jamais déployés en production.

| Package | Sévérité | Raison d'ignorer |
|---|---|---|
| `ajv` | Moderate | Dépendance de `@nestjs/cli` et `@nestjs/schematics` : dev only |
| `serialize-javascript` | High | Dépendance de `webpack` via `@nestjs/cli` : dev only |
| `webpack` | High | Dépendance de `@nestjs/cli` : dev only |
| `fork-ts-checker-webpack-plugin` | High | Dépendance de `@nestjs/cli` : dev only |
| `lodash` | Moderate | Dépendance de `@prisma/dev` : dev only |
| `chevrotain` | Moderate | Dépendance de `@prisma/dev` : dev only |

### ⚠️ Non corrigées: hors de notre périmètre

Ces vulnérabilités concernent des dépendances de production mais ne peuvent pas être corrigées sans breaking change ou car elles dépendent d'une mise à jour tierce.

| Package | Sévérité | CVE | Décision                                                                                                                                          |
|---|---|---|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `multer <= 2.0.2` | High | GHSA-xf7r-hgr6-v32p, GHSA-v52c-386h-88mc | Non corrigeable : `@nestjs/platform-express` embarque sa propre version de multer. Le fix dépend d'une mise à jour de `@nestjs/platform-express`. |
| `hono <= 4.11.9` | Moderate | GHSA-9r54-q6cx-xmh5 | Non corrigeable : `hono` est une dépendance de `@prisma/dev`, lui-même inclus dans `prisma >= 6.20.0`. Le fix dépend d'une mise à jour de Prisma. |

---

## Mesures alternatives :

Concernant `multer` (DoS via resource exhaustion) :

- La taille maximale des fichiers est limitée à 1 Go via `limits.fileSize` dans la config Multer
- Les types MIME et extensions de fichiers sont validés avant traitement
- L'endpoint d'upload est protégé par authentification JWT — pas accessible publiquement
- Une surveillance des logs est en place pour détecter des comportements anormaux

---

## Bonnes pratiques appliquées

- Mots de passe hashés avec `bcrypt` (salt rounds: 10)
- Authentification JWT avec expiration à 7 jours
- `storagePath` absent des réponses API
- Messages d'erreur génériques pour éviter l'énumération d'emails et de types de fichiers
- Validation des inputs via `class-validator` et `ValidationPipe` global
- Vérification de l'ownership avant suppression d'un fichier (403 si non propriétaire)

---

## Suivi

| Action | Statut |
|---|---|
| Scan `npm audit` backend | ✅ Effectué le 28/02/2026 |
| Scan `npm audit` frontend | 🔄 À effectuer |
| Relancer le scan après chaque ajout de dépendance | 🔄 En cours |