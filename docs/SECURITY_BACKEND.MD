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

### ✅ Corrigées

| Package | Sévérité | CVE                                                                                                           | Correction |
|---|---|---------------------------------------------------------------------------------------------------------------|---|
| `multer <= 2.0.2` | High | - https://github.com/advisories/GHSA-xf7r-hgr6-v32p <br />- https://github.com/advisories/GHSA-xf7r-hgr6-v32p | Mise à jour vers `multer@2.1.0` |

```text
CVE-2026-2359:
A vulnerability in Multer versions < 2.1.0 allows an attacker to trigger a Denial of Service (DoS) by dropping connection during file upload, 
potentially causing resource exhaustion.

CVE-2026-3304:
A vulnerability in Multer versions < 2.1.0 allows an attacker to trigger a Denial of Service (DoS) by sending malformed requests, 
potentially causing resource exhaustion.
```
**Correction appliquée :** mise à jour vers `multer@2.1.0` qui corrige les deux vulnérabilités.

**Détail de la vulnérabilité multer :** une attaque DoS (Denial of Service) consiste à saturer un serveur pour épuiser ses ressources. Dans le cas de multer, un attaquant pouvait déclencher cette attaque en interrompant une connexion pendant un upload, empêchant le nettoyage correct des ressources. La version `2.1.0` corrige ce comportement.

### ⚠️ Non corrigées: breaking changes incompatibles avec la stack actuelle

Ces vulnérabilités concernent des dépendances de production mais le correctif proposé par npm introduit un downgrade majeur incompatible avec notre stack.

| Package | Sévérité | CVE | Décision                                                                                                                                                         |
|---|---|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `hono <= 4.11.9` | Moderate | GHSA-9r54-q6cx-xmh5 | Non corrigée: `hono` est une dépendance de `@prisma/dev`, lui-même inclus dans `prisma >= 6.20.0`. Le fix dépend d'une mise à jour de Prisma |

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